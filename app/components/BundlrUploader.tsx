"use client";

import { useState, useEffect, useRef } from "react";
import Spinner from "./Spinner";
import fundAndUpload from "../utils/fundAndUpload";

// Define the Tag type
type Tag = {
	name: string;
	value: string;
};

export const BundlrUploader: React.FC = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileType, setFileType] = useState<string>("");

	const [licenseFeeType, setLicenseFeeType] = useState<string>("None");
	const [licenseFeeUnit, setLicenseFeeUnit] = useState<number>();

	const [commercialUse, setCommercialUse] = useState<string>("None");
	const [currency, setCurrency] = useState<string>("U");
	const [paymentAddress, setPaymentAddress] = useState<string>("");
	const [derivation, setDerivation] = useState<string>("None");

	const [txProcessing, setTxProcessing] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");

	// Called when a file is selected
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
			setFileType(event.target.files[0].type);
		}
	};

	// Called when the user clicks the Upload button
	const handleUpload = async () => {
		setMessage("");
		if (!selectedFile) {
			setMessage("Please select a file first");
			return;
		}
		setTxProcessing(true);

		// Validate input
		console.log("licenseFeeType=", licenseFeeType);

		if (licenseFeeType !== "None") {
			console.log("licenseFeeUnit=", licenseFeeUnit);
			if (!licenseFeeUnit || licenseFeeUnit === 0) {
				setMessage(`When selecting a License-Fee of "${licenseFeeType}" you must provide a unit.`);
				return;
			}
		}

		// Build tags
		const tags: Tag[] = [];
		tags.push({ name: "Content-Type", value: fileType });
		if (licenseFeeType !== "None") tags.push({ name: "License-Fee", value: licenseFeeType + "-" + licenseFeeUnit });
		if (commercialUse !== "None") tags.push({ name: "Commerical-Use", value: commercialUse });
		tags.push({ name: "Currency", value: currency });
		// Note, I'm not validating payment address here. But you could add an in an extra check to ensure it's a valid address
		if (paymentAddress) tags.push({ name: "Payment-Address", value: paymentAddress });
		if (derivation) tags.push({ name: "Derivation", value: derivation });

		// Conditionally fund and upload the file
		const txId = await fundAndUpload(selectedFile, tags);
		console.log(`File uploaded ==> https://arweave.net/${txId}`);
		setMessage(`File <a class="underline" target="_blank" href="https://arweave.net/${txId}">uploaded</a>`);

		// Reset the UI spinner
		setTxProcessing(false);
	};

	return (
		<div className="w-[400px] bg-background rounded-lg shadow-2xl p-5">
			<h2 className="text-2xl text-center font-bold mb-4 text-text">Bundlr UDL File Uploader</h2>

			<div className="pr-4 mt-5">
				<div className="rounded-lg shadow-2xl">
					<div
						className="border-2 border-dashed border-background-contrast rounded-lg p-4 mb-4 text-center"
						onDragOver={(event) => event.preventDefault()}
						onDrop={(event) => {
							event.preventDefault();
							const droppedFiles = Array.from(event.dataTransfer.files);
							setFiles(droppedFiles);
						}}
					>
						<input type="file" onChange={handleFileUpload} className="hidden" />
						{!selectedFile && (
							<button
								onClick={() => {
									const input = document.querySelector('input[type="file"]');
									if (input) {
										input.click();
									}
								}}
								className="px-4 py-2 bg-primary text-text rounded-md border-1 border-background-contrast hover:border-background hover:bg-primary hover:text-background-contrast transition-all duration-500 ease-in-out"
							>
								Select A File
							</button>
						)}
						{selectedFile && (
							<span className="px-4 py-2 bg-primary text-text rounded-md border-1">
								{selectedFile.name}
							</span>
						)}
					</div>
				</div>
				<div className="flex flex-col  bg-background rounded-lg shadow-2xl p-5">
					<p className="text-background-contrast mb-2 underline rounded-md px-1 text-center">Configure UDL</p>

					<label htmlFor="license-fee-type" className="text-text text-xs">
						License Fee
					</label>

					<div className="flex flex-row">
						<select
							id="license-fee-type"
							value={licenseFeeType}
							onChange={(e) => setLicenseFeeType(e.target.value)}
							className="bg-primary text-text rounded-md text-xs"
						>
							<option value="None">None</option>
							<option value="One-Time">One-Time</option>
							<option value="Monthly">Monthly</option>
						</select>
						<input
							type="number"
							id="license-fee-unit"
							value={licenseFeeUnit}
							onChange={(e) => setLicenseFeeUnit(Number(e.target.value))}
							className="bg-primary text-text rounded-md ml-3 text-xs pl-2"
						/>
					</div>
					<label htmlFor="commerical-use" className="text-text mt-3 underline text-xs">
						Commercial Use
					</label>

					<select
						id="commerical-use"
						value={commercialUse}
						onChange={(e) => setCommercialUse(e.target.value)}
						className="bg-primary text-text rounded-md text-xs"
					>
						<option value="None">None</option>
						<option value="Allowed">Allowed</option>
						<option value="Allowed-With-Credit">Allowed-With-Credit</option>
					</select>
					<label htmlFor="currency" className="text-text mt-3 underline text-xs">
						Currency
					</label>

					<select
						id="currency"
						value={currency}
						onChange={(e) => setCurrency(e.target.value)}
						className="bg-primary text-text rounded-md text-xs"
					>
						<option value="U">U</option>
						<option value="AR">Arweave</option>
						<option value="MATIC">Matic</option>
						<option value="ETH">Ethereum</option>
						<option value="SOl">Solana</option>
					</select>

					<label htmlFor="payment-address" className="text-text mt-3 underline text-xs">
						Payment Address
					</label>
					<input
						id="payment-address"
						value={paymentAddress}
						onChange={(e) => setPaymentAddress(e.target.value)}
						className="bg-primary text-text rounded-md text-xs pl-2"
					></input>

					<label htmlFor="derivation" className="text-text mt-3 underline text-xs">
						Derivation
					</label>
					<select
						id="derivation"
						value={derivation}
						onChange={(e) => setDerivation(e.target.value)}
						className="bg-primary text-text rounded-md text-xs"
					>
						<option value="None">None</option>
						<option value="Allowed-With-Credit">Allowed-With-Credit</option>
						<option value="Allowed-With-Indication">Allowed-With-Indication</option>
						<option value="Allowed-With-License-Passthrough">Allowed-With-License-Passthrough</option>
						<option value="Allowed-With-RevenueShare-25%">Allowed-With-RevenueShare-25%</option>
						<option value="Allowed-With-RevenueShare-50%">Allowed-With-RevenueShare-50%</option>
						<option value="Allowed-With-RevenueShare-75%">Allowed-With-RevenueShare-75%</option>
						<option value="Allowed-With-RevenueShare-100%">Allowed-With-RevenueShare-100%</option>
					</select>
				</div>
				{message && <div className="text-red-500 mt-2 " dangerouslySetInnerHTML={{ __html: message }} />}{" "}
				<button
					className={`mt-5 w-full py-2 px-4 bg-background text-text rounded-md flex items-center justify-center transition-colors duration-500 ease-in-out border-2 rounded-lg shadow-2xl border-background-contrast ${
						txProcessing ? "bg-primary text-white cursor-not-allowed" : "hover:bg-primary"
					}`}
					onClick={handleUpload}
					disabled={txProcessing}
				>
					{txProcessing ? <Spinner color="text-background" /> : "Upload"}
				</button>
			</div>
		</div>
	);
};

export default BundlrUploader;
