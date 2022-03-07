import React from 'react';

import { Button, Container, MainHeader, Text } from '@cardstack/components';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

const ProfileScreen = () => {
  // TODO: replace this with usePrimaryMerchant hook
  const merchantSafes = useRainbowSelector(state => state.data.merchantSafes);
  const hasSafes = (merchantSafes || []).length > 0;

  // TODO: This is a temporary workaround as designs are pending yet
  const NoSafesPlaceholder = () => (
    <Container flex={1} justifyContent="center">
      <Container
        backgroundColor="black"
        justifyContent="center"
        alignItems="center"
        paddingVertical={10}
      >
        <Text color="white" marginTop={10}>
          Placeholder
        </Text>
        <Button variant="small" marginTop={10}>
          Create Profile
        </Button>
      </Container>
    </Container>
  );

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title="PROFILE" />
      {!hasSafes && <NoSafesPlaceholder />}
    </Container>
  );
};

export default ProfileScreen;
