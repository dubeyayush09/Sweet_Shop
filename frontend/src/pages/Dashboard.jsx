import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getAllSweets,
  searchSweets,
  restockSweet,
} from "../services/sweetService";
import axios from "axios";

export default function Dashboard() {
  // Safe Auth fallback
  const auth = useContext(AuthContext) || {};
  const user = auth.user || null;
  const token = auth.token || null;

  const isAdmin =
    (user?.role && user.role.toLowerCase() === "admin") ||
    auth.isAdmin ||
    false;

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [restockValues, setRestockValues] = useState({});

  // ⛔ Guard: Must be logged in
//   if (!user || !token) {
//     return <p>Please login to continue</p>;
//   }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getAllSweets();
      setSweets(res.data.data);
    } catch (err) {
      console.error("Failed to fetch sweets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await searchSweets(query);
      setSweets(res.data.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/sweets/${id}`);
      setSweets((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleRestock = async (id) => {
    const amount = Number(restockValues[id] || 0);
    if (!amount || amount <= 0) return;

    try {
      await restockSweet(id, amount);
      setSweets((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, quantity: s.quantity + amount } : s
        )
      );
      setRestockValues((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Restock failed:", err);
    }
  };

   const authProvided = auth && Object.keys(auth).length > 0;

   if (authProvided && !user) {
     return <p>Please login to continue</p>;
   }

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          placeholder="Search sweets..."
          className="border p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="search-input"
        />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-blue-500 text-white"
          data-testid="search-btn"
        >
          Search
        </button>
      </div>

      {sweets.length === 0 ? (
        <p>No sweets available</p>
      ) : (
        <ul className="space-y-4">
          {sweets.map((sweet) => (
            <li key={sweet._id} className="p-3 border rounded">
              <strong className="text-lg">{sweet.name}</strong> - ₹{sweet.price}
              <div>Category: {sweet.category}</div>
              <div>
                Quantity:{" "}
                <span data-testid={`qty-${sweet._id}`}>{sweet.quantity}</span>
              </div>
              {sweet.quantity === 0 && (
                <p
                  className="text-red-600 font-semibold"
                  data-testid={`outofstock-${sweet._id}`}
                >
                  Out of stock
                </p>
              )}
              <button
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
                data-testid={`purchase-${sweet._id}`}
                disabled={sweet.quantity === 0}
                onClick={() =>
                  setSweets((prev) =>
                    prev.map((s) =>
                      s._id === sweet._id
                        ? { ...s, quantity: s.quantity - 1 }
                        : s
                    )
                  )
                }
              >
                Purchase
              </button>
              {/* Admin Controls */}
              {isAdmin && (
                <>
                  <button
                    className="ml-3 px-3 py-1 bg-red-500 text-white rounded"
                    data-testid={`delete-${sweet._id}`}
                    onClick={() => handleDelete(sweet._id)}
                  >
                    Delete
                  </button>

                  <div className="mt-2 flex items-center">
                    <input
                      type="number"
                      placeholder="Restock amount"
                      className="border p-1 w-24"
                      data-testid={`restock-input-${sweet._id}`}
                      value={restockValues[sweet._id] || ""}
                      onChange={(e) =>
                        setRestockValues((prev) => ({
                          ...prev,
                          [sweet._id]: e.target.value,
                        }))
                      }
                    />

                    <button
                      className="ml-2 px-2 py-1 bg-green-600 text-white rounded"
                      data-testid={`restock-btn-${sweet._id}`}
                      onClick={() => handleRestock(sweet._id)}
                    >
                      Restock
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
