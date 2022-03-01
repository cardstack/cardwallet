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
            <Text size="medium">How do you want to claim?</Text>
          </Container>
        }
      >
        <Container paddingHorizontal={5} paddingVertical={2}>
          <TextOptionRow
            description="Claim to your account balance."
            onPress={onClaimAllPress}
            title="Claim to Account"
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
    [onClaimAllPress]
  );
};

export default ConfirmClaimDestinyState;
