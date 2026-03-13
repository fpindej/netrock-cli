import { registerManifest } from '../features/manifest.js';

/** Registers the email feature manifest - SMTP service, Liquid template rendering, and base layout. */
export function registerEmailManifest(): void {
	registerManifest({
		featureId: 'email',
		files: [
			// Application - Email interfaces and data types
			{
				path: 'src/backend/MyProject.Application/Features/Email/EmailMessage.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Email/IEmailService.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Email/IEmailTemplateRenderer.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Email/ITemplatedEmailSender.cs',
				templated: false
			},

			// Infrastructure - Email services and configuration
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Options/EmailOptions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Services/FluidEmailTemplateRenderer.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Services/NoOpEmailService.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Services/SmtpEmailService.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Services/TemplatedEmailSender.cs',
				templated: false
			},

			// Infrastructure - Base email template layout
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/_base.liquid',
				templated: false
			},

			// Tests - Email services
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/FluidEmailTemplateRendererTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/SmtpEmailServiceTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/TemplatedEmailSenderTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Validation/EmailOptionsValidationTests.cs',
				templated: false
			}
		]
	});
}
