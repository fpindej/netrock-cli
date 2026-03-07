import { registerManifest } from '../features/manifest.js';

/** Registers the audit feature manifest - audit trail with event logging and querying. */
export function registerAuditManifest(): void {
	registerManifest({
		featureId: 'audit',
		files: [
			// Application
			{ path: 'src/backend/MyProject.Application/Features/Audit/AuditActions.cs', templated: false },
			{
				path: 'src/backend/MyProject.Application/Features/Audit/Dtos/AuditEventListOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Audit/Dtos/AuditEventOutput.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Application/Features/Audit/IAuditService.cs', templated: false },

			// Infrastructure
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Audit/Configurations/AuditEventConfiguration.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Audit/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Audit/Models/AuditEvent.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Audit/Services/AuditService.cs',
				templated: false
			},

			// WebApi
			{ path: 'src/backend/MyProject.WebApi/Features/Audit/AuditMapper.cs', templated: false },
			{
				path: 'src/backend/MyProject.WebApi/Features/Audit/Dtos/AuditEventResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Audit/Dtos/ListAuditEvents/ListAuditEventsRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Audit/Dtos/ListAuditEvents/ListAuditEventsResponse.cs',
				templated: false
			},

			// Tests
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/AuditServiceTests.cs',
				templated: false
			}
		]
	});
}
