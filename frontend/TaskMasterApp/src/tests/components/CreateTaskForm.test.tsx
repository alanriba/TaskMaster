import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateTaskForm from '../../components/tasks/CreateTaskForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TaskServiceApi } from '../../api/taskApi';

vi.mock('../../api/taskApi', () => ({
  TaskServiceApi: {
    create: vi.fn()
  }
}));

describe('CreateTaskForm', () => {
  const mockOnClose = vi.fn();
  const mockOnTaskCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = () => {
    render(
      <CreateTaskForm
        open={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );
  };

  it('should render the form', () => {
    renderForm();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('should show validation error when submitting empty title', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  it('should call TaskServiceApi.create and callbacks on successful submission', async () => {
    (TaskServiceApi.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 1,
      title: 'New Task',
      description: 'Test',
      status: 'pending',
      priority: 'medium',
      due_date: null,
      category: null,
      category_name: null,
      category_color: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    renderForm();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Task' }
    });

    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(TaskServiceApi.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'New Task' })
      );
      expect(mockOnTaskCreated).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should show error snackbar when submission fails', async () => {
    (TaskServiceApi.create as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Something went wrong')
    );

    renderForm();

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Failing Task' }
    });

    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    const alert = await screen.findByText(/something went wrong/i);
    expect(alert).toBeInTheDocument();
  });
});
