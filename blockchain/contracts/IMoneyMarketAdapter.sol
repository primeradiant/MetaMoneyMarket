pragma solidity 0.5.8;

interface IMoneyMarketAdapter {
  function getRate(address tokenAddress) external returns (uint256);
  function deposit(address tokenAddress, uint256 amount) external;
  function withdraw(address tokenAddress, address recipient, uint256 amount)
    external;
  function getSupply(address tokenAddress) external view returns (uint256);
}
