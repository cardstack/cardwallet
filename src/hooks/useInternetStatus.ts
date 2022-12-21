import NetInfo from '@react-native-community/netinfo';
import { isNil } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

export default function useInternetStatus() {
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  const onChange = useCallback(
    ({ isInternetReachable: newIsInternetReachable }) => {
      if (!isNil(newIsInternetReachable)) {
        setIsInternetReachable(newIsInternetReachable);
      }
    },
    []
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(onChange);
    return unsubscribe;
  }, [onChange]);

  return isInternetReachable;
}
