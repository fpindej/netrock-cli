import { registerManifest } from '../features/manifest.js';

/** Registers the oauth feature manifest - external OAuth providers, admin OAuth config, and provider management. */
export function registerOAuthManifest(): void {
	registerManifest({
		featureId: 'oauth',
		files: [
			// Application - Cryptography
			{ path: 'src/backend/MyProject.Application/Cryptography/ISecretEncryptionService.cs', templated: false },

			// Infrastructure - Cryptography
			{
				path: 'src/backend/MyProject.Infrastructure/Cryptography/AesGcmEncryptionService.cs',
				templated: false
			},

			// Application - DTOs
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/ExternalCallbackInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/ExternalCallbackOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/ExternalChallengeInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/ExternalChallengeOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/ExternalProviderInfo.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/ProviderConfigOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/ProviderCredentialsOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/UpsertProviderConfigInput.cs',
				templated: false
			},

			// Application - Interfaces
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/IExternalAuthService.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/IProviderConfigService.cs',
				templated: false
			},

			// Infrastructure - Configurations
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Configurations/ExternalAuthStateConfiguration.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Configurations/ExternalProviderConfigConfiguration.cs',
				templated: false
			},

			// Infrastructure - Models
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/ExternalAuthState.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/ExternalProviderConfig.cs',
				templated: false
			},

			// Infrastructure - Options
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Options/ExternalAuthOptions.cs',
				templated: false
			},

			// Infrastructure - Services
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalAuthService.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ProviderConfigService.cs',
				templated: false
			},

			// Infrastructure - External providers
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/AppleAuthProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/DiscordAuthProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/ExternalUserInfo.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/FacebookAuthProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/GitHubAuthProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/GitLabAuthProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/GoogleAuthProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/IExternalAuthProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/LinkedInAuthProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/MicrosoftAuthProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/ProviderCredentials.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/SlackAuthProvider.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/ExternalProviders/TwitchAuthProvider.cs',
				templated: false
			},

			// WebApi - External auth controller
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/ExternalAuthController.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/External/ExternalCallbackRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/External/ExternalCallbackRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/External/ExternalCallbackResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/External/ExternalChallengeRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/External/ExternalChallengeRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/External/ExternalChallengeResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/External/ExternalProviderResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/External/ExternalUnlinkRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/External/ExternalUnlinkRequestValidator.cs',
				templated: false
			},

			// WebApi - Routing
			{
				path: 'src/backend/MyProject.WebApi/Routing/ProviderNameRouteConstraint.cs',
				templated: false
			},

			// WebApi - Admin OAuth providers
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/OAuthProvidersController.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/OAuthProvidersMapper.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/OAuthProviders/OAuthProviderConfigResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/OAuthProviders/UpdateOAuthProviderRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/OAuthProviders/UpdateOAuthProviderRequestValidator.cs',
				templated: false
			},

			// Tests
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Controllers/ExternalAuthControllerTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Controllers/OAuthProvidersControllerTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/ExternalAuthValidatorTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/ExternalAuthServiceTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/ExternalProviders/FacebookAuthProviderTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/ExternalProviders/GitLabAuthProviderTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/ExternalProviders/LinkedInAuthProviderTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/ExternalProviders/MicrosoftAuthProviderTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/ExternalProviders/SlackAuthProviderTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/ExternalProviders/TwitchAuthProviderTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Validation/ExternalAuthOptionsValidationTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Cryptography/AesGcmEncryptionServiceTests.cs',
				templated: false
			}
		]
	});
}
