import React, { useMemo, memo } from 'react';

import { Container, ListEmptyComponent, Text } from '@cardstack/components';
import { PinnedHiddenSectionMenu } from '@cardstack/components/PinnedHiddenSection';

import { PinnedHiddenSectionOption } from '@rainbow-me/hooks';

import { strings } from '../strings';
import { AssetListSectionItem, SectionType } from '../types';

interface AssetSectionProps {
  section: AssetListSectionItem<SectionType>;
}

const AssetSectionHeader = ({ section }: AssetSectionProps) => {
  const {
    header: { type, title, count, showContextMenu, total },
    data,
  } = section;

  const isPrepaidCardSection = useMemo(
    () => type === PinnedHiddenSectionOption.PREPAID_CARDS,
    [type]
  );

  const isEmptyPrepaidCard = useMemo(
    () => isPrepaidCardSection && data.length === 0,
    [data.length, isPrepaidCardSection]
  );

  return (
    <>
      <Container
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        padding={4}
        backgroundColor="backgroundDarkPurple"
      >
        <Container flexDirection="row">
          <Text color="white" size="medium">
            {title}
          </Text>
          {count ? (
            <Text color="tealDark" size="medium" marginLeft={2}>
              {count}
            </Text>
          ) : null}
        </Container>
        <Container alignItems="center" flexDirection="row">
          {total ? (
            <Text
              color="tealDark"
              size="body"
              weight="extraBold"
              marginRight={showContextMenu ? 3 : 0}
            >
              {total}
            </Text>
          ) : null}
          {showContextMenu && <PinnedHiddenSectionMenu type={type} />}
        </Container>
      </Container>
      {isEmptyPrepaidCard && (
        <Container marginHorizontal={4} alignItems="center">
          <ListEmptyComponent
            text={strings.emptyCardMessage}
            width="100%"
            hasRoundBox
            textColor="blueText"
          />
        </Container>
      )}
    </>
  );
};

export default memo(AssetSectionHeader);
