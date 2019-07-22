const nomicsUrl = 'https://api.nomics.com/v1';
const apiKey = process.env.REACT_APP_NOMICS_API_KEY;

export const getPrice = async (symbol: string): Promise<number> => {
  if (!apiKey) {
    throw new Error('Nomics API key not specified');
  }
  const response = await fetch(`${nomicsUrl}/currencies/ticker?key=${apiKey}&ids=${symbol.toUpperCase()}`);
  const result = await response.json();

  if (result.length === 0) {
    throw new Error(`Could not get price for ${symbol}`);
  }

  return +result[0].price;
};
