import { useRoute } from '@react-navigation/core';
import React, { memo } from 'react';

import { Container, Sheet, Text, TextOptionRow } from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';

import { strings } from './strings';

interface Params {
  onClaimAllPress: () => void;
}

const ConfirmClaimDestinySheet = () => {
  const {
    params: { onClaimAllPress },
  } = useRoute<RouteType<Params>>();

  return (
    <Sheet
      Header={
        <Container paddingHorizontal={5} paddingVertical={3}>
          <Text size="medium">{strings.header}</Text>
        </Container>
      }
    >
      <Container paddingHorizontal={5} paddingVertical={2}>
        <TextOptionRow
          title={strings.claim.title}
          description={strings.claim.description}
          onPress={onClaimAllPress}
        />
        <TextOptionRow
          title={strings.refill.title}
          description={strings.refill.description}
          disabled
        />
        <TextOptionRow
          title={strings.create.title}
          description={strings.create.description}
          disabled
        />
      </Container>
    </Sheet>
  );
};

export default memo(ConfirmClaimDestinySheet);
