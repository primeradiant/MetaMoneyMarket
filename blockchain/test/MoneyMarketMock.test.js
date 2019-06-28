const MoneyMarketMock = artifacts.require('MoneyMarketMock');
const TestToken = artifacts.require('TestToken');
const TokenShare = artifacts.require('TokenShare');

contract('MoneyMarketMock', accounts => {
  let moneyMarket = null;
  let testToken = null;

  before(async () => {
    moneyMarket = await MoneyMarketMock.deployed();
    testToken = await TestToken.deployed();
  });

  it('should be deployed', async () => {
    expect(moneyMarket.address).to.be.a('string');
  });

  it('should have token supply for the first two accounts', async () => {
    const balance1 = await testToken.balanceOf(accounts[0]);
    const balance2 = await testToken.balanceOf(accounts[1]);

    expect(+balance1 > 0).to.equal(true);
    expect(+balance2 > 0).to.equal(true);
  });

  it('should not support the test token after being deployed', async () => {
    const supported = await moneyMarket.isMarketSupported(testToken.address);

    expect(supported).to.equal(false);
  });

  it('should add support for the test token', async () => {
    await moneyMarket.addMarket(testToken.address);

    const supported = await moneyMarket.isMarketSupported(testToken.address);

    expect(supported).to.equal(true);
  });

  it('user deposits 100 tokens and withdraws it', async () => {
    const tokenShareAddress = await moneyMarket.getTokenShare(
      testToken.address
    );
    const tokenShare = await TokenShare.at(tokenShareAddress);

    // user has 100 tokens and 0 dTokens
    expect((await testToken.balanceOf(accounts[1])).toString()).to.equal('100');
    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal('0');

    // user deposits all of those tokens
    await testToken.approve(moneyMarket.address, '-1', {from: accounts[1]});
    await moneyMarket.deposit(testToken.address, '100', {from: accounts[1]});

    // user receives 100 dTokens
    expect((await testToken.balanceOf(accounts[1])).toString()).to.equal('0');
    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal(
      '100'
    );

    // user withdraws 50 dTokens
    await tokenShare.approve(moneyMarket.address, '-1', {from: accounts[1]});
    await moneyMarket.withdraw(testToken.address, '50', {from: accounts[1]});

    // user has 50 tokens and 50 dTokens
    expect((await testToken.balanceOf(accounts[1])).toString()).to.equal('50');
    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal('50');

    // user withdraws 50 dTokens
    await moneyMarket.withdraw(testToken.address, '50', {from: accounts[1]});

    // user has 100 tokens and 0 dTokens
    expect((await testToken.balanceOf(accounts[1])).toString()).to.equal('100');
    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal('0');
  });

  it('user deposits 100 tokens, interest accrues and user withdraws it', async () => {
    const tokenShareAddress = await moneyMarket.getTokenShare(
      testToken.address
    );
    const tokenShare = await TokenShare.at(tokenShareAddress);

    // user has 100 tokens and 0 dTokens
    expect((await testToken.balanceOf(accounts[1])).toString()).to.equal('100');
    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal('0');

    // user deposits all of those tokens
    await moneyMarket.deposit(testToken.address, '100', {from: accounts[1]});

    // user receives 100 dTokens
    expect((await testToken.balanceOf(accounts[1])).toString()).to.equal('0');
    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal(
      '100'
    );

    // deposit accrues 10% of interest
    await testToken.transfer(moneyMarket.address, '10', {from: accounts[0]});

    // user withdraws 50 dTokens
    await moneyMarket.withdraw(testToken.address, '50', {from: accounts[1]});

    // user has 55 tokens and 50 dTokens
    expect((await testToken.balanceOf(accounts[1])).toString()).to.equal('55');
    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal('50');

    // user withdraws 50 dTokens
    await moneyMarket.withdraw(testToken.address, '50', {from: accounts[1]});

    // user has 110 tokens and 0 dTokens
    expect((await testToken.balanceOf(accounts[1])).toString()).to.equal('110');
    expect((await tokenShare.balanceOf(accounts[1])).toString()).to.equal('0');
  });

  it('user cannot withdraw more than the deposited amount', async () => {
    const tokenShareAddress = await moneyMarket.getTokenShare(
      testToken.address
    );
    const tokenShare = await TokenShare.at(tokenShareAddress);

    // user has 100 tokens and 0 dTokens
    expect((await testToken.balanceOf(accounts[2])).toString()).to.equal('100');
    expect((await tokenShare.balanceOf(accounts[2])).toString()).to.equal('0');

    // user deposits all of those tokens
    await testToken.approve(moneyMarket.address, '-1', {from: accounts[2]});
    await moneyMarket.deposit(testToken.address, '100', {from: accounts[2]});

    // user receives 100 dTokens
    expect((await testToken.balanceOf(accounts[2])).toString()).to.equal('0');
    expect((await tokenShare.balanceOf(accounts[2])).toString()).to.equal(
      '100'
    );

    // user tries to withdraw 110 dTokens
    let failed = false;
    try {
      await tokenShare.approve(moneyMarket.address, '-1', {from: accounts[2]});
      await moneyMarket.withdraw(testToken.address, '110', {from: accounts[2]});
    } catch (e) {
      failed = true;
    }

    expect(failed).to.equal(true);
  });
});
