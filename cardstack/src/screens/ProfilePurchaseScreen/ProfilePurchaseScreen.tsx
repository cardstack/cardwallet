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
          <CardPressable onPress={onPressBusinessColor} position="relative">
            <Text paddingLeft={10} {...InputCommonProps}>
              {profile?.color}
            </Text>
            <Container
              width={30}
              height={30}
              borderRadius={4}
              backgroundColor="white"
              borderWidth={1}
              borderColor="buttonSecondaryBorder"
              justifyContent="center"
              alignItems="center"
              position="absolute"
              left={4}
              top={8}
            >
              <Container
                width={20}
                height={20}
                style={{ backgroundColor: profile?.color }}
              />
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
        <Button onPress={() => fakeTestPurchase()}>Fake call purchase</Button>
      </CenteredContainer>
    </>
  );
};

export default memo(ProfilePurchaseScreen);
