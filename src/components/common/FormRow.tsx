import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeColors } from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {
  valueColor?: string;
  text: string;
  value: string;
}

export const FormRowsContainer = styled.div`
  margin-bottom: 28px;
`;

const FormRowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 3px;
  padding: 8px 10px;

  &:nth-child(odd) {
    background-color: #f5f5f5;
  }
`;

const FormRowText = styled.div`
  color: ${themeColors.secondaryTextColor};
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
`;

const FormRowValue = styled.div<{ color?: string }>`
  color: ${props => props.color};
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  text-align: right;
`;

FormRowValue.defaultProps = {
  color: themeColors.secondaryTextColor,
};

const FormRow: React.FC<Props> = (props: Props) => {
  const { text, value, valueColor, ...restProps } = props;

  return (
    <FormRowWrapper {...restProps}>
      <FormRowText>{text}</FormRowText>
      <FormRowValue color={valueColor}>{value}</FormRowValue>
    </FormRowWrapper>
  );
};

export default FormRow;
