import Sweet from "../models/Sweet.js";

export const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || !price || !quantity) {
      return res.status(400).json({ message: "All fields required" });
    }

    const sweet = await Sweet.create({ name, category, price, quantity });

    return res.status(201).json({ data: sweet });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    return res.status(200).json({ data: sweets });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateSweet = async (req, res) => {
  try {
    const updated = await Sweet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    return res.status(200).json({ data: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteSweet = async (req, res) => {
  try {
    await Sweet.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
