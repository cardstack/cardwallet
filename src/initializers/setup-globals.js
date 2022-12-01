import logger from 'logger';

// Note: shimming for reanimated need to happen before importing globalVariables.js
// eslint-disable-next-line import/no-commonjs
for (let variable of Object.entries(require('../../globalVariables').default)) {
  Object.defineProperty(global, variable[0], {
    get: () => variable[1],
    set: () => {
      logger.sentry(`Trying to override internal Cardstack var ${variable[0]}`);
    },
  });
}

if (typeof __dirname === 'undefined') global.__dirname = '/';
if (typeof __filename === 'undefined') global.__filename = '';
if (typeof process === 'undefined') {
  global.process = require('process');
} else {
  const bProcess = require('process');
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

process.browser = false;
if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer;
// global.location = global.location || { port: 80 }

// Shiming order is weird, to make sure allSettled works
// we reset the global Promise in case it doesn't exist yet
// eslint-disable-next-line import/no-extraneous-dependencies
if (!Promise?.allSettled) global.Promise = require('promise');
