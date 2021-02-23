/* eslint-disable jest/expect-expect */
import * as Helpers from './helpers';

describe('Smoke tests', () => {
  it('Should show the welcome screen', async () => {
    await Helpers.checkIfVisible('welcome-screen');
  });
});
