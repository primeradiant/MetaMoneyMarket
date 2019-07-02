/* eslint-disable no-console */
const CompoundAdapter = artifacts.require('CompoundAdapter');
const MetaMoneyMarket = artifacts.require('MetaMoneyMarket');
const MoneyMarketMock = artifacts.require('MoneyMarketMock');
const MoneyMarketMockAdapter = artifacts.require('MoneyMarketMockAdapter');
const TestToken = artifacts.require('TestToken');
const IERC20 = artifacts.require('IERC20');

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
  } else if (network === 'rinkeby') {
    await deployer.deploy(MoneyMarketMock, 1000);
    const moneyMarketMock = await MoneyMarketMock.deployed();
    await deployer.deploy(MoneyMarketMockAdapter, moneyMarketMock.address);
    const moneyMarketAdapter = await MoneyMarketMockAdapter.deployed();

    await deployer.deploy(CompoundAdapter);
    const compoundAdapter = await CompoundAdapter.deployed();

    const daiAddress = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea';
    const cDaiAddress = '0x6d7f0754ffeb405d23c51ce938289d4835be3b14';
    const dai = await IERC20.at(daiAddress);

    // map rinkeby dai to rinkeby cdai
    await compoundAdapter.mapTokenToCToken(daiAddress, cDaiAddress);

    moneyMarkets = [moneyMarketAdapter.address, compoundAdapter.address];

    await deployer.deploy(MetaMoneyMarket, moneyMarkets);
    const metaMoneyMarket = await MetaMoneyMarket.deployed();

    console.log('transferring adapters ownership to the MMM contract');
    await moneyMarketAdapter.transferOwnership(metaMoneyMarket.address);
    await compoundAdapter.transferOwnership(metaMoneyMarket.address);

    console.log('adding rinkeby dai market');
    await metaMoneyMarket.addMarket(daiAddress);
    await moneyMarketMock.addMarket(daiAddress);

    console.log('approving MMM contract to move the dai of the user');
    await dai.approve(
      metaMoneyMarket.address,
      '115792089237316195423570985008687907853269984665640564039456584007913129639935'
    );
  }
};
