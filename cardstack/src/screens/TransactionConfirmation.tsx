import { useRoute } from '@react-navigation/native';
import React from 'react';
import {
  Button,
  Container,
  HorizontalDivider,
  SheetHandle,
  Text,
} from '@cardstack/components';

const TransactionConfirmation = () => {
  const { params: routeParams } = useRoute();

  const {
    callback,
    transactionDetails: {
      dappName,
      dappScheme,
      dappUrl,
      displayDetails,
      imageUrl,
      payload: { method, params },
      peerId,
      requestId,
    },
  } = routeParams;

  console.log({ routeParams: JSON.stringify(routeParams, null, 2) });

  return (
    <Container flex={1} width="100%">
      <Container
        flex={1}
        alignItems="center"
        backgroundColor="white"
        paddingTop={3}
        borderRadius={20}
      >
        <SheetHandle />
        <Header dappUrl={dappUrl} />
        <SheetFooter />
      </Container>
      <Footer />
    </Container>
  );
};

const Header = ({ dappUrl }: { dappUrl: string }) => {
  const [, displayUrl] = dappUrl.split('://');

  return (
    <>
      <Text marginTop={4} weight="extraBold">
        Issue Prepaid Card
      </Text>
      <Text variant="subText" weight="bold">
        {displayUrl}
      </Text>
    </>
  );
};

const SheetFooter = () => {
  return (
    <Container
      width="100%"
      marginTop={5}
      bottom={20}
      position="absolute"
      backgroundColor="white"
    >
      <HorizontalDivider height={2} />
      <Container
        paddingHorizontal={5}
        flexDirection="row"
        justifyContent="space-between"
      >
        <Button variant="smallWhite">Cancel</Button>
        <Button variant="small">Confirm</Button>
      </Container>
    </Container>
  );
};

const Footer = () => {
  return <Container height={150} />;
};

export default TransactionConfirmation;
