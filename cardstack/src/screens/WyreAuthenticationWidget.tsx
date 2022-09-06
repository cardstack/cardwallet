import { useNavigation, useRoute } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';

import { SafeAreaView } from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';

interface NavParams {
  authenticationUrl: string;
  onSuccess: (value: void | PromiseLike<void>) => void;
}

const WyreAuthenticationWidget = () => {
  const {
    params: { authenticationUrl, onSuccess },
  } = useRoute<RouteType<NavParams>>();

  const { goBack } = useNavigation();

  const onNavigationStateChange = useCallback(
    (event: WebViewNavigation) => {
      // Successful auth redirects to about:blank
      if (event.url === 'about:blank') {
        goBack();
        onSuccess();
      }
    },
    [goBack, onSuccess]
  );

  return (
    <SafeAreaView flex={1} edges={['top']}>
      <WebView
        scrollEnabled={false}
        source={{
          uri: authenticationUrl,
        }}
        onNavigationStateChange={onNavigationStateChange}
      />
    </SafeAreaView>
  );
};

export default memo(WyreAuthenticationWidget);
