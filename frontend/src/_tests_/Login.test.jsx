import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/Login";

test("renders login form", () => {
  render(<Login />);

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});

test("shows validation error when fields are empty", () => {
  render(<Login />);

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
});
