pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./Claimable.sol";
import "./IMoneyMarketAdapter.sol";
import "./TokenShare.sol";

/**
 * @title MetaMoneyMarket
 * @dev MetaMoneyMarket is a contract for managing deposits. It chooses between a number of underlying
 * contracts and selects the one with the highest rate.
 * The addresses of the money markets are specified on deployment.
 */
contract MetaMoneyMarket is Ownable, Claimable {
  using SafeMath for uint256;

  // list of adapters for the underlying money markets
  IMoneyMarketAdapter[] public moneyMarkets;

  // maps token addresses to a struct indicating if the token is supported and to the address of the token share
  mapping(address => Market) public supportedMarkets;
  address[] public supportedMarketsList;

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
    require(
      _moneyMarkets.length > 0,
      "At least one money market has to be specified"
    );
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
    * @param tokenAmount Amount of token units to deposit
    */
  function deposit(address tokenAddress, uint256 tokenAmount)
    external
    checkMarketSupported(tokenAddress)
  {
    IERC20 token = IERC20(tokenAddress);

    TokenShare tokenShare = supportedMarkets[tokenAddress].tokenShare;
    uint256 tokenShareSupply = tokenShare.totalSupply();
    uint256 tokenSupply = totalSupply(tokenAddress);

    uint256 tokenSharesToMint = tokenSupply > 0
      ? tokenShareSupply * tokenAmount / tokenSupply
      : tokenAmount;

    tokenShare.mint(msg.sender, tokenSharesToMint);

    (IMoneyMarketAdapter bestMoneyMarket, ) = getBestMoneyMarket(tokenAddress);

    require(
      token.balanceOf(msg.sender) >= tokenAmount,
      "MetaMoneyMarket.deposit: User does not have enough balance"
    );
    require(
      token.allowance(msg.sender, address(this)) >= tokenAmount,
      "MetaMoneyMarket.deposit: Cannot transfer tokens from the user"
    );
    token.transferFrom(msg.sender, address(this), tokenAmount);

    bestMoneyMarket.deposit(tokenAddress, tokenAmount);
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
    uint256 tokenShareSupply = tokenShare.totalSupply();
    uint256 tokenSupply = totalSupply(tokenAddress);

    uint256 tokensToTransfer = tokenSupply * tokenShareAmount / tokenShareSupply;

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
      if (!moneyMarkets[i].supportsToken(tokenAddress)) {
        continue;
      }
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

    require(
      tokensToTransfer == 0,
      "MetaMoneyMarket.withdraw: Not all tokens could be withdrawn"
    );
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

    supportedMarketsList.push(tokenAddress);
    supportedMarkets[tokenAddress].isSupported = true;
    supportedMarkets[tokenAddress].tokenShare = tokenShare;

    for (uint256 i = 0; i < moneyMarkets.length; i++) {
      token.approve(address(moneyMarkets[i]), uint256(-1));
      tokenShare.approve(address(moneyMarkets[i]), uint256(-1));
    }
  }

  /**
    * @dev Take all the supply of `tokenAddress` and redistribute it according to `percentages`.
    *
    * Rejects if the token is not supported.
    *
    * @param tokenAddress Address of the token that is going to be rebalanced
    * @param percentages A list of percentages, expressed as units in 10000, indicating how to deposit the tokens in
    * each underlying money market. The length of this array is one less than the amount of money markets: the last
    * money market will receive the remaining tokens. For example, if there are 3 money markets, and you want to
    * rebalance so that the first one has 10.5% of the tokens, the second one 55%, and the third one 34.5%, this param
    * will be [1050, 5500].
    */
  function rebalance(address tokenAddress, uint256[] memory percentages)
    public
    checkMarketSupported(tokenAddress)
    onlyOwner
  {
    IERC20 token = IERC20(tokenAddress);

    require(percentages.length + 1 == moneyMarkets.length);

    for (uint256 i = 0; i < moneyMarkets.length; i++) {
      if (!moneyMarkets[i].supportsToken(tokenAddress)) {
        continue;
      }
      moneyMarkets[i].withdrawAll(tokenAddress, address(this));
    }

    uint256 totalSupply = token.balanceOf(address(this));

    for (uint256 i = 0; i < percentages.length; i++) {
      if (!moneyMarkets[i].supportsToken(tokenAddress)) {
        continue;
      }
      uint256 amountToDeposit = totalSupply * percentages[i] / 10000;
      if (amountToDeposit == 0) {
        continue;
      }
      moneyMarkets[i].deposit(tokenAddress, amountToDeposit);
    }

    uint256 remainingTokens = token.balanceOf(address(this));
    if (
      moneyMarkets[moneyMarkets.length - 1].supportsToken(
        tokenAddress
      ) && remainingTokens > 0
    ) {
      moneyMarkets[moneyMarkets.length - 1].deposit(
        tokenAddress,
        remainingTokens
      );
    }

    require(
      token.balanceOf(address(this)) == 0,
      "MetaMoneyMarket.rebalance: Not all tokens could be rebalanced"
    );
  }

  function claimTokens(address tokenAddress, address recipient)
    public
    onlyOwner
  {
    _claimTokens(tokenAddress, recipient);
  }

  function claimTokensFromAdapter(
    uint256 index,
    address tokenAddress,
    address recipient
  ) public onlyOwner {
    IMoneyMarketAdapter moneyMarket = moneyMarkets[index];
    moneyMarket.claimTokens(tokenAddress, recipient);
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
    uint256 tokenSupply = 0;
    for (uint256 i = 0; i < moneyMarkets.length; i++) {
      if (!moneyMarkets[i].supportsToken(tokenAddress)) {
        continue;
      }
      tokenSupply += moneyMarkets[i].getSupply(tokenAddress);
    }

    return tokenSupply;
  }

  /**
    * @dev Returns the amount of tokens for the given `tokenAddress`; it might not include accrued interest.
    *
    * This function cannot cause side effects.
    *
    * Rejects if the token is not supported.
    */
  function totalSupplyView(address tokenAddress)
    public
    view
    checkMarketSupported(tokenAddress)
    returns (uint256)
  {
    uint256 tokenSupply = 0;
    for (uint256 i = 0; i < moneyMarkets.length; i++) {
      if (!moneyMarkets[i].supportsToken(tokenAddress)) {
        continue;
      }
      tokenSupply += moneyMarkets[i].getSupplyView(tokenAddress);
    }

    return tokenSupply;
  }

  /**
    * @dev Indicates if the given token is supported.
    */
  function isMarketSupported(address tokenAddress) public view returns (bool) {
    return supportedMarkets[tokenAddress].isSupported;
  }

  function getMarketSymbol(address tokenAddress)
    public
    view
    checkMarketSupported(tokenAddress)
    returns (string memory)
  {
    ERC20Detailed token = ERC20Detailed(tokenAddress);

    return token.symbol();
  }

  /**
    * @dev Returns the number of underlying money markets.
    */
  function moneyMarketsCount() public view returns (uint256) {
    return moneyMarkets.length;
  }

  function supportedMarketsCount() public view returns (uint256) {
    return supportedMarketsList.length;
  }

  function getDepositedAmount(address tokenAddress, address account)
    public
    view
    checkMarketSupported(tokenAddress)
    returns (uint256)
  {
    TokenShare tokenShare = supportedMarkets[address(tokenAddress)].tokenShare;

    (uint256 tokenSupply, uint256 tokenShareSupply) = getExchangeRate(
      tokenAddress
    );
    uint256 tokenShareBalance = tokenShare.balanceOf(account);

    return tokenShareSupply > 0
      ? tokenShareBalance * tokenSupply / tokenShareSupply
      : 0;
  }

  function getExchangeRate(address tokenAddress)
    public
    view
    checkMarketSupported(tokenAddress)
    returns (uint256 tokenSupply, uint256 tokenShareSupply)
  {
    TokenShare tokenShare = supportedMarkets[address(tokenAddress)].tokenShare;

    tokenSupply = totalSupplyView(tokenAddress);
    tokenShareSupply = tokenShare.totalSupply();
  }

  function getBestMoneyMarket(address tokenAddress)
    public
    view
    checkMarketSupported(tokenAddress)
    returns (IMoneyMarketAdapter bestMoneyMarket, uint256 bestRate)
  {
    bestMoneyMarket = IMoneyMarketAdapter(address(0));
    bestRate = 0;
    for (uint256 i = 0; i < moneyMarkets.length; i++) {
      if (!moneyMarkets[i].supportsToken(tokenAddress)) {
        continue;
      }
      uint256 rate = moneyMarkets[i].getRate(tokenAddress);
      if (rate > bestRate) {
        bestRate = rate;
        bestMoneyMarket = moneyMarkets[i];
      }
    }

    require(address(bestMoneyMarket) != address(0));
  }

  function getBestInterestRate(address tokenAddress)
    public
    view
    checkMarketSupported(tokenAddress)
    returns (uint256)
  {
    (, uint256 bestRate) = getBestMoneyMarket(tokenAddress);

    return bestRate;
  }
}
