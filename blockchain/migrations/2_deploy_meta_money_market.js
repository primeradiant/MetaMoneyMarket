/* eslint-disable no-console */
const CompoundAdapter = artifacts.require('CompoundAdapter');
const DYDXAdapter = artifacts.require('DYDXAdapter');
const MetaMoneyMarket = artifacts.require('MetaMoneyMarket');
const MoneyMarketMock = artifacts.require('MoneyMarketMock');
const MoneyMarketMockAdapter = artifacts.require('MoneyMarketMockAdapter');
const TestToken = artifacts.require('TestToken');
const IERC20 = artifacts.require('IERC20');

module.exports = async function(deployer, network, accounts) {
  let moneyMarkets = [];
  if (network === 'development' || network === 'test') {
    await deployer.deploy(MoneyMarketMock, 1000);
    const moneyMarket1 = await MoneyMarketMock.deployed();
    await deployer.deploy(MoneyMarketMockAdapter, moneyMarket1.address);
    const moneyMarketAdapter1 = await MoneyMarketMockAdapter.deployed();

    await deployer.deploy(MoneyMarketMock, 1000);
    const moneyMarket2 = await MoneyMarketMock.deployed();
    await deployer.deploy(MoneyMarketMockAdapter, moneyMarket2.address);
    const moneyMarketAdapter2 = await MoneyMarketMockAdapter.deployed();

    moneyMarkets = [moneyMarketAdapter1.address, moneyMarketAdapter2.address];

    await deployer.deploy(TestToken, 'TEST1', '2000000000');
    const testToken = await TestToken.deployed();
    await testToken.transfer(accounts[1], '100');
    await testToken.transfer(accounts[2], '100');

    await deployer.deploy(MetaMoneyMarket, moneyMarkets);
    const metaMoneyMarket = await MetaMoneyMarket.deployed();

    await moneyMarket1.addMarket(testToken.address);
    await moneyMarket2.addMarket(testToken.address);
    await metaMoneyMarket.addMarket(testToken.address);

    await moneyMarketAdapter1.transferOwnership(metaMoneyMarket.address);
    await moneyMarketAdapter2.transferOwnership(metaMoneyMarket.address);
  } else if (network === 'rinkeby') {
    const daiAddress = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea';
    const cDaiAddress = '0x6d7f0754ffeb405d23c51ce938289d4835be3b14';
    const dai = await IERC20.at(daiAddress);

    // deploy money market mock
    await deployer.deploy(MoneyMarketMock, 1);
    const moneyMarketMock = await MoneyMarketMock.deployed();
    await deployer.deploy(MoneyMarketMockAdapter, moneyMarketMock.address);
    const moneyMarketAdapter = await MoneyMarketMockAdapter.deployed();

    // deploy compound and add dai->cDai mapping
    await deployer.deploy(CompoundAdapter);
    const compoundAdapter = await CompoundAdapter.deployed();
    await compoundAdapter.mapTokenToCToken(daiAddress, cDaiAddress);

    // deploy MetaMoneyMarket
    moneyMarkets = [moneyMarketAdapter.address, compoundAdapter.address];
    await deployer.deploy(MetaMoneyMarket, moneyMarkets);
    const metaMoneyMarket = await MetaMoneyMarket.deployed();

    // transfer ownership of adapters to the MMM contract
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
  } else if (network === 'kovan') {
    const daiAddress = '0xC4375B7De8af5a38a93548eb8453a498222C4fF2';
    const daiMarketId = 1;
    const dai = await IERC20.at(daiAddress);

    // deploy money market mock
    await deployer.deploy(MoneyMarketMock, 1);
    const moneyMarketMock = await MoneyMarketMock.deployed();
    await deployer.deploy(MoneyMarketMockAdapter, moneyMarketMock.address);
    const moneyMarketAdapter = await MoneyMarketMockAdapter.deployed();

    // deploy dydx adapter and map dai to market id
    await deployer.deploy(
      DYDXAdapter,
      '0x4EC3570cADaAEE08Ae384779B0f3A45EF85289DE'
    );
    const dydxAdapter = await DYDXAdapter.deployed();
    await dydxAdapter.mapTokenToMarketId(daiAddress, daiMarketId);

    // deploy MetaMoneyMarket
    moneyMarkets = [moneyMarketAdapter.address, dydxAdapter.address];
    await deployer.deploy(MetaMoneyMarket, moneyMarkets);
    const metaMoneyMarket = await MetaMoneyMarket.deployed();

    console.log('transferring adapters ownership to the MMM contract');
    await moneyMarketAdapter.transferOwnership(metaMoneyMarket.address);
    await dydxAdapter.transferOwnership(metaMoneyMarket.address);

    console.log('adding kovan dai market');
    await metaMoneyMarket.addMarket(daiAddress);
    await moneyMarketMock.addMarket(daiAddress);

    console.log('approving MMM contract to move the dai of the user');
    await dai.approve(
      metaMoneyMarket.address,
      '115792089237316195423570985008687907853269984665640564039456584007913129639935'
    );
  }
};
