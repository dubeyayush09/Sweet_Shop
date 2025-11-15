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

const buildSearchFilter = ({ name, category, minPrice, maxPrice }) => {
  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  return filter;
};


export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const filter = {};

    // Search by name (case-insensitive, partial match)
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Search by category
    if (category) {
      filter.category = category;
    }

    // Search by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // console.log("DEBUG QUERY:", filter);

    const all = await Sweet.find();
    // console.log("DEBUG ALL SWEETS:", all);


    return res.status(200).json({ data: sweets });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

