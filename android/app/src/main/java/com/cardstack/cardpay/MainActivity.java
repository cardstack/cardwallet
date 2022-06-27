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

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }
  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }
    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
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
