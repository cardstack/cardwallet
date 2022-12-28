import messaging from '@react-native-firebase/messaging';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Linking,
  ListRenderItemInfo,
  StyleSheet,
  Switch,
} from 'react-native';

import { strings } from './strings';
import { Button, Container, Skeleton, Text } from '@cardstack/components';
import {
  useAppState,
  useUpdateNotificationPreferences,
} from '@cardstack/hooks';
import {
  checkPushPermissionAndRegisterToken,
  getPermissionStatus,
} from '@cardstack/models/firebase';
import { NotificationsOptionsType } from '@cardstack/types';

import { Alert } from '@rainbow-me/components/alerts';

const showPermissionAlert = () =>
  Alert({
    buttons: [
      {
        onPress: checkPushPermissionAndRegisterToken,
        text: strings.alert.askPermission.actionButton,
      },
      {
        style: 'cancel',
        text: strings.alert.dismissButton,
      },
    ],
    title: strings.alert.askPermission.title,
    message: strings.alert.message,
  });

const PermissionDeniedPrompt = () => (
  <Container
    alignItems="center"
    flex={0.9}
    justifyContent="center"
    marginHorizontal={10}
  >
    <Text paddingBottom={2} textAlign="center" variant="bold">
      {strings.alert.handleDeniedPermission.title}
    </Text>
    <Text paddingBottom={6} textAlign="center">
      {strings.alert.message}
    </Text>
    <Button onPress={Linking.openSettings}>
      {strings.alert.handleDeniedPermission.actionButton}
    </Button>
  </Container>
);

const NotificationsSection = () => {
  const { justBecameActive } = useAppState();

  const {
    options,
    onUpdateOptionStatus,
    isError,
  } = useUpdateNotificationPreferences();

  const [showPermissionDeniedPrompt, setShowPermissionDeniedPrompt] = useState(
    false
  );

  // In case user has skipped this check during Notifications Permissions onboarding step
  // we need to present them again to opt-in notifications.
  const pushPermissionCheck = useCallback(async () => {
    const { NOT_DETERMINED, DENIED } = messaging.AuthorizationStatus;

    try {
      const permissionStatus = await getPermissionStatus();

      if (permissionStatus === NOT_DETERMINED) {
        showPermissionAlert();
      }

      setShowPermissionDeniedPrompt(permissionStatus === DENIED);
    } catch (error) {
      console.log(
        'Error checking if a user has push notifications permission',
        error
      );
    }
  }, []);

  useEffect(() => {
    pushPermissionCheck();
  }, [pushPermissionCheck, justBecameActive]);

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

  if (showPermissionDeniedPrompt) {
    return <PermissionDeniedPrompt />;
  }

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
