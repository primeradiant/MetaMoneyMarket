import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router-dom';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const LandingContainer = styled.div`

`;

const Landing = (props: Props) => {
  const { children, ...restProps } = props;

  return <LandingContainer {...restProps}>
    <p>Landing!</p>
    <Link to="/help">Help!</Link>
  </LandingContainer>;
};

export default Landing;
