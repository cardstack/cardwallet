import { useRoute } from '@react-navigation/core';
import React, { useMemo } from 'react';
import { Container, Sheet, Text, TextOptionRow } from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';

interface Params {
  onClaimAllPress: () => void;
}

const ConfirmClaimDestinyState = () => {
  const {
    params: { onClaimAllPress },
  } = useRoute<RouteType<Params>>();

  // Workaround to avoid not dismiss modal
  return useMemo(
    () => (
      <Sheet
        Header={
          <Container paddingHorizontal={5} paddingVertical={3}>
            <Text size="medium">What do you want to do with your money?</Text>
          </Container>
        }
      >
        <Container paddingHorizontal={5} paddingVertical={2}>
          <TextOptionRow
            description="Claim to your balance and it will be available to withdraw to an exchange."
            onPress={onClaimAllPress}
            title="Profile Balance Account"
          />
        </Container>
        <Container paddingHorizontal={5} paddingVertical={3}>
          <Text fontStyle="italic" paddingBottom={4} size="medium">
            Coming Soon:
          </Text>
          <TextOptionRow
            description="Refill or top up an existing prepaid card."
            disabled
            title="Refill Existing Prepaid Card"
          />
          <TextOptionRow
            description="Create a new prepaid card with the balance to pay others with."
            disabled
            title="Create New Prepaid Card"
          />
        </Container>
      </Sheet>
    ),
    []
  );
};

export default ConfirmClaimDestinyState;
