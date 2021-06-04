import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { CoinIcon } from '../coin-icon';
import { JellySelector } from '../jelly-selector';
import { RowWithMargins } from '../layout';
import { Text } from '../text';

import { Container } from '@cardstack/components';

import { useAccountSettings } from '@rainbow-me/hooks';
import { getTokenMetadata } from '@rainbow-me/utils';

const CurrencyItemHeight = 40;

const CurrencyItemLabel = styled(Text).attrs(({ theme: { colors } }) => ({
  color: colors.blueGreyDark,
  letterSpacing: 'roundedMedium',
  size: 'larger',
  weight: 'bold',
}))`
  opacity: ${({ isSelected, theme: { isDarkMode } }) =>
    isSelected ? (isDarkMode ? 1 : 0.8) : 0.5};
  padding-bottom: 1.5;
`;

// eslint-disable-next-line react/display-name
const CurrencyItem = (isWalletEthZero, nativeTokenAddress) => ({
  item: address,
  isSelected,
}) => {
  const metadata = getTokenMetadata(address);

  return (
    <Container
      alignItems="center"
      borderColor="buttonSecondaryBorder"
      borderRadius={50}
      borderWidth={isSelected ? 1 : 0}
      flexDirection="row"
      height={CurrencyItemHeight}
      opacity={isWalletEthZero && address !== nativeTokenAddress ? 0.5 : 1}
      paddingHorizontal={4}
    >
      <CoinIcon
        address={address}
        marginRight={5}
        size={26}
        symbol={metadata?.symbol}
      />
      <CurrencyItemLabel isSelected={isSelected}>
        {metadata?.name}
      </CurrencyItemLabel>
    </Container>
  );
};

const CurrencyItemRow = props => (
  <RowWithMargins justify="center" margin={8} maxWidth={300} {...props} />
);

const AddCashSelector = ({
  currencies,
  initialCurrencyIndex,
  isWalletEthZero,
  onSelect,
}) => {
  const { isDarkMode, colors } = useTheme();
  const { network } = useAccountSettings();
  const nativeTokenAddress = getConstantByNetwork(
    'nativeTokenAddress',
    network
  );
  return (
    <JellySelector
      backgroundColor={isDarkMode ? colors.darkModeDark : colors.white}
      defaultIndex={initialCurrencyIndex}
      disableSelection={isWalletEthZero}
      height={CurrencyItemHeight}
      items={currencies}
      onSelect={onSelect}
      // renderIndicator={JellySelectorShadowIndicator}
      renderItem={CurrencyItem(isWalletEthZero, nativeTokenAddress)}
      renderRow={CurrencyItemRow}
    />
  );
};

const neverRerender = () => true;
export default React.memo(AddCashSelector, neverRerender);
