const SHORTEN_PROP_TYPES_ERROR = true;

if (SHORTEN_PROP_TYPES_ERROR) {
  const oldConsoleError = console.error;
  console.error = function () {
    if (
      typeof arguments[0] === 'string' &&
      arguments[0].startsWith('Warning: Failed prop type')
    ) {
      console.log(
        `PropTypes error in: ${arguments[0]
          .match(/\w+.js:[0-9]+/g)
          .slice(0, 6)
          .join(' in ')}`
      );
      return;
    }
    // Temp disabling warning, but we definitely need to fix current behavior bc of android

    if (
      typeof arguments[0] === 'string' &&
      arguments[0].startsWith(
        'VirtualizedLists should never be nested inside plain ScrollViews'
      )
    ) {
      return;
    }
    oldConsoleError?.apply(this, arguments);
  };
}
