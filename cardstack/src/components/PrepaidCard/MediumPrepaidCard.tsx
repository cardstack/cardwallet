import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import { Container } from '@cardstack/components';
import { CustomizableBackground } from '@cardstack/components/PrepaidCard/components/CustomizableBackground';

import PrepaidCardInnerBottom, {
  PrepaidCardInnerBottomProps,
} from './components/PrepaidCardInnerBottom';
import PrepaidCardInnerTop, {
  PrepaidCardInnerTopProps,
} from './components/PrepaidCardInnerTop';

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
    elevation: 2,
  },
});

const MediumPrepaidCard = ({
  cardCustomization,
  address,
  networkName,
  nativeBalance,
  nativeCurrencyInfo,
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
        nativeBalance={nativeBalance}
        nativeCurrencyInfo={nativeCurrencyInfo}
        transferrable={transferrable}
        variant="medium"
      />
    </Container>
  </Container>
);

export default memo(MediumPrepaidCard);
