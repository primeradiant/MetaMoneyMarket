import React from 'react';
import styled from 'styled-components';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const HelpContainer = styled.div`

`;

const Help = (props: Props) => {
  const { children, ...restProps } = props;

  return <HelpContainer {...restProps}>
    Help!
  </HelpContainer>;
};

export default Help;
