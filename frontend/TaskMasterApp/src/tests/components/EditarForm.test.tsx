// src/tests/components/EditTaskForm.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditTaskForm from "../../components/tasks/EditTaskForm";
import { Task } from "../../models/Task";

vi.mock("../../api/taskApi", async () => ({
  TaskServiceApi: {
    update: vi.fn(),
  },
}));

const mockTask: Task = {
  id: 1,
  title: "Sample Task",
  description: "Sample description",
  status: "pending",
  priority: "medium",
  due_date: "2025-04-10",
  created_at: "2025-04-01T00:00:00Z",
  updated_at: "2025-04-01T00:00:00Z",
  category: null,
  category_name: null,
  category_color: null,
};

describe("EditTaskForm", () => {
  it("renders form with task data", () => {
    render(
      <EditTaskForm
        open={true}
        onClose={() => {}}
        onTaskUpdated={() => {}}
        task={mockTask}
      />
    );

    expect(screen.getByDisplayValue("Sample Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sample description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update task/i })
    ).toBeInTheDocument();
  });
});
