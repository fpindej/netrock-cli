import { registerManifest } from '../features/manifest.js';

/** Registers the core feature manifest with all files for the clean architecture skeleton. */
export function registerCoreManifest(): void {
	registerManifest({
		featureId: 'core',
		files: [
			// Domain
			{ path: 'src/backend/MyProject.Domain/Entities/BaseEntity.cs', templated: false },
			{ path: 'src/backend/MyProject.Domain/MyProject.Domain.csproj', templated: false },

			// Shared
			{ path: 'src/backend/MyProject.Shared/ErrorMessages.cs', templated: true },
			{ path: 'src/backend/MyProject.Shared/ErrorType.cs', templated: false },
			{ path: 'src/backend/MyProject.Shared/MyProject.Shared.csproj', templated: false },
			{ path: 'src/backend/MyProject.Shared/PhoneNumberHelper.cs', templated: false },
			{ path: 'src/backend/MyProject.Shared/Result.cs', templated: false },
			{ path: 'src/backend/MyProject.Shared/TimeSpanExtensions.cs', templated: false },

			// Application
			{ path: 'src/backend/MyProject.Application/MyProject.Application.csproj', templated: false },
			{ path: 'src/backend/MyProject.Application/Persistence/IBaseEntityRepository.cs', templated: false },

			// Infrastructure - Persistence
			{ path: 'src/backend/MyProject.Infrastructure/MyProject.Infrastructure.csproj', templated: true },
			{ path: 'src/backend/MyProject.Infrastructure/Persistence/BaseEntityRepository.cs', templated: false },
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Configurations/BaseEntityConfiguration.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Exceptions/PaginationException.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Extensions/ApplicationBuilderExtensions.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Extensions/ModelBuilderExtensions.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Extensions/PaginationExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Extensions/QueryableExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Extensions/ServiceCollectionExtensions.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Extensions/StringExtensions.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Infrastructure/Persistence/MyProjectDbContext.cs', templated: true },

			// Infrastructure - Logging
			{ path: 'src/backend/MyProject.Infrastructure/Logging/Environments.cs', templated: false },
			{
				path: 'src/backend/MyProject.Infrastructure/Logging/Extensions/LoggerConfigurationExtensions.cs',
				templated: false
			},

			// Infrastructure - Properties
			{ path: 'src/backend/MyProject.Infrastructure/Properties/AssemblyInfo.cs', templated: false },

			// ServiceDefaults
			{ path: 'src/backend/MyProject.ServiceDefaults/Extensions.cs', templated: false },
			{ path: 'src/backend/MyProject.ServiceDefaults/MyProject.ServiceDefaults.csproj', templated: false },

			// WebApi - Core
			{ path: 'src/backend/MyProject.WebApi/Program.cs', templated: true },
			{ path: 'src/backend/MyProject.WebApi/MyProject.WebApi.csproj', templated: true },
			{ path: 'src/backend/MyProject.WebApi/Dockerfile', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Properties/launchSettings.json', templated: false },
			{ path: 'src/backend/MyProject.WebApi/appsettings.json', templated: false },
			{ path: 'src/backend/MyProject.WebApi/appsettings.Development.json', templated: false },
			{ path: 'src/backend/MyProject.WebApi/appsettings.Testing.json', templated: true },

			// WebApi - Middlewares
			{
				path: 'src/backend/MyProject.WebApi/Middlewares/ExceptionHandlingMiddleware.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.WebApi/Middlewares/OriginValidationMiddleware.cs', templated: false },

			// WebApi - Extensions
			{ path: 'src/backend/MyProject.WebApi/Extensions/CorsExtensions.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Extensions/HealthCheckExtensions.cs', templated: true },
			{ path: 'src/backend/MyProject.WebApi/Extensions/HostingExtensions.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Extensions/RateLimiterExtensions.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Extensions/SecurityHeaderExtensions.cs', templated: false },

			// WebApi - OpenApi
			{
				path: 'src/backend/MyProject.WebApi/Features/OpenApi/Extensions/WebApplicationBuilderExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/OpenApi/Transformers/BearerSecurityOperationTransformer.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/OpenApi/Transformers/CamelCaseQueryParameterTransformer.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/OpenApi/Transformers/CleanupDocumentTransformer.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/OpenApi/Transformers/EnumSchemaTransformer.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/OpenApi/Transformers/NumericSchemaTransformer.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/OpenApi/Transformers/ProjectDocumentTransformer.cs',
				templated: false
			},

			// WebApi - Options
			{ path: 'src/backend/MyProject.WebApi/Options/CorsOptions.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Options/HostingOptions.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Options/RateLimitingOptions.cs', templated: false },

			// WebApi - Shared
			{ path: 'src/backend/MyProject.WebApi/Shared/ApiController.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Shared/PaginatedRequest.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Shared/PaginatedResponse.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Shared/ProblemFactory.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Shared/RateLimitPolicies.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Shared/ValidationConstants.cs', templated: false },

			// Solution and build config
			{ path: 'src/backend/MyProject.slnx', templated: true },
			{ path: 'src/backend/Directory.Build.props', templated: false },
			{ path: 'src/backend/Directory.Packages.props', templated: true },
			{ path: 'src/backend/nuget.config', templated: false },
			{ path: 'src/backend/.editorconfig', templated: false },
			{ path: 'src/backend/.dockerignore', templated: false },

			// Tests - Architecture
			{
				path: 'src/backend/tests/MyProject.Architecture.Tests/AccessModifierTests.cs',
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Architecture.Tests/DependencyTests.cs',
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Architecture.Tests/GlobalUsings.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Architecture.Tests/MyProject.Architecture.Tests.csproj',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Architecture.Tests/NamingConventionTests.cs',
				templated: false
			},

			// Tests - Unit
			{
				path: 'src/backend/tests/MyProject.Unit.Tests/Domain/BaseEntityTests.cs',
				templated: false
			},
			{ path: 'src/backend/tests/MyProject.Unit.Tests/GlobalUsings.cs', templated: false },
			{
				path: 'src/backend/tests/MyProject.Unit.Tests/MyProject.Unit.Tests.csproj',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Unit.Tests/Shared/ErrorMessagesTests.cs',
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Unit.Tests/Shared/ErrorTypeTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Unit.Tests/Shared/PhoneNumberHelperTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Unit.Tests/Shared/ResultGenericTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Unit.Tests/Shared/ResultTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Unit.Tests/Shared/TimeSpanExtensionsTests.cs',
				templated: false
			},

			// Root config
			{ path: 'global.json', templated: false },
			{ path: '.gitignore', templated: false },
			{ path: '.config/dotnet-tools.json', templated: false }
		]
	});
}
