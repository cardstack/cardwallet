export const dismissingScreenListener = { current: undefined };

global.__rainbowDismissScreen = () => dismissingScreenListener.current?.();
