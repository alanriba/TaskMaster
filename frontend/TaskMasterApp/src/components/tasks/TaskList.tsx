import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChipProps } from '@mui/material';
import { TaskServiceApi } from '../../api/taskApi';
import { Task } from '../../models/Task';
import CreateTaskForm from './CreateTaskForm';
import EditTaskForm from './EditTaskForm'; 

const getStatusColor = (status: Task['status']): ChipProps['color'] => {
  switch (status) {
    case 'pending':
      return 'default';
    case 'in_progress':
      return 'primary';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: Task['status']): string => {
  switch (status) {
    case 'pending':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasksData = await TaskServiceApi.getAll();
      setTasks(tasksData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleTaskCreated = () => fetchTasks();

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };
  const handleTaskUpdated = () => fetchTasks();

  const confirmDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await TaskServiceApi.delete(taskToDelete.id);
      setSnackbar({ open: true, message: 'Task deleted successfully', severity: 'success' });
      fetchTasks();
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete task', severity: 'error' });
    }
    finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Tasks</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateTask}>New Task</Button>
      </Box>

      <Paper elevation={2} sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : tasks.length === 0 ? (
          <Typography textAlign="center">No tasks found</Typography>
        ) : (
          <List>
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                {index > 0 && <Divider />}
                <ListItem sx={{ py: 2 }}>
                  <ListItemText
                    primary={<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">{task.title}</Typography>
                      <Box>
                        <Button onClick={() => handleEditTask(task)} size="small" variant="outlined">Edit</Button>
                        <Button onClick={() => confirmDeleteTask(task)} size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} sx={{ ml: 1 }}>
                          Delete
                        </Button>
                      </Box>
                    </Box>}
                    secondary={
                      <Box>
                        <Typography variant="body2" component="div" sx={{ mb: 1 }}>{task.description}</Typography>
                        <Chip label={getStatusLabel(task.status)} color={getStatusColor(task.status)} size="small" />
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <CreateTaskForm open={isCreateModalOpen} onClose={handleCloseCreateModal} onTaskCreated={handleTaskCreated} />
      {selectedTask && <EditTaskForm open={isEditModalOpen} onClose={handleCloseEditModal} onTaskUpdated={handleTaskUpdated} task={selectedTask} />}

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the task "{taskToDelete?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TaskList;
