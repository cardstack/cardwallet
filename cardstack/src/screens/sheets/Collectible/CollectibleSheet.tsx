import { useRoute } from '@react-navigation/native';
import React, { memo } from 'react';

import { Container, HorizontalDivider, Sheet } from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';
import { CollectibleType } from '@cardstack/types';

import {
  SendActionButton,
  SheetActionButtonRow,
} from '@rainbow-me/components/sheet';

import {
  CollectibleHeader,
  CollectibleImageWrapper,
  TextSection,
} from './components';

interface Params {
  collectible: CollectibleType;
}

const CollectibleSheet = () => {
  const {
    params: { collectible },
  } = useRoute<RouteType<Params>>();

  const { isSendable, description } = collectible;

  return (
    <Sheet isFullScreen scrollEnabled>
      <CollectibleHeader collectible={collectible} />
      <CollectibleImageWrapper collectible={collectible} />
      <SheetActionButtonRow>
        {isSendable && <SendActionButton asset={collectible} />}
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
