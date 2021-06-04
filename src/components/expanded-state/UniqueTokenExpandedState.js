import React, { Fragment, useMemo } from 'react';

import Link from '../Link';
import { Column } from '../layout';
import { SendActionButton, SheetActionButtonRow, SlackSheet } from '../sheet';
import { Text } from '../text';
import ExpandedStateSection from './ExpandedStateSection';
import {
  UniqueTokenExpandedStateHeader,
  UniqueTokenExpandedStateImage,
} from './unique-token';
import { Container, HorizontalDivider } from '@cardstack/components';
import { useDimensions } from '@rainbow-me/hooks';
import { magicMemo } from '@rainbow-me/utils';

const UniqueTokenExpandedState = ({ asset }) => {
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
        <UniqueTokenExpandedStateHeader asset={asset} />
        <UniqueTokenExpandedStateImage asset={asset} />
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

export default magicMemo(UniqueTokenExpandedState, 'asset');
