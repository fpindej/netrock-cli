import { registerManifest } from '../features/manifest.js';

/** Registers the captcha feature manifest - Cloudflare Turnstile captcha verification. */
export function registerCaptchaManifest(): void {
	registerManifest({
		featureId: 'captcha',
		files: [
			// Application
			{ path: 'src/backend/MyProject.Application/Features/Captcha/ICaptchaService.cs', templated: false },

			// Infrastructure
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Captcha/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Captcha/Options/CaptchaOptions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Captcha/Services/TurnstileCaptchaService.cs',
				templated: false
			},

			// Tests
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Validation/CaptchaOptionsValidationTests.cs',
				templated: false
			}
		]
	});
}
