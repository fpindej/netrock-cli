declare module 'virtual:templates' {
	export const textFiles: Map<string, string>;
	/** Base64-encoded binary files. Decode with atob() at runtime. */
	export const binaryFiles: Map<string, string>;
}

declare module 'virtual:changelog' {
	const content: string;
	export default content;
}
