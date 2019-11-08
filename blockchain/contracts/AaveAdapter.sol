pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./Claimable.sol";
import "./IMoneyMarketAdapter.sol";

contract LendingPoolAddressProvider {
  function getLendingPool() public view returns (address);
  function getLendingPoolCore() public view returns (address payable);
}

contract LendingPool {
  struct ReserveData {
    uint256 totalLiquidity;
    uint256 availableLiquidity;
    uint256 totalBorrowsFixed;
    uint256 totalBorrowsVariable;
    uint256 liquidityRate;
    // uint256 variableBorrowRate;
    // uint256 fixedBorrowRate;
    // uint256 averageFixedBorrowRate;
    // uint256 utilizationRate;
    // uint256 liquidityIndex;
    // uint256 variableBorrowIndex;
    // address aTokenAddress;
    // uint40 lastUpdateTimestamp;
  }
  function deposit(address _reserve, uint256 _amount, uint16 _referralCode) external payable;
  function getReserveData(address _reserve)
    external
    view
    returns (
      uint256 totalLiquidity,
      uint256 availableLiquidity,
      uint256 totalBorrowsFixed,
      uint256 totalBorrowsVariable,
      uint256 liquidityRate
      // uint256 variableBorrowRate,
      // uint256 fixedBorrowRate,
      // uint256 averageFixedBorrowRate,
      // uint256 utilizationRate,
      // uint256 liquidityIndex,
      // uint256 variableBorrowIndex,
      // address aTokenAddress,
      // uint40 lastUpdateTimestamp
    );
}

contract AToken is IERC20 {
  function redeem(uint256 _amount) external;
  function balanceOfUnderlying(address _user) public view returns (uint256);
  function underlyingAmountToATokenAmount(uint256 _amount) public view returns (uint256);
}

contract AaveAdapter is IMoneyMarketAdapter, Ownable, Claimable {
  using SafeMath for uint256;

  uint256 public blocksPerYear = 2102666;

  LendingPoolAddressProvider aaveProvider;

  // map a token address to an aToken address
  mapping(address => address) public tokenToAToken;

  event LogDeposit(
    address tokenAddress,
    uint256 aTokenAmount,
    uint256 tokenAmount
  );
  event LogWithdraw(
    address tokenAddress,
    uint256 aTokenAmount,
    uint256 tokenPaid
  );

  modifier checkTokenSupported(address tokenAddress) {
    require(_supportsToken(tokenAddress), "Token not supported");
    _;
  }

  constructor(address provider) public {
    // Set the aave lending pool address provider
    aaveProvider = LendingPoolAddressProvider(provider);

    require(
      aaveProvider.getLendingPool() != address(0),
      "Aave.LendingPool is invalid"
    );
  }

  function mapTokenToAToken(address tokenAddress, address aTokenAddress)
    external
    onlyOwner
  {
    tokenToAToken[tokenAddress] = aTokenAddress;
  }

  /**
    * @dev Returns the interest rate per block for the given token.
    */
  function getRate(address tokenAddress)
    external
    view
    returns (uint256)
  {
    LendingPool.ReserveData memory data;
    (
      data.totalLiquidity,
      data.availableLiquidity,
      data.totalBorrowsFixed,
      data.totalBorrowsVariable,
      data.liquidityRate
      // data.variableBorrowRate,
      // data.fixedBorrowRate,
      // data.averageFixedBorrowRate,
      // data.utilizationRate,
      // data.liquidityIndex,
      // data.variableBorrowIndex,
      // data.aTokenAddress,
      // data.lastUpdateTimestamp
    ) = LendingPool(aaveProvider.getLendingPool()).getReserveData(tokenAddress);

    uint256 iApr = data.liquidityRate.div(1e9);

    // Convert to interest rate per block, assuming 2102666 blocks per year
    return iApr.div(blocksPerYear);
  }

  /**
    * @dev Deposits the given amount of tokens in the underlying money market.
    */
  function deposit(address tokenAddress, uint256 tokenAmount)
    external
    onlyOwner
    checkTokenSupported(tokenAddress)
  {
    // get aToken
    IERC20 token = IERC20(tokenAddress);
    address aTokenAddress = tokenToAToken[tokenAddress];
    AToken aToken = AToken(aTokenAddress);

    // transfer tokens from MMM
    require(
      token.allowance(msg.sender, address(this)) >= tokenAmount,
      "AaveAdapter.deposit: Insufficient allowance"
    );
    token.transferFrom(msg.sender, address(this), tokenAmount);

    token.approve(aaveProvider.getLendingPoolCore(), uint256(-1));

    // uint256 previousBalance = aToken.balanceOfUnderlying(address(this));

    LendingPool(aaveProvider.getLendingPool()).deposit(tokenAddress, tokenAmount, 0);

    // uint256 currentBalance = aToken.balanceOfUnderlying(address(this));

    // require(
    //   currentBalance - previousBalance == tokenAmount,
    //   "AaveAdapter.deposit: There was an error minting the aToken"
    // );

    emit LogDeposit(tokenAddress, aToken.underlyingAmountToATokenAmount(tokenAmount), tokenAmount);
  }

  function withdraw(
    address tokenAddress,
    address recipient,
    uint256 tokenAmount
  ) external onlyOwner checkTokenSupported(tokenAddress) {
    IERC20 token = IERC20(tokenAddress);
    address aTokenAddress = tokenToAToken[tokenAddress];
    AToken aToken = AToken(aTokenAddress);

    uint256 aTokenAmount = aToken.underlyingAmountToATokenAmount(tokenAmount);

    aToken.redeem(aTokenAmount);

    uint256 redeemAmount = token.balanceOf(address(this));

    require(
      redeemAmount <= tokenAmount,
      "AaveAdapter.withdraw: There was an error redeeming the aToken"
    );
    token.transfer(recipient, redeemAmount);

    emit LogWithdraw(tokenAddress, aTokenAmount, redeemAmount);
  }

  function withdrawAll(address tokenAddress, address recipient)
    external
    onlyOwner
    checkTokenSupported(tokenAddress)
  {
    IERC20 token = IERC20(tokenAddress);
    address aTokenAddress = tokenToAToken[tokenAddress];
    AToken aToken = AToken(aTokenAddress);

    uint256 aTokenAmount = aToken.balanceOf(address(this));
    aToken.redeem(aTokenAmount);

    uint256 redeemAmount = token.balanceOf(address(this));

    require(
      redeemAmount >= 0,
      "AaveAdapter.withdraw: There was an error redeeming the aToken"
    );
    token.transfer(recipient, redeemAmount);

    emit LogWithdraw(tokenAddress, aTokenAmount, redeemAmount);
  }

  function claimTokens(address tokenAddress, address recipient) external {
    _claimTokens(tokenAddress, recipient);
  }

  /**
    * @dev Returns the supply for the given token, including accrued interest. This function can have side effects.
    */
  function getSupply(address tokenAddress) external returns (uint256) {
    return this.getSupplyView(tokenAddress);
  }

  /**
    * @dev Returns the supply for the given token; it might not include accrued interest. This function *cannot* have side effects.
    */
  function getSupplyView(address tokenAddress) external view returns (uint256) {
    address aTokenAddress = tokenToAToken[tokenAddress];
    AToken aToken = AToken(aTokenAddress);

    return aToken.balanceOfUnderlying(address(this));
  }

  function setBlocksPerYear(uint256 blocks)
    external
    onlyOwner
  {
    blocksPerYear = blocks;
  }

  /**
    * @dev Indicates if the adapter supports the token with the given address.
    */
  function supportsToken(address tokenAddress) external view returns (bool) {
    return _supportsToken(tokenAddress);
  }

  function _supportsToken(address tokenAddress) internal view returns (bool) {
    address aTokenAddress = tokenToAToken[tokenAddress];

    return aTokenAddress != address(0);
  }
}
