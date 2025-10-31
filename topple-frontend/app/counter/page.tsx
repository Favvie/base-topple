'use client';

import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useCallback, useEffect, useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { COUNTER_ABI } from '@/lib/counterABI';

const COUNTER_ADDRESS = process.env.NEXT_PUBLIC_COUNTER_ADDRESS;

// Type for wallet provider
type WalletProvider = {
	request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
	on: (event: string, handler: (...args: unknown[]) => void) => void;
	removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
};

const CounterPage = () => {
	const { address } = useAppKitAccount();
	const { walletProvider } = useAppKitProvider('eip155');
	const [counterValue, setCounterValue] = useState<string>('0');
	const [loading, setLoading] = useState(false);
	const [txHash, setTxHash] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [incrementAmount, setIncrementAmount] = useState<string>('1');
	const [isLoadingValue, setIsLoadingValue] = useState(false);

	// Fetch current counter value
	const fetchCounterValue = useCallback(async () => {
		if (!COUNTER_ADDRESS) {
			setError('Counter contract address not configured');
			return;
		}

		try {
			setIsLoadingValue(true);
			setError(null);
			const provider = new BrowserProvider(walletProvider as unknown as WalletProvider);
			const contract = new Contract(COUNTER_ADDRESS, COUNTER_ABI, provider);
			const value = await contract.x();
			setCounterValue(value.toString());
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to fetch counter value';
			setError(errorMsg);
			console.error('Error fetching counter:', err);
		} finally {
			setIsLoadingValue(false);
		}
	}, [walletProvider]);

	// Load counter value on component mount or when wallet connects
	useEffect(() => {
		if (walletProvider && COUNTER_ADDRESS) {
			fetchCounterValue();
		}
	}, [walletProvider, fetchCounterValue]);

	// Increment by 1
	const handleIncrement = useCallback(async () => {
		if (!address) {
			setError('Please connect your wallet first');
			return;
		}

		if (!COUNTER_ADDRESS) {
			setError('Counter contract address not configured');
			return;
		}

		try {
			setLoading(true);
			setError(null);
			setTxHash(null);

			const provider = new BrowserProvider(walletProvider as unknown as WalletProvider);
			const signer = await provider.getSigner();
			const contract = new Contract(COUNTER_ADDRESS, COUNTER_ABI, signer);

			const tx = await contract.inc();
			setTxHash(tx.hash);

			// Wait for confirmation
			await tx.wait();

			// Refresh counter value
			await fetchCounterValue();
			setTxHash(null);
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to increment counter';
			setError(errorMsg);
			console.error('Error incrementing counter:', err);
		} finally {
			setLoading(false);
		}
	}, [address, walletProvider, fetchCounterValue]);

	// Increment by custom amount
	const handleIncrementBy = useCallback(async () => {
		if (!address) {
			setError('Please connect your wallet first');
			return;
		}

		if (!COUNTER_ADDRESS) {
			setError('Counter contract address not configured');
			return;
		}

		const amount = BigInt(incrementAmount);
		if (amount <= BigInt(0)) {
			setError('Increment amount must be greater than 0');
			return;
		}

		try {
			setLoading(true);
			setError(null);
			setTxHash(null);

			const provider = new BrowserProvider(walletProvider as unknown as WalletProvider);
			const signer = await provider.getSigner();
			const contract = new Contract(COUNTER_ADDRESS, COUNTER_ABI, signer);

			const tx = await contract.incBy(amount);
			setTxHash(tx.hash);

			// Wait for confirmation
			await tx.wait();

			// Refresh counter value
			await fetchCounterValue();
			setTxHash(null);
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : 'Failed to increment counter';
			setError(errorMsg);
			console.error('Error incrementing counter:', err);
		} finally {
			setLoading(false);
		}
	}, [address, incrementAmount, walletProvider, fetchCounterValue]);

	if (!COUNTER_ADDRESS) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
				<div className="max-w-2xl mx-auto">
					<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
						<h1 className="text-2xl font-bold text-red-400 mb-2">Configuration Error</h1>
						<p className="text-red-300 mb-4">
							Counter contract address is not configured. Please set the NEXT_PUBLIC_COUNTER_ADDRESS environment variable.
						</p>
						<p className="text-sm text-red-200">
							Once deployed, add the address to your .env.local file:
						</p>
						<code className="block mt-2 bg-slate-800 p-2 rounded text-sm">
							NEXT_PUBLIC_COUNTER_ADDRESS=0x...
						</code>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-white mb-2">Counter dApp</h1>
					<p className="text-slate-400">Interact with the Counter smart contract on Base</p>
				</div>

				{/* Counter Display Card */}
				<div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
					<div className="text-center">
						<p className="text-slate-400 text-sm mb-2">Current Count</p>
						{isLoadingValue ? (
							<div className="text-5xl font-bold text-blue-400 animate-pulse">...</div>
						) : (
							<div className="text-6xl font-bold text-blue-400">{counterValue}</div>
						)}
					</div>

					{/* Wallet Status */}
					<div className="mt-6 pt-6 border-t border-slate-700">
						{address ? (
							<div className="text-sm text-slate-300">
								<span className="text-slate-400">Connected: </span>
								<span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
							</div>
						) : (
							<div className="text-sm text-slate-400">Please connect your wallet to interact</div>
						)}
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
						<p className="text-red-400 text-sm">{error}</p>
					</div>
				)}

				{/* Transaction Status */}
				{txHash && (
					<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
						<p className="text-blue-400 text-sm">
							Transaction pending:{' '}
							<a
								href={`https://sepolia.basescan.org/tx/${txHash}`}
								target="_blank"
								rel="noopener noreferrer"
								className="underline hover:text-blue-300"
							>
								{txHash.slice(0, 10)}...{txHash.slice(-8)}
							</a>
						</p>
					</div>
				)}

				{/* Action Buttons */}
				<div className="space-y-4">
					{/* Increment by 1 Button */}
					<button
						onClick={handleIncrement}
						disabled={loading || !address || isLoadingValue}
						className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
					>
						{loading ? 'Processing...' : 'Increment by 1'}
					</button>

					{/* Increment by Custom Amount */}
					<div className="flex gap-2">
						<input
							type="number"
							min="1"
							value={incrementAmount}
							onChange={(e) => setIncrementAmount(e.target.value)}
							disabled={loading || !address}
							className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="Enter amount"
						/>
						<button
							onClick={handleIncrementBy}
							disabled={loading || !address || isLoadingValue}
							className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors min-w-max"
						>
							{loading ? '...' : 'Increment'}
						</button>
					</div>

					{/* Refresh Button */}
					<button
						onClick={fetchCounterValue}
						disabled={loading || isLoadingValue || !address}
						className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-300 font-semibold py-2 px-6 rounded-lg transition-colors text-sm"
					>
						{isLoadingValue ? 'Refreshing...' : 'Refresh Value'}
					</button>
				</div>

				{/* Contract Info */}
				<div className="mt-8 bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-xs">
					<p className="text-slate-400 mb-2">
						<span className="font-semibold">Contract Address:</span>
					</p>
					<code className="block font-mono text-slate-300 break-all">{COUNTER_ADDRESS}</code>
				</div>
			</div>
		</div>
	);
};

export default CounterPage;
