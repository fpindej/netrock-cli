import { registerManifest } from '../features/manifest.js';

/** Registers the password-reset feature manifest - forgot password and reset password flows. */
export function registerPasswordResetManifest(): void {
	registerManifest({
		featureId: 'password-reset',
		files: [
			// Application
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/ResetPasswordInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Authentication/Dtos/SetPasswordInput.cs',
				templated: false
			},

			// WebApi
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/PasswordController.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/ForgotPassword/ForgotPasswordRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/ForgotPassword/ForgotPasswordRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/ResetPassword/ResetPasswordRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/ResetPassword/ResetPasswordRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/SetPassword/SetPasswordRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Authentication/Dtos/SetPassword/SetPasswordRequestValidator.cs',
				templated: false
			},

			// Tests
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/ForgotPasswordRequestValidatorTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/ResetPasswordRequestValidatorTests.cs',
				templated: false
			}
		]
	});
}
