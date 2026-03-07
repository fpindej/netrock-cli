import { registerManifest } from '../features/manifest.js';

/** Registers the auth feature manifest - core authentication, authorization, user profile, and identity. */
export function registerAuthManifest(): void {
	registerManifest({
		featureId: 'auth',
		files: [
			// Application - Identity
			{ path: 'src/backend/MyProject.Application/Identity/Constants/AppPermissions.cs', templated: false },
			{ path: 'src/backend/MyProject.Application/Identity/Constants/AppRoles.cs', templated: false },
			{
				path: 'src/backend/MyProject.Application/Identity/Constants/PermissionDefinition.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Application/Identity/Dtos/DeleteAccountInput.cs', templated: false },
			{ path: 'src/backend/MyProject.Application/Identity/IUserContext.cs', templated: false },
			{ path: 'src/backend/MyProject.Application/Identity/IUserService.cs', templated: false },

			// Application - Caching
			{ path: 'src/backend/MyProject.Application/Caching/Constants/CacheKeys.cs', templated: false },

			// Application - Cookies
			{ path: 'src/backend/MyProject.Application/Cookies/Constants/CookieNames.cs', templated: false },
			{ path: 'src/backend/MyProject.Application/Cookies/ICookieService.cs', templated: false },

			// Application - Cryptography
			{ path: 'src/backend/MyProject.Application/Cryptography/ISecretEncryptionService.cs', templated: false },

			// Application - Authentication DTOs and interfaces
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/IAuthenticationService.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/AuthenticationOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/ChangePasswordInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/LoginOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/RegisterInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/UpdateProfileInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/UserOutput.cs',
				templated: false
			},

			// Infrastructure - Caching
			{
				path: 'src/backend/MyProject.Infrastructure/Caching/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Infrastructure/Caching/Options/CachingOptions.cs', templated: false },
			{
				path: 'src/backend/MyProject.Infrastructure/Caching/Services/NoOpHybridCache.cs',
				templated: false
			},

			// Infrastructure - Cookies
			{ path: 'src/backend/MyProject.Infrastructure/Cookies/CookieService.cs', templated: false },
			{
				path: 'src/backend/MyProject.Infrastructure/Cookies/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},

			// Infrastructure - Cryptography
			{
				path: 'src/backend/MyProject.Infrastructure/Cryptography/AesGcmEncryptionService.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Infrastructure/Cryptography/HashHelper.cs', templated: false },

			// Infrastructure - Authentication
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Configurations/RefreshTokenConfiguration.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/ApplicationRole.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/ApplicationUser.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/RefreshToken.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Options/AuthenticationOptions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/AuthenticationService.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ITokenProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/JwtTokenProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/TokenSessionService.cs',
				templated: false
			},

			// Infrastructure - Identity
			{
				path: 'src/backend/MyProject.Infrastructure/Identity/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Infrastructure/Identity/Services/UserService.cs', templated: false },
			{ path: 'src/backend/MyProject.Infrastructure/Identity/UserContext.cs', templated: false },

			// Infrastructure - Persistence interceptors and seed
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Interceptors/AuditingInterceptor.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Interceptors/UserCacheInvalidationInterceptor.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Infrastructure/Persistence/Options/SeedOptions.cs', templated: false },

			// WebApi - Authorization
			{
				path: 'src/backend/MyProject.WebApi/Authorization/PermissionAuthorizationHandler.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Authorization/PermissionPolicyProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Authorization/PermissionRequirement.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Authorization/ProblemDetailsAuthorizationHandler.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Authorization/RequirePermissionAttribute.cs',
				templated: false
			},

			// WebApi - Auth controller and mapper
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/AuthController.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/AuthMapper.cs',
				templated: false
			},

			// WebApi - Auth DTOs: Login
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/Login/AuthenticationResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/Login/LoginRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/Login/LoginRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/Login/RefreshRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/Login/RefreshRequestValidator.cs',
				templated: false
			},

			// WebApi - Auth DTOs: Register
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/Register/RegisterRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/Register/RegisterRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/Register/RegisterResponse.cs',
				templated: false
			},

			// WebApi - Auth DTOs: ChangePassword
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/ChangePassword/ChangePasswordRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/ChangePassword/ChangePasswordRequestValidator.cs',
				templated: false
			},

			// WebApi - Users
			{
				path: 'src/backend/MyProject.WebApi/Features/Users/Dtos/DeleteAccount/DeleteAccountRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Users/Dtos/DeleteAccount/DeleteAccountRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Users/Dtos/UpdateUserRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Users/Dtos/UpdateUserRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Users/Dtos/UserResponse.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.WebApi/Features/Users/UserMapper.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Features/Users/UsersController.cs', templated: false },

			// WebApi - Routing
			{ path: 'src/backend/MyProject.WebApi/Routing/RoleNameRouteConstraint.cs', templated: false },

			// Documentation
			{ path: 'src/backend/AGENTS.md', templated: false },

			// Tests - Api
			{
				path: 'src/backend/tests/MyProject.Api.Tests/MyProject.Api.Tests.csproj',
				templated: false
			},
			{ path: 'src/backend/tests/MyProject.Api.Tests/GlobalUsings.cs', templated: false },
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Fixtures/CustomWebApplicationFactory.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Fixtures/TestAuthHandler.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Contracts/ResponseContracts.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Middlewares/OriginValidationMiddlewareTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validation/CorsOptionsValidationTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validation/RateLimitingOptionsValidationTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Controllers/AuthControllerTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Controllers/UsersControllerTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/LoginRequestValidatorTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/RegisterRequestValidatorTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/UserValidatorTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/ChangePasswordRequestValidatorTests.cs',
				templated: false
			},

			// Tests - Component
			{
				path: 'src/backend/tests/MyProject.Component.Tests/MyProject.Component.Tests.csproj',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/GlobalUsings.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Fixtures/IdentityMockHelpers.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Fixtures/MockHttpClientFactory.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Fixtures/MockHttpMessageHandler.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Fixtures/TestDbContextFactory.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Persistence/BaseEntityRepositoryTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/AuthenticationServiceTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/UserServiceTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/NoOpHybridCacheTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Cryptography/AesGcmEncryptionServiceTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Validation/AuthenticationOptionsValidationTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Validation/CachingOptionsValidationTests.cs',
				templated: false
			},

			// Tests - Unit
			{
				path: 'src/backend/tests/MyProject.Unit.Tests/Application/AppPermissionsTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Unit.Tests/Application/AppRolesTests.cs',
				templated: false
			}
		]
	});
}
