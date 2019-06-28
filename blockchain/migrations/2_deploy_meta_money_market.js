const MetaMoneyMarket = artifacts.require('MetaMoneyMarket');
const MoneyMarketMock = artifacts.require('MoneyMarketMock');
const MoneyMarketMockAdapter = artifacts.require('MoneyMarketMockAdapter');
const TestToken = artifacts.require('TestToken');

module.exports = async function(deployer, network, accounts) {
  let moneyMarkets = [];
  if (network === 'test') {
    await deployer.deploy(MoneyMarketMock, 1000);
    const moneyMarket1 = await MoneyMarketMock.deployed();
    await deployer.deploy(MoneyMarketMockAdapter, moneyMarket1.address);
    const moneyMarketAdapter1 = await MoneyMarketMockAdapter.deployed();

    await deployer.deploy(MoneyMarketMock, 1000);
    const moneyMarket2 = await MoneyMarketMock.deployed();
    await deployer.deploy(MoneyMarketMockAdapter, moneyMarket2.address);
    const moneyMarketAdapter2 = await MoneyMarketMockAdapter.deployed();

    moneyMarkets = [moneyMarketAdapter1.address, moneyMarketAdapter2.address];

    await deployer.deploy(TestToken, '2000000000');
    const testToken = await TestToken.deployed();
    await testToken.transfer(accounts[1], '100');
    await testToken.transfer(accounts[2], '100');

    await deployer.deploy(MetaMoneyMarket, moneyMarkets);
    const metaMoneyMarket = await MetaMoneyMarket.deployed();

    await moneyMarketAdapter1.transferOwnership(metaMoneyMarket.address);
    await moneyMarketAdapter2.transferOwnership(metaMoneyMarket.address);
  }
};
