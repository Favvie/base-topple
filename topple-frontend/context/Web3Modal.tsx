"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { base } from "@reown/appkit/networks";

// 1. Get projectId from environment
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
	throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

// 2. Set up the Ethers adapter
const ethersAdapter = new EthersAdapter();

// 3. Create the modal
const metadata = {
	name: "USDC Faucet",
	description: "Claim free USDC tokens on Base",
	url: "https://faucet.example.com",
	icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
	adapters: [ethersAdapter],
	networks: [base],
	metadata,
	projectId,
	features: {
		analytics: true,
	},
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
