pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract Claimable {
    function _claimTokens(address tokenAddress, address recipient) internal {
        require(recipient != address(0));
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        token.transfer(recipient, balance);
    }
}
