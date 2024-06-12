import { ABIInterface } from 'types';
export const MarketABI: ABIInterface = [
  'function underlying() view returns(address)',
  'function lend(uint256) view returns ()',
  'function redeemUnderlying(uint256) view returns ()',
  'function redeem(uint256) view returns ()',
  'function repayBorrow(uint256) view returns ()',
  'function borrow(uint256) view returns ()',
  // Native token related:
  'function lendNative() payable returns ()',
  'function redeemNative(uint256) view returns ()',
  'function redeemUnderlyingNative(uint256) view returns ()',
  'function repayBorrowNative() payable returns ()',
  'function borrowNative(uint256) view returns ()',
  // USDY/mUSD related:
  'function lendRUSDY(uint256) view returns ()',
  'function redeemRUSDY(uint256) view returns ()',
  'function redeemUnderlyingRUSDY(uint256) view returns ()',
  'function borrowRUSDY(uint256) view returns ()',
  'function repayBorrowRUSDY(uint256) view returns ()',
];

export const ERC20ABI: ABIInterface = [
  'function approve(address, uint256) view returns (bool)',
  'function allowance(address, address) view returns (uint256)',
];

export const BuybackABI: ABIInterface = [
  'function participate() view returns ()',
  'function leave() view returns ()',
  'function stake(uint256) view returns ()',
  'function unstake(uint256) view returns ()',
];

export const SupervisorABI: ABIInterface = [
  'function withdrawMnt(address[], uint256[]) view returns ()',
  'function enableAsCollateral(address[]) view returns ()',
  'function disableAsCollateral(address) view returns ()',
];

export const VestingABI: ABIInterface = [
  'function withdraw(uint256) view returns ()',
];

export const RewardsHubABI: ABIInterface = [
  'function distributeAllMnt(address) view returns ()',
  'function withdraw(uint256) view returns ()',
];

export const WithdrawMantleABI: ABIInterface = [
  'function withdraw(uint256) view returns ()',
];

export const MintProxyABI: ABIInterface = [
  'function multicall(bytes[]) view returns (bytes[])',
];

export const MntGovernorABI: ABIInterface = [
  'function castVote(uint256,uint8) view returns (uint256)',
  'function hasVoted(uint256, address) view returns (bool)',
];

export const MntABI: ABIInterface = [
  'function delegate(address) view returns ()',
];
export const MinterestProxyONftABI: ABIInterface = [
  'function sendFrom(address _from, uint16 _dstChainId, bytes calldata _toAddress, uint256 _tokenId, uint256 _amount, address payable _refundAddress, address _zroPaymentAddress, bytes calldata _adapterParams) external payable returns ()',
];

export const MinterestNftABI: ABIInterface = [
  `function isApprovedForAll(address, address) view returns (bool)`,
  `function setApprovalForAll(address, bool) view returns ()`,
];

export const MntProxyOFTABI: ABIInterface = [
  'function sendFrom(address _from, uint16 _dstChainId, bytes calldata _toAddress, uint256 _amount, address payable _refundAddress, address _zroPaymentAddress, bytes calldata _adapterParams) external payable returns ()',
];
