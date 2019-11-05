import BN from 'bn.js';
import React from 'react';
import {Box, Button, Flex, Text} from 'rebass';
import {BigNumberInput} from '../common/BigNumberInput';

const ValueInput: any = ({...rest}: any) => <BigNumberInput {...rest} />;

interface AmountTextfieldProps {
  id?: string;
  decimals: number;
  disabled?: boolean;
  max: BN;
  onMax: () => void;
  value: Maybe<BN>;
  token: string;
  onChange: (newValue: BN) => void;
}

const AmountTextfield: React.FC<AmountTextfieldProps> = ({
  id,
  decimals,
  disabled,
  max,
  token,
  onMax,
  value,
  onChange,
  ...restProps
}) => (
  <Flex
    width={1}
    alignItems="center"
    sx={{
      position: 'relative',
      height: 44,
    }}
    {...restProps}
  >
    <Box
      sx={{
        position: 'absolute',
        left: '16px',
      }}
    >
      <Button variant="max-button" onClick={onMax}>
        Max
      </Button>
    </Box>

    <ValueInput id={id} min={new BN(0)} max={max} value={value} onChange={onChange} decimals={decimals} />

    <Box
      sx={{
        position: 'absolute',
        right: '16px',
      }}
    >
      <Text variant="token-name">{token}</Text>
    </Box>
  </Flex>
);

export default AmountTextfield;
