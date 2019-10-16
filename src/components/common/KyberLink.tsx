import React from 'react';

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  tokenSymbol: string;
}

const KyberLink = ({ tokenSymbol, children, ...restProps }: Props) => {
  return (
    <a
      href={`https://widget.kyber.network/v0.7.2/?type=swap&mode=tab&lang=en&defaultPair=ETH_${tokenSymbol}&callback=https%3A%2F%2Fkyberpay-sample.knstats.com%2Fcallback&paramForwarding=true&network=mainnet&theme=theme-emerald`}
      target="_blank"
      rel='noopener noreferrer'
      {...restProps}
    >
      {children}
    </a>
  );
};

export default KyberLink;
