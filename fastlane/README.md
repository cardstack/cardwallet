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
### sync_vars
```
fastlane sync_vars
```
Download encrypted vars
### publish_vars
```
fastlane publish_vars
```
Upload encrypted vars
### publish_file
```
fastlane publish_file
```
Upload encrypted file
### sync_file
```
fastlane sync_file
```
Download encrypted file
### sync_google_services_files
```
fastlane sync_google_services_files
```
Sync google services configuration files
### publish_google_services_files
```
fastlane publish_google_services_files
```
Publish google services configuration files
### sync_google_play_credentials
```
fastlane sync_google_play_credentials
```
Sync google play credentials file
### publish_google_play_credentials
```
fastlane publish_google_play_credentials
```
Publish google play credentials file
### build_android_standalone
```
fastlane build_android_standalone
```
Create a standalone Android build
### build_ios_standalone
```
fastlane build_ios_standalone
```
Create a standalone IOS build
### sync_ios_signing
```
fastlane sync_ios_signing
```
Download IOS distribution certificates and profiles
### upload_android_build
```
fastlane upload_android_build
```
Upload Android build
### upload_ios_build
```
fastlane upload_ios_build
```
Upload IOS build

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
