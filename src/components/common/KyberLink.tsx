import React from 'react';
import { Button } from 'rebass';
import { KYBER_COMMISSION_ADDRESS } from '../../util/constants';

interface Props extends React.HTMLAttributes<any> {
  tokenSymbol: string;
}

const KyberLink: React.FC<Props> = ({ tokenSymbol, children, ...restProps }: Props) => (
  <Button
    as="a"
    href={`https://widget.kyber.network/v0.7.2/?type=swap&mode=popup&lang=en&defaultPair=ETH_${tokenSymbol}&callback=https%3A%2F%2Fkyberpay-sample.knstats.com%2Fcallback&paramForwarding=true&network=mainnet&theme=theme-emerald&commissionId=${KYBER_COMMISSION_ADDRESS}`}
    className="kyber-widget-button"
    target="_blank"
    {...restProps}
  >
    {children}
  </Button>
);

export default KyberLink;
