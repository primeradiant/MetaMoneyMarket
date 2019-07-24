import React, {HTMLAttributes, useContext, useState} from 'react';
import styled from 'styled-components';
import {useWeb3Context} from 'web3-react';

import {ContractsContext} from '../../context/contracts';
import Button from '../common/Button';
import Card from '../common/card';
import MyAccount from '../my-account';

import {LoginModal} from '../login';

import {themeBreakPoints, themeColors} from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {}

interface State {
  modalIsOpen: boolean;
}

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
  margin: 0 auto 45px;
  max-width: 1000px;
  text-align: center;
`;

const InfoTextMaxWidth = styled(InfoText)`
  margin-bottom: 60px;
  max-width: 780px;
  text-align: center;
`;

const MyAccountStyled = styled(MyAccount)`
  margin: 0 0 55px;
`;

const HomeTitle = styled.h2`
  color: ${themeColors.tertiaryTextColor};
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 10px;
  text-align: center;
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

const MailChimpForm = () => (
  <div
    id="mc_embed_signup"
    style={{clear: 'left', font: '14px Helvetica,Arial,sans-serif', width: '100%', marginBottom: '2rem'}}
  >
    <form
      action="https://gmail.us3.list-manage.com/subscribe/post?u=62a77ff46a9469711efebfd67&amp;id=1b6a93db6d"
      method="post"
      id="mc-embedded-subscribe-form"
      name="mc-embedded-subscribe-form"
      className="validate"
      target="_blank"
      noValidate={true}
    >
      <div id="mc_embed_signup_scroll">
        <input
          type="email"
          value=""
          name="EMAIL"
          className="email"
          id="mce-EMAIL"
          placeholder="Sign up to get early access"
          required={true}
        />
        <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
          <input type="text" name="b_62a77ff46a9469711efebfd67_1b6a93db6d" tabIndex={-1} value="" />
        </div>
        <div className="clear">
          <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
        </div>
      </div>
    </form>
  </div>
);

const Landing: React.FC<Props> = (props: Props) => {
  const context = useWeb3Context();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const {marketsData} = useContext(ContractsContext);

  return (
    <>
      <WelcomeText>Welcome to Sovereign!</WelcomeText>
      <MainText>Maximize your crypto gains</MainText>

      <MailChimpForm />

      {!context.account && (
        <ButtonContainer>
          <BigButton onClick={openModal}>Start Now!</BigButton>
        </ButtonContainer>
      )}
      <MyAccountStyled marketsData={marketsData} />

      <HomeTitle>How it works?</HomeTitle>
      <InfoText>
        Instead of manually moving money around burning fees chasing the optimal interest rate. Deposit your tokens into
        the MetaMoneyMarket, and the smart contract will automatically deposit into the highest yielding Money Market,
        periodically rebalancing for you when rates change.
      </InfoText>

      <InfoBlocks>
        <Card title="Best Rate">
          <InfoBlockText>
            By combining multiple markets into one, you get the best rate for a wider number of tokens than any
            contract.
          </InfoBlockText>
        </Card>
        <Card title="Meta Tokens">
          <InfoBlockText>
            You will receive a Token which represents your balance on deposit. Which you can then use in other DeFi
            Protocols.
          </InfoBlockText>
        </Card>
        <Card title="Auto Rebalance">
          <InfoBlockText>
            If you rebalanced 1x a day for a year, you'd burn 43% of a $100 deposit. MMM is only ~0.3%.
          </InfoBlockText>
        </Card>
      </InfoBlocks>
      <LoginModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    </>
  );
};

export default Landing;
