import { registerManifest } from '../features/manifest.js';

/** Registers the 2fa feature manifest - two-factor authentication setup, verification, and recovery. */
export function registerTwoFactorManifest(): void {
	registerManifest({
		featureId: '2fa',
		files: [
			// Frontend i18n
			{ path: 'src/frontend/src/messages/en/2fa.json', templated: false },
			{ path: 'src/frontend/src/messages/cs/2fa.json', templated: false },

			// Application
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/TwoFactorSetupOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/TwoFactorVerifySetupOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/ITwoFactorService.cs',
				templated: false
			},

			// Infrastructure
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/TwoFactorChallenge.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Configurations/TwoFactorChallengeConfiguration.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/TwoFactorService.cs',
				templated: true
			},

			// WebApi
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/TwoFactorController.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorDisableRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorDisableRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorLoginRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorLoginRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorRecoveryLoginRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorRecoveryLoginRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorRegenerateCodesRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorRegenerateCodesRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorSetupResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorVerifySetupRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorVerifySetupRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/TwoFactor/TwoFactorVerifySetupResponse.cs',
				templated: false
			},

			// Tests
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/TwoFactorServiceTests.cs',
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/TwoFactorValidatorTests.cs',
				templated: false
			}
		]
	});
}
