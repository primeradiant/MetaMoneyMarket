pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./Claimable.sol";
import "./IMoneyMarketAdapter.sol";

contract IToken is IERC20 {
  function mint(address receiver, uint256 depositAmount)
    external
    returns (uint256 mintAmount);

  function burn(address receiver, uint256 burnAmount)
    external
    returns (uint256 loanAmountPaid);

  function tokenPrice() external view returns (uint256 price);

  function supplyInterestRate() external view returns (uint256);

  function claimLoanToken() external returns (uint256 claimedAmount);

  function assetBalanceOf(address _owner) external view returns (uint256);
}

contract FulcrumAdapter is IMoneyMarketAdapter, Ownable, Claimable {
  using SafeMath for uint256;

  // map a token address to a iToken address
  mapping(address => address) public tokenToIToken;

  event LogDeposit(
    address tokenAddress,
    uint256 iTokenAmount,
    uint256 tokenAmount
  );
  event LogWithdraw(
    address tokenAddress,
    uint256 iTokenAmount,
    uint256 tokenPaid
  );

  modifier checkTokenSupported(address tokenAddress) {
    require(_supportsToken(tokenAddress), "Token not supported");
    _;
  }

  function mapTokenToIToken(address tokenAddress, address iTokenAddress)
    external
    onlyOwner
  {
    tokenToIToken[tokenAddress] = iTokenAddress;
  }

  /**
      * @dev Returns the interest rate per block for the given token.
      */
  function getRate(address tokenAddress) external view returns (uint256) {
    address iTokenAddress = tokenToIToken[tokenAddress];
    IToken iToken = IToken(iTokenAddress);

    uint256 iApr = iToken.supplyInterestRate();

    // Convert to interest rate per block, assuming 2102400 blocks per year
    return iApr.div(2102400).div(100);
  }

  /**
      * @dev Deposits the given amount of tokens in the underlying money market.
      */
  function deposit(address tokenAddress, uint256 tokenAmount)
    external
    onlyOwner
    checkTokenSupported(tokenAddress)
  {
    // get iToken
    IERC20 token = IERC20(tokenAddress);
    address iTokenAddress = tokenToIToken[tokenAddress];
    IToken iToken = IToken(iTokenAddress);

    // transfer tokens from MMM
    require(
      token.allowance(msg.sender, address(this)) >= tokenAmount,
      "FulcrumAdapter.deposit: Insufficient allowance"
    );
    token.transferFrom(msg.sender, address(this), tokenAmount);

    // mint iTokens
    token.approve(iTokenAddress, uint256(-1));

    uint256 iTokenAmount = iToken.mint(address(this), tokenAmount);
    require(
      iTokenAmount >= 0,
      "FulcrumAdapter.deposit: There was an error minting the iToken"
    );

    emit LogDeposit(tokenAddress, iTokenAmount, tokenAmount);
  }

  function withdraw(
    address tokenAddress,
    address recipient,
    uint256 tokenAmount
  ) external onlyOwner checkTokenSupported(tokenAddress) {
    IERC20 token = IERC20(tokenAddress);
    address iTokenAddress = tokenToIToken[tokenAddress];
    IToken iToken = IToken(iTokenAddress);

    uint256 iTokenAmount = tokenAmount * 1e18 / iToken.tokenPrice();

    uint256 redeemAmount = iToken.burn(address(this), iTokenAmount);
    require(
      redeemAmount <= tokenAmount,
      "FulcrumAdapter.withdraw: There was an error redeeming the iToken"
    );
    token.transfer(recipient, redeemAmount);

    emit LogWithdraw(tokenAddress, iTokenAmount, redeemAmount);
  }

  function withdrawAll(address tokenAddress, address recipient)
    external
    onlyOwner
    checkTokenSupported(tokenAddress)
  {
    IERC20 token = IERC20(tokenAddress);
    address iTokenAddress = tokenToIToken[tokenAddress];
    IToken iToken = IToken(iTokenAddress);

    uint256 iTokenAmount = iToken.balanceOf(address(this));
    uint256 redeemAmount = iToken.burn(address(this), iTokenAmount);

    require(
      redeemAmount >= 0,
      "FulcrumAdapter.withdraw: There was an error redeeming the iToken"
    );
    token.transfer(recipient, redeemAmount);
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
    address iTokenAddress = tokenToIToken[tokenAddress];
    IToken iToken = IToken(iTokenAddress);

    return iToken.assetBalanceOf(address(this));
  }

  /**
      * @dev Indicates if the adapter supports the token with the given address.
      */
  function supportsToken(address tokenAddress) external view returns (bool) {
    return _supportsToken(tokenAddress);
  }

  function _supportsToken(address tokenAddress) internal view returns (bool) {
    address iTokenAddress = tokenToIToken[tokenAddress];

    return iTokenAddress != address(0);
  }
}
