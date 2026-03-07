// @feature auth
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
// @end
using Microsoft.EntityFrameworkCore;
// @feature audit
using MyProject.Infrastructure.Features.Audit.Models;
// @end
// @feature auth
using MyProject.Infrastructure.Features.Authentication.Models;
// @end
// @feature jobs
using MyProject.Infrastructure.Features.Jobs.Models;
// @end
using MyProject.Infrastructure.Persistence.Extensions;

namespace MyProject.Infrastructure.Persistence;

/// <summary>
/// Application database context.
/// </summary>
// @feature !auth
internal class MyProjectDbContext(DbContextOptions<MyProjectDbContext> options) : DbContext(options)
// @end
// @feature auth
internal class MyProjectDbContext(DbContextOptions<MyProjectDbContext> options)
    : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>(options)
// @end
{
    // @feature auth
    /// <summary>
    /// Gets or sets the refresh tokens table for JWT token rotation.
    /// </summary>
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    /// <summary>
    /// Gets or sets the email tokens table for opaque password-reset and email-verification links.
    /// </summary>
    public DbSet<EmailToken> EmailTokens { get; set; }
    // @end

    // @feature jobs
    /// <summary>
    /// Gets or sets the paused jobs table for persisting pause state across restarts.
    /// </summary>
    public DbSet<PausedJob> PausedJobs { get; set; }
    // @end

    // @feature 2fa
    /// <summary>
    /// Gets or sets the two-factor authentication challenge tokens for pending 2FA logins.
    /// </summary>
    public DbSet<TwoFactorChallenge> TwoFactorChallenges { get; set; }
    // @end

    // @feature oauth
    /// <summary>
    /// Gets or sets the external OAuth2 authorization state tokens for pending OAuth flows.
    /// </summary>
    public DbSet<ExternalAuthState> ExternalAuthStates { get; set; }
    // @end

    // @feature audit
    /// <summary>
    /// Gets or sets the audit events table for the append-only audit log.
    /// </summary>
    public DbSet<AuditEvent> AuditEvents { get; set; }
    // @end

    // @feature oauth
    /// <summary>
    /// Gets or sets the external provider configurations for admin-managed OAuth credentials.
    /// </summary>
    public DbSet<ExternalProviderConfig> ExternalProviderConfigs { get; set; }
    // @end

    /// <summary>
    /// Configures the model by applying all entity configurations from this assembly
    /// and fuzzy search extensions.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MyProjectDbContext).Assembly);
        // @feature auth
        modelBuilder.ApplyAuthSchema();
        // @end
        modelBuilder.ApplyFuzzySearch();
    }
}
