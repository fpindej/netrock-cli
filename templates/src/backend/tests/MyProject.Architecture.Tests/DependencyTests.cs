// @feature auth
using MyProject.Infrastructure.Features.Authentication.Models;
// @end
using NetArchTest.Rules;

namespace MyProject.Architecture.Tests;

public class DependencyTests
{
    private static readonly System.Reflection.Assembly SharedAssembly = typeof(Shared.Result).Assembly;
    private static readonly System.Reflection.Assembly DomainAssembly = typeof(Domain.Entities.BaseEntity).Assembly;
    // @feature !auth
    private static readonly System.Reflection.Assembly ApplicationAssembly = typeof(Application.Persistence.IBaseEntityRepository<>).Assembly;
    // @end
    // @feature auth
    private static readonly System.Reflection.Assembly ApplicationAssembly = typeof(Application.Identity.Constants.AppRoles).Assembly;
    // @end
    // @feature !auth
    private static readonly System.Reflection.Assembly InfrastructureAssembly = typeof(Infrastructure.Persistence.Extensions.ApplicationBuilderExtensions).Assembly;
    // @end
    // @feature auth
    private static readonly System.Reflection.Assembly InfrastructureAssembly = typeof(ApplicationUser).Assembly;
    // @end
    private static readonly System.Reflection.Assembly WebApiAssembly = typeof(Program).Assembly;

    [Fact]
    public void Shared_ShouldNotDependOnAnyProjectAssembly()
    {
        var result = Types.InAssembly(SharedAssembly)
            .ShouldNot()
            .HaveDependencyOnAny(
                "MyProject.Domain",
                "MyProject.Application",
                "MyProject.Infrastructure",
                "MyProject.WebApi")
            .GetResult();

        Assert.True(result.IsSuccessful, FormatFailures("Shared", result));
    }

    [Fact]
    public void Domain_ShouldNotDependOnApplicationOrInfrastructureOrWebApi()
    {
        var result = Types.InAssembly(DomainAssembly)
            .ShouldNot()
            .HaveDependencyOnAny(
                "MyProject.Application",
                "MyProject.Infrastructure",
                "MyProject.WebApi")
            .GetResult();

        Assert.True(result.IsSuccessful, FormatFailures("Domain", result));
    }

    [Fact]
    public void Application_ShouldNotDependOnInfrastructureOrWebApi()
    {
        var result = Types.InAssembly(ApplicationAssembly)
            .ShouldNot()
            .HaveDependencyOnAny(
                "MyProject.Infrastructure",
                "MyProject.WebApi")
            .GetResult();

        Assert.True(result.IsSuccessful, FormatFailures("Application", result));
    }

    [Fact]
    public void Infrastructure_ShouldNotDependOnWebApi()
    {
        var result = Types.InAssembly(InfrastructureAssembly)
            .ShouldNot()
            .HaveDependencyOn("MyProject.WebApi")
            .GetResult();

        Assert.True(result.IsSuccessful, FormatFailures("Infrastructure", result));
    }

    private static string FormatFailures(string layer, TestResult result)
    {
        if (result.IsSuccessful) return string.Empty;
        var violators = result.FailingTypeNames ?? [];
        return $"{layer} has forbidden dependencies in: {string.Join(", ", violators)}";
    }
}
