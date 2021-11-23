import React, { Fragment } from 'react';

import { SendActionButton, SheetActionButtonRow, SlackSheet } from '../sheet';
import ExpandedStateSection from './ExpandedStateSection';
import {
  CollectibleExpandedStateHeader,
  CollectibleExpandedStateImage,
} from './collectible';
import { Container, HorizontalDivider } from '@cardstack/components';
import { CollectibleType } from '@cardstack/types';
import { Device } from '@cardstack/utils';
import { useDimensions } from '@rainbow-me/hooks';
import { magicMemo } from '@rainbow-me/utils';

const CollectibleExpandedState = ({ asset: collectible }: any) => {
  const { description, isSendable } = collectible as CollectibleType;

  const { height: screenHeight } = useDimensions();
  const contentHeight = screenHeight - 80;

  return (
    <Fragment>
      {/*
      // @ts-ignore can't sent props properly until SlackSheet is migrated to TS  */}
      <SlackSheet
        bottomInset={42}
        {...(Device.isIOS
          ? { height: '100%' }
          : { additionalTopPadding: true, contentHeight })}
        scrollEnabled
      >
        <CollectibleExpandedStateHeader collectible={collectible} />
        <CollectibleExpandedStateImage collectible={collectible} />
        <SheetActionButtonRow>
          {isSendable && <SendActionButton />}
        </SheetActionButtonRow>
        <Container paddingHorizontal={5}>
          <HorizontalDivider />
        </Container>
        <Container flexDirection="column">
          {!!description && (
            <ExpandedStateSection title="About">
              {description}
            </ExpandedStateSection>
          )}
        </Container>
      </SlackSheet>
    </Fragment>
  );
};

export default magicMemo(CollectibleExpandedState, 'asset');
