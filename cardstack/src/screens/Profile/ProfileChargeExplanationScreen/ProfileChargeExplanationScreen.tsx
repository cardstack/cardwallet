import React from 'react';

import {
  Container,
  InPageHeader,
  SafeAreaView,
  Text,
} from '@cardstack/components';

import { strings } from './strings';

// TODO: replace this with the value from usePurchase hook
const LOCALIZED_PRICE = '$0.99 USD';

const ProfileChargeExplanationScreen = () => (
  <SafeAreaView
    backgroundColor="backgroundDarkPurple"
    flex={1}
    paddingHorizontal={5}
    justifyContent="space-between"
  >
    <InPageHeader
      showSkipButton={false}
      leftIconProps={{ name: 'x', left: -6 }}
    />

    <Container flex={0.95}>
      <Text color="white" variant="pageHeader" paddingBottom={5}>
        {strings.title}
      </Text>
      <Text color="grayText" letterSpacing={0.4}>
        {strings.description(LOCALIZED_PRICE)}
      </Text>
    </Container>
  </SafeAreaView>
);

export default ProfileChargeExplanationScreen;
