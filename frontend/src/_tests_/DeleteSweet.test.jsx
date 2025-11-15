// src/_tests_/DeleteSweet.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

const mockSweets = [
  {
    _id: "1",
    name: "Ladoo",
    category: "Indian",
    price: 20,
    quantity: 5,
  },
];

describe("Delete Sweet (RED)", () => {
  test("admin should see delete button", async () => {
    axios.get.mockResolvedValue({
      data: { data: mockSweets },
    });

    render(
      <AuthContext.Provider value={{ user: { role: "admin" } }}>
        <Dashboard />
      </AuthContext.Provider>
    );

    expect(await screen.findByTestId("delete-1")).toBeDefined();
  });

  test("non-admin should NOT see delete button", async () => {
    axios.get.mockResolvedValue({
      data: { data: mockSweets },
    });

    render(
      <AuthContext.Provider value={{ user: { role: "user" } }}>
        <Dashboard />
      </AuthContext.Provider>
    );

    expect(screen.queryByTestId("delete-1")).toBeNull();
  });

  test("admin deletes a sweet and API is called", async () => {
    axios.get.mockResolvedValue({
      data: { data: mockSweets },
    });

    axios.delete.mockResolvedValue({
      data: { message: "Sweet deleted" },
    });

    render(
      <AuthContext.Provider value={{ user: { role: "admin" } }}>
        <Dashboard />
      </AuthContext.Provider>
    );

    // Ensure delete button is visible
    const btn = await screen.findByTestId("delete-1");
    fireEvent.click(btn);

    await waitFor(() =>
      expect(axios.delete).toHaveBeenCalledWith("/api/sweets/1")
    );
  });
});
