import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';

import { Task, TaskUpdate } from '../../models/Task';
import { TaskServiceApi } from '../../api/taskApi';

interface EditTaskFormProps {
  open: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  task: Task;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ open, onClose, onTaskUpdated, task }) => {
  const [formData, setFormData] = useState<Omit<TaskUpdate, 'id'>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: null
  });

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
    open: boolean;
  }>({ message: '', severity: 'success', open: false });

  useEffect(() => {
    if (task) {
      const { id: _id, ...rest } = task;
      setFormData(rest);
    }
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      await TaskServiceApi.update({ ...formData, id: task.id });
      setFeedback({
        message: 'Task updated successfully!',
        severity: 'success',
        open: true
      });
      onTaskUpdated();
      onClose();
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Failed to update task',
        severity: 'error',
        open: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseFeedback = () => {
    setFeedback(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
            required
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleSelectChange}
            >
              <MenuItem value="pending">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
            <FormHelperText>Select the current status of this task</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              name="priority"
              value={formData.priority || ''}
              label="Priority"
              onChange={handleSelectChange}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
            <FormHelperText>Select the priority level</FormHelperText>
          </FormControl>

          <TextField
            margin="dense"
            id="due_date"
            name="due_date"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.due_date || ''}
            onChange={handleInputChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Update Task'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseFeedback}
          severity={feedback.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditTaskForm;
