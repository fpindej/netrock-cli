import { registerManifest } from '../features/manifest.js';

/** Registers the admin feature manifest - admin panel with user management, roles, and permissions. */
export function registerAdminManifest(): void {
	registerManifest({
		featureId: 'admin',
		files: [
			// Frontend i18n
			{ path: 'src/frontend/src/messages/en/admin.json', templated: false },
			{ path: 'src/frontend/src/messages/cs/admin.json', templated: false },

			// Application - DTOs
			{
				path: 'src/backend/MyProject.Application/Features/Admin/Dtos/AdminRoleOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Admin/Dtos/AdminUserListOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Admin/Dtos/AdminUserOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Admin/Dtos/AssignRoleInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Admin/Dtos/CreateRoleInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Admin/Dtos/CreateUserInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Admin/Dtos/PermissionGroupOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Admin/Dtos/RoleDetailOutput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Admin/Dtos/SetRolePermissionsInput.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Application/Features/Admin/Dtos/UpdateRoleInput.cs',
				templated: false
			},

			// Application - Interfaces
			{
				path: 'src/backend/MyProject.Application/Features/Admin/IAdminService.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Application/Features/Admin/IRoleManagementService.cs',
				templated: false
			},

			// Infrastructure
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Admin/Extensions/ServiceCollectionExtensions.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Admin/Services/AdminService.cs',
				templated: true
			},
			{
				path: 'src/backend/MyProject.Infrastructure/Features/Admin/Services/RoleManagementService.cs',
				templated: true
			},

			// WebApi - Controller and mappers
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/AdminController.cs',
				templated: true
			},
			{ path: 'src/backend/MyProject.WebApi/Features/Admin/AdminMapper.cs', templated: false },
			{ path: 'src/backend/MyProject.WebApi/Features/Admin/PiiMasker.cs', templated: false },

			// WebApi - Admin DTOs
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/AdminRoleResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/AdminUserResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/AssignRole/AssignRoleRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/AssignRole/AssignRoleRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/CreateRole/CreateRoleRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/CreateRole/CreateRoleRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/CreateUser/CreateUserRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/CreateUser/CreateUserRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/DisableTwoFactor/DisableTwoFactorRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/DisableTwoFactor/DisableTwoFactorRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/ListUsers/ListUsersRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/ListUsers/ListUsersRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/ListUsers/ListUsersResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/PermissionGroupResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/RoleDetailResponse.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/SetPermissions/SetPermissionsRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/SetPermissions/SetPermissionsRequestValidator.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/UpdateRole/UpdateRoleRequest.cs',
				templated: false
			},
			{
				path: 'src/backend/MyProject.WebApi/Features/Admin/Dtos/UpdateRole/UpdateRoleRequestValidator.cs',
				templated: false
			},

			// Tests
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Features/Admin/AdminMapperPiiTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Features/Admin/PiiMaskerTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Controllers/AdminControllerTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Controllers/AdminControllerDisableTwoFactorTests.cs',
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/AdminValidatorTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Api.Tests/Validators/DisableTwoFactorRequestValidatorTests.cs',
				templated: false
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/AdminServiceTests.cs',
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/AdminServiceDisableTwoFactorTests.cs',
				templated: true
			},
			{
				path: 'src/backend/tests/MyProject.Component.Tests/Services/RoleManagementServiceTests.cs',
				templated: false
			}
		]
	});
}
