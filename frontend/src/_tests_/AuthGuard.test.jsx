import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { AuthContext } from "../context/AuthContext";
import { vi } from "vitest";

// Mock services to prevent real API calls
vi.mock("../services/sweetService", () => ({
  getAllSweets: vi.fn(() =>
    Promise.resolve({
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
    })
  ),
  searchSweets: vi.fn(),
  restockSweet: vi.fn(),
}));

describe("Dashboard Auth Guard (RED)", () => {
  const renderWithAuth = (authValue) => {
    return render(
      <AuthContext.Provider value={authValue}>
        <Dashboard />
      </AuthContext.Provider>
    );
  };

  test("blocks unauthenticated user and shows login message", async () => {
    renderWithAuth({
      user: null,
      token: null,
      isAdmin: false,
    });

    expect(screen.getByText("Please login to continue")).toBeDefined();
  });

  test("allows authenticated user to access dashboard", async () => {
    renderWithAuth({
      user: { role: "user" },
      token: "fake-jwt-token",
      isAdmin: false,
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    expect(screen.getByText("Dashboard")).toBeDefined();
    expect(screen.getByText("Ladoo")).toBeDefined();
  });

  test("admin should see delete/restock controls", async () => {
    renderWithAuth({
      user: { role: "admin" },
      token: "jwt",
      isAdmin: true,
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    expect(screen.getByTestId("delete-1")).toBeDefined();
    expect(screen.getByTestId("restock-input-1")).toBeDefined();
    expect(screen.getByTestId("restock-btn-1")).toBeDefined();
  });

  test("normal user should NOT see admin controls", async () => {
    renderWithAuth({
      user: { role: "user" },
      token: "jwt",
      isAdmin: false,
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).toBeNull();
    });

    expect(screen.queryByTestId("delete-1")).toBeNull();
    expect(screen.queryByTestId("restock-input-1")).toBeNull();
    expect(screen.queryByTestId("restock-btn-1")).toBeNull();
  });
});