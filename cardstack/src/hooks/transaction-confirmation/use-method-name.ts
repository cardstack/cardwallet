import { useState, useCallback, useEffect } from 'react';
import { Vibration, InteractionManager } from 'react-native';
import { isEmulatorSync } from 'react-native-device-info';

import { methodRegistryLookupAndParse } from '@rainbow-me/utils/methodRegistry';

export const useMethodName = (
  isMessageRequest: boolean,
  openAutomatically: boolean,
  rawPayloadParams: any
) => {
  const [methodName, setMethodName] = useState<string | undefined>();

  const fetchMethodName = useCallback(
    async data => {
      if (!data) return;
      const methodSignaturePrefix = data.substr(0, 10);
      let fallbackHandler;

      try {
        fallbackHandler = setTimeout(() => {
          setMethodName('Transaction Request');
        }, 5000);

        const { name } = await methodRegistryLookupAndParse(
          methodSignaturePrefix
        );

        if (name) {
          setMethodName(name);
          clearTimeout(fallbackHandler);
        }
      } catch (e) {
        setMethodName('Transaction Request');
        clearTimeout(fallbackHandler as any);
      }
    },
    [setMethodName]
  );

  useEffect(() => {
    if (openAutomatically && !isEmulatorSync()) {
      Vibration.vibrate();
    }

    InteractionManager.runAfterInteractions(() => {
      if (!isMessageRequest) {
        fetchMethodName(rawPayloadParams[0].data);
      } else {
        setMethodName('Message Signing Request');
      }
    });
  }, [fetchMethodName, isMessageRequest, openAutomatically, rawPayloadParams]);

  return methodName;
};
