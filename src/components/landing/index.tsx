import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import AccountBalance from '../account-balance';
import Button from '../common/Button';
import CurrentAmount from '../current-amount';

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

const InfoText = styled.p`
  color: ${themeColors.secondaryTextColor};
  font-size: 20px;
  font-weight: 600;
  line-height: 1.35;
  margin: 0 auto 40px;
  max-width: 780px;
  text-align: center;
`;

const CurrentAmountStyled = styled(CurrentAmount)`
  margin: 0 auto 55px;
  max-width: 100%;
  width: 370px;
`;

const AccountBalanceStyled = styled(AccountBalance)`
  margin: 0 0 55px;
`;

const Landing: React.FC<Props> = (props: Props) => {
  return (
    <>
      <WelcomeText>Welcome to Sovereign!</WelcomeText>
      <MainText>Your Personal Bank</MainText>
      <ButtonContainer>
        <BigButton onClick={() => alert(123)}>Start Now!</BigButton>
      </ButtonContainer>
      <InfoText>
        Similique sunt in culpa qui officia deserunt mollitia animi. Similique sunt in culpa qui officia deserunt
        mollitia animi similique sunt in culpa qui officia…
      </InfoText>
      <CurrentAmountStyled />
      <AccountBalanceStyled />
    </>
  );
};

export default Landing;
