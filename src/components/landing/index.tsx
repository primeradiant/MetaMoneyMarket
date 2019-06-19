import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import MyAccount from '../my-account';
import Button from '../common/Button';

import { themeColors } from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {}

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
  margin-bottom: 20px;
`;

const BigButton = styled(Button)`
  height: 45px;
  font-size: 21px;
`;

const InfoText = styled.p<{ textAlign?: string }>`
  color: ${themeColors.secondaryTextColor};
  font-size: 20px;
  font-weight: 600;
  line-height: 1.35;
  margin: 0 auto 50px;
  text-align: ${props => props.textAlign};
`;

const InfoTextMaxWidth = styled(InfoText)`
  max-width: 780px;
`;

InfoText.defaultProps = {
  textAlign: 'center'
};

const MyAccountStyled = styled(MyAccount)`
  margin: 0 0 55px;
`;

const HomeTitle = styled.h2`
  color: ${themeColors.tertiaryTextColor};
  font-size: 24px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 10px;
`;

const Landing: React.FC<Props> = (props: Props) => {
  return (
    <>
      <WelcomeText>Welcome to Sovereign!</WelcomeText>
      <MainText>Your Personal Bank</MainText>
      <ButtonContainer>
        <BigButton onClick={() => alert(123)}>Start Now!</BigButton>
      </ButtonContainer>
      <InfoTextMaxWidth>
        Similique sunt in culpa qui officia deserunt mollitia animi. Similique sunt in culpa qui officia deserunt
        mollitia animi similique sunt in culpa qui officia…
      </InfoTextMaxWidth>
      <MyAccountStyled />
      <HomeTitle>Why <strong>Sovereign?</strong></HomeTitle>
      <InfoText textAlign="left">Similique sunt in culpa qui officia deserunt mollitia animi.</InfoText>
    </>
  );
};

export default Landing;
