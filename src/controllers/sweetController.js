import Sweet from "../models/Sweet.js";

export const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sweet = await Sweet.create({ name, category, price, quantity });

    return res.status(201).json({ data: sweet });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();

    return res.status(200).json({ data: sweets });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    Object.assign(sweet, req.body);
    await sweet.save();

    return res.status(200).json({ data: sweet });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    await sweet.deleteOne();

    return res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const validateAmount = (amount) => {
  return amount && Number(amount) > 0;
};

const findSweetOr404 = async (id, res) => {
  const sweet = await Sweet.findById(id);
  if (!sweet) {
    res.status(404).json({ message: "Sweet not found" });
    return null;
  }
  return sweet;
};

export const purchaseSweet = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!validateAmount(amount)) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero" });
    }

    const sweet = await findSweetOr404(req.params.id, res);
    if (!sweet) return;

    if (sweet.quantity < amount) {
      return res.status(400).json({ message: "Not enough quantity in stock" });
    }

    sweet.quantity -= amount;
    await sweet.save();

    return res.status(200).json({ data: sweet });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const restockSweet = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!validateAmount(amount)) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero" });
    }

    const sweet = await findSweetOr404(req.params.id, res);
    if (!sweet) return;

    sweet.quantity += amount;
    await sweet.save();

    return res.status(200).json({ data: sweet });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
