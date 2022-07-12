import React, { memo } from 'react';
import { StatusBar } from 'react-native';

import {
  Text,
  Input,
  Button,
  CenteredContainer,
  Container,
} from '@cardstack/components';
import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';
import { ColorTypes } from '@cardstack/theme';

const InputCommonProps = {
  borderRadius: 6,
  paddingVertical: 3,
  paddingHorizontal: 5,
  fontSize: 16,
  borderWidth: 1,
  fontWeight: 'bold' as any,
  color: 'grayCardBackground' as ColorTypes,
  spellCheck: false,
  autoCorrect: false,
  blurOnSubmit: false,
};

const ProfilePurchaseScreen = () => {
  const {
    iapAvailable,
    products,
    purchaseProduct,
    profile,
    updateProfileInfo,
  } = usePurchaseProfile();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <CenteredContainer flex={1}>
        <Text>Slug:</Text>
        <Input
          textContentType="name"
          borderColor="buttonSecondaryBorder"
          value={profile?.slug}
          onChange={updateProfileInfo}
          returnKeyType="next"
          {...InputCommonProps}
        />
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
