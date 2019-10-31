import React, {HTMLAttributes, useState} from 'react';
import {Button, Card, Flex, Text} from 'rebass';
import {useWeb3Context} from 'web3-react';
import {getTokenDataBySymbol} from '../common/img/token-icons';
import {useHistory} from 'react-router-dom';
import {LoginModal} from '../login';
import {RebassTable, RebassTbody, RebassTd, RebassTh, RebassThead, RebassTr} from '../ui/Table';
import TokenIcon from '../ui/TokenIcon';

const TableLoading = () => (
  <>
    {Array(3)
      .fill('')
      .map((el, i) => (
        <RebassTr key={i}>
          {Array(4)
            .fill('')
            .map((el, i) => (
              <RebassTd key={i}>
                {i === 3 ? (
                  <Flex justifyContent="flex-end">
                    <Text color="muted">—</Text>
                  </Flex>
                ) : (
                  <Text color="muted">—</Text>
                )}
              </RebassTd>
            ))}
        </RebassTr>
      ))}
  </>
);

interface Props extends HTMLAttributes<HTMLDivElement> {
  marketsData: Markets;
}

const AssetTable: React.FC<Props> = (props: Props) => {
  const {marketsData} = props;

  const context = useWeb3Context();

  const {history} = useHistory();

  const [loginModalIsOpen, setModalIsOpen] = useState(false);

  const openLoginModal = () => {
    if (context.account) {
      history.push('/my-account');
    }
    setModalIsOpen(true);
  };

  const closeLoginModal = () => setModalIsOpen(false);

  return (
    <Card p={['8px 14px', '16px 30px']} sx={{overflowX: 'auto'}}>
      <RebassTable sx={{minWidth: 580, tableLayout: 'auto'}}>
        <RebassThead>
          <RebassTr>
            <RebassTh width={0.2}>Asset</RebassTh>
            <RebassTh width={0.15}>Price</RebassTh>
            <RebassTh width={0.15}>Interest Rate</RebassTh>
            <RebassTh width={0.2}>&nbsp;</RebassTh>
          </RebassTr>
        </RebassThead>
        <RebassTbody>
          {marketsData.length === 0 && <TableLoading />}
          {marketsData.map((market, index) => {
            const tokenData = getTokenDataBySymbol(market.symbol);
            const image = tokenData ? tokenData.image : '';
            return (
              <RebassTr key={index}>
                <RebassTd>
                  <Flex alignItems="center" justifyContent="flex-start">
                    <TokenIcon mr={3} image={image} />
                    <strong>{market.symbol}</strong>
                  </Flex>
                </RebassTd>
                <RebassTd>${market.price}</RebassTd>
                <RebassTd>Earn {market.interestRate}%</RebassTd>
                <RebassTd>
                  <Flex justifyContent="flex-end">
                    <Button onClick={openLoginModal} variant="text" py={2} fontSize={2}>
                      Start Earning
                    </Button>
                  </Flex>
                </RebassTd>
              </RebassTr>
            );
          })}
        </RebassTbody>
      </RebassTable>
      <LoginModal isOpen={loginModalIsOpen} onRequestClose={closeLoginModal} />
    </Card>
  );
};

export default AssetTable;
