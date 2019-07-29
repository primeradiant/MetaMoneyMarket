const knownSymbols: {[networkId: number]: {[address: string]: string}} = {
  1: {
    '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359': 'DAI',
  },
};

export const getSymbol = (networkId: number, address: string): Maybe<string> => {
  if (knownSymbols[networkId]) {
    return knownSymbols[networkId][address.toLowerCase()] || null;
  }

  return null;
};
