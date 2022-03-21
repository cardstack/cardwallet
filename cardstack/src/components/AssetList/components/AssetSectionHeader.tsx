import React, { useMemo, memo } from 'react';
import { AssetListSectionItem, SectionType } from '../types';
import { strings } from '../strings';
import {
  Button,
  Container,
  ListEmptyComponent,
  Text,
} from '@cardstack/components';
import { Device } from '@cardstack/utils';
import { PinnedHiddenSectionOption } from '@rainbow-me/hooks';
import { PinnedHiddenSectionMenu } from '@cardstack/components/PinnedHiddenSection';
import { useTabBarFlag } from '@cardstack/navigation/tabBarNavigator';

interface AssetSectionProps {
  section: AssetListSectionItem<SectionType>;
  onBuyCardPress: () => void;
}

const AssetSectionHeader = ({ section, onBuyCardPress }: AssetSectionProps) => {
  const { isTabBarEnabled } = useTabBarFlag();

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

  const backgroundColor = useMemo(
    () => (isTabBarEnabled ? 'backgroundDarkPurple' : 'backgroundBlue'),
    [isTabBarEnabled]
  );

  return (
    <>
      <Container
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        padding={4}
        backgroundColor={backgroundColor}
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
      {isPrepaidCardSection && Device.supportsFiatOnRamp && (
        <Container
          paddingBottom={4}
          alignItems="center"
          backgroundColor={backgroundColor}
        >
          <Button onPress={onBuyCardPress}>{strings.buyCardLabel}</Button>
        </Container>
      )}
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
