import React, { useMemo } from 'react';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { exampleMerchantData, strings } from './';
import { Button, Container, Text, MerchantSafe } from '@cardstack/components';
import { useAccountSettings } from '@rainbow-me/hooks';

export const CreateProfileStepOne = () => {
  const { network } = useAccountSettings();

  const exampleMerchantExtraProps = useMemo(() => {
    const networkName = getConstantByNetwork('name', network);

    return {
      nativeCurrency: '',
      currencyConversionRates: [],
      networkName,
    };
  }, [network]);

  return (
    <Container
      flexGrow={1}
      flexDirection="column"
      justifyContent="space-between"
      paddingVertical={8}
    >
      <Container>
        <Text color="white" fontWeight="bold" fontSize={20} textAlign="center">
          {strings.createProfile}
        </Text>
        <Text color="grayText" marginTop={8} textAlign="center">
          {strings.createProfileDesc}
        </Text>
      </Container>
      <Container>
        <Text color="white" textAlign="left" paddingLeft={4} marginBottom={1}>
          {strings.example}
        </Text>
        <MerchantSafe
          {...exampleMerchantExtraProps}
          {...exampleMerchantData}
          disabled
          headerRightText={strings.headerRightText}
        />
      </Container>
      <Container alignItems="center">
        <Button>{strings.continueButton}</Button>
      </Container>
    </Container>
  );
};
