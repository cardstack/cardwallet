import {
  NotificationsOptionsType,
  NotificationsOptionsStrings,
  NotificationsPreferenceRawDataType,
} from '@cardstack/types';

import { hubApi, HubCacheTags } from '../hub-api';
import { hubBodyBuilder } from '../hub-service';

import {
  RegisterFCMTokenQueryParams,
  NotificationsPreferenceTypeStatusParam,
} from './hub-notifications-types';

const routes = {
  registerFCMToken: '/push-notification-registrations',
  notificationsPreferences: '/notification-preferences',
};

export const hubNotifications = hubApi.injectEndpoints({
  endpoints: builder => ({
    registerFcmToken: builder.query<string, RegisterFCMTokenQueryParams>({
      query: ({ fcmToken }) => ({
        url: routes.registerFCMToken,
        method: 'POST',
        body: hubBodyBuilder('push-notification-registration', {
          'push-client-id': fcmToken,
        }),
      }),
    }),
    unregisterFcmToken: builder.mutation<string, RegisterFCMTokenQueryParams>({
      query: ({ fcmToken }) => ({
        url: `${routes.registerFCMToken}/${fcmToken}`,
        method: 'DELETE',
        responseHandler: response => response.text(),
      }),
    }),
    setNotificationsPreferences: builder.mutation<
      void,
      NotificationsPreferenceTypeStatusParam
    >({
      query: ({ notificationType, status }) => ({
        url: routes.notificationsPreferences,
        method: 'PUT',
        body: JSON.stringify({
          data: {
            type: 'notification-preference',
            attributes: {
              'notification-type': notificationType,
              status,
            },
          },
        }),
      }),
      onQueryStarted(
        { notificationType, status },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          hubNotifications.util.updateQueryData(
            'getNotificationsPreferences',
            undefined,
            (preferencesDraft: NotificationsOptionsType[]) => {
              preferencesDraft?.map((item: NotificationsOptionsType) => {
                if (item.type === notificationType) {
                  item.status = status;
                }

                return item;
              });
            }
          )
        );

        queryFulfilled.catch(patchResult.undo);
      },
      invalidatesTags: [HubCacheTags.NOTIFICATION_PREFERENCES],
      extraOptions: { appendFCMToken: true },
    }),
    getNotificationsPreferences: builder.query<
      NotificationsOptionsType[],
      void
    >({
      query: () => routes.notificationsPreferences,
      providesTags: [HubCacheTags.NOTIFICATION_PREFERENCES],
      extraOptions: { appendFCMToken: true },
      transformResponse: (response: {
        data: NotificationsPreferenceRawDataType[];
      }) =>
        response?.data.map(
          item =>
            ({
              type: item.attributes['notification-type'],
              description:
                NotificationsOptionsStrings[
                  item.attributes[
                    'notification-type'
                  ] as keyof typeof NotificationsOptionsStrings
                ],
              status: item.attributes.status,
            } as NotificationsOptionsType)
        ),
    }),
  }),
});

export const {
  useRegisterFcmTokenQuery,
  useUnregisterFcmTokenMutation,
  useSetNotificationsPreferencesMutation,
  useGetNotificationsPreferencesQuery,
} = hubNotifications;
