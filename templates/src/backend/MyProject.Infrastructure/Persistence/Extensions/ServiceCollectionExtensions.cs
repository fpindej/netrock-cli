using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyProject.Application.Persistence;
// @feature auth
using MyProject.Infrastructure.Features.Authentication.Extensions;
using MyProject.Infrastructure.Persistence.Interceptors;
// @end

namespace MyProject.Infrastructure.Persistence.Extensions;

/// <summary>
/// Extension methods for registering persistence services (DbContext and repositories).
/// </summary>
public static class ServiceCollectionExtensions
{
    extension(IServiceCollection services)
    {
        /// <summary>
        /// Registers the database context and generic repository.
        /// </summary>
        /// <param name="configuration">The application configuration for reading connection strings.</param>
        /// <returns>The service collection for chaining.</returns>
        public IServiceCollection AddPersistence(IConfiguration configuration)
        {
            services.ConfigureDbContext(configuration);
            services.AddScoped(typeof(IBaseEntityRepository<>), typeof(BaseEntityRepository<>));

            return services;
        }

        // @feature auth
        /// <summary>
        /// Registers ASP.NET Identity, JWT authentication, and authentication services.
        /// </summary>
        /// <param name="configuration">The application configuration for reading auth options.</param>
        /// <returns>The service collection for chaining.</returns>
        public IServiceCollection AddIdentityServices(IConfiguration configuration)
        {
            services.AddIdentity<MyProjectDbContext>(configuration);

            return services;
        }
        // @end

        private IServiceCollection ConfigureDbContext(IConfiguration configuration)
        {
            // @feature auth
            services.AddScoped<AuditingInterceptor>();
            services.AddScoped<UserCacheInvalidationInterceptor>();
            // @end
            services.AddDbContext<MyProjectDbContext>((sp, opt) =>
            {
                var connectionString = configuration.GetConnectionString("Database");
                opt.UseNpgsql(connectionString, npgsqlOptions =>
                    npgsqlOptions.EnableRetryOnFailure());
                // @feature auth
                opt.AddInterceptors(
                    sp.GetRequiredService<AuditingInterceptor>(),
                    sp.GetRequiredService<UserCacheInvalidationInterceptor>());
                // @end
            });
            return services;
        }
    }
}
