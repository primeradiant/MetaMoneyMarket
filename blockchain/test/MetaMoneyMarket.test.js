const MetaMoneyMarket = artifacts.require('MetaMoneyMarket');
const MoneyMarketMock = artifacts.require('MoneyMarketMock');
const MoneyMarketMockAdapter = artifacts.require('MoneyMarketMockAdapter');
const TestToken = artifacts.require('TestToken');
const TokenShare = artifacts.require('TokenShare');

contract('MetaMoneyMarket', accounts => {
  let metaMoneyMarket = null;
  let testToken = null;
  let moneyMarket1 = null;
  let moneyMarket2 = null;
  let moneyMarketAdapter1 = null;
  let moneyMarketAdapter2 = null;

  before(async () => {
    metaMoneyMarket = await MetaMoneyMarket.deployed();
    testToken = await TestToken.deployed();
    moneyMarketAdapter1 = await MoneyMarketMockAdapter.at(
      await metaMoneyMarket.moneyMarkets(0)
    );
    moneyMarketAdapter2 = await MoneyMarketMockAdapter.at(
      await metaMoneyMarket.moneyMarkets(1)
    );
    moneyMarket1 = await MoneyMarketMock.at(
      await moneyMarketAdapter1.moneyMarket()
    );
    moneyMarket2 = await MoneyMarketMock.at(
      await moneyMarketAdapter2.moneyMarket()
    );
  });

  it('should be deployed', async () => {
    expect(metaMoneyMarket.address).to.be.a('string');
  });

  it('should not support the test token', async () => {
    const supported = await metaMoneyMarket.isMarketSupported(
      testToken.address
    );

    expect(supported).to.equal(false);
  });

  it('should add support for the test token', async () => {
    await metaMoneyMarket.addMarket(testToken.address);

    const supported = await metaMoneyMarket.isMarketSupported(
      testToken.address
    );

    expect(supported).to.equal(true);
  });

  it('should deposit to the first money market if its rate is higher', async () => {
    await moneyMarket1.addMarket(testToken.address);
    await moneyMarket2.addMarket(testToken.address);
    await moneyMarket1.setRate(100);
    await moneyMarket2.setRate(90);
    const tokenShareAddress = await metaMoneyMarket.getTokenShare(
      testToken.address
    );
    const tokenShare = await TokenShare.at(tokenShareAddress);
    await testToken.approve(metaMoneyMarket.address, '-1', {from: accounts[1]});
    await tokenShare.approve(metaMoneyMarket.address, '-1', {
      from: accounts[1]
    });
    await metaMoneyMarket.deposit(testToken.address, '100', {
      from: accounts[1]
    });
    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal(
      '100'
    );
    expect(
      (await moneyMarketAdapter1.getSupply(testToken.address)).toString()
    ).to.equal('100');
    expect(
      (await moneyMarketAdapter2.getSupply(testToken.address)).toString()
    ).to.equal('0');
  });

  it('should accrue interest and withdraw', async () => {
    const tokenShareAddress = await metaMoneyMarket.getTokenShare(
      testToken.address
    );
    const tokenShare = await TokenShare.at(tokenShareAddress);

    testToken.transfer(moneyMarket1.address, '50', {from: accounts[0]});
    expect(
      (await moneyMarketAdapter1.getSupply(testToken.address)).toString()
    ).to.equal('150');
    expect(
      (await moneyMarketAdapter2.getSupply(testToken.address)).toString()
    ).to.equal('0');
    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal(
      '100'
    );
    expect(
      (await testToken.balanceOf(metaMoneyMarket.address)).toString()
    ).to.equal('0');

    await metaMoneyMarket.withdraw(testToken.address, '50', {
      from: accounts[1]
    });

    expect(
      (await testToken.balanceOf(metaMoneyMarket.address)).toString()
    ).to.equal('0');
    expect(
      (await testToken.balanceOf(moneyMarketAdapter1.address)).toString()
    ).to.equal('0');
    expect(
      (await testToken.balanceOf(moneyMarketAdapter2.address)).toString()
    ).to.equal('0');

    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal('50');
    expect(
      (await moneyMarketAdapter1.getSupply(testToken.address)).toString()
    ).to.equal('75');
    expect(
      (await moneyMarketAdapter2.getSupply(testToken.address)).toString()
    ).to.equal('0');
    expect((await testToken.balanceOf(accounts[1])).toString()).to.equal('75');
  });

  it('should deposit in the market with the new best rate', async () => {
    const tokenShareAddress = await metaMoneyMarket.getTokenShare(
      testToken.address
    );
    const tokenShare = await TokenShare.at(tokenShareAddress);

    // money market 2 has a higher rate
    await moneyMarket1.setRate(90);
    await moneyMarket2.setRate(100);

    // check pre-conditions
    expect((await tokenShare.balanceOf(accounts[2])).toString()).to.equal('0');
    expect((await tokenShare.totalSupply()).toString()).to.equal('50');
    expect(
      (await metaMoneyMarket.totalSupply(testToken.address)).toString()
    ).to.equal('75');

    // user 2 lets the contract move its assets and deposits 100 tokens
    await testToken.approve(metaMoneyMarket.address, '-1', {from: accounts[2]});
    await tokenShare.approve(metaMoneyMarket.address, '-1', {
      from: accounts[2]
    });
    await metaMoneyMarket.deposit(testToken.address, '100', {
      from: accounts[2]
    });

    // check post-conditions
    expect((await tokenShare.totalSupply()).toString()).to.equal('116');
    expect((await tokenShare.balanceOf(accounts[2])).toString()).to.equal('66');
    expect(
      (await moneyMarketAdapter1.getSupply(testToken.address)).toString()
    ).to.equal('75');
    expect(
      (await moneyMarketAdapter2.getSupply(testToken.address)).toString()
    ).to.equal('100');
    expect(
      (await metaMoneyMarket.totalSupply(testToken.address)).toString()
    ).to.equal('175');
  });
});
