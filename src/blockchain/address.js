export const SupportedChainId = {
  POLYGON_MAINNET: 137,
  POLYGON_TESTNET: 80001,
  POLYGON_HEX_MAINNET: "0x89",
  POLYGON_HEX_TESTNET: "0x13881",
};

export const PacmanAddressess = {
  [SupportedChainId.POLYGON_MAINNET]: "",
  [SupportedChainId.POLYGON_TESTNET]: "0x36858A3C5D7afCf0416DC13cfb618e3098976Ee9",
  [SupportedChainId.POLYGON_HEX_MAINNET]: "",
  [SupportedChainId.POLYGON_HEX_TESTNET]: "0x36858A3C5D7afCf0416DC13cfb618e3098976Ee9",
};

export default module.exports = {
  SupportedChainId: SupportedChainId,
  PacmanAddressess: PacmanAddressess,
};