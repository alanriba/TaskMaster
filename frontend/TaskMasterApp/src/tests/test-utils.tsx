import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { vi } from "vitest";
import { RegisterRequest, User } from "../models/User";
import { AuthContextType } from "../types/AuthContextType";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  error: string | null;
  loading: boolean;
}

const defaultAuthValues: AuthContextValue = {
  isAuthenticated: false,
  user: null,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  clearError: vi.fn(),
  error: null,
  loading: false,
};

export const mockUseAuth = (values: Partial<AuthContextType> = {}) => {
  vi.resetModules();

  // Requiere que el mock esté dentro de cada test o `beforeEach`
  vi.doMock("../hooks/useAuth", () => ({
    useAuth: () => ({
      ...defaultAuthValues,
      ...values,
    }),
  }));
};

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  authValues?: Partial<AuthContextValue>;
  route?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { authValues = {}, route = "/", ...renderOptions }: CustomRenderOptions = {}
) {
  const mockAuthContext = {
    ...defaultAuthValues,
    ...authValues,
  };

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <AuthContext.Provider value={mockAuthContext}>
          {children}
        </AuthContext.Provider>
      </MemoryRouter>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    mockAuthContext,
  };
}
