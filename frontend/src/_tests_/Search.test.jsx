import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import axios from "axios";

vi.mock("axios");

describe("Search Feature (RED)", () => {
  test("renders search input", () => {
    render(<Dashboard />);
    expect(screen.getByPlaceholderText("Search sweets...")).toBeDefined();
  });

  test("search filters sweets", async () => {
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

    render(<Dashboard />);

    // type in the search box
    const input = screen.getByPlaceholderText("Search sweets...");
    fireEvent.change(input, { target: { value: "gulab" } });

    // click search
    fireEvent.click(screen.getByText("Search"));

    // mock API return after search
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

    await waitFor(() => {
      expect(screen.getByText("Gulab Jamun")).toBeDefined();
    });
  });
});
