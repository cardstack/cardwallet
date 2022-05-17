import analytics from '@react-native-firebase/analytics';

export enum UserAccessType {
  BETA = 'BETA',
}

export const setUserAccessType = async (userAccessType: UserAccessType) =>
  analytics().setUserProperty('user_access_type', userAccessType);
