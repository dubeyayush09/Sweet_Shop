import { useEffect, useState } from "react";
import axios from "axios";
import { getAllSweets } from "../services/sweetService";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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
      const res = await axios.get(`/api/sweets/search?name=${query}`);
      setSweets(res.data.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>

      {/* ✅ Search Bar */}
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

      {/* List */}
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
              {/* Out of Stock Message */}
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
                onClick={() => {
                  setSweets((prev) =>
                    prev.map((s) =>
                      s._id === sweet._id
                        ? { ...s, quantity: s.quantity - 1 }
                        : s
                    )
                  );
                }}
              >
                Purchase
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
