package com.allowgames.cityville;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.job.JobInfo;
import android.app.job.JobParameters;
import android.app.job.JobScheduler;
import android.app.job.JobService;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.webkit.CookieManager;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Locale;
import java.util.TimeZone;

/**
 * CityVille Revived - Allow Games: cada 15 minutos pregunta al servidor si hay avisos nuevos
 * (mensajes, amistad, ayudas, regalos, franquicias, premio diario) y los muestra como
 * notificaciones del telefono, igual que Facebook.
 */
public class NotifyJob extends JobService {

    static final String BASE = "https://cityvillerevived.com";
    static final String CHANNEL = "avisos";
    private static final int JOB_ID = 4201;

    public static void schedule(Context ctx) {
        JobScheduler js = (JobScheduler) ctx.getSystemService(Context.JOB_SCHEDULER_SERVICE);
        if (js == null) return;
        for (JobInfo j : js.getAllPendingJobs()) if (j.getId() == JOB_ID) return;
        JobInfo info = new JobInfo.Builder(JOB_ID, new ComponentName(ctx, NotifyJob.class))
                .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
                .setPeriodic(15 * 60 * 1000L)
                .setPersisted(true)
                .build();
        js.schedule(info);
    }

    static void channel(Context ctx) {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null || nm.getNotificationChannel(CHANNEL) != null) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL, "CityVille", NotificationManager.IMPORTANCE_DEFAULT);
        ch.setDescription("Mensajes, vecinos y premios");
        ch.enableVibration(true);
        nm.createNotificationChannel(ch);
    }

    @Override
    public boolean onStartJob(final JobParameters params) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    check(getApplicationContext());
                } catch (Throwable ignored) {
                }
                jobFinished(params, false);
            }
        }).start();
        return true;
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        return true;
    }

    static void check(Context ctx) throws Exception {
        String cookie = CookieManager.getInstance().getCookie(BASE);
        if (cookie == null || cookie.length() == 0) return;
        SharedPreferences sp = ctx.getSharedPreferences("avisos", Context.MODE_PRIVATE);
        long after = sp.getLong("last", 0);
        int tz = TimeZone.getDefault().getOffset(System.currentTimeMillis()) / 60000;
        URL url = new URL(BASE + "/api/ag/notify/pending?after=" + after + "&lang=" + Locale.getDefault().getLanguage() + "&tz=" + tz);
        HttpURLConnection c = (HttpURLConnection) url.openConnection();
        c.setConnectTimeout(15000);
        c.setReadTimeout(15000);
        c.setRequestProperty("Cookie", cookie);
        c.setRequestProperty("User-Agent", "AllowGamesApp/" + MainActivity.APP_VERSION);
        c.setInstanceFollowRedirects(false);
        if (c.getResponseCode() != 200) { c.disconnect(); return; }
        InputStream in = c.getInputStream();
        ByteArrayOutputStream bo = new ByteArrayOutputStream();
        byte[] buf = new byte[4096];
        int n;
        while ((n = in.read(buf)) > 0) bo.write(buf, 0, n);
        in.close();
        c.disconnect();
        JSONObject o = new JSONObject(bo.toString("UTF-8"));
        JSONArray items = o.optJSONArray("items");
        long last = o.optLong("last", after);
        if (items != null) {
            channel(ctx);
            NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
            for (int i = 0; i < items.length(); i++) {
                JSONObject it = items.getJSONObject(i);
                show(ctx, nm, (int) (it.optLong("id") % 100000), it.optString("title"), it.optString("body"), it.optString("url", "/Game"));
            }
        }
        sp.edit().putLong("last", last).apply();
    }

    @SuppressWarnings("deprecation")
    static void show(Context ctx, NotificationManager nm, int id, String title, String body, String path) {
        if (nm == null) return;
        Intent open = new Intent(ctx, MainActivity.class);
        open.setAction(Intent.ACTION_VIEW);
        open.setData(Uri.parse(BASE + (path.startsWith("/") ? path : "/" + path)));
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(ctx, id, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(ctx, CHANNEL) : new Notification.Builder(ctx);
        b.setSmallIcon(R.drawable.ic_stat)
                .setLargeIcon(BitmapFactory.decodeResource(ctx.getResources(), R.mipmap.ic_launcher))
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new Notification.BigTextStyle().bigText(body))
                .setColor(0xFF2F8FC4)
                .setAutoCancel(true)
                .setContentIntent(pi);
        if (Build.VERSION.SDK_INT < 26) b.setDefaults(Notification.DEFAULT_ALL);
        nm.notify(id, b.build());
    }
}
