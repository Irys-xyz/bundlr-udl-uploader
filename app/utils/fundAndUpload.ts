import { WebBundlr } from "@bundlr-network/client";
import fileReaderStream from "filereader-stream";
import getBundlr from "../utils/getBundlr";

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

/**
 * This function:
 * 1. Looks at the cost to upload the selected file
 * 2. Looks at the currently loaded balance
 * 3. Funds if necessary
 * 4. Uploads the file and tags passed as parameters
 * 5. Returns the transaction ID of the upload
 */
const fundAndUpload = async (selectedFile: File, tags: Tag[]) => {
	try {
		const bundlr = await getBundlr();

		const dataStream = fileReaderStream(selectedFile);
		const price = await bundlr.getPrice(selectedFile?.size);
		const balance = await bundlr.getLoadedBalance();

		//if (price.isGreaterThanOrEqualTo(balance)) {
		console.log("Funding node.");
		await bundlr.fund(price);
		console.log("Fund successful.");
		// } else {
		// 	console.log("Funding not needed, balance sufficient.");
		// }
		console.log("Uploading");

		const tx = await bundlr.upload(dataStream, {
			tags,
		});
		console.log("Upload successful");

		return tx.id;
	} catch (e) {
		console.log("Error on upload, ", e);
	}
};

export default fundAndUpload;
