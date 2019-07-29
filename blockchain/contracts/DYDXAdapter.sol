pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./Claimable.sol";
import "./IMoneyMarketAdapter.sol";

contract SoloMargin {
  using SafeMath for uint96;
  using SafeMath for uint128;
  using SafeMath for uint256;

  enum ActionType {Deposit, Withdraw}
  enum AssetDenomination {Wei, Par}

  enum AssetReference {Delta, Target}

  struct AccountInfo {
    address owner;
    uint256 number;
  }
  struct ActionArgs {
    ActionType actionType;
    uint256 accountId;
    AssetAmount amount;
    uint256 primaryMarketId;
    uint256 secondaryMarketId;
    address otherAddress;
    uint256 otherAccountId;
    bytes data;
  }
  struct AssetAmount {
    bool sign; // true if positive
    AssetDenomination denomination;
    AssetReference ref;
    uint256 value;
  }
  struct Index {
    uint96 borrow;
    uint96 supply;
    uint32 lastUpdate;
  }
  struct Rate {
    uint256 value;
  }
  struct TotalPar {
    uint128 borrow;
    uint128 supply;
  }
  struct Wei {
    bool sign; // true if positive
    uint256 value;
  }

  function getMarketInterestRate(uint256 marketId)
    public
    view
    returns (Rate memory);

    function getMarketTotalPar(
        uint256 marketId
    )
        public
        view
        returns (TotalPar memory);
    function getMarketCurrentIndex(uint256 marketId)
        public
        view
        returns (Index memory);


  function getAccountWei(AccountInfo memory account, uint256 marketId)
    public
    view
    returns (Wei memory);

  function operate(AccountInfo[] memory accounts, ActionArgs[] memory actions)
    public;
}

contract DYDXAdapter is IMoneyMarketAdapter, Ownable, Claimable {
  // dyDx SoloMargin contract
  SoloMargin soloMargin;

  // map a token address to a dYdX market id
  mapping(address => MarketId) public tokenToMarketId;

  // this struct is necessary because 0 is a valid market id, and we want to distinguish it from unknown tokens.
  struct MarketId {
    uint256 id;
    bool exists;
  }

  modifier checkMarketSupported(address tokenAddress) {
    require(
      _supportsToken(tokenAddress),
      "Unknown market id for the given token address"
    );
    _;
  }

  function supportsToken(address tokenAddress) external view returns (bool) {
    return _supportsToken(tokenAddress);
  }

  function _supportsToken(address tokenAddress) internal view returns (bool) {
    return tokenToMarketId[tokenAddress].exists;
  }

  constructor(address soloMarginAddress) public {
    soloMargin = SoloMargin(soloMarginAddress);
  }

  function mapTokenToMarketId(address tokenAddress, uint256 marketId)
    external
    onlyOwner
  {
    tokenToMarketId[tokenAddress].id = marketId;
    tokenToMarketId[tokenAddress].exists = true;
  }

  function getRate(address tokenAddress)
    external
    view
    checkMarketSupported(tokenAddress)
    returns (uint256)
  {
    uint256 marketId = tokenToMarketId[tokenAddress].id;

    SoloMargin.TotalPar memory totalPar = soloMargin.getMarketTotalPar(marketId);
    SoloMargin.Index memory index = soloMargin.getMarketCurrentIndex(marketId);
    uint256 borrowRatePerSecond = soloMargin.getMarketInterestRate(marketId).value;

    uint256 supplyRatePerSecond = (90000 * uint256(totalPar.borrow) * uint256(index.borrow) * borrowRatePerSecond) / (100000 * uint256(totalPar.supply) * uint256(index.supply));

    return supplyRatePerSecond * 15;
  }

  function deposit(address tokenAddress, uint256 tokenAmount)
    external
    onlyOwner
    checkMarketSupported(tokenAddress)
  {
    IERC20 token = IERC20(tokenAddress);
    require(
      token.allowance(msg.sender, address(this)) >= tokenAmount,
      "CompoundAdapter.deposit: Insufficient allowance"
    );
    token.transferFrom(msg.sender, address(this), tokenAmount);
    token.approve(address(soloMargin), uint256(-1));

    uint256 marketId = tokenToMarketId[tokenAddress].id;

    SoloMargin.AccountInfo[] memory accounts = new SoloMargin.AccountInfo[](1);
    accounts[0] = SoloMargin.AccountInfo(address(this), 0);
    SoloMargin.ActionArgs[] memory actions = new SoloMargin.ActionArgs[](1);
    actions[0] = SoloMargin.ActionArgs(
      SoloMargin.ActionType.Deposit,
      0,
      SoloMargin.AssetAmount(
        true,
        SoloMargin.AssetDenomination.Wei,
        SoloMargin.AssetReference.Delta,
        tokenAmount
      ),
      marketId,
      0,
      address(this),
      0,
      ""
    );

    soloMargin.operate(accounts, actions);
  }

  function withdraw(
    address tokenAddress,
    address recipient,
    uint256 tokenAmount
  ) external onlyOwner checkMarketSupported(tokenAddress) {
    IERC20 token = IERC20(tokenAddress);

    uint256 marketId = tokenToMarketId[tokenAddress].id;

    SoloMargin.AccountInfo[] memory accounts = new SoloMargin.AccountInfo[](1);
    accounts[0] = SoloMargin.AccountInfo(address(this), 0);
    SoloMargin.ActionArgs[] memory actions = new SoloMargin.ActionArgs[](1);
    actions[0] = SoloMargin.ActionArgs(
      SoloMargin.ActionType.Withdraw,
      0,
      SoloMargin.AssetAmount(
        false,
        SoloMargin.AssetDenomination.Wei,
        SoloMargin.AssetReference.Delta,
        tokenAmount
      ),
      marketId,
      0,
      address(this),
      0,
      ""
    );
    soloMargin.operate(accounts, actions);

    token.transfer(recipient, tokenAmount);
  }

  function withdrawAll(address tokenAddress, address recipient)
    external
    onlyOwner
    checkMarketSupported(tokenAddress)
  {
    IERC20 token = IERC20(tokenAddress);

    uint256 marketId = tokenToMarketId[tokenAddress].id;

    SoloMargin.AccountInfo[] memory accounts = new SoloMargin.AccountInfo[](1);
    accounts[0] = SoloMargin.AccountInfo(address(this), 0);

    uint256 balance = soloMargin.getAccountWei(accounts[0], marketId).value;

    SoloMargin.ActionArgs[] memory actions = new SoloMargin.ActionArgs[](1);
    actions[0] = SoloMargin.ActionArgs(
      SoloMargin.ActionType.Withdraw,
      0,
      SoloMargin.AssetAmount(
        false,
        SoloMargin.AssetDenomination.Wei,
        SoloMargin.AssetReference.Delta,
        balance
      ),
      marketId,
      0,
      address(this),
      0,
      ""
    );
    soloMargin.operate(accounts, actions);

    token.transfer(recipient, token.balanceOf(address(this)));
  }

  function claimTokens(address tokenAddress, address recipient)
    external
    onlyOwner
  {
    _claimTokens(tokenAddress, recipient);
  }

  function getSupply(address tokenAddress) external returns (uint256) {
    return this.getSupplyView(tokenAddress);
  }

  function getSupplyView(address tokenAddress) external view returns (uint256) {
    uint256 marketId = tokenToMarketId[tokenAddress].id;
    SoloMargin.AccountInfo memory account = SoloMargin.AccountInfo(
      address(this),
      0
    );

    return soloMargin.getAccountWei(account, marketId).value;
  }
}
