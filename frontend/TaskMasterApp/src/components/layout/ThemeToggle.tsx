import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Modo oscuro
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Modo claro
import { useThemeContext } from '../../providers/ThemeProviders';
 

const ThemeToggle: React.FC = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <Tooltip title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      <IconButton color="inherit" onClick={toggleColorMode} aria-label="toggle theme">
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;