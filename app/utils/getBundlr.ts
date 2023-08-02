interface Window {
	ethereum?: any;
}

import { WebBundlr } from "@bundlr-network/client";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";

const getBundlr = async (
	url = "https://devnet.bundlr.network",
	currency = "matic",
	providerUrl = "https://rpc-mumbai.maticvigil.com",
) => {
	//@ts-ignore
	const provider = new ethers.BrowserProvider(window.ethereum);
	//@ts-ignore
	provider.getGasPrice = async () => {
		const gp = +((await provider.getFeeData()).gasPrice?.toString() ?? 0);
		console.log("getGasPrice", gp, typeof gp);
		return gp;
	};

	const e = provider.estimateGas.bind(provider);
	//@ts-ignore
	provider.estimateGas = async (tx) => {
		const est = +((await e(tx))?.toString() ?? 0);
		//@ts-ignore
		return { mul: (n) => +est * +n };
	};

	const signer = await provider.getSigner();

	signer.estimateGas = e;
	//@ts-ignore
	signer.getGasPrice = provider.getGasPrice;
	//@ts-ignore
	provider.getSigner = () => signer;
	//@ts-ignore
	signer._signTypedData = (domain, types, value) => signer.signTypedData(domain, types, value);

	const bundlr = new WebBundlr(url, currency, provider, {
		providerUrl,
	});

	bundlr.currencyConfig.createTx = async (amount, to) => {
		//@ts-ignore
		const estimatedGas = await signer.estimateGas({ to, from: bundlr.address, amount });
		//@ts-ignore
		const gasPrice = await signer.getGasPrice();
		const txr = await signer.populateTransaction({
			// eslint-disable-next-line no-undef
			to,
			from: bundlr.address,
			//@ts-ignore
			value: BigInt(amount),
			gasPrice,
			gasLimit: estimatedGas,
		});
		return { txId: undefined, tx: txr };
	};
	//@ts-ignore
	bundlr.currencyConfig.getTx = async function (txId: string): Promise<Tx> {
		//@ts-ignore
		const provider = this.providerInstance;
		const response = await provider.getTransaction(txId);

		if (!response) throw new Error("Tx doesn't exist");
		if (!response.to) throw new Error(`Unable to resolve transactions ${txId} receiver`);

		return {
			from: response.from,
			to: response.to,
			blockHeight: response.blockNumber ? new BigNumber(response.blockNumber) : undefined,
			amount: new BigNumber(response.value),
			pending: response.blockNumber ? false : true,
			//@ts-ignore
			confirmed: response.confirmations >= this.minConfirm,
		};
	};
	await bundlr.ready();
	console.log("bundlr=", bundlr);

	return bundlr;
};

export default getBundlr;
