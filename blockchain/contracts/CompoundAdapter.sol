pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./Claimable.sol";
import "./IMoneyMarketAdapter.sol";

contract CToken is IERC20 {
  function supplyRatePerBlock() external view returns (uint);
  function mint(uint mintAmount) external returns (uint);
  function redeemUnderlying(uint redeemAmount) external returns (uint);
  function balanceOfUnderlying(address owner) external returns (uint);
  function exchangeRateStored() public view returns (uint);
}

contract CompoundAdapter is IMoneyMarketAdapter, Ownable, Claimable {
  // map a token address to a cToken address
  mapping(address => address) public tokenToCToken;

  function mapTokenToCToken(address tokenAddress, address cTokenAddress)
    external
    onlyOwner
  {
    tokenToCToken[tokenAddress] = cTokenAddress;
  }

  function getRate(address tokenAddress) external view returns (uint256) {
    address cTokenAddress = tokenToCToken[tokenAddress];
    CToken cToken = CToken(cTokenAddress);

    return cToken.supplyRatePerBlock();
  }

  function deposit(address tokenAddress, uint256 tokenAmount)
    external
    onlyOwner
  {
    // get cToken
    IERC20 token = IERC20(tokenAddress);
    address cTokenAddress = tokenToCToken[tokenAddress];
    require(
      cTokenAddress != address(0),
      "CompoundAdapter.deposit: Unknown cToken for given token address"
    );
    CToken cToken = CToken(cTokenAddress);

    // transfer tokens from MMM
    require(
      token.allowance(msg.sender, address(this)) >= tokenAmount,
      "CompoundAdapter.deposit: Insufficient allowance"
    );
    token.transferFrom(msg.sender, address(this), tokenAmount);

    // mint cTokens
    token.approve(cTokenAddress, uint256(-1));
    uint256 result = cToken.mint(tokenAmount);
    require(
      result == 0,
      "CompoundAdapter.deposit: There was an error minting the cToken"
    );
  }

  function withdraw(
    address tokenAddress,
    address recipient,
    uint256 tokenAmount
  ) external onlyOwner {
    IERC20 token = IERC20(tokenAddress);
    address cTokenAddress = tokenToCToken[tokenAddress];
    require(
      cTokenAddress != address(0),
      "CompoundAdapter.withdraw: Unknown cToken for given token address"
    );
    CToken cToken = CToken(cTokenAddress);

    uint256 result = cToken.redeemUnderlying(tokenAmount);
    require(
      result == 0,
      "CompoundAdapter.withdraw: There was an error redeeming the cToken"
    );
    token.transfer(recipient, tokenAmount);
  }

  function withdrawAll(
    address tokenAddress,
    address recipient
  ) external onlyOwner {
    IERC20 token = IERC20(tokenAddress);
    address cTokenAddress = tokenToCToken[tokenAddress];
    require(
      cTokenAddress != address(0),
      "CompoundAdapter.withdraw: Unknown cToken for given token address"
    );
    CToken cToken = CToken(cTokenAddress);

    uint256 result = cToken.redeemUnderlying(cToken.balanceOfUnderlying(address(this)));
    require(
      result == 0,
      "CompoundAdapter.withdraw: There was an error redeeming the cToken"
    );
    token.transfer(recipient, token.balanceOf(address(this)));
  }

  function claimTokens(address tokenAddress, address recipient) external onlyOwner {
    _claimTokens(tokenAddress, recipient);
  }

  function getSupply(address tokenAddress) external returns (uint256) {
    address cTokenAddress = tokenToCToken[tokenAddress];
    CToken cToken = CToken(cTokenAddress);

    return cToken.balanceOfUnderlying(address(this));
  }

  function getSupplyView(address tokenAddress) external view returns (uint256) {
    address cTokenAddress = tokenToCToken[tokenAddress];
    CToken cToken = CToken(cTokenAddress);

    uint256 exchangeRate = cToken.exchangeRateStored();
    uint256 balance = cToken.balanceOf(address(this));
    return balance * exchangeRate / 10 ** 18;
  }
}
