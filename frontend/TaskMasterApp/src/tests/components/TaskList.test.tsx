import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import TaskList from '../../components/tasks/TaskList';
import { Task } from '../../models/Task';
vi.mock('../../api/taskApi', () => ({
  TaskServiceApi: {
    getAll: vi.fn(),
    delete: vi.fn()
  }
}));

import { TaskServiceApi } from '../../api/taskApi';

// ✅ Mock del componente CreateTaskForm
vi.mock('../../components/tasks/CreateTaskForm', () => ({
  default: () => <div data-testid="create-task-form">CreateTaskForm</div>
}));

vi.mock('../../components/tasks/EditTaskForm', () => ({
  default: () => <div data-testid="edit-task-form">Mock EditTaskForm</div>
}));

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task.',
    status: 'pending',
    priority: 'medium',
    due_date: null,
    category: null,
    category_name: null,
    category_color: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title and button', async () => {
    (TaskServiceApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    render(<TaskList />);
    await waitFor(() => expect(TaskServiceApi.getAll).toHaveBeenCalled());
    expect(screen.getByText(/my tasks/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument();
  });

  it('should show loading spinner initially', async () => {
    (TaskServiceApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    render(<TaskList />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(TaskServiceApi.getAll).toHaveBeenCalled());
  });

  it('should show empty message if no tasks', async () => {
    (TaskServiceApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    render(<TaskList />);
    await waitFor(() =>
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument()
    );
  });

  it('should show task if tasks are returned', async () => {
    (TaskServiceApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks);
    render(<TaskList />);
  
    const matches = await screen.findAllByText(/test task/i);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]).toBeInTheDocument();
  
    expect(screen.getByText(/this is a test task/i)).toBeInTheDocument();
  });
  

  it('should show error message if request fails', async () => {
    (TaskServiceApi.getAll as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed to load'));
    render(<TaskList />);
    await waitFor(() =>
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    );
  });

  it('should show CreateTaskForm when "New Task" button is clicked', async () => {
    (TaskServiceApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    render(<TaskList />);
    fireEvent.click(screen.getByRole('button', { name: /new task/i }));
    expect(await screen.findByTestId('create-task-form')).toBeInTheDocument();
  });
});

describe('TaskList - Delete Task Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show empty message if no tasks', async () => {
    (TaskServiceApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    render(<TaskList />);
    await waitFor(() =>
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument()
    );
  });

  it('should open delete confirmation dialog when "Delete" is clicked', async () => {
    (TaskServiceApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks);

    render(<TaskList />);
    await waitFor(() => expect(TaskServiceApi.getAll).toHaveBeenCalled());

    const deleteBtn = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(await screen.findByText(/confirm deletion/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
  });

  it('should call TaskServiceApi.delete and show success message when confirmed', async () => {
    (TaskServiceApi.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockTasks);
    (TaskServiceApi.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    render(<TaskList />);
    await waitFor(() => expect(TaskServiceApi.getAll).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await screen.findByText(/confirm deletion/i);

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(TaskServiceApi.delete).toHaveBeenCalledWith(1);
    });

    expect(await screen.findByText(/task deleted successfully/i)).toBeInTheDocument();
  });
});