import React from 'react';
import {Button, ButtonProps} from 'rebass';

interface Props extends ButtonProps {
  children: React.ReactNode;
  destCurrency?: 'ETH' | 'USDC' | 'DAI';
  destAddress: string;
}

const SendwyreLink: React.FC<Props> = ({destCurrency, destAddress, children, ...restProps}: Props) => {
  return (
    <Button
      as="a"
      href={`https://pay.sendwyre.com/purchase?${destCurrency && `destCurrency=${destCurrency}&`}${destAddress &&
        `dest=${destAddress}&`}redirectUrl=${window.location.href}
    `}
      target="_blank"
      {...restProps}
    >
      {children}
    </Button>
  );
};

export default SendwyreLink;
