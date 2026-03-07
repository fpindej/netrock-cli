import { registerManifest } from '../features/manifest.js';

/** Registers the jobs feature manifest - Hangfire background job scheduling, management, and recurring jobs. */
export function registerJobsManifest(): void {
	registerManifest({
		featureId: 'jobs',
		files: [
			// Application
			{
				path: 'src/backend/MyProject.Application/Features/Jobs/Dtos/JobExecutionOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Jobs/Dtos/RecurringJobDetailOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Jobs/Dtos/RecurringJobOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Jobs/IJobManagementService.cs',
				templated: false
			},

			// Infrastructure
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Jobs/Configurations/PausedJobConfiguration.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Jobs/Examples/ExampleFireAndForgetJob.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Jobs/Extensions/ApplicationBuilderExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Jobs/Extensions/ServiceCollectionExtensions.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Jobs/IRecurringJobDefinition.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.Infrastructure/Features/Jobs/Models/PausedJob.cs', templated: false },
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Jobs/Options/JobSchedulingOptions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Jobs/RecurringJobs/ExpiredEmailTokenCleanupJob.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Jobs/RecurringJobs/ExpiredRefreshTokenCleanupJob.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Jobs/RecurringJobs/ExpiredTwoFactorChallengeCleanupJob.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Jobs/Services/JobManagementService.cs',
				templated: false
			},

			// WebApi
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/JobsController.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.WebApi/Features/Admin/JobsMapper.cs', templated: false },
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/Jobs/JobExecutionResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/Jobs/RecurringJobDetailResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/Jobs/RecurringJobResponse.cs',
				templated: false
			},
			{ path: 'src/backend/MyProject.WebApi/Routing/JobIdRouteConstraint.cs', templated: false },

			// Tests
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Controllers/JobsControllerTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Validation/JobSchedulingOptionsValidationTests.cs',
				templated: false
			}
		]
	});
}
