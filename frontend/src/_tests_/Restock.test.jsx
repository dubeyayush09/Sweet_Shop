import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { vi } from "vitest";
import { restockSweet } from "../services/sweetService";

// Mock axios
vi.mock("axios", () => ({
  default: {
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock sweet services
vi.mock("../services/sweetService", () => ({
  getAllSweets: vi.fn(() => {
    return Promise.resolve({
      data: {
        data: [
          {
            _id: "1",
            name: "Ladoo",
            category: "Indian",
            price: 20,
            quantity: 5,
          },
        ],
      },
    });
  }),

  restockSweet: vi.fn((id, amount) =>
    Promise.resolve({ data: { message: "Restocked" } })
  ),

  searchSweets: vi.fn(() => Promise.resolve({ data: { data: [] } })),
}));

describe("Restock Sweet (RED)", () => {
  const renderWithAuth = (userRole) => {
    return render(
      <AuthContext.Provider
        value={{
          user: { role: userRole },
          isAdmin: userRole === "admin",
        }}
      >
        <Dashboard />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    axios.post.mockReset();
    axios.delete.mockReset();
  });

  test("admin can see restock input and button", async () => {
    renderWithAuth("admin");

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    expect(screen.getByTestId("restock-input-1")).toBeDefined();
    expect(screen.getByTestId("restock-btn-1")).toBeDefined();
  });

  test("non-admin CANNOT see restock controls", async () => {
    renderWithAuth("user");

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    expect(screen.queryByTestId("restock-input-1")).toBeNull();
    expect(screen.queryByTestId("restock-btn-1")).toBeNull();
  });

  test("admin restocks sweet and API is called", async () => {
    renderWithAuth("admin");

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const input = screen.getByTestId("restock-input-1");
    fireEvent.change(input, { target: { value: "3" } });

    fireEvent.click(screen.getByTestId("restock-btn-1"));

    await waitFor(() => expect(restockSweet).toHaveBeenCalledWith("1", 3));
  });

  test("restock increases quantity in UI", async () => {
    renderWithAuth("admin");

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    const qtyBefore = screen.getByTestId("qty-1").textContent;
    expect(qtyBefore).toBe("5");

    const input = screen.getByTestId("restock-input-1");
    fireEvent.change(input, { target: { value: "2" } });

    fireEvent.click(screen.getByTestId("restock-btn-1"));

    await waitFor(() =>
      expect(screen.getByTestId("qty-1").textContent).toBe("7")
    );
  });
});
