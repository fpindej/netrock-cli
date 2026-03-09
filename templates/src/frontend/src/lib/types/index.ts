import type { components } from '$lib/api/v1';

/**
 * Shared type aliases for commonly used API types.
 * Centralizes type definitions to avoid repetition across components.
 */
export type User = components['schemas']['UserResponse'];
// @feature admin
export type AdminUser = components['schemas']['AdminUserResponse'];
export type AdminRole = components['schemas']['AdminRoleResponse'];
export type PermissionGroup = components['schemas']['PermissionGroupResponse'];
// @end
// @feature audit
export type AuditEvent = components['schemas']['AuditEventResponse'];
// @end
// @feature jobs
export type Job = components['schemas']['RecurringJobResponse'];
export type JobDetail = components['schemas']['RecurringJobDetailResponse'];
export type JobExecution = components['schemas']['JobExecutionResponse'];
// @end
// @feature oauth
export type OAuthProviderConfig = components['schemas']['OAuthProviderConfigResponse'];
// @end
