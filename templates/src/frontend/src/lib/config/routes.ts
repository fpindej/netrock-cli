// @feature admin
import { Permissions } from '$lib/utils/permissions';
// @end

/**
 * Centralized route path constants.
 * Use these instead of hardcoding path strings to keep navigation targets
 * in sync and make route changes a single-point edit.
 */
export const routes = {
	dashboard: '/dashboard',
	// @feature auth
	login: '/login',
	register: '/register',
	forgotPassword: '/forgot-password',
	profile: '/profile',
	settings: '/settings'
	// @end
} as const;

// @feature admin
/**
 * Union of all permission string literals from the Permissions object.
 * Catches typos at compile time - only known permission values are accepted.
 */
type PermissionValue =
	(typeof Permissions)[keyof typeof Permissions][keyof (typeof Permissions)[keyof typeof Permissions]];

/**
 * Admin route registry entry - pairs a path with its required RBAC permission.
 * Consumed by route guards, sidebar, command palette, and breadcrumbs so that
 * path-permission pairs are never duplicated.
 */
export interface AdminRoute {
	path: string;
	permission: PermissionValue;
}

export const adminRoutes = {
	users: { path: '/admin/users', permission: Permissions.Users.View },
	roles: { path: '/admin/roles', permission: Permissions.Roles.View },
	// @feature jobs
	jobs: { path: '/admin/jobs', permission: Permissions.Jobs.View },
	// @end
	// @feature oauth
	oauthProviders: { path: '/admin/oauth-providers', permission: Permissions.OAuthProviders.View }
	// @end
} as const satisfies Record<string, AdminRoute>;
// @end
