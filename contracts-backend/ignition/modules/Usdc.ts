import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("UsdcModule", (m) => {
  const usdc = m.contract("Usdc");

  return { usdc };
});
