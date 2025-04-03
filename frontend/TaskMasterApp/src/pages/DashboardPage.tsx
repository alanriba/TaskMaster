import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.first_name || user?.username}!</p>
      <p> This is the protected home page.</p>
    </div>
  );
};

export default Dashboard;