import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeSelectionItem } from './SafeSelectionItem';
import { strings } from './strings';
import { MerchantSafeType } from '@cardstack/types';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { Container, InfoBanner } from '@cardstack/components';

interface SafeSelectionListProps {
  safes: MerchantSafeType[];
  onSafePress: (safe: MerchantSafeType) => () => void;
}

export const SafeSelectionList = ({
  safes,
  onSafePress,
}: SafeSelectionListProps) => {
  const { primarySafe } = usePrimarySafe();

  const renderItem = useCallback(
    ({ item }) => (
      <SafeSelectionItem
        safe={item}
        primary={item.address === primarySafe?.address}
        onSafePress={onSafePress}
      />
    ),
    [primarySafe, onSafePress]
  );

  const renderDivisor = useCallback(
    () => <Container backgroundColor="borderGray" height={1} />,
    []
  );

  const renderFooter = useCallback(
    () => (
      <Container>
        {renderDivisor()}
        <InfoBanner
          paddingTop={5}
          title={strings.note.title}
          message={strings.note.message}
        />
      </Container>
    ),
    [renderDivisor]
  );

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={safes}
      keyExtractor={item => item.address}
      renderItem={renderItem}
      ItemSeparatorComponent={renderDivisor}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
});
