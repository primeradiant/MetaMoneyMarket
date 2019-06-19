import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeColors, themeDimensions } from '../../util/constants';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  disabled?: boolean;
}

const ButtonContainer = styled.button`
  align-items: center;
  background-color: #fff;
  border-radius: ${themeDimensions.commonBorderRadius};
  border: 1px solid ${themeColors.primaryColor};
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.05);
  color: ${themeColors.primaryColor};
  cursor: pointer;
  display: flex;
  font-size: 11px;
  font-weight: 600;
  height: 23px;
  justify-content: center;
  outline: none;
  padding: 0 20px;
  text-align: center;
  transition: box-shadow 0.15s ease-out;
  white-space: nowrap;

  &:hover {
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ButtonLine: React.FC<Props> = (props: Props) => {
  const { children, ...restProps } = props;

  return (
    <ButtonContainer {...restProps}>
      {children}
    </ButtonContainer>
  );
};

export default ButtonLine;
