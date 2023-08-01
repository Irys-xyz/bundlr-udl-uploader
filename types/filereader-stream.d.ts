declare module "filereader-stream" {
	import { Readable } from "stream";

	function createStream(file: File | Blob | string, options?: any): Readable;

	export default createStream;
}
