import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import usdcModule from "./Usdc.js";

export default buildModule("UsdcFaucetModule", (m) => {
	const { usdc } = m.useModule(usdcModule);

	const faucet = m.contract("Faucet", [usdc]);

	// Transfer 10,000 USDC to the faucet for distribution
	m.call(usdc, "transfer", [faucet, 10000n * 10n ** 6n]);

	return { faucet, usdc };
});
