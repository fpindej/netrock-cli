import { registerManifest } from '../features/manifest.js';

/** Registers the avatars feature manifest - avatar uploads with image processing. */
export function registerAvatarsManifest(): void {
	registerManifest({
		featureId: 'avatars',
		files: [
			// Frontend i18n
			{ path: 'src/frontend/src/messages/en/avatars.json', templated: false },
			{ path: 'src/frontend/src/messages/cs/avatars.json', templated: false },

			// Application
			{
				path: 'src/backend/MyProject.Application/Features/Avatar/Dtos/ProcessedImageOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Avatar/IImageProcessingService.cs',
				templated: false
			},

			// Infrastructure
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Avatar/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Avatar/Services/ImageProcessingService.cs',
				templated: false
			},

			// WebApi
			{
				path: 'src/backend/MyProject.WebApi/Features/Users/Dtos/UploadAvatar/UploadAvatarRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Users/Dtos/UploadAvatar/UploadAvatarRequestValidator.cs',
				templated: false
			},

			// Tests
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/ImageProcessingServiceTests.cs',
				templated: false
			}
		]
	});
}
