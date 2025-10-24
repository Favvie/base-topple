import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AstrodexPair", (m) => {
	// First deploy the factory which will be used to create pairs
	const factory = m.contract("AstrodexFactory");

	return { factory };
});
