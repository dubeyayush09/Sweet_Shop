import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import axios from "axios";

vi.mock("axios");

describe("Search Feature (GREEN)", () => {
  
  test("renders search input", async () => {
    // FIRST CALL → Dashboard initial load
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<Dashboard />);

    expect(
      screen.getByPlaceholderText("Search sweets...")
    ).toBeDefined();
  });

  test("search filters sweets", async () => {
    // FIRST CALL → initial load
    axios.get.mockResolvedValueOnce({
      data: { data: [] }
    });

    render(<Dashboard />);

    const input = screen.getByPlaceholderText("Search sweets...");
    fireEvent.change(input, { target: { value: "gulab" } });

    // Setup the SECOND mock BEFORE clicking Search
    axios.get.mockResolvedValueOnce({
      data: {
        data: [
          { 
            _id: "1",
            name: "Gulab Jamun",
            price: 20,
            category: "Indian",
            quantity: 5,
          },
        ],
      },
    });

    fireEvent.click(screen.getByText("Search"));

    // Wait for UI update
    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeDefined();
    });
  });

});
