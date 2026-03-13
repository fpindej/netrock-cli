import { registerManifest } from '../features/manifest.js';

/** Registers the auth feature manifest - authentication, email, email verification, password reset, and identity. */
export function registerAuthManifest(): void {
	registerManifest({
		featureId: 'auth',
		files: [
			// Frontend i18n
			{ path: 'src/frontend/src/messages/en/auth.json', templated: false },
			{ path: 'src/frontend/src/messages/cs/auth.json', templated: false },

			// Application - Identity
			{
				path: 'src/backend/MyProject.Application/Identity/Constants/AppPermissions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Identity/Constants/AppRoles.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Identity/Constants/PermissionDefinition.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Identity/Dtos/DeleteAccountInput.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Application/Identity/IUserContext.cs', templated: false },
			{ path: 'src/backend/MyProject.Application/Identity/IUserService.cs', templated: true },

			// Application - Caching
			{
				path: 'src/backend/MyProject.Application/Caching/Constants/CacheKeys.cs',
				templated: false
			},

			// Application - Cookies
			{
				path: 'src/backend/MyProject.Application/Cookies/Constants/CookieNames.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Application/Cookies/ICookieService.cs', templated: false },

			// Application - Authentication DTOs and interfaces
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/IAuthenticationService.cs',
				templated: true
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

			// Application - Email verification DTOs
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/VerifyEmailInput.cs',
				templated: false
			},

			// Application - Password reset DTOs
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/ResetPasswordInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/SetPasswordInput.cs',
				templated: false
			},

			// Application - Email (auth-specific template names and models)
			{
				path: 'src/backend/MyProject.Application/Features/Email/EmailTemplateNames.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Email/Models/EmailTemplateModels.cs',
				templated: false
			},

			// Infrastructure - Caching
			{
				path: 'src/backend/MyProject.Infrastructure/Caching/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Caching/Options/CachingOptions.cs',
				templated: false
			},
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
			{ path: 'src/backend/MyProject.Infrastructure/Cryptography/HashHelper.cs', templated: false },

			// Infrastructure - Authentication
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Configurations/EmailTokenConfiguration.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Configurations/RefreshTokenConfiguration.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Extensions/ServiceCollectionExtensions.cs',
				templated: true
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
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/EmailToken.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/EmailTokenPurpose.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/RefreshToken.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Options/AuthenticationOptions.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/AuthenticationService.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/EmailTokenService.cs',
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

			// Infrastructure - Auth-specific email templates
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/verify-email.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/verify-email.subject.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/verify-email.text.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/reset-password.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/reset-password.subject.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/reset-password.text.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/invitation.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/invitation.subject.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/invitation.text.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/admin-reset-password.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/admin-reset-password.subject.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/admin-reset-password.text.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/admin-disable-2fa.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/admin-disable-2fa.subject.liquid',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/admin-disable-2fa.text.liquid',
				templated: false
			},

			// Infrastructure - Identity
			{
				path: 'src/backend/MyProject.Infrastructure/Identity/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Identity/Services/UserService.cs',
				templated: true
			},
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
			{
				path: 'src/backend/MyProject.Infrastructure/Persistence/Options/SeedOptions.cs',
				templated: false
			},

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
				templated: true
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/AuthMapper.cs',
				templated: true
			},

			// WebApi - Password controller
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/PasswordController.cs',
				templated: true
			},

			// WebApi - Email verification controller
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/EmailVerificationController.cs',
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

			// WebApi - Auth DTOs: VerifyEmail
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/VerifyEmail/VerifyEmailRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/VerifyEmail/VerifyEmailRequestValidator.cs',
				templated: false
			},

			// WebApi - Auth DTOs: ForgotPassword
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/ForgotPassword/ForgotPasswordRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/ForgotPassword/ForgotPasswordRequestValidator.cs',
				templated: false
			},

			// WebApi - Auth DTOs: ResetPassword
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/ResetPassword/ResetPasswordRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/ResetPassword/ResetPasswordRequestValidator.cs',
				templated: false
			},

			// WebApi - Auth DTOs: SetPassword
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/SetPassword/SetPasswordRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/SetPassword/SetPasswordRequestValidator.cs',
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
			{ path: 'src/backend/MyProject.WebApi/Features/Users/UsersController.cs', templated: true },

			// WebApi - Routing
			{ path: 'src/backend/MyProject.WebApi/Routing/RoleNameRouteConstraint.cs', templated: false },

			// Tests - Api
			{
				path: 'src/backend/tests/MyProject.Api.Tests/MyProject.Api.Tests.csproj',
				templated: false
			},
			{ path: 'src/backend/tests/MyProject.Api.Tests/GlobalUsings.cs', templated: false },
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Fixtures/CustomWebApplicationFactory.cs',
				templated: true
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
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Controllers/UsersControllerTests.cs',
				templated: true
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
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/ChangePasswordRequestValidatorTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/VerifyEmailRequestValidatorTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/ForgotPasswordRequestValidatorTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/ResetPasswordRequestValidatorTests.cs',
				templated: false
			},

			// Tests - Component
			{
				path: 'src/backend/tests/MyProject.Component.Tests/MyProject.Component.Tests.csproj',
				templated: true
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
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/UserServiceTests.cs',
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/NoOpHybridCacheTests.cs',
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
