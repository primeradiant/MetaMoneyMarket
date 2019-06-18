import React from 'react';
import styled from 'styled-components';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const LandingContainer = styled.div``;

const Landing = (props: Props) => {
  const { children, ...restProps } = props;

  return <LandingContainer {...restProps}>
    <p>Landing!</p>
  </LandingContainer>;
};

export default Landing;
