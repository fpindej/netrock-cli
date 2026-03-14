import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const origin = url.origin;

	const body = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /api/',
		// @feature admin
		'Disallow: /admin/',
		// @end
		// @feature auth
		'Disallow: /dashboard',
		'Disallow: /profile',
		'Disallow: /settings',
		// @end
		'',
		`Sitemap: ${origin}/sitemap.xml`
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
