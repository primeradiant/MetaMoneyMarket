pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract TestToken is ERC20Mintable {
  constructor(uint256 initialSupply) public {
    mint(address(msg.sender), initialSupply);
  }
}
