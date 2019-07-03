pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./IMoneyMarketAdapter.sol";
import "./TokenShare.sol";

/**
 * @title MetaMoneyMarket
 * @dev MetaMoneyMarket is a contract for managing deposits. It chooses between a number of underlying
 * contracts and selects the one with the highest rate.
 * The addresses of the money markets are specified on deployment.
 */
contract MetaMoneyMarket is Ownable {
  // list of adapters for the underlying money markets
  IMoneyMarketAdapter[] public moneyMarkets;

  // maps token addresses to a struct indicating if the token is supported and to the address of the token share
  mapping(address => Market) public supportedMarkets;

  struct Market {
    bool isSupported;
    TokenShare tokenShare;
  }

  /**
    * @param _moneyMarkets Addresses of adapter contracts for supported money markets
    * @dev The adapters are contracts that implement a given interface, used by this contract to interact with the
    * underlying money markets. See `IMoneyMarketAdapter`.
    */
  constructor(address[] memory _moneyMarkets) public {
    for (uint256 i = 0; i < _moneyMarkets.length; i++) {
      moneyMarkets.push(IMoneyMarketAdapter(_moneyMarkets[i]));
    }
  }

  modifier checkMarketSupported(address token) {
    require(isMarketSupported(token), "Market is not supported");
    _;
  }

  /**
    * @dev Deposit the given amount of tokens in the best available money market.
    * Before calling this function, the callee must give permission to this contract to move at least the specified
    * amount of tokens.
    *
    * Rejects if the token is not supported.
    *
    * @param tokenAddress Address of the token that is going to be deposited
    * @param amount Amount of token units to deposit
    */
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

  /**
    * @dev Burn the given amount of token shares and transfer the equivalent amount of tokens to the callee.
    * Before calling this function, the callee must give permission to this contract to move at least the specified
    * amount of token shares.
    *
    * Rejects if the token is not supported.
    *
    * @param tokenAddress Address of the token that is going to be deposited
    * @param tokenShareAmount Amount of token share units to burn
    */
  function withdraw(address tokenAddress, uint256 tokenShareAmount)
    external
    checkMarketSupported(tokenAddress)
  {
    TokenShare tokenShare = supportedMarkets[tokenAddress].tokenShare;
    uint256 mintedTokens = tokenShare.totalSupply();
    uint256 ownedTokens = totalSupply(tokenAddress);

    uint256 tokensToTransfer = ownedTokens * tokenShareAmount / mintedTokens;

    require(
      tokenShare.balanceOf(msg.sender) >= tokenShareAmount,
      "MetaMoneyMarket.withdraw: Not enough token shares"
    );
    require(
      tokenShare.allowance(msg.sender, address(this)) >= tokenShareAmount,
      "MetaMoneyMarket.withdraw: Cannot burn token shares"
    );
    tokenShare.burnFrom(msg.sender, tokenShareAmount);

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

  /**
    * @dev Add the given token to the list of supported markets.
    * This method deploys a new token that represents shares on the deposits of the given market. This is a `Mintable`
    * and `Burnable` token. Only this contract can mint new shares.
    *
    * Rejects if the token is already supported.
    *
    * @param tokenAddress Address of the token that is going to be supported
    */
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

  /**
    * @dev Return the address of the `TokenShare` for the given `tokenAddress`.
    *
    * Rejects if the token is not supported.
    */
  function getTokenShare(address tokenAddress)
    external
    view
    checkMarketSupported(tokenAddress)
    returns (address)
  {
    return address(supportedMarkets[tokenAddress].tokenShare);
  }

  /**
    * @dev Returns the amount of tokens for the given `tokenAddress`, including accrued interest.
    *
    * This function can cause side effects.
    *
    * Rejects if the token is not supported.
    */
  function totalSupply(address tokenAddress)
    public
    checkMarketSupported(tokenAddress)
    returns (uint256)
  {
    uint256 ownedTokens = 0;
    for (uint256 i = 0; i < moneyMarkets.length; i++) {
      ownedTokens += moneyMarkets[i].getSupply(tokenAddress);
    }

    return ownedTokens;
  }

  /**
    * @dev Indicates if the given token is supported.
    */
  function isMarketSupported(address tokenAddress) public view returns (bool) {
    return supportedMarkets[tokenAddress].isSupported;
  }

  /**
    * @dev Returns the number of underlying money markets.
    */
  function moneyMarketsCount() public view returns (uint256) {
    return moneyMarkets.length;
  }
}
