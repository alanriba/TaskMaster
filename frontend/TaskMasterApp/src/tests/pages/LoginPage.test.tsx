import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test-utils';

// Mock the LoginForm component to simplify testing
vi.mock('../../components/auth/LoginForm', () => ({
  default: () => <div data-testid="login-form">Login Form Component</div>
}));

// IMPORTAR DESPUÉS DEL MOCK
import LoginPage from '../../pages/LoginPage';

describe('LoginPage', () => {
  it('renders login page correctly', () => {
    const { container } = renderWithProviders(<LoginPage />);
    
    // Check if the LoginForm component is rendered
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    
    // Check if the page has the correct class
    expect(container.querySelector('.login-page')).toBeInTheDocument();
  });
});