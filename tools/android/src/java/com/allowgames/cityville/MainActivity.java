package com.allowgames.cityville;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.OvershootInterpolator;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Locale;

/**
 * CityVille Revived - Allow Games.
 * App propia para Android: intro animada de Allow Games, pantalla completa horizontal
 * y el juego de cityvillerevived.com con tu sesion guardada.
 */
public class MainActivity extends Activity {

    private static final String HOST = "cityvillerevived.com";
    private static final String HOME = "https://" + HOST + "/Game?app=1";
    static final String APP_VERSION = "0.34";
    private static final int PICK_FILE = 42;

    private WebView web;
    private FrameLayout root;
    private View splash;
    private ValueCallback<Uri[]> fileCallback;
    private boolean pageReady;
    private boolean introDone;
    private long lastBack;
    private final Handler handler = new Handler(Looper.getMainLooper());

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window w = getWindow();
        w.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON | WindowManager.LayoutParams.FLAG_FULLSCREEN);
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams lp = w.getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            w.setAttributes(lp);
        }

        root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(4, 5, 12));

        web = new WebView(this);
        setupWeb();
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));

        splash = buildSplash();
        root.addView(splash, new FrameLayout.LayoutParams(-1, -1));

        setContentView(root);
        hideBars();

        // avisos en el telefono (mensajes, vecinos, premios)
        NotifyJob.channel(this);
        NotifyJob.schedule(this);
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission("android.permission.POST_NOTIFICATIONS") != android.content.pm.PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 7);
        }

        if (savedInstanceState != null && web.restoreState(savedInstanceState) != null) {
            pageReady = true;
            introDone = true;
            removeSplash();
        } else {
            web.loadUrl(startUrl(getIntent()));
            playIntro();
        }
    }

    private String startUrl(Intent intent) {
        Uri data = intent != null ? intent.getData() : null;
        if (data != null && isOurs(data)) return data.toString();
        return HOME;
    }

    private static boolean isOurs(Uri u) {
        String h = u.getHost();
        return h != null && (h.equals(HOST) || h.endsWith("." + HOST));
    }

    private void setupWeb() {
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setTextZoom(100);
        s.setAllowFileAccess(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setUserAgentString(s.getUserAgentString() + " AllowGamesApp/" + APP_VERSION);

        CookieManager cm = CookieManager.getInstance();
        cm.setAcceptCookie(true);
        cm.setAcceptThirdPartyCookies(web, true);

        web.setBackgroundColor(Color.rgb(4, 5, 12));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (isOurs(u)) return false;
                String scheme = u.getScheme();
                if ("http".equals(scheme) || "https".equals(scheme) || "mailto".equals(scheme)) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, u));
                    } catch (ActivityNotFoundException ignored) {
                    }
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pageReady = true;
                CookieManager.getInstance().flush();
                maybeRemoveSplash();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    view.loadDataWithBaseURL(HOME, offlinePage(), "text/html", "utf-8", null);
                }
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                try {
                    startActivityForResult(params.createIntent(), PICK_FILE);
                } catch (ActivityNotFoundException e) {
                    fileCallback = null;
                    return false;
                }
                return true;
            }
        });
    }

    // ---------- intro Allow Games ----------

    private View buildSplash() {
        FrameLayout f = new FrameLayout(this);
        GradientDrawable bg = new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM,
                new int[]{Color.rgb(13, 32, 64), Color.rgb(4, 5, 12)});
        f.setBackground(bg);
        f.setClickable(true);

        ImageView ag = new ImageView(this);
        ag.setId(View.generateViewId());
        ag.setImageResource(R.drawable.ag_logo);
        ag.setAdjustViewBounds(true);
        ag.setAlpha(0f);
        ag.setScaleX(0.6f);
        ag.setScaleY(0.6f);
        f.addView(ag, new FrameLayout.LayoutParams(dp(300), -2, Gravity.CENTER));

        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setGravity(Gravity.CENTER_HORIZONTAL);
        col.setAlpha(0f);

        ImageView cv = new ImageView(this);
        cv.setImageResource(R.drawable.cv_logo);
        cv.setAdjustViewBounds(true);
        col.addView(cv, new LinearLayout.LayoutParams(dp(320), -2));

        ProgressBar pb = new ProgressBar(this);
        LinearLayout.LayoutParams pl = new LinearLayout.LayoutParams(dp(34), dp(34));
        pl.topMargin = dp(10);
        col.addView(pb, pl);

        TextView tv = new TextView(this);
        tv.setText(loadingText());
        tv.setTextColor(Color.WHITE);
        tv.setTextSize(15);
        tv.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams tl = new LinearLayout.LayoutParams(-2, -2);
        tl.topMargin = dp(6);
        col.addView(tv, tl);

        f.addView(col, new FrameLayout.LayoutParams(-2, -2, Gravity.CENTER));
        f.setTag(new View[]{ag, col});
        return f;
    }

    private void playIntro() {
        View[] parts = (View[]) splash.getTag();
        final View ag = parts[0];
        final View col = parts[1];
        ag.animate().alpha(1f).scaleX(1f).scaleY(1f).setDuration(700)
                .setInterpolator(new OvershootInterpolator(1.6f)).start();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                ag.animate().alpha(0f).scaleX(1.15f).scaleY(1.15f).setDuration(400).start();
                col.setScaleX(0.85f);
                col.setScaleY(0.85f);
                col.animate().alpha(1f).scaleX(1f).scaleY(1f).setStartDelay(250).setDuration(500)
                        .setInterpolator(new DecelerateInterpolator()).start();
            }
        }, 1700);
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                introDone = true;
                maybeRemoveSplash();
            }
        }, 3000);
        // por si la pagina tarda mucho, no dejar al jugador atrapado en la intro
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                pageReady = true;
                maybeRemoveSplash();
            }
        }, 15000);
    }

    private void maybeRemoveSplash() {
        if (introDone && pageReady) removeSplash();
    }

    private void removeSplash() {
        if (splash == null) return;
        final View s = splash;
        splash = null;
        s.animate().alpha(0f).setDuration(450).withEndAction(new Runnable() {
            @Override
            public void run() {
                root.removeView(s);
            }
        }).start();
    }

    // ---------- pantalla completa ----------

    private void hideBars() {
        Window w = getWindow();
        if (Build.VERSION.SDK_INT >= 30) {
            w.setDecorFitsSystemWindows(false);
            WindowInsetsController c = w.getInsetsController();
            if (c != null) {
                c.hide(WindowInsets.Type.systemBars());
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            w.getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideBars();
    }

    // ---------- ciclo de vida ----------

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Uri data = intent.getData();
        if (data != null && isOurs(data)) web.loadUrl(data.toString());
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == PICK_FILE) {
            if (fileCallback != null) {
                fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
                fileCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onPause() {
        super.onPause();
        web.onPause();
        CookieManager.getInstance().flush();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        hideBars();
        // ya entro al juego: quitar los avisos viejos de la barra
        android.app.NotificationManager nm = (android.app.NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.cancelAll();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        if (web != null) {
            root.removeView(web);
            web.destroy();
        }
        super.onDestroy();
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (web.canGoBack()) {
            web.goBack();
            return;
        }
        long now = System.currentTimeMillis();
        if (now - lastBack < 2000) {
            super.onBackPressed();
        } else {
            lastBack = now;
            Toast.makeText(this, exitText(), Toast.LENGTH_SHORT).show();
        }
    }

    // ---------- textos ----------

    private static String lang() {
        return Locale.getDefault().getLanguage();
    }

    private static String loadingText() {
        switch (lang()) {
            case "en": return "Loading your city...";
            case "pt": return "Carregando sua cidade...";
            case "fr": return "Chargement de ta ville...";
            case "it": return "Caricamento della tua città...";
            case "de": return "Deine Stadt wird geladen...";
            default: return "Cargando tu ciudad...";
        }
    }

    private static String exitText() {
        switch (lang()) {
            case "en": return "Press back again to exit";
            case "pt": return "Toque voltar de novo para sair";
            case "fr": return "Appuie encore sur retour pour quitter";
            case "it": return "Premi ancora indietro per uscire";
            case "de": return "Nochmal zurück drücken zum Beenden";
            default: return "Toca atrás otra vez para salir";
        }
    }

    private static String offlinePage() {
        String title, msg, btn;
        switch (lang()) {
            case "en": title = "No connection"; msg = "Check your internet and try again."; btn = "Retry"; break;
            case "pt": title = "Sem conexão"; msg = "Verifique sua internet e tente de novo."; btn = "Tentar de novo"; break;
            case "fr": title = "Pas de connexion"; msg = "Vérifie ton internet et réessaie."; btn = "Réessayer"; break;
            case "it": title = "Nessuna connessione"; msg = "Controlla internet e riprova."; btn = "Riprova"; break;
            case "de": title = "Keine Verbindung"; msg = "Prüfe dein Internet und versuch es nochmal."; btn = "Nochmal"; break;
            default: title = "Sin conexión"; msg = "Revisa tu internet y vuelve a intentarlo."; btn = "Reintentar"; break;
        }
        return "<html><head><meta name='viewport' content='width=device-width,initial-scale=1'></head>"
                + "<body style='margin:0;height:100vh;display:flex;align-items:center;justify-content:center;"
                + "background:linear-gradient(#0d2040,#04050c);color:#fff;font-family:sans-serif;text-align:center'>"
                + "<div><div style='font-size:46px'>&#128225;</div><h2>" + title + "</h2><p>" + msg + "</p>"
                + "<button onclick=\"location.href='" + HOME + "'\" style='border:0;border-radius:999px;padding:12px 28px;"
                + "font-size:18px;font-weight:bold;color:#fff;background:linear-gradient(#8ee05a,#4caf27);"
                + "box-shadow:0 5px 0 #2f7d17'>" + btn + "</button></div></body></html>";
    }

    private int dp(int v) {
        return Math.round(v * getResources().getDisplayMetrics().density);
    }
}
