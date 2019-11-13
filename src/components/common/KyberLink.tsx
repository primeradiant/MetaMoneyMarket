import React, { useEffect } from 'react';
import { Button, ButtonProps } from 'rebass';
import { KYBER_COMMISSION_ADDRESS } from '../../util/constants';

interface Props extends ButtonProps {
  tokenSymbol: string;
}

const KyberLink: React.FC<Props> = ({ tokenSymbol, children, ...restProps }: Props) => {
  useEffect(() => {
    if (typeof window !== undefined) {
      // @ts-ignore
      window.kyberWidgetOptions.register('#kyber-link');
    }
  }, []);

  return (
    <Button
      as="a"
      id="kyber-link"
      href={`https://widget.kyber.network/v0.7.2/?type=swap&mode=popup&lang=en&defaultPair=ETH_${tokenSymbol}&callback=https%3A%2F%2Fkyberpay-sample.knstats.com%2Fcallback&paramForwarding=true&network=mainnet&theme=theme-emerald&commissionId=${KYBER_COMMISSION_ADDRESS}`}
      target="_blank"
      {...restProps}
    >
      {children}
    </Button>
  );
};

export default KyberLink;
