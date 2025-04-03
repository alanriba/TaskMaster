import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

vi.mock('../utils/tokenStorage', () => ({
  isAuthenticated: vi.fn().mockReturnValue(false),
}));


vi.mock('../components/auth/LoginForm', () => ({
  default: () => <div data-testid="login-form">Mock LoginForm</div>,
}));

describe('LoginPage', () => {
  it('renders login page correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
