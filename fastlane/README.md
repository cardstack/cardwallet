fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### publish_android_keystore

```sh
[bundle exec] fastlane publish_android_keystore
```

Upload encrypted android release keystore

### sync_android_keystore

```sh
[bundle exec] fastlane sync_android_keystore
```

Download encrypted android release keystore

### sync_app_vars

```sh
[bundle exec] fastlane sync_app_vars
```

Download encrypted base app vars

### publish_app_vars

```sh
[bundle exec] fastlane publish_app_vars
```

Upload encrypted base app vars

### sync_alpha_app_vars

```sh
[bundle exec] fastlane sync_alpha_app_vars
```

Download encrypted alpha app vars

### publish_alpha_app_vars

```sh
[bundle exec] fastlane publish_alpha_app_vars
```

Upload encrypted alpha app vars

### sync_beta_app_vars

```sh
[bundle exec] fastlane sync_beta_app_vars
```

Download encrypted beta app vars

### publish_beta_app_vars

```sh
[bundle exec] fastlane publish_beta_app_vars
```

Upload encrypted beta app vars

### sync_release_app_vars

```sh
[bundle exec] fastlane sync_release_app_vars
```

Download encrypted production app vars

### publish_release_app_vars

```sh
[bundle exec] fastlane publish_release_app_vars
```

Upload encrypted production app vars

### publish_google_service_info

```sh
[bundle exec] fastlane publish_google_service_info
```

Upload encrypted google service info

### sync_google_service_info

```sh
[bundle exec] fastlane sync_google_service_info
```

Download encrypted google service info

### publish_google_play_credentials

```sh
[bundle exec] fastlane publish_google_play_credentials
```

Upload encrypted google play credentials

### sync_google_play_credentials

```sh
[bundle exec] fastlane sync_google_play_credentials
```

Download encrypted google play credentials

### publish_apns_key

```sh
[bundle exec] fastlane publish_apns_key
```

Upload encrypted app push notification service key

### sync_apns_key

```sh
[bundle exec] fastlane sync_apns_key
```

Download encrypted app push notification service key

### publish_sentry_properties

```sh
[bundle exec] fastlane publish_sentry_properties
```

Upload encrypted sentry.properties

### sync_sentry_properties

```sh
[bundle exec] fastlane sync_sentry_properties
```

Download encrypted sentry.properties

### contexts_sync_all

```sh
[bundle exec] fastlane contexts_sync_all
```

Sync all contexts vars

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
