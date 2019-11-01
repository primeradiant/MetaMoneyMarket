import React from 'react';

import { KYBER_COMMISSION_ADDRESS } from '../../util/constants';

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  tokenSymbol: string;
}

const KyberLink = ({ tokenSymbol, children, ...restProps }: Props) => {
  return (
    <a
      href={`https://widget.kyber.network/v0.7.2/?type=swap&mode=popup&lang=en&defaultPair=ETH_${tokenSymbol}&callback=https%3A%2F%2Fkyberpay-sample.knstats.com%2Fcallback&paramForwarding=true&network=mainnet&theme=theme-emerald&commissionId=${KYBER_COMMISSION_ADDRESS}`}
      target="_blank"
      rel='noopener noreferrer'
      {...restProps}
    >
      {children}
    </a>
  );
};

export default KyberLink;
