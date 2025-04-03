import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Importa configuraciones base para temas claro y oscuro
import { lightThemeOptions, darkThemeOptions } from '../theme';

type ColorMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ColorMode;
  toggleColorMode: () => void;
}

// Crear contexto de tema
const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleColorMode: () => {},
});

// Hook personalizado para usar el contexto de tema
export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Intenta recuperar la preferencia guardada o usa la preferencia del sistema
  const savedMode = localStorage.getItem('colorMode') as ColorMode | null;
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialMode = savedMode || (prefersDarkMode ? 'dark' : 'light');
  
  const [mode, setMode] = useState<ColorMode>(initialMode);

  // Actualiza localStorage cuando cambia el modo
  useEffect(() => {
    localStorage.setItem('colorMode', mode);
  }, [mode]);

  // Función para cambiar entre modos claro y oscuro
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Memoriza el tema para evitar recreaciones innecesarias
  const theme = useMemo(
    () => createTheme(mode === 'light' ? lightThemeOptions : darkThemeOptions),
    [mode]
  );

  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;