import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSweetById, updateSweet } from "../services/sweetService";

export default function EditSweet() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSweetById(id);

        setForm({
          name: res.data.name,
          category: res.data.category,
          price: String(res.data.price),
          quantity: String(res.data.quantity),
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to load sweet.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.price || !form.quantity) {
      alert("All fields are required.");
      return;
    }

    await updateSweet(id, {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });

    alert("Sweet updated successfully!");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const fields = [
    { name: "name", placeholder: "Enter sweet name" },
    { name: "category", placeholder: "Enter category" },
    { name: "price", placeholder: "Enter price", type: "number" },
    { name: "quantity", placeholder: "Enter quantity", type: "number" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Sweet</h2>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <input
            key={field.name}
            data-testid={field.name}
            className="border p-2 block mb-2"
            name={field.name}
            placeholder={field.placeholder}
            type={field.type || "text"}
            value={form[field.name]}
            onChange={handleChange}
          />
        ))}

        <button
          data-testid="update-btn"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          type="submit"
        >
          Update Sweet
        </button>
      </form>
    </div>
  );
}
