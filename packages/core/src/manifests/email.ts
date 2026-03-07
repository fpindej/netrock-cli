import { registerManifest } from '../features/manifest.js';

/** Registers the email feature manifest - SMTP email sending, Fluid templates, and email rendering. */
export function registerEmailManifest(): void {
	registerManifest({
		featureId: 'email',
		files: [
			// Application
			{ path: 'src/backend/MyProject.Application/Features/Email/EmailMessage.cs', templated: false },
			{
				path: 'src/backend/MyProject.Application/Features/Email/EmailTemplateNames.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Application/Features/Email/IEmailService.cs', templated: false },
			{
				path: 'src/backend/MyProject.Application/Features/Email/IEmailTemplateRenderer.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Email/ITemplatedEmailSender.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Email/Models/EmailTemplateModels.cs',
				templated: false
			},

			// Infrastructure - Services
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
				templated: false
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

			// Infrastructure - Templates
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Email/Templates/_base.liquid',
				templated: false
			},
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

			// Tests
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
