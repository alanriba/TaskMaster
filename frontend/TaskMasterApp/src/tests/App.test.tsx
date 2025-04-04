import { render, screen } from '@testing-library/react';
import { describe, it, expect} from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

import { vi } from 'vitest';

vi.mock('../components/auth/LoginForm', () => ({
  default: () => <div data-testid="login-form">Mocked LoginForm</div>,
}));


describe('LoginPage', () => {
  it('renders login page correctly', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
