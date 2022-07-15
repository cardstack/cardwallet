import React, { memo } from 'react';
import { StatusBar, ActivityIndicator } from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  HorizontalDivider,
  Text,
} from '@cardstack/components';
import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';

const ProfilePurchaseScreen = () => {
  const {
    products,
    iapAvailable,
    purchaseProduct,
    fakeTestPurchase,
    isLoadingProducts,
    isProcessingReceipt,
  } = usePurchaseProfile();

  console.log({ isProcessingReceipt });

  return (
    <>
      <StatusBar barStyle="light-content" />
      <CenteredContainer flex={1} width="100%">
        {isLoadingProducts || !iapAvailable ? (
          <>
            <ActivityIndicator />
            <Text>Loading products</Text>
          </>
        ) : (
          products.map(product => (
            <Container paddingBottom={4}>
              <Button
                loading={isProcessingReceipt}
                onPress={() => purchaseProduct(product)}
              >
                Buy {product.title} for {product.price}
              </Button>
            </Container>
          ))
        )}
        <HorizontalDivider />
        <Button loading={isProcessingReceipt} onPress={fakeTestPurchase}>
          Fake call purchase
        </Button>
      </CenteredContainer>
    </>
  );
};

export default memo(ProfilePurchaseScreen);
