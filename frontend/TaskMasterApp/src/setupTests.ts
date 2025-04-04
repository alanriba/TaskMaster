import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("./hooks/useAuth", () => ({
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

export const TaskServiceApi = {
  getAll: vi.fn().mockResolvedValue([]),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  changeStatus: vi.fn(),
  getAllTags: vi.fn().mockResolvedValue([]),
  createTag: vi.fn().mockImplementation(async (name: string) => ({
    id: Math.floor(Math.random() * 1000),
    name,
    created_at: new Date().toISOString(),
  })),
};

vi.mock("./api/taskApi", async () => {
  const actual = await vi.importActual("../api/taskApi");
  return {
    ...actual,
    TaskServiceApi: {
      getAll: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      getAllTags: vi.fn().mockResolvedValue([]),
      createTag: vi
        .fn()
        .mockResolvedValue({
          id: 999,
          name: "new",
          created_at: new Date().toISOString(),
        }),
    },
  };
});
