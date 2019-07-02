var PrivateKeyProvider = require('truffle-privatekey-provider');

const rinkebyPrivateKey = process.env.RINKEBY_PRIVATE_KEY;
const rinkebyRpcUrl = process.env.RINKEBY_RPC_URL;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    },
    test: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    },
    rinkeby: {
      network_id: '4',
      provider: new PrivateKeyProvider(
        rinkebyPrivateKey,
        rinkebyRpcUrl
      )
    }
  },

  compilers: {
    solc: {
      version: '0.5.8'
    }
  }
};
