import BAT from './bat.png';
import DAI from './dai.png';
import ETH from './eth.png';
import KNC from './knc.png';
import LINK from './link.png';
import MKR from './mkr.png';
import REP from './rep.png';
import TUSD from './tusd.png';
import USDC from './usdc.png';
import WBTC from './wbtc.png';
import ZRX from './zrx.png';

interface TokenData {
  image: string;
  text: string;
  title: string;
}

export const tokensList: { [symbol: string]: TokenData } = {
  BAT: {
    image: BAT,
    text: 'Basic Attention',
    title: 'BAT',
  },
  DAI: {
    image: DAI,
    text: 'DAI',
    title: 'DAI',
  },
  ETH: {
    image: ETH,
    text: 'Ethereum',
    title: 'ETH',
  },
  KNC: {
    image: KNC,
    text: 'Kyber',
    title: 'KNC',
  },
  LINK: {
    image: LINK,
    text: 'Chainlink',
    title: 'LINK',
  },
  MKR: {
    image: MKR,
    text: 'Maker',
    title: 'MKR',
  },
  REP: {
    image: REP,
    text: 'Augur',
    title: 'REP',
  },
  TUSD: {
    image: TUSD,
    text: 'True USD',
    title: 'TUSD',
  },
  USDC: {
    image: USDC,
    text: 'USD Coin',
    title: 'USDC',
  },
  WBTC: {
    image: WBTC,
    text: 'Wrapper BTC',
    title: 'WBTC',
  },
  ZRX: {
    image: ZRX,
    text: '0x',
    title: 'ZRX',
  },
};

export const getTokenDataBySymbol = (symbol: string): TokenData | null => {
  return tokensList[symbol.toUpperCase()] || null;
};
