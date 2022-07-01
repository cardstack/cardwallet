import React, { memo } from 'react';
import { StatusBar } from 'react-native';

import { Button, CenteredContainer, Container } from '@cardstack/components';
import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';

const ProfilePurchaseScreen = () => {
  const { iapAvailable, products, purchaseProduct } = usePurchaseProfile();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <CenteredContainer flex={1}>
        {iapAvailable &&
          products.map(product => (
            <Container paddingBottom={4}>
              <Button onPress={() => purchaseProduct(product)}>
                Buy {product.title} for {product.price}
              </Button>
            </Container>
          ))}
      </CenteredContainer>
    </>
  );
};

export default memo(ProfilePurchaseScreen);
