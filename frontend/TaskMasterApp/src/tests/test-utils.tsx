import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { vi } from "vitest";
import { RegisterRequest, User } from "../models/User";
import { AuthContextType } from "../types/AuthContextType";
import { Tag } from "../models/Tag";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  error: string | null;
  loading: boolean;
}

const defaultAuthValues: AuthContextValue = {
  isAuthenticated: false,
  user: null,
  login: vi.fn(() => Promise.resolve()), 
  register: vi.fn(() => Promise.resolve()), 
  logout: vi.fn(() => Promise.resolve()), 
  clearError: vi.fn(() => Promise.resolve()), 
  error: null,
  loading: false,
};

export const mockUseAuth = (values: Partial<AuthContextType> = {}) => {
  vi.resetModules();

  vi.doMock("../hooks/useAuth", () => ({
    useAuth: () => ({
      ...defaultAuthValues,
      ...values,
    }),
  }));
};

export const mockTags: Tag[] = [
  {
    id: 1,
    name: "Important",
    color: "#FF5733",
  },
  {
    id: 2,
    name: "Urgent",
    color: "#33FF57",
  },
];

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

export const mockTaskServiceApi = {
  getAll: vi.fn().mockResolvedValue(mockTags),
  getAllTags: vi.fn().mockResolvedValue(mockTags),
  create: vi.fn(),
  delete: vi.fn(),
  update: vi.fn(),
  changeStatus: vi.fn(),
  createTag: vi.fn()
};