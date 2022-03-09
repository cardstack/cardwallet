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
    <Container width="100%" justifyContent="center">
      <Container justifyContent="center" alignItems="center" paddingTop={10}>
        <Text color="white" fontWeight="bold" fontSize={20} marginTop={5}>
          {strings.createProfile}
        </Text>
        <Text color="grayText" marginTop={8} textAlign="center">
          {strings.createProfileDesc}
        </Text>
        <Container width="100%" justifyContent="flex-start">
          <Text
            color="white"
            marginTop={8}
            textAlign="left"
            paddingLeft={4}
            marginBottom={1}
          >
            {strings.example}
          </Text>
          <MerchantSafe
            {...exampleMerchantExtraProps}
            {...exampleMerchantData}
            notPressable
            headerRightText={strings.headerRightText}
          />
        </Container>
        <Button marginTop={5}>{strings.continueButton}</Button>
      </Container>
    </Container>
  );
};
