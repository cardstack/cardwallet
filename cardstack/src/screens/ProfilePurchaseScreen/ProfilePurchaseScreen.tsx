import React, { memo } from 'react';
import { StatusBar } from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  HorizontalDivider,
} from '@cardstack/components';
import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';

const ProfilePurchaseScreen = () => {
  const {
    products,
    iapAvailable,
    purchaseProduct,
    fakeTestPurchase,
  } = usePurchaseProfile();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <CenteredContainer flex={1} width="100%">
        {iapAvailable &&
          products.map(product => (
            <Container paddingBottom={4}>
              <Button onPress={() => purchaseProduct(product)}>
                Buy {product.title} for {product.price}
              </Button>
            </Container>
          ))}
        <HorizontalDivider />
        <Button onPress={fakeTestPurchase}>Fake call purchase</Button>
      </CenteredContainer>
    </>
  );
};

export default memo(ProfilePurchaseScreen);
