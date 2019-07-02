pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./IMoneyMarketAdapter.sol";
import "./TokenShare.sol";

contract MetaMoneyMarket is Ownable {
  IMoneyMarketAdapter[] public moneyMarkets;
  mapping(address => Market) public supportedMarkets;

  function moneyMarketsCount() public view returns (uint256) {
    return moneyMarkets.length;
  }

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

  constructor(address[] memory _moneyMarkets) public {
    for (uint256 i = 0; i < _moneyMarkets.length; i++) {
      moneyMarkets.push(IMoneyMarketAdapter(_moneyMarkets[i]));
    }
  }

  function deposit(address tokenAddress, uint256 amount)
    external
    checkMarketSupported(tokenAddress)
  {
    IERC20 token = IERC20(tokenAddress);

    TokenShare tokenShare = supportedMarkets[address(token)].tokenShare;
    uint256 mintedTokens = tokenShare.totalSupply();
    uint256 ownedTokens = totalSupply(tokenAddress);

    uint256 tokensToMint = mintedTokens > 0
      ? mintedTokens * amount / ownedTokens
      : amount;

    tokenShare.mint(msg.sender, tokensToMint);

    IMoneyMarketAdapter bestMoneyMarket = moneyMarkets[0];
    uint256 bestRate = moneyMarkets[0].getRate(tokenAddress);
    for (uint256 i = 1; i < moneyMarkets.length; i++) {
      uint256 rate = moneyMarkets[i].getRate(tokenAddress);
      if (rate > bestRate) {
        bestRate = rate;
        bestMoneyMarket = moneyMarkets[i];
      }
    }

    require(
      token.balanceOf(msg.sender) >= amount,
      "MetaMoneyMarket.deposit: User does not have enough balance"
    );
    require(
      token.allowance(msg.sender, address(this)) >= amount,
      "MetaMoneyMarket.deposit: Cannot transfer tokens from the user"
    );
    token.transferFrom(msg.sender, address(this), amount);
    bestMoneyMarket.deposit(tokenAddress, amount);
  }

  function withdraw(address tokenAddress, uint256 amount)
    external
    checkMarketSupported(tokenAddress)
  {
    TokenShare tokenShare = supportedMarkets[tokenAddress].tokenShare;
    uint256 mintedTokens = tokenShare.totalSupply();
    uint256 ownedTokens = totalSupply(tokenAddress);

    uint256 tokensToTransfer = ownedTokens * amount / mintedTokens;

    require(
      tokenShare.balanceOf(msg.sender) >= amount,
      "MetaMoneyMarket.withdraw: Not enough token shares"
    );
    require(
      tokenShare.allowance(msg.sender, address(this)) >= amount,
      "MetaMoneyMarket.withdraw: Cannot burn token shares"
    );
    tokenShare.burnFrom(msg.sender, amount);

    for (uint256 i = 0; i < moneyMarkets.length && tokensToTransfer > 0; i++) {
      uint256 supply = moneyMarkets[i].getSupply(tokenAddress);
      if (supply == 0) {
        continue;
      }
      if (supply >= tokensToTransfer) {
        moneyMarkets[i].withdraw(tokenAddress, msg.sender, tokensToTransfer);
        tokensToTransfer = 0;
      } else {
        moneyMarkets[i].withdraw(tokenAddress, msg.sender, supply);
        tokensToTransfer -= supply;
      }
    }
  }

  function addMarket(address tokenAddress) external onlyOwner {
    IERC20 token = IERC20(tokenAddress);
    require(
      !supportedMarkets[tokenAddress].isSupported,
      "Market is already supported"
    );

    TokenShare tokenShare = new TokenShare();

    supportedMarkets[tokenAddress].isSupported = true;
    supportedMarkets[tokenAddress].tokenShare = tokenShare;

    for (uint256 i = 0; i < moneyMarkets.length; i++) {
      token.approve(address(moneyMarkets[i]), uint256(-1));
      tokenShare.approve(address(moneyMarkets[i]), uint256(-1));
    }
  }

  function getTokenShare(address tokenAddress)
    external
    view
    checkMarketSupported(tokenAddress)
    returns (address)
  {
    return address(supportedMarkets[tokenAddress].tokenShare);
  }

  function totalSupply(address tokenAddress) public returns (uint256) {
    uint256 ownedTokens = 0;
    for (uint256 i = 0; i < moneyMarkets.length; i++) {
      ownedTokens += moneyMarkets[i].getSupply(tokenAddress);
    }

    return ownedTokens;
  }
}
