// src/_tests_/AddSweet.test.jsx
import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// 🟢 MOCK THE SERVICE (IMPORTANT)
vi.mock("../services/sweetService.js", () => ({
  createSweet: vi.fn(() =>
    Promise.resolve({ data: { message: "Sweet added" } })
  ),
}));

import { createSweet } from "../services/sweetService.js";
import AddSweet from "../pages/AddSweet.jsx";

describe("Add Sweet Form (RED)", () => {
  test("renders add sweet form", () => {
    render(<AddSweet />);

    expect(screen.getByPlaceholderText("Enter sweet name")).toBeDefined();
    expect(screen.getByPlaceholderText("Enter category")).toBeDefined();
    expect(screen.getByPlaceholderText("Enter price")).toBeDefined();
    expect(screen.getByPlaceholderText("Enter quantity")).toBeDefined();
    expect(screen.getByText("Add Sweet")).toBeDefined();
  });

  test("submits form and calls API", async () => {
    render(<AddSweet />);

    fireEvent.change(screen.getByPlaceholderText("Enter sweet name"), {
      target: { value: "Ladoo" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter category"), {
      target: { value: "Indian" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter price"), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter quantity"), {
      target: { value: "50" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() =>
      expect(createSweet).toHaveBeenCalledWith({
        name: "Ladoo",
        category: "Indian",
        price: "30",
        quantity: "50",
      })
    );
  });
});
