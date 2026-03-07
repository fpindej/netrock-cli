import { registerManifest } from '../features/manifest.js';

/** Registers the file-storage feature manifest - S3/MinIO file storage with upload and download. */
export function registerFileStorageManifest(): void {
	registerManifest({
		featureId: 'file-storage',
		files: [
			// Application
			{
				path: 'src/backend/MyProject.Application/Features/FileStorage/Dtos/FileDownloadOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/FileStorage/IFileStorageService.cs',
				templated: false
			},

			// Infrastructure
			{
				path: 'src/backend/MyProject.Infrastructure/Features/FileStorage/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/FileStorage/Options/FileStorageOptions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/FileStorage/Services/S3FileStorageService.cs',
				templated: false
			},

			// Tests
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Validation/FileStorageOptionsValidationTests.cs',
				templated: false
			}
		]
	});
}
