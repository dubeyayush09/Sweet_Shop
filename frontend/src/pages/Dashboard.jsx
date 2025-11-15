import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await axios.get("/api/sweets");
        setSweets(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSweets();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (sweets.length === 0) return <p>No sweets available</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {sweets.map((sweet) => (
          <li key={sweet._id}>
            <strong>{sweet.name}</strong> - ₹{sweet.price} ({sweet.category})
            <br />
            Quantity: {sweet.quantity}
            <br />
            <button
              data-testid={`purchase-${sweet._id}`}
              disabled={sweet.quantity === 0}
            >
              Purchase
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
