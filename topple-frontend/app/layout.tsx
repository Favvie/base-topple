import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppKitProvider } from "@/context/Web3Modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "USDC Faucet - Base Network",
	description: "Claim free USDC tokens on Base network",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AppKitProvider>{children}</AppKitProvider>
			</body>
		</html>
	);
}
