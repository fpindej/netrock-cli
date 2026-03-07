import { registerManifest } from '../features/manifest.js';

/** Registers the email-verification feature manifest - email verification flow with token management. */
export function registerEmailVerificationManifest(): void {
	registerManifest({
		featureId: 'email-verification',
		files: [
			// Application
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/VerifyEmailInput.cs',
				templated: false
			},

			// Infrastructure
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/EmailToken.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Models/EmailTokenPurpose.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Configurations/EmailTokenConfiguration.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Authentication/Services/EmailTokenService.cs',
				templated: false
			},

			// WebApi
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/EmailVerificationController.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/VerifyEmail/VerifyEmailRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/VerifyEmail/VerifyEmailRequestValidator.cs',
				templated: false
			},

			// Tests
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/VerifyEmailRequestValidatorTests.cs',
				templated: false
			}
		]
	});
}
