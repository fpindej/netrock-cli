import { registerAdminManifest } from './admin.js';
import { registerAspireManifest } from './aspire.js';
import { registerAuditManifest } from './audit.js';
import { registerAuthManifest } from './auth.js';
import { registerAvatarsManifest } from './avatars.js';
import { registerCaptchaManifest } from './captcha.js';
import { registerClaudeManifest } from './claude.js';
import { registerClaudeSkillsManifest } from './claude-skills.js';
import { registerCoreManifest } from './core.js';
import { registerFileStorageManifest } from './file-storage.js';
import { registerFrontendManifest } from './frontend.js';
import { registerJobsManifest } from './jobs.js';
import { registerOAuthManifest } from './oauth.js';
import { registerTwoFactorManifest } from './two-factor.js';

/** Registers all feature manifests. Call once before generating a project. */
export function registerAllManifests(): void {
	registerCoreManifest();
	registerAuthManifest();
	registerTwoFactorManifest();
	registerOAuthManifest();
	registerCaptchaManifest();
	registerJobsManifest();
	registerFileStorageManifest();
	registerAvatarsManifest();
	registerAuditManifest();
	registerAdminManifest();
	registerAspireManifest();
	registerClaudeManifest();
	registerClaudeSkillsManifest();
	registerFrontendManifest();
}
