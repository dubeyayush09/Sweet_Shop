import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import * as sweetService from "../services/sweetService";

describe("Purchase Feature (RED)", () => {
  test("purchase button reduces quantity by 1", async () => {
    const mockSweet = {
      _id: "123",
      name: "Gulab Jamun",
      price: 20,
      quantity: 5,
      category: "Indian",
    };

    // mock API
    vi.spyOn(sweetService, "getAllSweets").mockResolvedValue({
      data: { data: [mockSweet] },
    });

    vi.spyOn(sweetService, "purchaseSweet").mockResolvedValue({
      data: { message: "Purchased" },
    });

    render(<Dashboard />);

    // Wait for sweets to load
    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeDefined();
    });

    const qtyBefore = screen.getByTestId("qty-123").textContent;

    const btn = screen.getByTestId("purchase-123");

    fireEvent.click(btn);

    // After purchase, quantity should reduce by one
    await waitFor(() => {
      expect(screen.getByTestId("qty-123").textContent).toBe(
        String(Number(qtyBefore) - 1)
      );
    });
  });

  test("disables purchase button when quantity reaches zero", async () => {
    const mockSweet = {
      _id: "123",
      name: "Barfi",
      price: 30,
      quantity: 0,
      category: "Milk",
    };

    vi.spyOn(sweetService, "getAllSweets").mockResolvedValue({
      data: { data: [mockSweet] },
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Barfi")).toBeDefined();
    });

    const btn = screen.getByTestId("purchase-123");

    expect(btn).toBeDisabled();
    expect(screen.getByText("Out of stock")).toBeDefined();
  });
});
