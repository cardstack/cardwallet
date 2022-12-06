import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Switch } from 'react-native';
import { strings } from './strings';
import { Container, Skeleton, Text } from '@cardstack/components';
import {
  NotificationsOptionsStrings,
  useUpdateNotificationPreferences,
} from '@cardstack/hooks';
import { NotificationsPreferenceDataType } from '@cardstack/types';

const NotificationsSection = () => {
  const {
    options,
    onUpdateOptionStatus,
    isError,
  } = useUpdateNotificationPreferences();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NotificationsPreferenceDataType>) => {
      return (
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          paddingHorizontal={6}
          paddingVertical={2}
          testID="option-item"
        >
          <Text>
            {
              NotificationsOptionsStrings[
                item?.attributes[
                  'notification-type'
                ] as keyof typeof NotificationsOptionsStrings
              ]
            }
          </Text>
          <Switch
            onValueChange={isEnabled =>
              onUpdateOptionStatus(
                item.attributes['notification-type'],
                isEnabled
              )
            }
            value={item?.attributes.status === 'enabled'}
          />
        </Container>
      );
    },
    [onUpdateOptionStatus]
  );

  const ListError = useMemo(
    () => (
      <Container alignItems="center" flex={1} justifyContent="center">
        <Text>{strings.errorMessage}</Text>
      </Container>
    ),
    []
  );

  const ListLoading = useMemo(
    () => (
      <Container
        flexDirection="column"
        paddingHorizontal={6}
        paddingVertical={2}
      >
        {[...Array(3)].map((v, i) => (
          <Skeleton
            height={40}
            key={`${i}`}
            light
            marginBottom={1}
            width="100%"
          />
        ))}
      </Container>
    ),
    []
  );

  const keyExtractor = (item: NotificationsPreferenceDataType) =>
    item.attributes['notification-type'];

  return (
    <FlatList
      ListEmptyComponent={isError ? ListError : ListLoading}
      contentContainerStyle={styles.contentContainer}
      data={options}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 16,
  },
});

export default NotificationsSection;
