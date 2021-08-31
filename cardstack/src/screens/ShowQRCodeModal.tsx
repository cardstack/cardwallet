import { useRoute } from '@react-navigation/core';
import React from 'react';
import CardstackColorLogo from '../assets/cardstackColorLogo.png';
import {
  Container,
  QRCode,
  SafeAreaView,
  SheetHandle,
  Text,
} from '@cardstack/components';
import { useDimensions } from '@rainbow-me/hooks';
import { shadow } from '@rainbow-me/styles';

type ShowQRCodeModalParamTypes = {
  value: string;
  amountWithSymbol: string;
  amountInSpend: number;
  name: string | undefined;
  style: object;
};

const ShowQRCodeModal = () => {
  const {
    params: { value, amountInSpend, amountWithSymbol, name, style },
  } = useRoute() as { params: ShowQRCodeModalParamTypes };

  const { width } = useDimensions();

  return (
    <SafeAreaView flex={1} width="100%" backgroundColor="transparent">
      <Container flex={1} alignItems="center">
        <Container
          flex={1.5}
          flexDirection="column"
          justifyContent="flex-end"
          alignItems="center"
        >
          <SheetHandle color="white" opacity={1} />
          <Container
            marginTop={8}
            width="75%"
            padding={4}
            backgroundColor="white"
            borderRadius={30}
            alignItems="center"
            style={[
              shadow.buildAsObject(0, 30, 30, 'rgba(0, 0, 0, 0.25)', 1),
              style,
            ]}
          >
            <QRCode
              size={width * 0.6}
              value={value}
              logoMargin={12}
              logoBorderRadius={6}
              logo={CardstackColorLogo}
            />
          </Container>
        </Container>
        <Container alignItems="center" flex={1} marginTop={15}>
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
          <Text size="large" letterSpacing={0.39} color="white" marginTop={5}>
            {`to ${name}`}
          </Text>
        </Container>
      </Container>
    </SafeAreaView>
  );
};

export default ShowQRCodeModal;
