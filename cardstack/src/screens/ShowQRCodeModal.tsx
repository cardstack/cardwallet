import { useRoute } from '@react-navigation/core';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import CardstackColorLogo from '../assets/cardstackColorLogo.png';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import {
  Touchable,
  Container,
  QRCode,
  Sheet,
  Text,
} from '@cardstack/components';
import { MerchantInformation } from '@cardstack/types';
import { colors } from '@cardstack/theme';
import { useDimensions } from '@rainbow-me/hooks';
import { hitSlop } from '@cardstack/utils/layouts';

type ShowQRCodeModalParamTypes = {
  value: string;
  amountWithSymbol: string;
  merchantInfo?: MerchantInformation;
  hasAmount?: boolean;
  backToEditMode?: () => void;
};

export const AmountQRCode = ({
  value,
  amountWithSymbol,
  merchantInfo,
  hasAmount,
  backToEditMode,
}: ShowQRCodeModalParamTypes) => {
  const { width } = useDimensions();
  const QRCodeSize = Math.round(width - 160);
  const { goBack } = useNavigation();

  const goBackToEditAmount = useCallback(() => {
    backToEditMode && backToEditMode();
    goBack();
  }, [goBack, backToEditMode]);

  const [isFocus, setFocus] = useState(false);
  const [isQRCodeRendering, setQRCodeState] = useState(true);
  const onQRCodeRendered = useCallback(() => setQRCodeState(false), []);
  useFocusEffect(
    useCallback(() => {
      setFocus(true);

      return () => setFocus(false);
    }, [])
  );

  return (
    <Container flex={1} alignItems="center">
      <Container
        flex={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Container alignItems="center">
          <Text size="body" color="black" fontWeight="bold" marginTop={4}>
            Scan to Pay
          </Text>
        </Container>
        <Container alignItems="center">
          {merchantInfo && (
            <ContactAvatar
              color={merchantInfo.color}
              size="xlarge"
              value={merchantInfo.name}
              textColor={merchantInfo.textColor}
            />
          )}
          {merchantInfo?.name ? (
            <Text
              size="medium"
              color="black"
              weight="bold"
              marginTop={2}
              textAlign="center"
            >
              {merchantInfo.name}
            </Text>
          ) : null}
          {hasAmount ? (
            <>
              {amountWithSymbol ? (
                <Text
                  size="largeBalance"
                  color="black"
                  fontWeight="bold"
                  marginTop={4}
                >
                  {amountWithSymbol}
                </Text>
              ) : null}
            </>
          ) : null}
          <Touchable
            borderColor="grayText"
            borderRadius={15}
            borderWidth={1}
            height={30}
            hitSlop={hitSlop.small}
            onPress={goBackToEditAmount}
            paddingHorizontal={4}
            marginTop={4}
          >
            <Text size="xxs" weight="bold" lineHeight={29}>
              Edit amount
            </Text>
          </Touchable>
        </Container>
      </Container>
      <Container alignItems="center" flex={1} paddingTop={8}>
        <Container
          backgroundColor="white"
          alignItems="center"
          justifyContent="center"
          borderRadius={40}
          width={QRCodeSize + 50}
          height={QRCodeSize + 50}
        >
          {isFocus && (
            <QRCode
              size={QRCodeSize}
              data={value}
              logo={CardstackColorLogo}
              logoWidth={34}
              logoHeight={36}
              onRenderingEnd={onQRCodeRendered}
            />
          )}
          {isQRCodeRendering && (
            <Container position="absolute">
              <ActivityIndicator size="large" color={colors.blueText} />
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  );
};

const ShowQRCodeModal = () => {
  const { params } = useRoute() as { params: ShowQRCodeModalParamTypes };

  return (
    <Sheet isFullScreen cardBackgroundColor={colors.grayCardBackground}>
      <AmountQRCode {...params} />
    </Sheet>
  );
};

export default ShowQRCodeModal;
