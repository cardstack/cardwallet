import React, { memo } from 'react';
import { convertToSpend } from '@cardstack/cardpay-sdk';
import { strings } from './strings';
import { useRequestPrepaidCardScreen } from './useRequestPrepaidCardScreen';
import {
  Container,
  InfoBanner,
  NavigationStackHeader,
  Text,
} from '@cardstack/components';
import MediumPrepaidCard from '@cardstack/components/PrepaidCard/MediumPrepaidCard';

const RequestPrepaidCardScreen = () => {
  const { onSupportLinkPress } = useRequestPrepaidCardScreen();

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <NavigationStackHeader title={strings.navigation.title} />
      <Container paddingHorizontal={5} alignItems="center" flex={1}>
        <CardPlaceholder />
        <InfoBanner
          title={strings.termsBanner.title}
          message={strings.termsBanner.message}
        >
          <Text
            textDecorationLine="underline"
            color="blueOcean"
            size="xs"
            onPress={onSupportLinkPress}
          >
            {strings.termsBanner.link}
          </Text>
        </InfoBanner>
      </Container>
    </Container>
  );
};

export default RequestPrepaidCardScreen;

// TODO: Replace with correct design
const CardPlaceholder = memo(() => (
  <Container width="70%" justifyContent="center" paddingVertical={5}>
    <MediumPrepaidCard
      networkName="Gnosis Chain"
      nativeCurrency="USD"
      //@ts-expect-error no currency needed
      currencyConversionRates=""
      address="0xXXXX…XXXX"
      spendFaceValue={convertToSpend(2, 'USD', 1)}
      transferrable={false}
      cardCustomization={{
        background: 'linear-gradient(139.27deg, #00ebe5 34%, #c3fc33 70%)',
        issuerName: 'Cardstack',
        patternColor: 'white',
        patternUrl:
          'https://app.cardstack.com/images/prepaid-card-customizations/pattern-5.svg',
        textColor: 'black',
      }}
    />
  </Container>
));
