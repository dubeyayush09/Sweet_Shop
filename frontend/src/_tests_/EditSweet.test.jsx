// src/_tests_/EditSweet.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditSweet from "../pages/EditSweet";
import axios from "axios";
import { vi } from "vitest";

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          data: {
            name: "Gulab Jamun",
            category: "Indian",
            price: 20,
            quantity: 10,
          },
        },
      })
    ),
    put: vi.fn(() => Promise.resolve({ data: { message: "Updated" } })),
  },
}));

describe("Edit Sweet (RED)", () => {
  test("renders edit sweet form with existing data", async () => {
    render(
      <MemoryRouter initialEntries={["/edit/123"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditSweet />} />
        </Routes>
      </MemoryRouter>
    );

    // Should show loading initially
    expect(screen.getByText("Loading...")).toBeDefined();

    // After data loads
    expect(await screen.findByDisplayValue("Gulab Jamun")).toBeDefined();
    expect(screen.getByDisplayValue("Indian")).toBeDefined();
    expect(screen.getByDisplayValue("20")).toBeDefined();
    expect(screen.getByDisplayValue("10")).toBeDefined();
  });

  test("updates sweet and calls API", async () => {
    render(
      <MemoryRouter initialEntries={["/edit/123"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditSweet />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for prefilled data
    await screen.findByDisplayValue("Gulab Jamun");

    fireEvent.change(screen.getByPlaceholderText("Enter sweet name"), {
      target: { value: "Updated Jamun" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter price"), {
      target: { value: "25" },
    });

    fireEvent.click(screen.getByTestId("update-btn"));

    await waitFor(() =>
      expect(axios.put).toHaveBeenCalledWith("/api/sweets/123", {
        name: "Updated Jamun",
        category: "Indian",
        price: "25",
        quantity: "10",
      })
    );
  });
});
