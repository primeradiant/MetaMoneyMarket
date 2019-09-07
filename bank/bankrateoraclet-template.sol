pragma solidity ^0.5.11;
import "https://github.com/provable-things/ethereum-api/blob/master/provableAPI_0.5.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol";


contract BankOracle is usingProvable {
   
    uint256 public oneMonth;
    uint256 public threeMonth;
    uint256 public sixMonth;
    event LogConstructorInitiated(string nextStep);
    event LogRateUpdated(string result);
    event LogNewProvableQuery(string description);

    function ExampleContract() payable public {
        emit LogConstructorInitiated("Constructor was initiated. Call 'updateRate()' to send the Provable Query.");
   }

    function __callback(bytes32 myid, string memory result) public{
       if (msg.sender != provable_cbAddress()) revert();
       emit LogRateUpdated(result);
      
       oneMonth = parseInt("oneMonth") / 10000;
       threeMonth = parseInt("threeMonth") / 10000;
       sixMonth = parseInt("sixMonth") / 10000;
       emit LogRateUpdated(result);
   }


   function updateRate() payable public {
       if (provable_getPrice("URL") > address(this).balance) {
           emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
       } else {
          emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
           provable_query("URL", "json(https://github.com/primeradiant/MetaMoneyMarket/blob/master/bank/bankrate1.json)");
           
       }
   }
}
