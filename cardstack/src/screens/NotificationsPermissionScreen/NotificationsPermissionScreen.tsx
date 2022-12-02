import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import {
  Button,
  CenteredContainer,
  Container,
  PageWithStackHeader,
  PageWithStackHeaderFooter,
  Text,
  NotificationBanner,
  Checkbox,
  HorizontalDivider,
  Skeleton,
} from '@cardstack/components';
import { NotificationsOptionsStrings } from '@cardstack/hooks/notifications-preferences/useUpdateNotificationPreferences';
import { NotificationsPreferenceDataType } from '@cardstack/types';
import { listStyle } from '@cardstack/utils';

import { strings } from './strings';
import { useNotificationsPermissionScreen } from './useNotificationsPermissionScreen';

const NotificationsPermissionScreen = () => {
  const {
    options,
    isError,
    handleSkipOnPress,
    handleEnableNotificationsOnPress,
  } = useNotificationsPermissionScreen();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NotificationsPreferenceDataType>) => {
      const notificationType =
        NotificationsOptionsStrings[
          item?.attributes[
            'notification-type'
          ] as keyof typeof NotificationsOptionsStrings
        ];

      return (
        <>
          <HorizontalDivider backgroundColor="blueDarkest" />
          <Container>
            <Checkbox checkboxPosition="left">
              <Text color="white">{notificationType}</Text>
            </Checkbox>
            <NotificationBanner
              paddingTop={6}
              paddingRight={8}
              paddingBottom={3}
              paddingLeft={10}
              title="Cardstack"
              body={notificationType}
            />
          </Container>
        </>
      );
    },
    []
  );

  const PageHeader = useMemo(
    () => (
      <Container flex={1} width="90%" paddingBottom={6}>
        <Text variant="pageHeader" paddingBottom={4}>
          {strings.title}
        </Text>
        <Text color="grayText" letterSpacing={0.4}>
          {strings.description}
        </Text>
        <Text color="teal" letterSpacing={0.4}>
          {strings.highlight}
        </Text>
      </Container>
    ),
    []
  );

  const ListError = useMemo(
    () => (
      <Container
        alignItems="center"
        width="100%"
        justifyContent="center"
        backgroundColor="backgroundDarkerPurple"
        marginTop={6}
        padding={6}
        borderRadius={10}
      >
        <Text color="white">{strings.errorMessage}</Text>
      </Container>
    ),
    []
  );

  const ListLoading = useMemo(
    () => (
      <Container flexDirection="column" paddingVertical={8}>
        {[...Array(3)].map((v, i) => (
          <Skeleton height={150} key={`${i}`} marginBottom={6} width="100%" />
        ))}
      </Container>
    ),
    []
  );

  return (
    <PageWithStackHeader
      canGoBack={false}
      skipPressCallback={handleSkipOnPress}
    >
      <FlatList
        style={listStyle.fullWidth}
        contentContainerStyle={listStyle.paddingBottom}
        showsVerticalScrollIndicator={false}
        data={options}
        renderItem={renderItem}
        ListHeaderComponent={PageHeader}
        ListEmptyComponent={isError ? ListError : ListLoading}
      />
      <PageWithStackHeaderFooter>
        <CenteredContainer>
          <Button onPress={handleEnableNotificationsOnPress} marginBottom={4}>
            {strings.confirmBtn}
          </Button>
        </CenteredContainer>
      </PageWithStackHeaderFooter>
    </PageWithStackHeader>
  );
};

export default memo(NotificationsPermissionScreen);
