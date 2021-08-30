import { useRoute } from '@react-navigation/core';
import { BlurView, VibrancyView } from '@react-native-community/blur';
import React from 'react';
import CardstackColorLogo from '../assets/cardstackColorLogo.png';
import {
  Container,
  QRCode,
  SafeAreaView,
  SheetHandle,
  Text,
} from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { useDimensions } from '@rainbow-me/hooks';
import { shadow } from '@rainbow-me/styles';

type ShowQRCodeModalParamTypes = {
  value: string;
  amountWithSymbol: string;
  amountInSpend: number;
  name: string | undefined;
};

const ShowQRCodeModal = () => {
  const {
    params: { value, amountInSpend, amountWithSymbol, name },
  } = useRoute() as { params: ShowQRCodeModalParamTypes };

  const { width } = useDimensions();
  const BlurViewWrapper = ios ? VibrancyView : BlurView;

  return (
    <SafeAreaView flex={1} width="100%" backgroundColor="transparent">
      <BlurViewWrapper
        blurType="light"
        blurAmount={100}
        blurRadius={25}
        downsampleFactor={10}
        reducedTransparencyFallbackColor="black"
        overlayColor={colors.overlayGray}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      />
      <Container
        alignItems="center"
        minHeight="100%"
        flexDirection="column"
        width="100%"
        justifyContent="center"
        backgroundColor="transparent"
      >
        <Container
          width="100%"
          height="auto"
          alignItems="center"
          backgroundColor="transparent"
          paddingBottom={15}
        >
          <SheetHandle color="white" opacity={1} />
          <Container
            width="100%"
            paddingHorizontal={10}
            marginTop={7}
            alignItems="center"
          >
            <Container
              width="100%"
              padding={4}
              backgroundColor="white"
              borderRadius={20}
              alignItems="center"
              style={shadow.buildAsObject(0, 20, 20, 'rgba(0, 0, 0, 0.25)', 1)}
            >
              <QRCode
                size={width - 112}
                value={value}
                logoMargin={12}
                logoBorderRadius={6}
                logo={CardstackColorLogo}
                quietZone={4}
              />
            </Container>
            <Container marginTop={10} alignItems="center" width="100%">
              <Text size="large" letterSpacing={0.39} color="white">
                Scan to pay
              </Text>
              <Text
                size="large"
                letterSpacing={0.39}
                color="white"
                fontWeight="bold"
              >
                {amountWithSymbol}
              </Text>
              <Text size="xs" color="underlineGray" fontWeight="600">
                {`§${amountInSpend} SPEND`}
              </Text>
              <Text
                size="large"
                letterSpacing={0.39}
                color="white"
                marginTop={5}
              >
                {`to ${name}`}
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </SafeAreaView>
  );
};

export default ShowQRCodeModal;
