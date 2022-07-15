import React, { createContext, useContext, useMemo } from 'react';
import { ThemeProvider } from 'styled-components';

import { lightModeThemeColors } from '../styles/colors';

export const ThemeContext = createContext({
  colors: lightModeThemeColors,
  isDarkMode: false,
  setTheme: () => {},
});

export const MainThemeProvider = props => {
  const currentTheme = useMemo(
    () => ({
      colors: lightModeThemeColors,
      isDarkMode: false,
    }),
    []
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <ThemeContext.Provider value={currentTheme}>
        {props.children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};

// Custom hook to get the theme object returns {isDarkMode, colors, setTheme}
export const useTheme = () => useContext(ThemeContext);
