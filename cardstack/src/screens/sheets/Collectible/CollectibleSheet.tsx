import React, { memo } from 'react';

import { useRoute } from '@react-navigation/core';
import {
  CollectibleHeader,
  CollectibleImageWrapper,
  TextSection,
} from './components';
import { Container, HorizontalDivider, Sheet } from '@cardstack/components';
import { CollectibleType } from '@cardstack/types';
import {
  SendActionButton,
  SheetActionButtonRow,
} from '@rainbow-me/components/sheet';

interface RouteType {
  params: {
    collectible: CollectibleType;
  };
  key: string;
  name: string;
}

const CollectibleSheet = () => {
  const {
    params: { collectible },
  } = useRoute<RouteType>();

  const { isSendable, description } = collectible;

  return (
    <Sheet isFullScreen scrollEnabled>
      <CollectibleHeader collectible={collectible} />
      <CollectibleImageWrapper collectible={collectible} />
      <SheetActionButtonRow>
        {isSendable && <SendActionButton />}
      </SheetActionButtonRow>
      <Container paddingHorizontal={5}>
        <HorizontalDivider />
      </Container>
      <Container flexDirection="column">
        {!!description && (
          <TextSection title="About">{description}</TextSection>
        )}
      </Container>
    </Sheet>
  );
};

export default memo(CollectibleSheet);
