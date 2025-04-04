import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});


// Mock for useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});


vi.mock('./hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(() => Promise.resolve()), 
    logout: vi.fn(() => Promise.resolve()),
    register: vi.fn(() => Promise.resolve()),
    clearError: vi.fn(() => Promise.resolve()), 
    error: null,
    loading: false,
    isAuthenticated: false,
  }),
}));