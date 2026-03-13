import { registerManifest } from '../features/manifest.js';

/** Registers the frontend feature manifest - full SvelteKit frontend with all feature UIs. */
export function registerFrontendManifest(): void {
	registerManifest({
		featureId: 'frontend',
		files: [
			{ path: 'src/frontend/.dockerignore', templated: false },
			{ path: 'src/frontend/.env.example', templated: false },
			{ path: 'src/frontend/.env.test', templated: false },
			{ path: 'src/frontend/.gitignore', templated: false },
			{ path: 'src/frontend/.npmrc', templated: false },
			{ path: 'src/frontend/.prettierignore', templated: false },
			{ path: 'src/frontend/.prettierrc', templated: false },
			{ path: 'src/frontend/Dockerfile', templated: false },
			{ path: 'src/frontend/Dockerfile.local', templated: false },
			{ path: 'src/frontend/README.md', templated: false },
			{ path: 'src/frontend/components.json', templated: false },
			{ path: 'src/frontend/eslint.config.js', templated: false },
			{ path: 'src/frontend/package.json', templated: false },
			{ path: 'src/frontend/pnpm-lock.yaml', templated: false },
			{ path: 'src/frontend/project.inlang/settings.json', templated: false },
			{ path: 'src/frontend/src/app.d.ts', templated: false },
			{ path: 'src/frontend/src/app.html', templated: false },
			{ path: 'src/frontend/src/hooks.server.test.ts', templated: false },
			{ path: 'src/frontend/src/hooks.server.ts', templated: false },
			{ path: 'src/frontend/src/lib/api/backend-monitor.ts', templated: false },
			{ path: 'src/frontend/src/lib/api/client.ts', templated: false },
			{ path: 'src/frontend/src/lib/api/error-handling.test.ts', templated: false },
			{ path: 'src/frontend/src/lib/api/error-handling.ts', templated: false },
			{ path: 'src/frontend/src/lib/api/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/api/mutation.test.ts', templated: false },
			{ path: 'src/frontend/src/lib/api/mutation.ts', templated: false },
			{ path: 'src/frontend/src/lib/api/v1.d.ts', templated: false },
			{ path: 'src/frontend/src/lib/auth/auth.test.ts', templated: false },
			{ path: 'src/frontend/src/lib/auth/auth.ts', templated: false },
			{ path: 'src/frontend/src/lib/auth/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/auth/middleware.test.ts', templated: false },
			{ path: 'src/frontend/src/lib/auth/middleware.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/admin/AccountActions.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/AccountInfoCard.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/AuditTrailCard.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/CreateRoleDialog.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/CreateUserDialog.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/JobActionsCard.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/JobExecutionHistory.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/JobInfoCard.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/JobTable.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/OAuthProviderCard.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/Pagination.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/RoleCardGrid.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/RoleDeleteSection.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/RoleDetailsCard.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/RoleManagement.svelte', templated: true },
			{
				path: 'src/frontend/src/lib/components/admin/RolePermissionEditor.svelte',
				templated: true
			},
			{
				path: 'src/frontend/src/lib/components/admin/RolePermissionsSection.svelte',
				templated: true
			},
			{ path: 'src/frontend/src/lib/components/admin/UserDetailCards.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/UserManagementCard.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/UserTable.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/admin/index.ts', templated: true },
			{ path: 'src/frontend/src/lib/components/auth/AuthShell.svelte', templated: false },
			{
				path: 'src/frontend/src/lib/components/auth/EmailVerificationBanner.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/auth/ForgotPasswordForm.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/auth/LoginForm.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/auth/RegisterForm.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/auth/ResetPasswordForm.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/auth/TurnstileWidget.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/auth/TwoFactorStep.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/auth/index.ts', templated: true },
			{ path: 'src/frontend/src/lib/components/common/EmptyState.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/common/FieldError.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/common/IconCircle.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/common/LoadingSpinner.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/common/PageHeader.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/common/ReadOnlyNotice.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/common/StatusIndicator.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/common/WorkInProgress.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/common/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/layout/AppSidebar.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/layout/CommandPalette.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/layout/ContentHeader.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/layout/Header.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/layout/LanguageSelector.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/layout/ShortcutsHelp.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/layout/ThemeToggle.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/layout/UserNav.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/layout/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/oauth/ConnectedAccountsCard.svelte',
				templated: true
			},
			{ path: 'src/frontend/src/lib/components/oauth/DisconnectDialog.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/oauth/OAuthProviderButton.svelte', templated: true },
			{
				path: 'src/frontend/src/lib/components/oauth/OAuthProviderButtons.svelte',
				templated: true
			},
			{ path: 'src/frontend/src/lib/components/oauth/ProviderIcon.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/oauth/index.ts', templated: true },
			{ path: 'src/frontend/src/lib/components/profile/AccountDetails.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/profile/AvatarCropStep.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/profile/AvatarDialog.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/profile/AvatarSelectStep.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/profile/InfoItem.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/profile/ProfileForm.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/profile/ProfileHeader.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/profile/index.ts', templated: true },
			{ path: 'src/frontend/src/lib/components/settings/ActivityLog.svelte', templated: true },
			{
				path: 'src/frontend/src/lib/components/settings/ChangePasswordForm.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/settings/DeleteAccountDialog.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/settings/SetPasswordForm.svelte', templated: true },
			{ path: 'src/frontend/src/lib/components/settings/TwoFactorCard.svelte', templated: true },
			{
				path: 'src/frontend/src/lib/components/settings/TwoFactorDisableDialog.svelte',
				templated: true
			},
			{
				path: 'src/frontend/src/lib/components/settings/TwoFactorRecoveryCodesDialog.svelte',
				templated: true
			},
			{
				path: 'src/frontend/src/lib/components/settings/TwoFactorSetupDialog.svelte',
				templated: true
			},
			{ path: 'src/frontend/src/lib/components/settings/index.ts', templated: true },
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog-action.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog-cancel.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog-content.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog-description.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog-footer.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog-header.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog-overlay.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog-portal.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog-title.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog-trigger.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/alert-dialog/alert-dialog.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/alert-dialog/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/alert/alert-description.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/alert/alert-title.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/alert/alert.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/alert/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/avatar/avatar-fallback.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/avatar/avatar-image.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/avatar/avatar.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/avatar/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/badge/badge.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/badge/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/breadcrumb/breadcrumb-ellipsis.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/breadcrumb/breadcrumb-item.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/breadcrumb/breadcrumb-link.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/breadcrumb/breadcrumb-list.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/breadcrumb/breadcrumb-page.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/breadcrumb/breadcrumb-separator.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/breadcrumb/breadcrumb.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/breadcrumb/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/button/button.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/button/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/card/card-content.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/card/card-description.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/card/card-footer.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/card/card-header.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/card/card-title.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/card/card.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/card/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/checkbox/checkbox.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/checkbox/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/command/command-dialog.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/command/command-empty.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/command/command-group.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/command/command-input.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/command/command-item.svelte', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/command/command-link-item.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/command/command-list.svelte', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/command/command-loading.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/command/command-separator.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/command/command-shortcut.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/command/command.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/command/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/dialog/dialog-close.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/dialog/dialog-content.svelte', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/dialog/dialog-description.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/dialog/dialog-footer.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/dialog/dialog-header.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/dialog/dialog-overlay.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/dialog/dialog-portal.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/dialog/dialog-title.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/dialog/dialog-trigger.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/dialog/dialog.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/dialog/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-checkbox-group.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-checkbox-item.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-content.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-group-heading.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-group.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-item.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-label.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-portal.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-radio-group.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-radio-item.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-separator.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-shortcut.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-sub-content.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-sub-trigger.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-sub.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-trigger.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/dropdown-menu/dropdown-menu.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/dropdown-menu/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/form/form-button.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/form/form-description.svelte', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/form/form-element-field.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/form/form-field-errors.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/form/form-field.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/form/form-fieldset.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/form/form-label.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/form/form-legend.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/form/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/input-otp/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/input-otp/input-otp-group.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/input-otp/input-otp-separator.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/input-otp/input-otp-slot.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/input-otp/input-otp.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/input/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/input/input.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/label/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/label/label.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/pagination/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/pagination/pagination-content.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/pagination/pagination-ellipsis.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/pagination/pagination-item.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/pagination/pagination-link.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/pagination/pagination-next-button.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/pagination/pagination-next.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/pagination/pagination-prev-button.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/pagination/pagination-previous.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/pagination/pagination.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/phone-input/country-codes.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/phone-input/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/phone-input/phone-input.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/select/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/select/select-content.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/select/select-item.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/select/select-trigger.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/separator/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/separator/separator.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sheet/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sheet/sheet-close.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sheet/sheet-content.svelte', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/sheet/sheet-description.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/sheet/sheet-footer.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sheet/sheet-header.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sheet/sheet-overlay.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sheet/sheet-portal.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sheet/sheet-title.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sheet/sheet-trigger.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sheet/sheet.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sidebar/constants.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sidebar/context.svelte.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sidebar/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-content.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-footer.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-group-action.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-group-content.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-group-label.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-group.svelte', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-header.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-input.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-inset.svelte', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-menu-action.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-menu-badge.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-menu-button.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-menu-item.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-menu-skeleton.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-menu-sub-button.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-menu-sub-item.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-menu-sub.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-menu.svelte', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-provider.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-rail.svelte', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-separator.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/sidebar/sidebar-trigger.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/sidebar/sidebar.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/skeleton/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/skeleton/skeleton.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/slider/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/slider/slider.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sonner/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/sonner/sonner.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/switch/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/switch/switch.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/table/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/table/table-body.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/table/table-caption.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/table/table-cell.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/table/table-footer.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/table/table-head.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/table/table-header.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/table/table-row.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/table/table.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/textarea/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/textarea/textarea.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/timeline/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/timeline/timeline-content.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/timeline/timeline-item.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/timeline/timeline.svelte', templated: false },
			{ path: 'src/frontend/src/lib/components/ui/tooltip/index.ts', templated: false },
			{
				path: 'src/frontend/src/lib/components/ui/tooltip/tooltip-content.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/tooltip/tooltip-portal.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/tooltip/tooltip-provider.svelte',
				templated: false
			},
			{
				path: 'src/frontend/src/lib/components/ui/tooltip/tooltip-trigger.svelte',
				templated: false
			},
			{ path: 'src/frontend/src/lib/components/ui/tooltip/tooltip.svelte', templated: false },
			{ path: 'src/frontend/src/lib/config/i18n.ts', templated: false },
			{ path: 'src/frontend/src/lib/config/index.ts', templated: true },
			{ path: 'src/frontend/src/lib/config/routes.ts', templated: true },
			{ path: 'src/frontend/src/lib/config/server.ts', templated: false },
			{ path: 'src/frontend/src/lib/hooks/is-mobile.svelte.ts', templated: false },
			{ path: 'src/frontend/src/lib/schemas/auth.ts', templated: false },
			{ path: 'src/frontend/src/lib/state/breadcrumb.svelte.ts', templated: false },
			{ path: 'src/frontend/src/lib/state/cooldown.svelte.ts', templated: false },
			{ path: 'src/frontend/src/lib/state/health.svelte.ts', templated: false },
			{ path: 'src/frontend/src/lib/state/health.test.ts', templated: false },
			{ path: 'src/frontend/src/lib/state/index.ts', templated: false },
			{ path: 'src/frontend/src/lib/state/shake.svelte.ts', templated: false },
			{ path: 'src/frontend/src/lib/state/shortcuts.svelte.ts', templated: false },
			{ path: 'src/frontend/src/lib/state/theme.svelte.ts', templated: false },
			{ path: 'src/frontend/src/lib/types/index.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/audit.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/crop.test.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/crop.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/index.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/jobs.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/oauth.test.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/oauth.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/permissions.test.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/permissions.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/platform.ts', templated: false },
			{ path: 'src/frontend/src/lib/utils/roles.test.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/roles.ts', templated: true },
			{ path: 'src/frontend/src/lib/utils/ui.ts', templated: false },
			{ path: 'src/frontend/src/messages/cs.json', templated: false },
			{ path: 'src/frontend/src/messages/en.json', templated: false },
			{ path: 'src/frontend/src/routes/(app)/+layout.server.ts', templated: false },
			{ path: 'src/frontend/src/routes/(app)/+layout.svelte', templated: false },
			{ path: 'src/frontend/src/routes/(app)/+page.server.ts', templated: false },
			{ path: 'src/frontend/src/routes/(app)/dashboard/+page.svelte', templated: false },
			{ path: 'src/frontend/src/routes/(app)/admin/+layout.server.ts', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/jobs/+page.server.ts', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/jobs/+page.svelte', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/jobs/[jobId]/+page.server.ts', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/jobs/[jobId]/+page.svelte', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/layout.server.test.ts', templated: true },
			{
				path: 'src/frontend/src/routes/(app)/admin/oauth-providers/+page.server.ts',
				templated: true
			},
			{ path: 'src/frontend/src/routes/(app)/admin/oauth-providers/+page.svelte', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/roles/+page.server.ts', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/roles/+page.svelte', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/roles/[id]/+page.server.ts', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/roles/[id]/+page.svelte', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/users/+page.server.ts', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/users/+page.svelte', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/users/[id]/+page.server.ts', templated: true },
			{ path: 'src/frontend/src/routes/(app)/admin/users/[id]/+page.svelte', templated: true },
			{ path: 'src/frontend/src/routes/(app)/layout.server.test.ts', templated: false },
			{ path: 'src/frontend/src/routes/(app)/profile/+page.svelte', templated: false },
			{ path: 'src/frontend/src/routes/(app)/settings/+page.svelte', templated: true },
			{ path: 'src/frontend/src/routes/(public)/+layout.server.ts', templated: false },
			{
				path: 'src/frontend/src/routes/(public)/forgot-password/+page.server.ts',
				templated: false
			},
			{ path: 'src/frontend/src/routes/(public)/forgot-password/+page.svelte', templated: false },
			{ path: 'src/frontend/src/routes/(public)/login/+page.server.ts', templated: false },
			{ path: 'src/frontend/src/routes/(public)/login/+page.svelte', templated: false },
			{ path: 'src/frontend/src/routes/(public)/login/page.server.test.ts', templated: false },
			{ path: 'src/frontend/src/routes/(public)/oauth/callback/+page.server.ts', templated: true },
			{ path: 'src/frontend/src/routes/(public)/oauth/callback/+page.svelte', templated: true },
			{
				path: 'src/frontend/src/routes/(public)/oauth/callback/page.server.test.ts',
				templated: true
			},
			{ path: 'src/frontend/src/routes/(public)/register/+page.server.ts', templated: false },
			{ path: 'src/frontend/src/routes/(public)/register/+page.svelte', templated: false },
			{ path: 'src/frontend/src/routes/(public)/reset-password/+page.server.ts', templated: false },
			{ path: 'src/frontend/src/routes/(public)/reset-password/+page.svelte', templated: false },
			{ path: 'src/frontend/src/routes/(public)/verify-email/+page.server.ts', templated: false },
			{ path: 'src/frontend/src/routes/(public)/verify-email/+page.svelte', templated: false },
			{ path: 'src/frontend/src/routes/+error.svelte', templated: false },
			{ path: 'src/frontend/src/routes/+layout.server.ts', templated: false },
			{ path: 'src/frontend/src/routes/+layout.svelte', templated: false },
			{ path: 'src/frontend/src/routes/+layout.ts', templated: false },
			{ path: 'src/frontend/src/routes/api/[...path]/+server.ts', templated: false },
			{ path: 'src/frontend/src/routes/api/health/+server.ts', templated: false },
			{ path: 'src/frontend/src/routes/api/proxy.test.ts', templated: false },
			{ path: 'src/frontend/src/routes/layout.server.test.ts', templated: false },
			{ path: 'src/frontend/src/styles/animations.css', templated: false },
			{ path: 'src/frontend/src/styles/base.css', templated: false },
			{ path: 'src/frontend/src/styles/index.css', templated: false },
			{ path: 'src/frontend/src/styles/tailwind.css', templated: false },
			{ path: 'src/frontend/src/styles/themes.css', templated: false },
			{ path: 'src/frontend/src/styles/utilities.css', templated: false },
			{ path: 'src/frontend/src/test-setup.ts', templated: false },
			{ path: 'src/frontend/src/test-utils.ts', templated: false },
			{ path: 'src/frontend/static/android-chrome-192x192.png', templated: false },
			{ path: 'src/frontend/static/android-chrome-512x512.png', templated: false },
			{ path: 'src/frontend/static/apple-touch-icon.png', templated: false },
			{ path: 'src/frontend/static/favicon-16x16.png', templated: false },
			{ path: 'src/frontend/static/favicon-32x32.png', templated: false },
			{ path: 'src/frontend/static/favicon.ico', templated: false },
			{ path: 'src/frontend/static/robots.txt', templated: false },
			{ path: 'src/frontend/static/site.webmanifest', templated: false },
			{ path: 'src/frontend/svelte.config.js', templated: false },
			{ path: 'src/frontend/tsconfig.json', templated: false },
			{ path: 'src/frontend/vite.config.ts', templated: false }
		]
	});
}
