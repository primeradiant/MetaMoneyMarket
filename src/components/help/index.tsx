import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {}

const HelpContainer = styled.div``;

const Help: React.FC<Props> = (props: Props) => {
  const { ...restProps } = props;

  return <HelpContainer {...restProps}>Help.</HelpContainer>;
};

export default Help;
