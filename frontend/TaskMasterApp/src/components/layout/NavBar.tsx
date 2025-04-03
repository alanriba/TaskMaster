import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };
  
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TaskMaster
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          
          {/* Theme Toggle Button */}
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
                sx={{ mx: 1 }}
              >
                Dashboard
              </Button>
              
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                keepMounted
                slotProps={{
                  paper: {
                    elevation: 3,
                    sx: { mt: 1.5, minWidth: 180 }
                  }
                }}
              >
                <MenuItem disabled>
                  Hola, {user?.first_name || user?.username}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ mx: 1 }}
              >
                Log in
              </Button>
              <Button 
                color="secondary" 
                component={RouterLink} 
                to="/register"
                variant="contained"
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;