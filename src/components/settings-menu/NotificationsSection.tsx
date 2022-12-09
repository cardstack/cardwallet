import messaging from '@react-native-firebase/messaging';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  FlatList,
  Linking,
  ListRenderItemInfo,
  StyleSheet,
  Switch,
} from 'react-native';

import { strings } from './strings';
import { Container, Skeleton, Text } from '@cardstack/components';
import { useUpdateNotificationPreferences } from '@cardstack/hooks';
import {
  checkPushPermissionAndRegisterToken,
  getPermissionStatus,
} from '@cardstack/models/firebase';
import { NotificationsOptionsType } from '@cardstack/types';

import { Alert } from '@rainbow-me/components/alerts';

const showAlert = (
  alertType: 'askPermission' | 'handleDeniedPermission',
  onSuccessCallback: () => void
) =>
  Alert({
    buttons: [
      {
        onPress: onSuccessCallback,
        text: strings.alert[alertType].actionButton,
      },
      {
        style: 'cancel',
        text: strings.alert.dismissButton,
      },
    ],
    title: strings.alert[alertType].title,
    message: strings.alert.message,
  });

const NotificationsSection = () => {
  const {
    options,
    onUpdateOptionStatus,
    isError,
  } = useUpdateNotificationPreferences();

  // In case user has skipped this check during Notifications Permissions onboarding step
  // we need to present them again to opt-in notifications.
  const pushPermissionCheck = useCallback(async () => {
    const { NOT_DETERMINED, DENIED } = messaging.AuthorizationStatus;

    try {
      const permissionStatus = await getPermissionStatus();

      switch (permissionStatus) {
        case NOT_DETERMINED:
          showAlert('askPermission', checkPushPermissionAndRegisterToken);
          break;
        case DENIED:
          showAlert('handleDeniedPermission', Linking.openSettings);
          break;
      }
    } catch (error) {
      console.log(
        'Error checking if a user has push notifications permission',
        error
      );
    }
  }, []);

  useEffect(() => {
    pushPermissionCheck();
  }, [pushPermissionCheck]);

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
