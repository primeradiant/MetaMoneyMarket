/* eslint-disable no-console */
const CompoundAdapter = artifacts.require('CompoundAdapter');
const DYDXAdapter = artifacts.require('DYDXAdapter');
const FulcrumAdapter = artifacts.require('FulcrumAdapter');
const AaveAdapter = artifacts.require('AaveAdapter');

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
  aaveAddress: '0x9C6C63aA0cD4557d7aE6D9306C06C093A2e35408',
  tokens: [
    {
      name: 'dai',
      tokenAddress: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2',
      marketId: 1,
      iTokenAddress: '0xA1e58F3B1927743393b25f261471E1f2D3D9f0F6'
    },
    {
      name: 'aave dai',
      tokenAddress: '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD',
      aTokenAddress: '0x8Ac14CE57A87A07A2F13c1797EfEEE8C0F8F571A'
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
      marketId: 1,
      iTokenAddress: '0x14094949152eddbfcd073717200da82fed8dc960'
    },
    {
      name: 'usdc',
      tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      cTokenAddress: '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
      marketId: 2,
      iTokenAddress: '0xf013406a0b1d544238083df0b93ad0d2cbe0f65f'
    },
    {
      name: 'wbtc',
      tokenAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      cTokenAddress: '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4',
      iTokenAddress: '0xBA9262578EFef8b3aFf7F60Cd629d6CC8859C8b5'
    },
    {
      name: 'rep',
      tokenAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
      cTokenAddress: '0x158079Ee67Fce2f58472A96584A73C7Ab9AC95c1',
      iTokenAddress: '0xBd56E9477Fc6997609Cf45F84795eFbDAC642Ff1'
    },
    {
      name: 'zrx',
      tokenAddress: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
      cTokenAddress: '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
      iTokenAddress: '0xa7eb2bc82df18013ecc2a6c533fc29446442edee'
    },
    {
      name: 'bat',
      tokenAddress: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
      cTokenAddress: '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e'
    },
    {
      name: 'knc',
      tokenAddress: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
      iTokenAddress: '0x1cc9567ea2eb740824a45f8026ccf8e46973234d'
    },
    {
      name: 'link',
      tokenAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      iTokenAddress: '0x1d496da96caf6b518b133736beca85d5c4f9cbc5'
    }
  ]
};

module.exports = async function (deployer, network, accounts) {
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
    for (const { name, tokenAddress, cTokenAddress } of rinkebyConfig.tokens) {
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
    // deploy Aave adapter
    await deployer.deploy(AaveAdapter, kovanConfig.aaveAddress);
    const aaveAdapter = await AaveAdapter.deployed();

    // deploy Fulcrum adapter
    await deployer.deploy(FulcrumAdapter);
    const fulcrumAdapter = await FulcrumAdapter.deployed();

    // deploy dydx adapter
    await deployer.deploy(DYDXAdapter, kovanConfig.soloAddress);
    const dydxAdapter = await DYDXAdapter.deployed();

    // deploy MetaMoneyMarket
    moneyMarkets = [aaveAdapter.address, fulcrumAdapter.address, dydxAdapter.address];
    await deployer.deploy(MetaMoneyMarket, moneyMarkets);
    const metaMoneyMarket = await MetaMoneyMarket.deployed();

    console.log('configuring tokens');
    for (const {
      name,
      tokenAddress,
      marketId,
      iTokenAddress,
      aTokenAddress
    } of kovanConfig.tokens) {
      if (aTokenAddress !== undefined) {
        console.log(`configuring aave for ${name}`);
        await aaveAdapter.mapTokenToAToken(tokenAddress, aTokenAddress);
      }
      if (iTokenAddress !== undefined) {
        console.log(`configuring fulcrum for ${name}`);
        await fulcrumAdapter.mapTokenToIToken(tokenAddress, iTokenAddress);
      }
      if (marketId !== undefined) {
        console.log(`configuring mmm and adapters for ${name}`);
        await dydxAdapter.mapTokenToMarketId(tokenAddress, marketId);
      }

      // add market to mmm if some adapter supports this token
      if (
        aTokenAddress !== undefined ||
        iTokenAddress !== undefined ||
        marketId !== undefined
      ) {
        console.log(`configuring mmm for ${name}`);
        await metaMoneyMarket.addMarket(tokenAddress);
      }
    }

    console.log('transferring adapters ownership to the MMM contract');
    await aaveAdapter.transferOwnership(metaMoneyMarket.address);
    await fulcrumAdapter.transferOwnership(metaMoneyMarket.address);
    await dydxAdapter.transferOwnership(metaMoneyMarket.address);
  } else if (network === 'mainnet') {
    // deploy compound
    await deployer.deploy(CompoundAdapter);
    const compoundAdapter = await CompoundAdapter.deployed();

    // deploy dydx adapter
    await deployer.deploy(DYDXAdapter, mainnetConfig.soloAddress);
    const dydxAdapter = await DYDXAdapter.deployed();

    // deploy Fulcrum adapter
    await deployer.deploy(FulcrumAdapter);
    const fulcrumAdapter = await FulcrumAdapter.deployed();

    // deploy MetaMoneyMarket
    moneyMarkets = [
      compoundAdapter.address,
      dydxAdapter.address,
      fulcrumAdapter.address
    ];
    await deployer.deploy(MetaMoneyMarket, moneyMarkets);
    const metaMoneyMarket = await MetaMoneyMarket.deployed();

    console.log('configuring tokens');
    for (const {
      name,
      tokenAddress,
      cTokenAddress,
      iTokenAddress,
      marketId
    } of mainnetConfig.tokens) {
      if (cTokenAddress !== undefined) {
        console.log(`configuring compound for ${name}`);
        await compoundAdapter.mapTokenToCToken(tokenAddress, cTokenAddress);
      }
      if (marketId !== undefined) {
        console.log(`configuring dydx for ${name}`);
        await dydxAdapter.mapTokenToMarketId(tokenAddress, marketId);
      }
      if (iTokenAddress !== undefined) {
        console.log(`configuring fulcrum for ${name}`);
        await fulcrumAdapter.mapTokenToIToken(tokenAddress, iTokenAddress);
      }

      // add market to mmm if some adapter supports this token
      if (
        cTokenAddress !== undefined ||
        iTokenAddress !== undefined ||
        marketId !== undefined
      ) {
        console.log(`configuring mmm for ${name}`);
        await metaMoneyMarket.addMarket(tokenAddress);
      }
    }

    // console.log('transferring adapters ownership to the MMM contract');
    // await compoundAdapter.transferOwnership(metaMoneyMarket.address);
    // await dydxAdapter.transferOwnership(metaMoneyMarket.address);
  }
};
