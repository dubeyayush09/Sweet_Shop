import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../pages/Register";

test("renders register form", () => {
  render(<Register />);

  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
});

test("shows validation error when fields are empty", () => {
  render(<Register />);

  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
});
