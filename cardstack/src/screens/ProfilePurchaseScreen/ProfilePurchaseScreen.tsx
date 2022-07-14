import React, { memo } from 'react';
import { StatusBar } from 'react-native';

import {
  Button,
  CardPressable,
  CenteredContainer,
  Container,
  Text,
  Input,
} from '@cardstack/components';
import { usePurchaseProfile } from '@cardstack/hooks/usePurchaseProfile';
import { ColorTypes } from '@cardstack/theme';
import { Device } from '@cardstack/utils';

const InputCommonProps = {
  borderRadius: 6,
  paddingVertical: 3,
  paddingHorizontal: 5,
  marginBottom: 2,
  fontSize: 16,
  borderWidth: 1,
  fontWeight: 'bold' as any,
  color: 'black' as ColorTypes,
  spellCheck: false,
  autoCorrect: false,
  blurOnSubmit: false,
  borderColor: 'buttonSecondaryBorder' as ColorTypes,
};

const ProfilePurchaseScreen = () => {
  const {
    iapAvailable,
    products,
    purchaseProduct,
    profile,
    updateProfileInfo,
    fakeTestPurchase,
    onPressBusinessColor,
  } = usePurchaseProfile();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <CenteredContainer flex={1} width="100%">
        <Container padding={4} width="100%">
          <Text>Slug:</Text>
          <Input
            textContentType="username"
            value={profile?.slug}
            onChange={e =>
              updateProfileInfo({
                slug: e.nativeEvent.text,
              })
            }
            returnKeyType="next"
            {...InputCommonProps}
          />
          <Text>Name:</Text>
          <Input
            textContentType="name"
            value={profile?.name}
            onChange={e =>
              updateProfileInfo({
                name: e.nativeEvent.text,
              })
            }
            returnKeyType="next"
            {...InputCommonProps}
          />
          <Text>Color:</Text>
          <CardPressable onPress={onPressBusinessColor} position="relative">
            <Container
              borderRadius={6}
              borderWidth={1}
              borderColor="buttonSecondaryBorder"
              justifyContent="center"
              alignItems="center"
              style={{ backgroundColor: profile?.color }}
            >
              <Text
                paddingVertical={4}
                style={{ color: profile?.['text-color'] }}
              >
                {profile?.color}
              </Text>
            </Container>
          </CardPressable>
        </Container>
        {iapAvailable &&
          products.map(product => (
            <Container paddingBottom={4}>
              <Button onPress={() => purchaseProduct(product)}>
                Buy {product.title} for {product.price}
              </Button>
            </Container>
          ))}
        <Container
          width="100%"
          height={2}
          backgroundColor="grayBackground"
          marginBottom={4}
        />
        {Device.isAndroid && (
          <Button onPress={() => fakeTestPurchase()}>Fake call purchase</Button>
        )}
      </CenteredContainer>
    </>
  );
};

export default memo(ProfilePurchaseScreen);
