import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

const mockSweets = [
  {
    _id: "1",
    name: "Gulab Jamun",
    category: "Indian",
    price: 20,
    quantity: 10,
  },
  { _id: "2", name: "Rasgulla", category: "Bengali", price: 25, quantity: 0 },
];

test("shows loading initially", () => {
  axios.get.mockResolvedValue({ data: { data: [] } });

  render(<Dashboard />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("renders sweets list", async () => {
  axios.get.mockResolvedValue({ data: { data: mockSweets } });

  render(<Dashboard />);

  expect(await screen.findByText("Gulab Jamun")).toBeInTheDocument();
  expect(screen.getByText("Rasgulla")).toBeInTheDocument();
});

test("disables purchase button when quantity is zero", async () => {
  axios.get.mockResolvedValue({ data: { data: mockSweets } });

  render(<Dashboard />);

  await screen.findByText("Gulab Jamun");

  const rasgullaBtn = screen.getByTestId("purchase-2");
  expect(rasgullaBtn).toBeDisabled();
});

test("shows message if no sweets available", async () => {
  axios.get.mockResolvedValue({ data: { data: [] } });

  render(<Dashboard />);

  expect(await screen.findByText(/no sweets available/i)).toBeInTheDocument();
});
