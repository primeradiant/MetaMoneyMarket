import React, {HTMLAttributes} from 'react';
import styled from 'styled-components';

import {themeColors, themeDimensions} from '../../util/constants';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  disabled?: boolean;
}

const ButtonContainer = styled.button`
  align-items: center;
  background-color: ${themeColors.primaryColor};
  border-radius: ${themeDimensions.commonBorderRadius};
  border: none;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12);
  color: ${themeColors.primaryButtonColor};
  cursor: pointer;
  display: flex;
  font-size: 17px;
  font-weight: 600;
  height: 40px;
  justify-content: center;
  outline: none;
  padding: 0 25px;
  text-align: center;
  transition: box-shadow 0.15s ease-out;
  white-space: nowrap;

  &:hover {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
  }

  &[disabled] {
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Button: React.FC<Props> = (props: Props) => {
  const {children, ...restProps} = props;

  return <ButtonContainer {...restProps}>{children}</ButtonContainer>;
};

export default Button;
