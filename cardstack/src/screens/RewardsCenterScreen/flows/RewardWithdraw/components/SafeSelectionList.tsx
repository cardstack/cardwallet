import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeSelectionItem, SafeSelectionItemProps } from './SafeSelectionItem';
import { strings } from './strings';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import {
  Container,
  HorizontalDivider,
  InfoBanner,
} from '@cardstack/components';

interface SafeSelectionListProps
  extends Pick<SafeSelectionItemProps, 'onSafePress'> {
  safes: SafeSelectionItemProps['safe'][];
}

export const SafeSelectionList = ({
  safes,
  onSafePress,
}: SafeSelectionListProps) => {
  const { primarySafe } = usePrimarySafe();

  const renderItem = useCallback(
    ({ item }) => (
      <>
        <SafeSelectionItem
          safe={item}
          primary={item.address === primarySafe?.address}
          onSafePress={onSafePress}
        />
        <HorizontalDivider />
      </>
    ),
    [primarySafe, onSafePress]
  );

  const renderFooter = useCallback(
    () => (
      <Container>
        <InfoBanner title={strings.note.title} message={strings.note.message} />
      </Container>
    ),
    []
  );

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={safes}
      keyExtractor={item => item.address}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
