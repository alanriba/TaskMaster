import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, mockUseAuth } from '../test-utils';


const mockLogin = vi.fn();

mockUseAuth({
  login: mockLogin,
  error: null,
  loading: false
});

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    error: null,
    loading: false
  })
}));


vi.mock('@mui/icons-material', () => ({
  Visibility: () => <span data-testid="visibility-icon" />,
  VisibilityOff: () => <span data-testid="visibility-off-icon" />
}));

import LoginForm from '../../components/auth/LoginForm';



describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockReset();
  });

  it('renders the form correctly', () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('allows input change and form submission', async () => {
    renderWithProviders(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });
});
