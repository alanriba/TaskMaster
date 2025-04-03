import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

vi.mock('@mui/icons-material', () => ({
  Visibility: () => <span />,
  VisibilityOff: () => <span />
}));

const mockRegister = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    register: mockRegister,
    loading: false,
    error: null
  })
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits the form with correct values', async () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'New' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'user@example.com',
        first_name: 'New',
        last_name: 'User',
        password: '123456',
        password_confirm: '123456'
      });
    });
  });
});
