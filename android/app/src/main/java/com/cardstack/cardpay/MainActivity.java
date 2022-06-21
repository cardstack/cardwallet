package com.cardstack.cardpay;
import expo.modules.ReactActivityDelegateWrapper;
import android.content.res.Configuration;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import org.devio.rn.splashscreen.SplashScreen;
import com.cardstack.cardpay.NativeModules.RNBackHandler.RNBackHandlerPackage;
import android.webkit.WebView;

import android.content.Intent;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.NoActionBar);
        super.onCreate(null);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Rainbow";
  }

  @Override
  public void onBackPressed() {
      if (!RNBackHandlerPackage.sBlockBack) {
          super.onBackPressed();
      }
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    getReactInstanceManager().onConfigurationChanged(this, newConfig);
  }

  @Override
  public void onNewIntent(Intent intent) {
      super.onNewIntent(intent);
      setIntent(intent);
    }
  
}
