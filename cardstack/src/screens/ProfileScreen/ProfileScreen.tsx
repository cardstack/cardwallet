import React, { useMemo } from 'react';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { exampleMerchantData, strings } from './fixture';
import {
  Button,
  Container,
  MainHeader,
  Text,
  MerchantSafe,
} from '@cardstack/components';
import usePrimarySafe from '@cardstack/redux/hooks/usePrimarySafe';
import { useAccountSettings } from '@rainbow-me/hooks';
import { useNativeCurrencyAndConversionRates } from '@rainbow-me/redux/hooks';

const ProfileScreen = () => {
  const { primarySafe } = usePrimarySafe();

  const [
    nativeCurrency,
    currencyConversionRates,
  ] = useNativeCurrencyAndConversionRates();

  const { network } = useAccountSettings();

  const exmapleMerchantExtraProps = useMemo(() => {
    const networkName = getConstantByNetwork('name', network);

    return {
      nativeCurrency,
      currencyConversionRates,
      networkName,
    };
  }, [currencyConversionRates, nativeCurrency, network]);

  const CreateProfileStepOne = () => (
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
            {...exmapleMerchantExtraProps}
            {...exampleMerchantData}
            notPressable
          />
        </Container>
        <Button marginTop={5}>{strings.continueButton}</Button>
      </Container>
    </Container>
  );

  const CreateProfile = () => <CreateProfileStepOne />;

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title={strings.title} />
      <Container justifyContent="center" flex={1}>
        {primarySafe ? <MerchantSafe {...primarySafe} /> : <CreateProfile />}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
