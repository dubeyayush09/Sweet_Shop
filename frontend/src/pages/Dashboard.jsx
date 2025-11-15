import { useEffect, useState } from "react";
import { getAllSweets } from "../services/sweetService";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;

  if (sweets.length === 0) return <p>No sweets available</p>;

  return (
    <main>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>

      <ul className="space-y-4">
        {sweets.map((sweet) => (
          <li key={sweet._id} className="p-3 border rounded">
            <strong className="text-lg">{sweet.name}</strong> - ₹{sweet.price}
            <div>Category: {sweet.category}</div>
            <div>Quantity: {sweet.quantity}</div>
            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
              data-testid={`purchase-${sweet._id}`}
              disabled={sweet.quantity === 0}
            >
              Purchase
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
