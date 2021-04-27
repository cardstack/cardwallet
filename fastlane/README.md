fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### publish_android_keystore
```
fastlane publish_android_keystore
```
Upload encrypted android release keystore
### sync_android_keystore
```
fastlane sync_android_keystore
```
Download encrypted android release keystore
### sync_app_vars
```
fastlane sync_app_vars
```
Download encrypted base app vars
### publish_app_vars
```
fastlane publish_app_vars
```
Upload encrypted base app vars
### sync_alpha_app_vars
```
fastlane sync_alpha_app_vars
```
Download encrypted alpha app vars
### publish_alpha_app_vars
```
fastlane publish_alpha_app_vars
```
Upload encrypted alpha app vars
### sync_beta_app_vars
```
fastlane sync_beta_app_vars
```
Download encrypted beta app vars
### publish_beta_app_vars
```
fastlane publish_beta_app_vars
```
Upload encrypted beta app vars
### sync_release_app_vars
```
fastlane sync_release_app_vars
```
Download encrypted production app vars
### publish_release_app_vars
```
fastlane publish_release_app_vars
```
Upload encrypted production app vars
### publish_google_service_info
```
fastlane publish_google_service_info
```
Upload encrypted google service info
### sync_google_service_info
```
fastlane sync_google_service_info
```
Download encrypted google service info
### publish_google_play_credentials
```
fastlane publish_google_play_credentials
```
Upload encrypted google play credentials
### sync_google_play_credentials
```
fastlane sync_google_play_credentials
```
Download encrypted google play credentials

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
