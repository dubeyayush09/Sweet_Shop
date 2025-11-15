import { useAuth } from "../context/AuthContext";

export default function AuthGuard({ children }) {
  const { user, token } = useAuth();

  const isAuthenticated = user && token;

  if (!isAuthenticated) {
    return <p>Please login to continue</p>;
  }

  return children;
}
