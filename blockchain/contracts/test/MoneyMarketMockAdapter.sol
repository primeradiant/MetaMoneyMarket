pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../IMoneyMarketAdapter.sol";
import "./MoneyMarketMock.sol";

contract MoneyMarketMockAdapter is Ownable, IMoneyMarketAdapter {
  MoneyMarketMock public moneyMarket;

  constructor(MoneyMarketMock _moneyMarket) public {
    moneyMarket = _moneyMarket;
  }

  function getRate(address tokenAddress) external view returns (uint256) {
    return moneyMarket.getRate(tokenAddress);
  }

  function deposit(address tokenAddress, uint256 amount) external onlyOwner {
    IERC20 token = IERC20(tokenAddress);
    token.approve(address(moneyMarket), uint256(-1));

    require(
      token.balanceOf(msg.sender) >= amount,
      "MoneyMarketMockAdapter.deposit: not enough token balance"
    );
    require(
      token.allowance(msg.sender, address(this)) >= amount,
      "MoneyMarketMockAdapter.deposit: Cannot transfer tokens"
    );
    token.transferFrom(msg.sender, address(this), amount);
    moneyMarket.deposit(tokenAddress, amount);
  }

  function withdraw(address tokenAddress, address recipient, uint256 amount)
    external
    onlyOwner
  {
    IERC20 token = IERC20(tokenAddress);
    IERC20 tokenShare = IERC20(moneyMarket.getTokenShare(tokenAddress));
    tokenShare.approve(address(moneyMarket), uint256(-1));

    (uint256 tokenShares, uint256 baseTokens) = moneyMarket.getExchangeRate(
      tokenAddress
    );

    uint256 amountToWithdraw = amount * tokenShares / baseTokens;

    moneyMarket.withdraw(tokenAddress, amountToWithdraw);
    token.transfer(recipient, token.balanceOf(address(this)));
  }

  function getSupply(address tokenAddress) external returns (uint256) {
    return moneyMarket.getSupply(tokenAddress);
  }

  function getSupplyView(address tokenAddress) external view returns (uint256) {
    return moneyMarket.getSupply(tokenAddress);
  }
}
