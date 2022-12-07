import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Switch } from 'react-native';
import { strings } from './strings';
import { Container, Skeleton, Text } from '@cardstack/components';
import { useUpdateNotificationPreferences } from '@cardstack/hooks';
import { checkPushPermissionAndRegisterToken } from '@cardstack/models/firebase';
import { NotificationsOptionsType } from '@cardstack/types';

const NotificationsSection = () => {
  const {
    options,
    onUpdateOptionStatus,
    isError,
  } = useUpdateNotificationPreferences();

  // In case user has skipped this check during Notifications Permissions onboarding step
  // we need to present them again to opt-in notifications.
  useEffect(() => {
    checkPushPermissionAndRegisterToken();
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NotificationsOptionsType>) => {
      return (
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          paddingHorizontal={6}
          paddingVertical={2}
          testID="option-item"
        >
          <Text>{item?.description}</Text>
          <Switch
            onValueChange={isEnabled =>
              onUpdateOptionStatus(item.type, isEnabled)
            }
            value={item?.status === 'enabled'}
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

  const keyExtractor = (item: NotificationsOptionsType) => item.type;

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
