/// <reference types="vitest/globals" />

import { render, screen } from '@testing-library/react';
import { describe, it, expect} from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

vi.mock('../utils/tokenStorage', () => ({
  isAuthenticated: vi.fn().mockReturnValue(false),
}));

describe('LoginPage', () => {
  it('renders login page correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});