import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ExternalContractModule", (m) => {
	const externalContract = m.contract("ExampleExternalContract");

	return { externalContract };
});
