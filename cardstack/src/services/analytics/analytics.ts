import analytics from '@react-native-firebase/analytics';

export enum UserAccessType {
  BETA = 'BETA',
}

/**
 * setUserAccessType: Sets or clears access type to current analytics user.
 * @param userAccessType user type (BETA) or null to clear property for user.
 */
export const setUserAccessType = async (
  userAccessType: UserAccessType | null
) => analytics().setUserProperty('user_access_type', userAccessType);
