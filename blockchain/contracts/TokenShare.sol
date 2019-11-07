pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract TokenShare is ERC20Burnable, ERC20Mintable {
  uint8 public decimals;

  constructor (uint8 _decimals) public {
    decimals = _decimals;
  }
}
