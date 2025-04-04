
import { vi } from 'vitest';

vi.mock('../components/auth/LoginForm', () => ({
  default: () => <div data-testid="login-form">Mocked LoginForm</div>,
}));

