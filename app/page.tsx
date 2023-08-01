import Image from "next/image";
import BundlrUploader from "./components/BundlrUploader";

// https://arwiki.wiki/#/en/Universal-Data-License-How-to-use-it
export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
				<BundlrUploader />
			</div>
		</main>
	);
}
