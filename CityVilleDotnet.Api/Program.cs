using Microsoft.AspNetCore.DataProtection;
using CityVilleDotnet.Api.Features.AllowGames;
using System.Globalization;
using System.IO.Compression;
using System.Threading.RateLimiting;
using CityVilleDotnet.Api.Common.Amf;
using CityVilleDotnet.Api.Common.Identity;
using CityVilleDotnet.Api.Common.Logging;
using CityVilleDotnet.Api.Features.Gateway.Endpoint;
using CityVilleDotnet.Common.Settings;
using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Persistence;
using FastEndpoints;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using CityVilleDotnet.Api.Data;
using CityVilleDotnet.Api.Middleware;
using CityVilleDotnet.Common.Global;
using CityVilleDotnet.Common.Utils;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder();

builder.Services.AddDbContextPool<CityVilleDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("Database")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 2;

        options.User.RequireUniqueEmail = false;
    })
    .AddEntityFrameworkStores<CityVilleDbContext>()
    .AddClaimsPrincipalFactory<PlayerClaimsPrincipalFactory>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.SlidingExpiration = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
});

var discordClientId = builder.Configuration["Discord:ClientId"];

if (!string.IsNullOrEmpty(discordClientId))
{
    builder.Services.AddAuthentication().AddDiscord(options =>
    {
        options.ClientId = discordClientId;
        options.ClientSecret = builder.Configuration["Discord:ClientSecret"]!;
        options.CorrelationCookie.SameSite = SameSiteMode.Lax;
        options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.Events.OnRemoteFailure = context =>
        {
            var callback = context.Properties?.RedirectUri ?? "/Account/ExternalLogin?handler=Callback";
            context.Response.Redirect(QueryHelpers.AddQueryString(callback, "remoteError", context.Failure?.Message ?? "error"));
            context.HandleResponse();
            return Task.CompletedTask;
        };
    });
}

builder.Services.AddScoped<PlayerRegistrationService>();
builder.Services.AddSingleton<ProfilePictureStorage>();
builder.Services.AddHttpClient();
builder.Services.AddScoped<IAuthorizationHandler, AdminAuthorizationHandler>();
builder.Services.AddAuthorizationBuilder()
    .AddPolicy(AdminPolicy.Name, policy => policy.RequireAuthenticatedUser().AddRequirements(new AdminRequirement()));

builder.Services.AddSingleton<LogFileReader>();

builder.Services.AddRazorPages(options => options.Conventions.AuthorizeFolder("/Admin", AdminPolicy.Name)).AddViewLocalization();
builder.Services.AddFastEndpoints();
builder.Services.AddHttpContextAccessor();

builder.Services.ConfigureHttpJsonOptions(options => { options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()); });
builder.Services.Configure<JsonOptions>(options => { options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(o => o.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);

builder.Services.AddLocalization();

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = LocaleUtils.SupportedLocales.Select(x => new CultureInfo(x)).ToList();

    options.DefaultRequestCulture = new RequestCulture("es-ES");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

var executingAssembly = Assembly.GetExecutingAssembly();
var serviceTypes = executingAssembly.GetTypes().Where(t => t.IsClass && !t.IsAbstract && t.IsSubclassOf(typeof(AmfService)));

foreach (var type in serviceTypes)
{
    builder.Services.AddScoped(type);
}

GatewayService.InitializeHandlers(executingAssembly);

builder.Services.AddValidatorsFromAssembly(executingAssembly);

ValidatorOptions.Global.LanguageManager.Culture = new System.Globalization.CultureInfo("en");

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(["text/xml", "application/xml", "application/x-amf"]);
});

builder.Services.Configure<BrotliCompressionProviderOptions>(options => options.Level = CompressionLevel.Fastest);
builder.Services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Fastest);

// Allow Games: en el servidor las llaves de sesion se guardan en disco para que nadie pierda la sesion al reiniciar
var agKeysDir = Environment.GetEnvironmentVariable("AG_KEYS_DIR");
if (!string.IsNullOrWhiteSpace(agKeysDir))
{
    builder.Services.AddDataProtection()
        .SetApplicationName("CityVilleRevived")
        .PersistKeysToFileSystem(new DirectoryInfo(agKeysDir));
}

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        var path = context.Request.Path.Value ?? string.Empty;

        if (path.StartsWith("/assets", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".swf", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".js", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".css", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".xml", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith("gateway.php", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/api/ag/pic/", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/api/ag/media/", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith("record_stats.php", StringComparison.OrdinalIgnoreCase)
           )
        {
            return RateLimitPartition.GetNoLimiter(string.Empty);
        }

        var remoteIp = context.Request.Headers["CF-Connecting-IP"].FirstOrDefault()
                       ?? context.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',', StringSplitOptions.TrimEntries).FirstOrDefault()
                       ?? context.Connection.RemoteIpAddress?.ToString()
                       ?? "unknown";

        // Allow Games: la Comunidad y el chat preguntan seguido (y una familia puede jugar desde la misma casa)
        if (path.StartsWith("/api/ag/", StringComparison.OrdinalIgnoreCase))
            return RateLimitPartition.GetFixedWindowLimiter("ag:" + remoteIp, _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 600,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            });

        return RateLimitPartition.GetFixedWindowLimiter(remoteIp, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 50,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0
        });
    });
});

builder.Host.UseSerilog((context, configuration) => configuration.ReadFrom.Configuration(context.Configuration));

var app = builder.Build();

var forwardedHeaders = new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.XForwardedProto };
forwardedHeaders.KnownIPNetworks.Clear();
forwardedHeaders.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeaders);

app.UseExceptionHandler("/Error");

app.UseResponseCompression();

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        if (ctx.Context.Request.Path.StartsWithSegments("/assets"))
        {
            ctx.Context.Response.Headers.CacheControl = "public, max-age=86400";
        }
        else if (ctx.File.Name.EndsWith(".html"))
        {
            ctx.Context.Response.Headers.CacheControl = "no-cache";
        }
    }
});
app.UseMiddleware<FallbackAssetMiddleware>();
app.UseRateLimiter();
app.UseRouting();
// Allow Games: XP que pide cada nivel (para la barra de XP de la interfaz de celular)
app.MapGet("/api/ag/levels", (HttpContext http) =>
{
    http.Response.Headers.CacheControl = "public, max-age=86400";
    var levels = CityVilleDotnet.Common.Settings.GameSettingsManager.Instance.GetLevels()
        .OrderBy(l => l.Num).Select(l => l.RequiredXp).ToList();
    return Results.Json(levels);
});

// Allow Games: descarga de la app de Android (la crea 9_crear_app_android.bat y se sube con assets_nuevos)
app.MapGet("/app/android", (HttpContext http, IWebHostEnvironment env) =>
{
    var apk = Path.Combine(env.WebRootPath, "assets", "app", "CityVilleRevived.apk");
    http.Response.Headers.CacheControl = "no-cache";
    if (File.Exists(apk))
        return Results.File(apk, "application/vnd.android.package-archive", "CityVilleRevived.apk");
    return Results.Content("<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>CityVille Revived</title>" +
        "<body style='margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#04050c;color:#fff;font-family:sans-serif;text-align:center'>" +
        "<div><h2>App de Android: muy pronto</h2><p>Android app: coming soon</p><p><a style='color:#8ee05a' href='/Game'>Jugar en el navegador / Play in browser</a></p></div>",
        "text/html; charset=utf-8");
});

app.MapGet("/", (HttpContext http, IWebHostEnvironment env) =>
{
    http.Response.Headers.CacheControl = "no-cache";
    return Results.File(Path.Combine(env.WebRootPath, "inicio.html"), "text/html; charset=utf-8");
});
app.MapAllowGames();
app.MapCommunity();
app.MapSupport();
app.MapCrewGifts();
app.MapMissingHandlers();
CityVilleDotnet.Api.Features.AllowGames.DailyBonusService.MapDaily(app);
CityVilleDotnet.Api.Features.AllowGames.FranchiseRequestService.MapFranchise(app);
app.MapRazorPages();
app.UseAuthentication();
app.UseAuthorization();

app.UseFastEndpoints();

var options = app.Services.GetRequiredService<IOptions<RequestLocalizationOptions>>();
app.UseRequestLocalization(options.Value);

StaticLogger.Configure(app.Services.GetRequiredService<ILoggerFactory>());

using var scope = app.Services.CreateScope();
await using var context = scope.ServiceProvider.GetRequiredService<CityVilleDbContext>();
await context.Database.MigrateAsync();

var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

ServerUtils.CheckRequiredFiles(logger);

GameSettingsManager.Instance.Initialize(scope.ServiceProvider.GetRequiredService<ILogger<GameSettingsManager>>());
QuestSettingsManager.Instance.Initialize(scope.ServiceProvider.GetRequiredService<ILogger<QuestSettingsManager>>());

await SamanthaSeeder.SeedAsync(app.Services);

CityVilleDotnet.Api.Features.AllowGames.SeasonService.Initialize(app.Environment.ContentRootPath);
CityVilleDotnet.Api.Features.AllowGames.DailyBonusService.Initialize(app.Environment.ContentRootPath);
CityVilleDotnet.Api.Features.AllowGames.ChallengeService.Initialize(app.Environment.ContentRootPath);
CityVilleDotnet.Api.Features.AllowGames.CommunityService.Initialize(app.Environment.ContentRootPath);
CityVilleDotnet.Api.Features.AllowGames.SupportService.Initialize(app.Environment.ContentRootPath);
CityVilleDotnet.Api.Features.AllowGames.ResetCodeService.Initialize(app.Environment.ContentRootPath);
CityVilleDotnet.Api.Features.AllowGames.MissingHandlers.Initialize(app.Environment.ContentRootPath);
await CityVilleDotnet.Api.Features.AllowGames.AllowGamesEndpoints.BootstrapAdminsAsync(app.Services, app.Configuration, logger);

logger.LogInformation("Version {InformationalVersion} loaded", Assembly.GetEntryAssembly()?.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion);

app.Run();