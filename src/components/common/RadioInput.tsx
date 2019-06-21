import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface OwnProps {
  checked?: boolean;
}

interface Props extends HTMLAttributes<HTMLDivElement>, OwnProps {}

const RadioWrapper = styled.div``;

const RadioContainer = styled.div``;

const RadioInput: React.FC<Props> = (props: Props) => {
  const { checked, ...restProps } = props;

  return (
    <RadioWrapper {...restProps}>
      <input type="radio" checked={checked} />
    </RadioWrapper>
  );
};

export default RadioInput;
