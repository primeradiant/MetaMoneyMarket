pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./IMoneyMarketAdapter.sol";

contract CToken is IERC20 {
  function supplyRatePerBlock() external view returns (uint);
  function mint(uint mintAmount) external returns (uint);
  function redeemUnderlying(uint redeemAmount) external returns (uint);
  function balanceOfUnderlying(address owner) external returns (uint);
}

contract CompoundAdapter is IMoneyMarketAdapter, Ownable {
  // map a token address to a cToken address
  mapping (address => address) public tokenToCToken;

  function mapTokenToCToken(address tokenAddress, address cTokenAddress) external onlyOwner {
    tokenToCToken[tokenAddress] = cTokenAddress;
  }

  function getRate(address tokenAddress) external returns (uint256) {
    address cTokenAddress = tokenToCToken[tokenAddress];
    CToken cToken = CToken(cTokenAddress);

    return cToken.supplyRatePerBlock();
  }

  function deposit(address tokenAddress, uint256 amount) external onlyOwner {
    // get cToken
    IERC20 token = IERC20(tokenAddress);
    address cTokenAddress = tokenToCToken[tokenAddress];
    require(cTokenAddress != address(0), "CompoundAdapter.deposit: Unknown cToken for given token address");
    CToken cToken = CToken(cTokenAddress);

    // transfer tokens from MMM
    require(token.allowance(msg.sender, address(this)) >= amount, "CompoundAdapter.deposit: Insufficient allowance");
    token.transferFrom(msg.sender, address(this), amount);

    // mint cTokens
    token.approve(cTokenAddress, uint256(-1));
    uint256 result = cToken.mint(amount);
    require(result == 0, "CompoundAdapter.deposit: There was an error minting the cToken");
  }

  function withdraw(address tokenAddress, address recipient, uint256 amount) external onlyOwner {
    IERC20 token = IERC20(tokenAddress);
    address cTokenAddress = tokenToCToken[tokenAddress];
    require(cTokenAddress != address(0), "CompoundAdapter.withdraw: Unknown cToken for given token address");
    CToken cToken = CToken(cTokenAddress);

    uint256 result = cToken.redeemUnderlying(amount);
    require(result == 0, "CompoundAdapter.withdraw: There was an error redeeming the cToken");
    token.transfer(recipient, token.balanceOf(address(this)));
  }

  function getSupply(address tokenAddress) external returns (uint256) {
    address cTokenAddress = tokenToCToken[tokenAddress];
    CToken cToken = CToken(cTokenAddress);

    return cToken.balanceOfUnderlying(address(this));
  }
}
