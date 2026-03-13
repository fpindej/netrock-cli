using System.Text.Json.Serialization;
using FluentValidation;
using FluentValidation.AspNetCore;
// @feature auth
using Microsoft.AspNetCore.Authorization;
// @end
// @feature auth
using MyProject.Infrastructure.Caching.Extensions;
using MyProject.Infrastructure.Cookies.Extensions;
using MyProject.Infrastructure.Identity.Extensions;
// @end
// @feature admin
using MyProject.Infrastructure.Features.Admin.Extensions;
// @end
// @feature audit
using MyProject.Infrastructure.Features.Audit.Extensions;
// @end
// @feature avatars
using MyProject.Infrastructure.Features.Avatar.Extensions;
// @end
// @feature captcha
using MyProject.Infrastructure.Features.Captcha.Extensions;
// @end
// @feature file-storage
using MyProject.Infrastructure.Features.FileStorage.Extensions;
// @end
// @feature auth
using MyProject.Infrastructure.Features.Email.Extensions;
// @end
// @feature jobs
using MyProject.Infrastructure.Features.Jobs.Extensions;
// @end
using MyProject.Infrastructure.Persistence.Extensions;
// @feature auth
using MyProject.WebApi.Authorization;
// @end
using MyProject.WebApi.Extensions;
using MyProject.WebApi.Features.OpenApi.Extensions;
using MyProject.WebApi.Middlewares;
// @feature admin
using MyProject.WebApi.Routing;
// @end
// @feature jobs
using MyProject.WebApi.Routing;
// @end
// @feature oauth
using MyProject.WebApi.Routing;
// @end
using Serilog;
using LoggerConfigurationExtensions = MyProject.Infrastructure.Logging.Extensions.LoggerConfigurationExtensions;

var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? Environments.Production;

Log.Logger = LoggerConfigurationExtensions.ConfigureMinimalLogging(environmentName);

try
{
    Log.Information("Starting web host");
    var builder = WebApplication.CreateBuilder(args);

    Log.Debug("Use Serilog");
    builder.Host.UseSerilog((context, _, loggerConfiguration) =>
    {
        LoggerConfigurationExtensions.SetupLogger(context.Configuration, loggerConfiguration);
    }, preserveStaticLogger: true, writeToProviders: true);

    Log.Debug("Adding Aspire service defaults (OpenTelemetry, service discovery, resilience)");
    builder.AddServiceDefaults();

    try
    {
        Log.Debug("Adding TimeProvider");
        builder.Services.AddSingleton(TimeProvider.System);

        Log.Debug("Adding persistence services");
        builder.Services.AddPersistence(builder.Configuration);

        // @feature auth
        Log.Debug("Adding identity services");
        builder.Services.AddIdentityServices(builder.Configuration);

        Log.Debug("Adding user context");
        builder.Services.AddUserContext();

        Log.Debug("Adding caching");
        builder.Services.AddCaching(builder.Configuration);

        Log.Debug("Adding cookie services");
        builder.Services.AddCookieServices();
        // @end

        // @feature admin
        Log.Debug("Adding admin services");
        builder.Services.AddAdminServices();
        // @end

        // @feature audit
        Log.Debug("Adding audit services");
        builder.Services.AddAuditServices();
        // @end

        // @feature auth
        Log.Debug("Adding email services");
        builder.Services.AddEmailServices(builder.Configuration);
        // @end

        // @feature file-storage
        Log.Debug("Adding file storage services");
        builder.Services.AddFileStorageServices(builder.Configuration);
        // @end

        // @feature avatars
        Log.Debug("Adding avatar services");
        builder.Services.AddAvatarServices();
        // @end

        // @feature captcha
        Log.Debug("Adding captcha services");
        builder.Services.AddCaptchaServices();
        // @end

        // @feature jobs
        Log.Debug("Adding job scheduling");
        builder.Services.AddJobScheduling(builder.Configuration);
        // @end

        // @feature auth
        Log.Debug("Adding permission-based authorization");
        builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
        builder.Services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
        builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, ProblemDetailsAuthorizationHandler>();
        // @end
    }
    catch (Exception ex)
    {
        Log.Fatal(ex, "Failed to configure essential services or dependencies.");
        throw;
    }

    Log.Debug("Adding Cors Feature");
    builder.Services.AddCors(builder.Configuration, builder.Environment);

    Log.Debug("Adding Routing => LowercaseUrls, Custom Constraints");
    builder.Services.AddRouting(options =>
    {
        options.LowercaseUrls = true;
        // @feature admin
        options.ConstraintMap.Add("roleName", typeof(RoleNameRouteConstraint));
        // @end
        // @feature jobs
        options.ConstraintMap.Add("jobId", typeof(JobIdRouteConstraint));
        // @end
        // @feature oauth
        options.ConstraintMap.Add("providerName", typeof(ProviderNameRouteConstraint));
        // @end
    });

    Log.Debug("Adding ProblemDetails");
    builder.Services.AddProblemDetails(options =>
    {
        options.CustomizeProblemDetails = context =>
        {
            context.ProblemDetails.Instance = context.HttpContext.Request.Path;
        };
    });

    Log.Debug("Adding Controllers");
    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

    Log.Debug("Adding FluentValidation");
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddValidatorsFromAssemblyContaining<Program>();

    Log.Debug("Adding hosting options");
    builder.Services.AddHostingOptions(builder.Configuration);

    Log.Debug("Adding rate limiting");
    builder.Services.AddRateLimiting(builder.Configuration);

    Log.Debug("ConfigureServices => Setting AddHealthChecks");
    builder.Services.AddApplicationHealthChecks(builder.Configuration);

    Log.Debug("ConfigureServices => Setting AddApiDefinition");
    builder.AddOpenApiSpecification();

    var app = builder.Build();

    Log.Debug("Setting hosting middleware (forwarded headers, HTTPS)");
    app.UseHostingMiddleware();

    if (!app.Environment.IsProduction())
    {
        Log.Debug("Setting Scalar OpenApi Documentation");
        app.UseOpenApiDocumentation();
    }

    Log.Debug("Setting security headers");
    app.UseSecurityHeaders();

    if (!app.Environment.IsDevelopment())
    {
        Log.Debug("Setting HSTS");
        app.UseHsts();
    }

    Log.Debug("Initializing database");
    await app.InitializeDatabaseAsync();

    Log.Debug("Setting UseCors");
    CorsExtensions.UseCors(app);

    Log.Debug("Setting UseMiddleware => OriginValidationMiddleware");
    app.UseMiddleware<OriginValidationMiddleware>();

    Log.Debug("Setting UseSerilogRequestLogging");
    app.UseSerilogRequestLogging();

    Log.Debug("Setting UseMiddleware => ExceptionHandlingMiddleware");
    app.UseMiddleware<ExceptionHandlingMiddleware>();

    Log.Debug("Setting UseStatusCodePages");
    app.UseStatusCodePages();

    if (!app.Environment.IsDevelopment())
    {
        Log.Debug("Setting UseHttpsRedirection");
        app.UseHttpsRedirection();
    }

    Log.Debug("Setting UseRouting");
    app.UseRouting();

    // @feature auth
    Log.Debug("Setting UseAuthentication");
    app.UseAuthentication();
    // @end

    Log.Debug("Setting UseRateLimiter");
    app.UseRateLimiter();

    // @feature auth
    Log.Debug("Setting UseAuthorization");
    app.UseAuthorization();
    // @end

    // @feature jobs
    Log.Debug("Setting up job scheduling");
    app.UseJobScheduling();
    // @end

    Log.Debug("Setting \"security\" measure => Redirect to YouTube video to confuse enemies");
    app.Use(async (context, next) =>
    {
        if (context.Request.Path.Value is "/")
        {
            context.Response.Redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ", permanent: false);
            return;
        }

        await next();
    });

    Log.Debug("Setting endpoints => MapControllers");
    app.MapControllers();

    Log.Debug("Setting endpoints => MapHealthChecks");
    app.MapHealthCheckEndpoints();

    await app.RunAsync();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
}
finally
{
    Log.Information("Shutting down application");
    await Log.CloseAndFlushAsync();
}
