import BN from 'bn.js';
import React from 'react';
import {Flex, Text, Box, Button} from 'rebass';
import styled from 'styled-components';

import {themeColors} from '../../util/constants';
import {BigNumberInput} from '../common/BigNumberInput';

interface Props {
  id?: string;
  decimals: number;
  disabled?: boolean;
  max: BN;
  onMax: () => void;
  value: Maybe<BN>;
  token: string;
  onChange: (newValue: BN) => void;
}

const AmountTextfieldWrapper = styled.div<{disabled?: boolean}>`
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;

    &::before {
      content: '';
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 5;
    }
  }
`;

AmountTextfieldWrapper.defaultProps = {
  disabled: false,
};

const ValueInput: any = ({...rest}: any) => <BigNumberInput {...rest} />;

const AmountTextfield: React.FC<Props> = ({
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
  <Flex width={1} alignItems="center" sx={{position: 'relative', height: 44}} {...restProps}>
    <Box sx={{position: 'absolute', left: '16px'}}>
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
