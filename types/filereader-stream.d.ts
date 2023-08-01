declare module "filereader-stream" {
	const createStream: (file: File, options?: any) => ReadableStream;
	export default createStream;
}
