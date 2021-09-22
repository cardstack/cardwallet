import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import PrepaidCardInnerTop, {
  PrepaidCardInnerTopProps,
} from './components/PrepaidCardInnerTop';
import PrepaidCardInnerBottom, {
  PrepaidCardInnerBottomProps,
} from './components/PrepaidCardInnerBottom';
import { Container } from '@cardstack/components';
import { CustomizableBackground } from '@cardstack/components/PrepaidCard/components/CustomizableBackground';

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderRadius: 10,
  },
});

const MediumPrepaidCard = ({
  cardCustomization,
  address,
  networkName,
  spendFaceValue,
  reloadable,
  nativeCurrency,
  currencyConversionRates,
  transferrable,
}: Omit<
  PrepaidCardInnerTopProps & PrepaidCardInnerBottomProps,
  'variant' | 'disabled'
>) => (
  <Container
    style={styles.cardWrapper}
    shadowColor="overlay"
    borderColor="whiteOverlay"
  >
    <Container borderRadius={10} overflow="hidden">
      <CustomizableBackground
        cardCustomization={cardCustomization}
        address={address}
        isEditing={false}
        variant="medium"
      />
      <PrepaidCardInnerTop
        address={address}
        cardCustomization={cardCustomization}
        networkName={networkName}
        variant="medium"
        disabled
      />
      <PrepaidCardInnerBottom
        spendFaceValue={spendFaceValue}
        reloadable={reloadable}
        nativeCurrency={nativeCurrency}
        currencyConversionRates={currencyConversionRates}
        transferrable={transferrable}
        variant="medium"
      />
    </Container>
  </Container>
);

export default memo(MediumPrepaidCard);
