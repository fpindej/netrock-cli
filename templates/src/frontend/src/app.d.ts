// @feature auth
import type { components } from '$lib/api/v1';
// @end

declare global {
	namespace App {
		interface Locals {
			// @feature auth
			user: components['schemas']['UserResponse'] | null;
			// @end
			// @feature !auth
			user: null;
			// @end
			locale: string;
		}
	}

	// @feature captcha
	interface Window {
		turnstile?: {
			render: (container: HTMLElement, options: Record<string, unknown>) => string;
			reset: (widgetId: string) => void;
			remove: (widgetId: string) => void;
		};
	}
	// @end
}

export {};
