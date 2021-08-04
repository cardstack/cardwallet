
### Card Pay Card Wallet: Payments & Rewards
DeFi payments made easy



## Requirements

* A computer running macOS.
* NVM installed or Node.js 14: https://github.com/creationix/nvm
* Install CocoaPods by running `sudo gem install cocoapods`
* Install Watchman `brew install watchman`
* Install the latest version of XCode: https://developer.apple.com/xcode/

## How to run the project

If you are new to React Native, this is a helpful introduction: https://facebook.github.io/react-native/docs/getting-started.html

1. Clone the GitHub repository to your machine.

1. Run `nvm use 14` to use set the version of node for this project.

1. Set up your .env file, use our env.example as a guide.

    ___Note that some features are currently not accessible, we are working with our Data Providers in order to provide open source API Keys!___

    Here are some resources to generate your own API keys:

    * Etherscan: https://etherscan.io/apis
    * Infura: https://infura.io/
    * ETH Gas Station: https://docs.ethgasstation.info/
    * Imgix: https://www.imgix.com/

1. Run `yarn setup` to get all of the packages required.

1. Run `yarn install-bundle`.

1. Install required Pods by running `yarn install-pods`.

1. Run `yarn build:ios` to generate the main.jsbundle bundle for Xcode.
   
1. Run `yarn start` to start the React Native Bundler.

1. Open `cardwallet/ios/Rainbow.xcworkspace` in XCode.

1. Run the project by clicking the play button.

