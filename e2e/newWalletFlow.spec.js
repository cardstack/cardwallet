/* eslint-disable no-undef */
/* eslint-disable jest/expect-expect */
import * as Helpers from './helpers';

describe('New Wallet flow', () => {
  it('should show the welcome screen', async () => {
    await Helpers.checkIfVisible('welcome-screen');
  });

  it('go to the wallet screen after pressing "Get a new wallet" button', async () => {
    await Helpers.tap('new-wallet-button');
    if (device.getPlatform() === 'android') {
      await Helpers.checkIfVisible('pin-authentication-screen');
      // Set the pin
      await Helpers.authenticatePin('1234');
      // Confirm it
      await Helpers.authenticatePin('1234');
    }
    await Helpers.checkIfVisible('wallet-screen');
  });

  it('should show the "Add funds" button', async () => {
    await Helpers.checkIfVisible('copy-address-button');
  });

  it('should show "No transactions yet" in the activity list', async () => {
    if (device.getPlatform() === 'android') {
      await Helpers.tap('navbar-profile-button');
      await Helpers.checkIfElementByTextIsVisible('No transactions yet');
    } else {
      await Helpers.tap('navbar-profile-button');
      await Helpers.delay(2000);
      await Helpers.checkForElementByLabel('no-transactions-yet-label');
    }
  });

  afterAll(async () => {
    // Reset the app state
    await device.clearKeychain();
  });
});
