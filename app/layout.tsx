import "./globals.css";
import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";

export const metadata: Metadata = {
	title: "Bundlr UDL File Uploader",
	description: "Upload a file and attach UDL",
};

const roboto = Roboto({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={roboto.className}>
			<body className={roboto.className}>{children}</body>
		</html>
	);
}
