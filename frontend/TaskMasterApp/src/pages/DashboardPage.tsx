import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TaskList from '../components/tasks/TaskList';




const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mostrar loading mientras se resuelve el estado de autenticación
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Welcome, {user.username}!
      </Typography>

      <TaskList user={user} /> {}
    </Container>
  );
};

export default Dashboard;
