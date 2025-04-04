import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateTaskForm from '../../components/tasks/CreateTaskForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../api/taskApi', async () => {
  return {
    TaskServiceApi: {
      getAll: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      changeStatus: vi.fn(),
      getAllTags: vi.fn().mockResolvedValue([]),
      createTag: vi.fn()
    }
  };
});

import { TaskServiceApi } from '../../api/taskApi';


describe('CreateTaskForm', () => {
  const mockOnClose = vi.fn();
  const mockOnTaskCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(TaskServiceApi.getAll).mockResolvedValue([]);
    vi.mocked(TaskServiceApi.getAllTags).mockResolvedValue([]);});

  const renderForm = () => {
    render(
      <CreateTaskForm
        open={true}
        onClose={mockOnClose}
        onTaskCreated={mockOnTaskCreated}
      />
    );
  };

  it('should render the form',async() => {
    render(<CreateTaskForm open={true} onClose={mockOnClose} onTaskCreated={mockOnTaskCreated} />);
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
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
