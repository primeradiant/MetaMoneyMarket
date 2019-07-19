import BN from 'bn.js';

export default class TokenAmount implements ITokenAmount {
  public static fromString(value: string, decimals: number) {
    const parts = value.split('.');
    const integer = parts[0];
    const fractional = (parts[1] || '0').slice(0, decimals).padEnd(decimals, '0');

    const scale = new BN(10).pow(new BN(decimals));

    const amount = new BN(integer).mul(scale).add(new BN(fractional));

    return new TokenAmount(amount, decimals);
  }

  public static format(amount: BN, decimals: number, precision: number = 4) {
    const scale = new BN(10).pow(new BN(decimals));
    const integer = amount.div(scale).toString();
    const fractional = amount
      .mod(scale)
      .toString()
      .slice(0, precision);
    return `${integer}.${fractional}`;
  }

  public amount: BN;
  public decimals: number;

  constructor(amount: BN, decimals: number) {
    this.amount = amount;
    this.decimals = decimals;
  }

  public format(precision: number = 4) {
    return TokenAmount.format(this.amount, this.decimals, precision);
  }
}
