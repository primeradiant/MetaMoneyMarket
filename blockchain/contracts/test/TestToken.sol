pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract TestToken is ERC20Mintable {
  string public symbol;
  constructor(string memory _symbol, uint256 initialSupply) public {
    symbol = _symbol;
    mint(address(msg.sender), initialSupply);
  }
}
