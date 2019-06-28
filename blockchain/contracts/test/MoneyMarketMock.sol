pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../TokenShare.sol";

contract MoneyMarketMock is Ownable {
  uint256 public rate;
  mapping(address => Market) public supportedMarkets;

  struct Market {
    bool isSupported;
    TokenShare tokenShare;
  }

  modifier checkMarketSupported(address token) {
    require(isMarketSupported(token), "Market is not supported");
    _;
  }

  function isMarketSupported(address token) public view returns (bool) {
    return supportedMarkets[token].isSupported;
  }

  constructor(uint256 _rate) public {
    rate = _rate;
  }

  function getRate(address token)
    external
    view
    checkMarketSupported(token)
    returns (uint256)
  {
    return rate;
  }

  function setRate(uint256 newRate) external onlyOwner {
    rate = newRate;
  }

  function deposit(address tokenAddress, uint256 amount)
    external
    checkMarketSupported(tokenAddress)
  {
    IERC20 token = IERC20(tokenAddress);

    TokenShare tokenShare = supportedMarkets[tokenAddress].tokenShare;
    uint256 mintedTokens = tokenShare.totalSupply();
    uint256 ownedTokens = token.balanceOf(address(this));

    uint256 tokensToMint = mintedTokens > 0
      ? mintedTokens * amount / ownedTokens
      : amount;

    tokenShare.mint(msg.sender, tokensToMint);

    require(
      token.balanceOf(msg.sender) >= amount,
      "MoneyMarketMock.deposit: not enough token balance"
    );
    require(
      token.allowance(msg.sender, address(this)) >= amount,
      "MoneyMarketMock.deposit: Cannot transfer tokens"
    );
    token.transferFrom(msg.sender, address(this), amount);
  }

  function withdraw(address tokenAddress, uint256 amount)
    external
    checkMarketSupported(tokenAddress)
  {
    IERC20 token = IERC20(tokenAddress);

    TokenShare tokenShare = supportedMarkets[tokenAddress].tokenShare;
    uint256 mintedTokens = tokenShare.totalSupply();
    uint256 ownedTokens = token.balanceOf(address(this));

    uint256 tokensToTransfer = ownedTokens * amount / mintedTokens;

    require(
      tokenShare.allowance(msg.sender, address(this)) >= amount,
      "MoneyMarketMock.withdraw: Cannot burn token share"
    );
    tokenShare.burnFrom(msg.sender, amount);

    require(
      token.balanceOf(address(this)) >= tokensToTransfer,
      "MoneyMarketMock.withdraw: Not enough tokens to transfer"
    );
    token.transfer(msg.sender, tokensToTransfer);
  }

  function addMarket(address tokenAddress) external onlyOwner {
    require(
      !supportedMarkets[tokenAddress].isSupported,
      "Market is already supported"
    );

    TokenShare tokenShare = new TokenShare();

    supportedMarkets[tokenAddress].isSupported = true;
    supportedMarkets[tokenAddress].tokenShare = tokenShare;
  }

  function getTokenShare(address tokenAddress)
    external
    view
    checkMarketSupported(tokenAddress)
    returns (address)
  {
    return address(supportedMarkets[tokenAddress].tokenShare);
  }

  function getSupply(address tokenAddress)
    external
    view
    checkMarketSupported(tokenAddress)
    returns (uint256)
  {
    IERC20 token = IERC20(tokenAddress);
    return token.balanceOf(address(this));
  }

  function getExchangeRate(address tokenAddress)
    external
    view
    checkMarketSupported(tokenAddress)
    returns (uint256, uint256)
  {
    IERC20 token = IERC20(tokenAddress);
    TokenShare tokenShare = supportedMarkets[tokenAddress].tokenShare;

    return (tokenShare.totalSupply(), token.balanceOf(address(this)));
  }
}
