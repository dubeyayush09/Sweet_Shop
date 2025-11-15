import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { vi } from "vitest";
import axios from "axios";

vi.mock("axios");

// Mock API responses
beforeEach(() => {
  axios.get.mockImplementation((url) => {
    // Initial load of all sweets (Dashboard loadData)
    if (url === "/api/sweets") {
      return Promise.resolve({
        data: {
          data: [
            {
              _id: "1",
              name: "Gulab Jamun",
              category: "Indian",
              price: 20,
              quantity: 10,
            },
            {
              _id: "2",
              name: "Rasgulla",
              category: "Bengali",
              price: 25,
              quantity: 15,
            },
          ],
        },
      });
    }

    // Search API
    if (url.includes("/api/sweets/search?name=gulab")) {
      return Promise.resolve({
        data: {
          data: [
            {
              _id: "1",
              name: "Gulab Jamun",
              category: "Indian",
              price: 20,
              quantity: 10,
            },
          ],
        },
      });
    }

    // Default fallback mock
    return Promise.resolve({ data: { data: [] } });
  });
});

// ----------------------
// TEST CASES
// ----------------------

describe("Search Feature (GREEN)", () => {
  test("renders search input", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search sweets...")).toBeDefined();
    });
  });

  test("search filters sweets", async () => {
    render(<Dashboard />);

    // Wait for initial load to finish
    await waitFor(() =>
      expect(screen.getByPlaceholderText("Search sweets...")).toBeDefined()
    );

    const input = screen.getByPlaceholderText("Search sweets...");
    fireEvent.change(input, { target: { value: "gulab" } });

    const btn = screen.getByText("Search");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeDefined();
    });
  });
});
