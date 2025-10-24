export const FAUCET_ABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_usdcTokenAddress",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "timeRemaining",
				type: "uint256",
			},
		],
		name: "ClaimTooSoon",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "faucetBalance",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "requestedAmount",
				type: "uint256",
			},
		],
		name: "InsufficientFaucetBalance",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address",
			},
		],
		name: "SafeERC20FailedOperation",
		type: "error",
	},
	{
		inputs: [],
		name: "ZeroAddress",
		type: "error",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "user",
				type: "address",
			},
		],
		name: "TokensClaimed",
		type: "event",
	},
	{
		inputs: [],
		name: "CLAIM_INTERVAL",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
		],
		name: "drip",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_user",
				type: "address",
			},
		],
		name: "getNextClaimTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "lastClaimTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "usdcClaimAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "usdcToken",
		outputs: [
			{
				internalType: "contract IERC20",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "address",
				name: "_token",
				type: "address",
			},
		],
		name: "withdrawRemainingTokens",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;
