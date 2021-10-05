import { useRoute } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import CardstackColorLogo from '../assets/cardstackColorLogo.png';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import {
  Touchable,
  Container,
  QRCode,
  SafeAreaView,
  SheetHandle,
  Text,
} from '@cardstack/components';
import { MerchantInformation } from '@cardstack/types';
import { useDimensions } from '@rainbow-me/hooks';
import { hitSlop } from '@cardstack/utils/layouts';

const StatusBarHeight = getStatusBarHeight(true);

type ShowQRCodeModalParamTypes = {
  value: string;
  amountWithSymbol: string;
  amountInAnotherCurrency: string;
  merchantInfo?: MerchantInformation;
  hasAmount?: boolean;
};

export const AmountQRCode = ({
  value,
  amountWithSymbol,
  amountInAnotherCurrency,
  merchantInfo,
  hasAmount,
}: ShowQRCodeModalParamTypes) => {
  const { width } = useDimensions();
  const QRCodeSize = width - 140;
  const { goBack } = useNavigation();

  const goBackToEditAmount = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <Container
      flex={1}
      alignItems="center"
      backgroundColor="grayCardBackground"
      borderRadius={20}
      borderWidth={1}
      borderColor="whiteOverlay"
    >
      <Container
        flex={1}
        flexDirection="column"
        alignItems="center"
        paddingTop={4}
      >
        <SheetHandle />
        <Text size="body" color="black" marginTop={7} fontWeight="bold">
          Scan to Pay
        </Text>
        {merchantInfo && (
          <Container marginTop={12}>
            <ContactAvatar
              color={merchantInfo.color}
              size="xlarge"
              value={merchantInfo.name}
              textColor={merchantInfo.textColor}
            />
          </Container>
        )}
        {merchantInfo?.name ? (
          <Text size="medium" color="black" marginTop={3} textAlign="center">
            {merchantInfo.name}
          </Text>
        ) : null}
        {hasAmount ? (
          <>
            {amountWithSymbol ? (
              <Text size="xl" color="black" fontWeight="bold" marginTop={4}>
                {amountWithSymbol}
              </Text>
            ) : null}
            {amountInAnotherCurrency ? (
              <Text size="medium" color="blueText">
                {amountInAnotherCurrency}
              </Text>
            ) : null}
          </>
        ) : null}
        <Container
          flexGrow={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Touchable
            borderColor="grayText"
            borderRadius={15}
            borderWidth={1}
            height={30}
            hitSlop={hitSlop.small}
            onPress={goBackToEditAmount}
            paddingHorizontal={4}
          >
            <Text size="xxs" weight="bold" lineHeight={29}>
              Edit amount
            </Text>
          </Touchable>
        </Container>
      </Container>
      <Container alignItems="center" flex={1}>
        <Container
          padding={5}
          backgroundColor="white"
          alignItems="center"
          borderRadius={40}
        >
          <QRCode
            size={QRCodeSize}
            value={value}
            logoMargin={14}
            logoBorderRadius={7}
            logo={CardstackColorLogo}
          />
        </Container>
      </Container>
    </Container>
  );
};

const ShowQRCodeModal = () => {
  const { params } = useRoute() as { params: ShowQRCodeModalParamTypes };

  return (
    <SafeAreaView
      flex={1}
      width="100%"
      backgroundColor="transparent"
      paddingTop={Math.round(StatusBarHeight / 4)}
    >
      <AmountQRCode {...params} />
    </SafeAreaView>
  );
};

export default ShowQRCodeModal;
