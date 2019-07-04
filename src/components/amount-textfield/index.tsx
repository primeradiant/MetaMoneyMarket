import React, {HTMLAttributes} from 'react';
import styled from 'styled-components';

import {themeColors} from '../../util/constants';

interface Props extends HTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  value: number;
  token: string;
}

const AmountTextfieldWrapper = styled.div<{disabled?: boolean}>`
  align-items: flex-start;
  border-bottom: 1px solid ${themeColors.borderColor};
  display: flex;
  justify-content: space-between;
  margin: 0 0 35px;
  padding: 5px 0;
  position: relative;
  z-index: 0;

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

const MaxButton = styled.button`
  border: none;
  color: #999;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  margin-left: 3px;
  outline: none;
  padding: 0;
  position: relative;
  text-transform: uppercase;
  z-index: 1;

  &:hover {
    color: #333;
  }
`;

const TokenName = styled.div`
  color: #444;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  margin-right: 3px;
  position: relative;
  z-index: 1;
`;

const ValueInput = styled.input`
  background-color: transparent;
  border: none;
  color: ${themeColors.baseTextColor};
  flex-grow: 1;
  font-size: 16px;
  font-weight: 600;
  margin-left: auto;
  outline: none;
  padding: 0 8px;
  position: relative;
  text-align: right;
  z-index: 1;

  &::placeholder {
    color: #999;
  }
`;

class AmountTextfield extends React.Component<Props> {
  public render = () => {
    const {disabled, token, value, onChange, ...restProps} = this.props;

    return (
      <AmountTextfieldWrapper disabled={disabled} {...restProps}>
        <MaxButton>Max</MaxButton>
        <ValueInput placeholder="0.0000" disabled={disabled} value={value} onChange={onChange} />
        <TokenName>{token}</TokenName>
      </AmountTextfieldWrapper>
    );
  };
}

export default AmountTextfield;
