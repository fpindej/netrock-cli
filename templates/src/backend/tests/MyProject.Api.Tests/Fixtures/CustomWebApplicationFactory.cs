using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Caching.Hybrid;
// @feature admin
using MyProject.Application.Features.Admin;
// @end
using MyProject.Application.Features.Authentication;
// @feature audit
using MyProject.Application.Features.Audit;
// @end
// @feature captcha
using MyProject.Application.Features.Captcha;
// @end
using MyProject.Application.Features.Email;
// @feature jobs
using MyProject.Application.Features.Jobs;
// @end
using MyProject.Application.Identity;
using MyProject.Infrastructure.Persistence;
using NSubstitute.ClearExtensions;
using IAuthenticationService = MyProject.Application.Features.Authentication.IAuthenticationService;
// @feature 2fa
using ITwoFactorService = MyProject.Application.Features.Authentication.ITwoFactorService;
// @end

namespace MyProject.Api.Tests.Fixtures;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = "TestDb_" + Guid.NewGuid();

    public IAuthenticationService AuthenticationService { get; } = Substitute.For<IAuthenticationService>();
    public IUserService UserService { get; } = Substitute.For<IUserService>();
    // @feature admin
    public IAdminService AdminService { get; } = Substitute.For<IAdminService>();
    public IRoleManagementService RoleManagementService { get; } = Substitute.For<IRoleManagementService>();
    // @end
    // @feature jobs
    public IJobManagementService JobManagementService { get; } = Substitute.For<IJobManagementService>();
    // @end
    public IEmailService EmailService { get; } = Substitute.For<IEmailService>();
    public HybridCache HybridCache { get; } = Substitute.For<HybridCache>();
    // @feature captcha
    public ICaptchaService CaptchaService { get; } = Substitute.For<ICaptchaService>();
    // @end
    // @feature audit
    public IAuditService AuditService { get; } = Substitute.For<IAuditService>();
    // @end
    // @feature 2fa
    public ITwoFactorService TwoFactorService { get; } = Substitute.For<ITwoFactorService>();
    // @end
    // @feature oauth
    public IExternalAuthService ExternalAuthService { get; } = Substitute.For<IExternalAuthService>();
    public IProviderConfigService ProviderConfigService { get; } = Substitute.For<IProviderConfigService>();
    // @end

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Use Testing environment - loads appsettings.Testing.json which disables
        // Hangfire, and provides a dummy DB connection string.
        // Also avoids EF migrations and dev user seeding (non-Development).
        builder.UseEnvironment("Testing");

        builder.ConfigureTestServices(services =>
        {
            // @feature jobs
            // Remove Hangfire hosted services in case config override didn't prevent registration
            var hangfireDescriptors = services
                .Where(d => d.ServiceType == typeof(IHostedService) &&
                            (d.ImplementationType?.FullName?.Contains("Hangfire") == true ||
                             d.ImplementationFactory?.Method.DeclaringType?.FullName?.Contains("Hangfire") == true))
                .ToList();
            foreach (var descriptor in hangfireDescriptors)
            {
                services.Remove(descriptor);
            }
            // @end

            // Remove ALL EF Core / DbContext registrations to avoid dual-provider conflict
            // (Npgsql registered by app + InMemory registered by tests)
            services.RemoveAll<DbContextOptions<MyProjectDbContext>>();
            services.RemoveAll<DbContextOptions>();
            services.RemoveAll<MyProjectDbContext>();

            // Manually register InMemory options (bypasses AddDbContext's TryAdd)
            services.AddScoped(_ =>
            {
                var optionsBuilder = new DbContextOptionsBuilder<MyProjectDbContext>();
                optionsBuilder.UseInMemoryDatabase(_dbName);
                return optionsBuilder.Options;
            });

            services.AddScoped<DbContextOptions>(sp =>
                sp.GetRequiredService<DbContextOptions<MyProjectDbContext>>());

            services.AddScoped<MyProjectDbContext>();

            // Replace services with mocks
            services.RemoveAll<IAuthenticationService>();
            services.AddSingleton(AuthenticationService);

            services.RemoveAll<IUserService>();
            services.AddSingleton(UserService);

            // @feature admin
            services.RemoveAll<IAdminService>();
            services.AddSingleton(AdminService);

            services.RemoveAll<IRoleManagementService>();
            services.AddSingleton(RoleManagementService);
            // @end

            // @feature jobs
            services.RemoveAll<IJobManagementService>();
            services.AddSingleton(JobManagementService);
            // @end

            services.RemoveAll<IEmailService>();
            services.AddSingleton(EmailService);

            services.RemoveAll<HybridCache>();
            services.AddSingleton(HybridCache);

            // @feature captcha
            services.RemoveAll<ICaptchaService>();
            services.AddSingleton(CaptchaService);
            // @end

            // @feature audit
            services.RemoveAll<IAuditService>();
            services.AddSingleton(AuditService);
            // @end

            // @feature 2fa
            services.RemoveAll<ITwoFactorService>();
            services.AddSingleton(TwoFactorService);
            // @end

            // @feature oauth
            services.RemoveAll<IExternalAuthService>();
            services.AddSingleton(ExternalAuthService);

            services.RemoveAll<IProviderConfigService>();
            services.AddSingleton(ProviderConfigService);
            // @end

            // Override auth scheme - PostConfigure runs after the app's Configure,
            // ensuring the test scheme wins over the JWT Bearer defaults.
            services.PostConfigure<AuthenticationOptions>(options =>
            {
                options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
                options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
                options.DefaultScheme = TestAuthHandler.SchemeName;
            });

            services.AddAuthentication()
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                    TestAuthHandler.SchemeName, _ => { });

            // Replace TimeProvider with a fixed one
            services.RemoveAll<TimeProvider>();
            services.AddSingleton(TimeProvider.System);
        });
    }

    /// <summary>
    /// Clears all NSubstitute return values and received calls on every mock.
    /// Call from each test class constructor to prevent mock state leaking between tests.
    /// </summary>
    public void ResetMocks()
    {
        AuthenticationService.ClearSubstitute(ClearOptions.All);
        UserService.ClearSubstitute(ClearOptions.All);
        // @feature admin
        AdminService.ClearSubstitute(ClearOptions.All);
        RoleManagementService.ClearSubstitute(ClearOptions.All);
        // @end
        // @feature jobs
        JobManagementService.ClearSubstitute(ClearOptions.All);
        // @end
        EmailService.ClearSubstitute(ClearOptions.All);
        HybridCache.ClearSubstitute(ClearOptions.All);
        // @feature captcha
        CaptchaService.ClearSubstitute(ClearOptions.All);
        // @end
        // @feature audit
        AuditService.ClearSubstitute(ClearOptions.All);
        // @end
        // @feature 2fa
        TwoFactorService.ClearSubstitute(ClearOptions.All);
        // @end
        // @feature oauth
        ExternalAuthService.ClearSubstitute(ClearOptions.All);
        ProviderConfigService.ClearSubstitute(ClearOptions.All);
        // @end
    }
}
