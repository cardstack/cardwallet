# Cardwallet

> DeFi payments made easy

## Requirements

- A computer running macOS.
- Volta installed for node/yarn version management: https://volta.sh/

For iOS:

- Install CocoaPods by running `sudo gem install cocoapods`
- Install Watchman `brew install watchman`
- xCode Version 13.0 (can be found [here](https://developer.apple.com/download/all/?q=xcode))

For Android:

- Install Android Studio https://developer.android.com/studio/install

If you are new to React Native, this is a helpful introduction: https://facebook.github.io/react-native/docs/getting-started.html

## How to run the project on iOS

1. Clone the GitHub repository to your machine.

2. Set up your .env file. For information how to do this, look [here](#project-secrets)

3. Run `yarn setup` to get all of the packages required.

4. Run `yarn install-bundle`.

5. Install required Pods by running `yarn install-pods`.

6. Run `yarn build:ios` to generate the main.jsbundle bundle for Xcode.

7. Run `yarn start` to start the React Native Bundler.

8. Open `cardwallet/ios/Rainbow.xcworkspace` in XCode.

9. Run the project by clicking the play button.

## How to run the project on Android

Follow steps 1 through 4 from the iOS steps above, then:

5. Run `bundle exec fastlane sync_google_service_info`

6. Run `yarn android`

7. Launch an Android emulator or connect a test device



### Troubleshooting

Error regarding file system watches on linux. You may need to increase the maximum number of file system watches. You can do this by running the following command:

    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

If you get an error about metro not running you can start the server manually by running `yarn start`.

## How to run the tests

`yarn test`

## Project Secrets

### Commands

#### Syncing

- `yarn contexts:app:sync`
  - Syncs app vars from context repo (corresponds to `.env` file)
- `yarn contexts:app:${LANE}:sync`
  - Syncs app vars for lane specific variables to `.env.${LANE}` file (lanes are alpha, beta, release)
- `yarn contexts:sync`
  - Syncs all app and lane-specific variables from the context repo

##### Troubleshooting

If you get an error saying the cryptex password is incorrect but you have checked it is correct, you may need the following fastlane plugin branch https://github.com/IanCal/fastlane-plugin-cryptex

On some filesystems the temp files written are not available immediately and a short sleep is required to allow the file to be written.

#### Publishing

- `yarn contexts:app:publish`
  - Publishes app vars to context repo (pushes variables from `.env` file)
- `yarn contexts:app:${LANE}:publish`
  - Publishes lane specific variables to context repo (pushes variable from `.env.${LANE}` file)

### Pulling Secrets

All of our app variables are synced within a contexts repository and decoded using cryptex. In order to pull these, you need the cryptex password, which is stored in AWS secrets manager. Once you have this, you can add the following to a `.env` file within the `fastlane` directory (`fastlane/.env`):

```
CRYPTEX_GIT_URL=https://github.com/cardstack/cardwallet-context
CRYPTEX_GIT_REPOSITORY=cardstack/cardwallet-context
CRYPTEX_PASSWORD=${{CRYPTEX_PASSWORD}}
CRYPTEX_SKIP_DOCS=true
ANDROID_KEYSTORE_CRYPTEX_KEY=android_release_keystore
MATCH_GIT_URL=https://github.com/cardstack/cardwallet-context
MATCH_PASSWORD=${{CRYPTEX_PASSWORD}}
MATCH_STORAGE_MODE=git
MATCH_TYPE=appstore
MATCH_APP_IDENTIFIER=com.cardstack.cardpay
```

Once this is setup, and you have git access to the `cardwallet-context` repository, you can run `yarn contexts:sync` to pull all environment variables down into a root `.env` file.

If you get an error and are prompted to login to Github when following the instructions to resolve, enter your username and when you are prompted for password, enter your Github personal access token.

### Adding Secrets

If you have already completed the necessary steps for pulling secrets, and have write access to the `cardwallet-context` repository, then you can now update these secrets within the context repo.

First, ensure that you have the current up to date variables by running `yarn contexts:sync`. Once you have these, you can add or change any environment variables and run the [publish commands](#publishing).

## Manual Release

### Android

To generate an Android bundle for release, make sure to have synced the secrets in order to have the `envs` and `release-keys` then run:

`yarn android:bundle`
