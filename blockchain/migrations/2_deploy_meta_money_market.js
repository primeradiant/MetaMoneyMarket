/* eslint-disable no-console */
const CompoundAdapter = artifacts.require('CompoundAdapter');
const DYDXAdapter = artifacts.require('DYDXAdapter');
const FulcrumAdapter = artifacts.require('FulcrumAdapter');

const MetaMoneyMarket = artifacts.require('MetaMoneyMarket');
const MoneyMarketMock = artifacts.require('MoneyMarketMock');
const MoneyMarketMockAdapter = artifacts.require('MoneyMarketMockAdapter');
const TestToken = artifacts.require('TestToken');

const rinkebyConfig = {
  tokens: [
    {
      name: 'dai',
      tokenAddress: '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
      cTokenAddress: '0x6d7f0754ffeb405d23c51ce938289d4835be3b14'
    }
  ]
};

const kovanConfig = {
  soloAddress: '0x4EC3570cADaAEE08Ae384779B0f3A45EF85289DE',
  tokens: [
    {
      name: 'dai',
      tokenAddress: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2',
      marketId: 1,
      iTokenAddress: '0xA1e58F3B1927743393b25f261471E1f2D3D9f0F6'
    }
  ]
};

const mainnetConfig = {
  soloAddress: '0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e',
  tokens: [
    {
      name: 'dai',
      tokenAddress: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      cTokenAddress: '0xf5dce57282a584d2746faf1593d3121fcac444dc',
      marketId: 1
    },
    {
      name: 'usdc',
      tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      cTokenAddress: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
      marketId: 2
    }
  ]
};

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
    // deploy money market mock
    await deployer.deploy(MoneyMarketMock, 1);
    const moneyMarketMock = await MoneyMarketMock.deployed();
    await deployer.deploy(MoneyMarketMockAdapter, moneyMarketMock.address);
    const moneyMarketAdapter = await MoneyMarketMockAdapter.deployed();

    // deploy compound
    await deployer.deploy(CompoundAdapter);
    const compoundAdapter = await CompoundAdapter.deployed();

    // deploy MetaMoneyMarket
    moneyMarkets = [moneyMarketAdapter.address, compoundAdapter.address];
    await deployer.deploy(MetaMoneyMarket, moneyMarkets);
    const metaMoneyMarket = await MetaMoneyMarket.deployed();

    console.log('configuring tokens');
    for (const {name, tokenAddress, cTokenAddress} of rinkebyConfig.tokens) {
      if (cTokenAddress !== undefined) {
        console.log(`configuring mmm and adapters for ${name}`);
        await compoundAdapter.mapTokenToCToken(tokenAddress, cTokenAddress);
        await metaMoneyMarket.addMarket(tokenAddress);
        await moneyMarketMock.addMarket(tokenAddress);
      }
    }

    // transfer ownership of adapters to the MMM contract
    console.log('transferring adapters ownership to the MMM contract');
    await moneyMarketAdapter.transferOwnership(metaMoneyMarket.address);
    await compoundAdapter.transferOwnership(metaMoneyMarket.address);
  } else if (network === 'kovan') {

    // deploy Fulcrum adapter
    await deployer.deploy(FulcrumAdapter);
    const fulcrumAdapter = await FulcrumAdapter.deployed();

    // deploy dydx adapter
    await deployer.deploy(DYDXAdapter, kovanConfig.soloAddress);
    const dydxAdapter = await DYDXAdapter.deployed();

    // deploy MetaMoneyMarket
    moneyMarkets = [fulcrumAdapter.address, dydxAdapter.address];
    await deployer.deploy(MetaMoneyMarket, moneyMarkets);
    const metaMoneyMarket = await MetaMoneyMarket.deployed();

    console.log('configuring tokens');
    for (const { name, tokenAddress, marketId, iTokenAddress } of kovanConfig.tokens) {
      if (marketId !== undefined) {
        console.log(`configuring mmm and adapters for ${name}`);
        await fulcrumAdapter.mapTokenToIToken(tokenAddress, iTokenAddress);
        await dydxAdapter.mapTokenToMarketId(tokenAddress, marketId);
        await metaMoneyMarket.addMarket(tokenAddress);
      }
    }

    console.log('transferring adapters ownership to the MMM contract');
    await fulcrumAdapter.transferOwnership(metaMoneyMarket.address);
    await dydxAdapter.transferOwnership(metaMoneyMarket.address);
  } else if (network === 'mainnet') {
    // deploy compound
    await deployer.deploy(CompoundAdapter);
    const compoundAdapter = await CompoundAdapter.deployed();

    // deploy dydx adapter
    await deployer.deploy(DYDXAdapter, mainnetConfig.soloAddress);
    const dydxAdapter = await DYDXAdapter.deployed();

    // deploy MetaMoneyMarket
    moneyMarkets = [compoundAdapter.address, dydxAdapter.address];
    await deployer.deploy(MetaMoneyMarket, moneyMarkets);
    const metaMoneyMarket = await MetaMoneyMarket.deployed();

    console.log('configuring tokens');
    for (const {
      name,
      tokenAddress,
      cTokenAddress,
      marketId
    } of mainnetConfig.tokens) {
      if (cTokenAddress !== undefined && marketId !== undefined) {
        console.log(`configuring mmm and adapters for ${name}`);
        await compoundAdapter.mapTokenToCToken(tokenAddress, cTokenAddress);
        await dydxAdapter.mapTokenToMarketId(tokenAddress, marketId);
        await metaMoneyMarket.addMarket(tokenAddress);
      }
    }

    // console.log('transferring adapters ownership to the MMM contract');
    // await compoundAdapter.transferOwnership(metaMoneyMarket.address);
    // await dydxAdapter.transferOwnership(metaMoneyMarket.address);
  }
};
