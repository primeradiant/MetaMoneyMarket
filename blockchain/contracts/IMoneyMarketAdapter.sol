pragma solidity 0.5.8;

/**
 * @title IMoneyMarketAdapter
 * @dev Interface used by `MetaMoneyMarket` to interact with its underlying money markets.
 */
interface IMoneyMarketAdapter {
  /**
    * @dev Returns the interest rate per block for the given token.
    */
  function getRate(address tokenAddress) external view returns (uint256);

  /**
    * @dev Deposits the given amount of tokens in the underlying money market.
    */
  function deposit(address tokenAddress, uint256 tokenAmount) external;

  /**
    * @dev Withdraws the given amount of tokens from the underlying money market and transfers them to `recipient`.
    */
  function withdraw(address tokenAddress, address recipient, uint256 amount)
    external;

  /**
    * @dev Withdraws all the tokens from the underlying money market and transfers them to `recipient`.
    */
  function withdrawAll(address tokenAddress, address recipient)
    external;

  /**
    * @dev Returns the supply for the given token, including accrued interest. This function can have side effects.
    */
  function getSupply(address tokenAddress) external returns (uint256);

  /**
    * @dev Returns the supply for the given token; it might not include accrued interest. This function *cannot* have side effects.
    */
  function getSupplyView(address tokenAddress) external view returns (uint256);
}
