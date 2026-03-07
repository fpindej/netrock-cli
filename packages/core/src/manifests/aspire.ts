import { registerManifest } from '../features/manifest.js';

/** Registers the aspire feature manifest - .NET Aspire orchestration with AppHost and HealthProbe. */
export function registerAspireManifest(): void {
	registerManifest({
		featureId: 'aspire',
		files: [
			// AppHost
			{ path: 'src/backend/MyProject.AppHost/MyProject.AppHost.csproj', templated: false },
			{ path: 'src/backend/MyProject.AppHost/Program.cs', templated: false },
			{
				path: 'src/backend/MyProject.AppHost/Properties/launchSettings.json',
				templated: false
			},
			{ path: 'src/backend/MyProject.AppHost/appsettings.json', templated: false },

			// HealthProbe
			{ path: 'src/backend/HealthProbe/HealthProbe.csproj', templated: false },
			{ path: 'src/backend/HealthProbe/Program.cs', templated: false }
		]
	});
}
