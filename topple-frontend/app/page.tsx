"use client";

import { useEffect, useState, useCallback } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { FAUCET_ABI } from "@/lib/faucetABI";
import { USDC_ABI } from "@/lib/usdcABI";

const FAUCET_ADDRESS = process.env.NEXT_PUBLIC_FAUCET_ADDRESS!;
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS!;

// Type for wallet provider
type WalletProvider = {
	request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
	on: (event: string, handler: (...args: unknown[]) => void) => void;
	removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
};

export default function Home() {
	const { address, isConnected } = useAppKitAccount();
	const { walletProvider } = useAppKitProvider("eip155");

	const [balance, setBalance] = useState<string>("0");
	const [claimAmount, setClaimAmount] = useState<string>("0");
	const [nextClaimTime, setNextClaimTime] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const [txHash, setTxHash] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [timeRemaining, setTimeRemaining] = useState<string>("");

	const fetchUserData = useCallback(async () => {
		try {
			if (!walletProvider || !address) return;

			const provider = new BrowserProvider(walletProvider as unknown as WalletProvider);
			const signer = await provider.getSigner();

			// Get USDC balance
			const usdcContract = new Contract(USDC_ADDRESS, USDC_ABI, signer);
			const balanceRaw = await usdcContract.balanceOf(address);
			const decimals = await usdcContract.decimals();
			setBalance(formatUnits(balanceRaw, decimals));

			// Get claim amount and next claim time
			const faucetContract = new Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);
			const claimAmountRaw = await faucetContract.usdcClaimAmount();
			setClaimAmount(formatUnits(claimAmountRaw, decimals));

			const nextClaim = await faucetContract.getNextClaimTime(address);
			setNextClaimTime(Number(nextClaim));
		} catch (err) {
			console.error("Error fetching data:", err);
		}
	}, [walletProvider, address]);

	// Fetch balance and claim info
	useEffect(() => {
		if (isConnected && address && walletProvider) {
			fetchUserData();
		}
	}, [isConnected, address, walletProvider, fetchUserData]);

	// Update countdown timer
	useEffect(() => {
		if (nextClaimTime > 0) {
			const interval = setInterval(() => {
				const now = Math.floor(Date.now() / 1000);
				const remaining = nextClaimTime - now;

				if (remaining <= 0) {
					setTimeRemaining("");
					clearInterval(interval);
				} else {
					const hours = Math.floor(remaining / 3600);
					const minutes = Math.floor((remaining % 3600) / 60);
					const seconds = remaining % 60;
					setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [nextClaimTime]);

	const handleClaim = async () => {
		if (!walletProvider || !address) return;

		setIsLoading(true);
		setError("");
		setTxHash("");

		try {
			const provider = new BrowserProvider(walletProvider as unknown as WalletProvider);
			const signer = await provider.getSigner();
			const faucetContract = new Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);

			const tx = await faucetContract.drip(address);
			setTxHash(tx.hash);

			await tx.wait();

			// Refresh data after successful claim
			await fetchUserData();
			setError("");
		} catch (err: unknown) {
			console.error("Claim error:", err);

			// Parse error message
			const errorMessage = err instanceof Error ? err.message : "Unknown error";
			if (errorMessage?.includes("ClaimTooSoon")) {
				setError("You need to wait before claiming again");
			} else if (errorMessage?.includes("InsufficientFaucetBalance")) {
				setError("Faucet is empty. Please contact the administrator.");
			} else if (errorMessage?.includes("user rejected")) {
				setError("Transaction was rejected");
			} else {
				setError(errorMessage || "Failed to claim tokens");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const canClaim = () => {
		const now = Math.floor(Date.now() / 1000);
		return nextClaimTime <= now;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-2xl mx-auto">
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-5xl font-bold text-gray-900 mb-4">USDC Faucet</h1>
						<p className="text-xl text-gray-600">Claim free USDC tokens on Base network</p>
					</div>

					{/* Main Card */}
					<div className="bg-white rounded-2xl shadow-xl p-8">
						{/* Connect Wallet Button */}
						<div className="mb-8">
							<appkit-button />
						</div>

						{isConnected ? (
							<>
								{/* Balance Display */}
								<div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mb-6 text-white">
									<div className="text-sm opacity-90 mb-2">Your USDC Balance</div>
									<div className="text-4xl font-bold">{parseFloat(balance).toFixed(2)} USDC</div>
									<div className="text-sm opacity-75 mt-2">Claim Amount: {claimAmount} USDC</div>
								</div>

								{/* Claim Button or Countdown */}
								<div className="space-y-4">
									{canClaim() ? (
										<button
											onClick={handleClaim}
											disabled={isLoading}
											className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105">
											{isLoading ? (
												<span className="flex items-center justify-center">
													<svg
														className="animate-spin h-5 w-5 mr-3"
														viewBox="0 0 24 24">
														<circle
															className="opacity-25"
															cx="12"
															cy="12"
															r="10"
															stroke="currentColor"
															strokeWidth="4"
															fill="none"
														/>
														<path
															className="opacity-75"
															fill="currentColor"
															d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
														/>
													</svg>
													Processing...
												</span>
											) : (
												"Claim Tokens"
											)}
										</button>
									) : (
										<div className="bg-gray-100 rounded-xl p-6 text-center">
											<div className="text-gray-600 mb-2">Next claim available in:</div>
											<div className="text-3xl font-bold text-indigo-600">{timeRemaining}</div>
										</div>
									)}

									{/* Transaction Hash */}
									{txHash && (
										<div className="bg-green-50 border border-green-200 rounded-xl p-4">
											<div className="text-sm text-green-800 font-semibold mb-2">Transaction Successful! 🎉</div>
											<a
												href={`https://basescan.org/tx/${txHash}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-blue-600 hover:text-blue-800 break-all underline">
												View on BaseScan →
											</a>
										</div>
									)}

									{/* Error Message */}
									{error && (
										<div className="bg-red-50 border border-red-200 rounded-xl p-4">
											<div className="text-sm text-red-800 font-semibold mb-1">Error</div>
											<div className="text-sm text-red-600">{error}</div>
										</div>
									)}
								</div>

								{/* Info Section */}
								<div className="mt-8 pt-8 border-t border-gray-200">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<div className="text-gray-500 mb-1">Network</div>
											<div className="font-semibold">Base</div>
										</div>
										<div>
											<div className="text-gray-500 mb-1">Cooldown</div>
											<div className="font-semibold">24 hours</div>
										</div>
									</div>
								</div>
							</>
						) : (
							<div className="text-center py-12">
								<div className="text-6xl mb-4">💧</div>
								<h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
								<p className="text-gray-600">Connect your wallet to claim free USDC tokens</p>
							</div>
						)}
					</div>

					{/* Footer Info */}
					<div className="mt-8 text-center text-sm text-gray-600">
						<p>
							Contract Address:{" "}
							<a
								href={`https://basescan.org/address/${FAUCET_ADDRESS}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:text-blue-800 underline">
								{FAUCET_ADDRESS}
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
