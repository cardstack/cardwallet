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

// Shiming order is weird, to make sure allSettled works
// we reset the global Promise in case it doesn't exist yet

if (!Promise?.allSettled) global.Promise = require('promise');

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto

require('crypto');
