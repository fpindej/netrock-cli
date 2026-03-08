import { registerManifest } from '../features/manifest.js';

/** Registers the aspire feature manifest - .NET Aspire orchestration with AppHost and HealthProbe. */
export function registerAspireManifest(): void {
	registerManifest({
		featureId: 'aspire',
		files: [
			// AppHost
			{ path: 'src/backend/MyProject.AppHost/MyProject.AppHost.csproj', templated: false },
			{ path: 'src/backend/MyProject.AppHost/Program.cs', templated: true },
			{
				path: 'src/backend/MyProject.AppHost/Properties/launchSettings.json',
				templated: false
			},
			{ path: 'src/backend/MyProject.AppHost/appsettings.json', templated: true },

			// HealthProbe
			{ path: 'src/backend/HealthProbe/HealthProbe.csproj', templated: false },
			{ path: 'src/backend/HealthProbe/Program.cs', templated: false }
		]
	});
}
