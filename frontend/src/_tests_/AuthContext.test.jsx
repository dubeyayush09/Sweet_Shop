import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { act } from "react-dom/test-utils";

function TestComponent() {
  const { user, token, login, logout } = useAuth();

  return (
    <div>
      <p data-testid="user">{user ? user.email : "null"}</p>
      <p data-testid="token">{token || "null"}</p>
      <button onClick={() => login({ email: "test@test.com" }, "fake-jwt")}>
        Test Login
      </button>
      <button onClick={logout}>Test Logout</button>
    </div>
  );
}

test("AuthProvider provides default values", () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  expect(screen.getByTestId("user").textContent).toBe("null");
  expect(screen.getByTestId("token").textContent).toBe("null");
});

test("login updates user and token", () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  act(() => {
    screen.getByText("Test Login").click();
  });

  expect(screen.getByTestId("user").textContent).toBe("test@test.com");
  expect(screen.getByTestId("token").textContent).toBe("fake-jwt");
});

test("logout resets user and token", () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  act(() => {
    screen.getByText("Test Login").click();
    screen.getByText("Test Logout").click();
  });

  expect(screen.getByTestId("user").textContent).toBe("null");
  expect(screen.getByTestId("token").textContent).toBe("null");
});
