import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("StakerModule", (m) => {
	const exampleContract = "0x3058678c16e634be4680d0d92f0cbb84a0fb70a2";
	const staker = m.contract("Staker", [exampleContract]);

	return { staker };
});
