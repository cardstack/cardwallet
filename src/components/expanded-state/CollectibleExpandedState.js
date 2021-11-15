import React, { Fragment } from 'react';

import { SendActionButton, SheetActionButtonRow, SlackSheet } from '../sheet';
import ExpandedStateSection from './ExpandedStateSection';
import {
  CollectibleExpandedStateHeader,
  CollectibleExpandedStateImage,
} from './collectible';
import { Container, HorizontalDivider } from '@cardstack/components';
import { useDimensions } from '@rainbow-me/hooks';
import { magicMemo } from '@rainbow-me/utils';

const CollectibleExpandedState = ({ asset }) => {
  const { description, isSendable } = asset;

  const { height: screenHeight } = useDimensions();

  return (
    <Fragment>
      <SlackSheet
        bottomInset={42}
        {...(ios
          ? { height: '100%' }
          : { additionalTopPadding: true, contentHeight: screenHeight - 80 })}
        scrollEnabled
      >
        <CollectibleExpandedStateHeader asset={asset} />
        <CollectibleExpandedStateImage asset={asset} />
        <SheetActionButtonRow>
          {isSendable && <SendActionButton />}
        </SheetActionButtonRow>
        <Container paddingHorizontal={5}>
          <HorizontalDivider />
        </Container>
        <Container flexDirection="column">
          {!!description && (
            <ExpandedStateSection title="Bio">
              {description}
            </ExpandedStateSection>
          )}
        </Container>
      </SlackSheet>
    </Fragment>
  );
};

export default magicMemo(CollectibleExpandedState, 'asset');
