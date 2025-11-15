// src/_tests_/AddSweet.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddSweet from "../pages/AddSweet";
import axios from "axios";

vi.mock("axios");

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
    axios.post.mockResolvedValue({
      data: { message: "Sweet added" },
    });

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

    fireEvent.click(screen.getByText("Add Sweet"));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith("/api/sweets", {
        name: "Ladoo",
        category: "Indian",
        price: "30",
        quantity: "50",
      })
    );
  });
});
