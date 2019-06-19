import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import Button from '../common/Button';
import Card from '../common/card';
import MyAccount from '../my-account';

import { themeColors, themeBreakPoints } from '../../util/constants';

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
  margin: 0 auto 40px;
  text-align: ${props => props.textAlign};
`;

const InfoTextMaxWidth = styled(InfoText)`
  max-width: 780px;
`;

InfoText.defaultProps = {
  textAlign: 'center',
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

const InfoBlocks = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 15px;

  @media (min-width: ${themeBreakPoints.xxl}) {
    column-gap: 15px;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const InfoBlockText = styled.div`
  color: ${themeColors.secondaryTextColor};
  font-size: 16px;
  font-weight: normal;
  line-height: 1.38;
  padding-top: 10px;

  a {
    color: ${themeColors.linkColor};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
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
      <HomeTitle>
        Why <strong>Sovereign?</strong>
      </HomeTitle>
      <InfoText textAlign="left">Similique sunt in culpa qui officia deserunt mollitia animi.</InfoText>
      <InfoBlocks>
        <Card title="Title 1">
          <InfoBlockText>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,{' '}
            <a href="https://google.com">similique sunt in</a> culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
          </InfoBlockText>
        </Card>
        <Card title="Title 2">
          <InfoBlockText>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, culpa qui
            officia deserunt mollitia animi, id est laborum et dolorum fuga.
          </InfoBlockText>
        </Card>
        <Card title="Title 3">
          <InfoBlockText>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, culpa qui
            officia deserunt mollitia animi, id est laborum et dolorum fuga.
          </InfoBlockText>
        </Card>
      </InfoBlocks>
    </>
  );
};

export default Landing;
