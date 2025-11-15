import { useState } from "react";
import { createSweet } from "../services/sweetService";

export default function AddSweet() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSweet(form); // ⬅ THIS is what test is expecting
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Sweet</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 block mb-2"
          name="name"
          data-testid="name"
          placeholder="Enter sweet name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="border p-2 block mb-2"
          name="category"
          data-testid="category"
          placeholder="Enter category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          className="border p-2 block mb-2"
          name="price"
          data-testid="price"
          type="number"
          placeholder="Enter price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          className="border p-2 block mb-2"
          name="quantity"
          data-testid="quantity"
          type="number"
          placeholder="Enter quantity"
          value={form.quantity}
          onChange={handleChange}
        />

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          data-testid="submit-btn"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
