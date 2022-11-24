import store from '@rainbow-me/redux/store';

import { hubNotifications } from './hub-notifications-api';

export const registerFcmToken = (fcmToken: string) =>
  store.dispatch(
    hubNotifications.endpoints.registerFcmToken.initiate({ fcmToken })
  );

export const unregisterFcmToken = (fcmToken: string) =>
  store.dispatch(
    hubNotifications.endpoints.unregisterFcmToken.initiate({ fcmToken })
  );
