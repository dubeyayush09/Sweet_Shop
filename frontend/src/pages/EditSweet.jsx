// src/pages/EditSweet.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EditSweet() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    const fetchSweet = async () => {
      try {
        const res = await axios.get(`/api/sweets/${id}`);

        setForm({
          name: res.data.name,
          category: res.data.category,
          price: res.data.price,
          quantity: res.data.quantity,
        });

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch sweet:", err);
        setLoading(false);
      }
    };

    fetchSweet();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(`/api/sweets/${id}`, {
      name: String(form.name),
      category: String(form.category),
      price: String(form.price),
      quantity: String(form.quantity),
    });
    alert("Sweet updated!");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Sweet</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 block mb-2"
          data-testid="name"
          name="name"
          placeholder="Enter sweet name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="border p-2 block mb-2"
          data-testid="category"
          name="category"
          placeholder="Enter category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          className="border p-2 block mb-2"
          data-testid="price"
          name="price"
          placeholder="Enter price"
          type="number"
          value={form.price}
          onChange={handleChange}
        />

        <input
          className="border p-2 block mb-2"
          data-testid="quantity"
          name="quantity"
          placeholder="Enter quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
        />

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          data-testid="update-btn"
          type="submit"
        >
          Update Sweet
        </button>
      </form>
    </div>
  );
}
