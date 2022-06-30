import React, { memo } from 'react';
import { StatusBar } from 'react-native';

import { Button, Container } from '@cardstack/components';
import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';

const ProfilePurchaseScreen = () => {
  const { iapAvailable, products, purchaseProduct } = usePurchaseProfile();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Container flex={1} alignItems="center">
        {iapAvailable &&
          products.map(product => (
            <Button onPress={() => purchaseProduct(product)}>
              Buy {product.title} for {product.price}
            </Button>
          ))}
      </Container>
    </>
  );
};

export default memo(ProfilePurchaseScreen);
