import React from 'react';
import styled from 'styled-components';

import Button from '../common/Button';

import { themeColors } from '../util/constants';

const WelcomeText = styled.h2`
  color: ${themeColors.baseTextColor};
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 10px;
  text-align: center;
`;

const MainText = styled.h1`
  color: ${themeColors.baseTextColor};
  font-size: 46px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 35px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
`;

const BigButton = styled(Button)`
  height: 45px;
  font-size: 21px;
`;



const Landing: React.FC = () => {
  return <>
    <WelcomeText>Welcome to Sovereign!</WelcomeText>
    <MainText>Your Personal Bank</MainText>
    <ButtonContainer>
      <BigButton onClick={() => alert(123)}>Start Now!</BigButton>
    </ButtonContainer>

  </>;
};

export default Landing;
