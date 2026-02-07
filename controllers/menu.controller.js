import Menu from "../models/Menu.js";

export async function getMenu(req, res, next) {
  try {
    const { category, q, available } = req.query;

    const filter = {};
    if (category && category !== "all") filter.category = category;
    if (available === "true") filter.available = true;
    if (available === "false") filter.available = false;
    if (q) filter.name = { $regex: q, $options: "i" };

    const items = await Menu.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function getMenuItem(req, res, next) {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function createMenuItem(req, res, next) {
  try {
    const { name, category, price, description, imageUrl, available } =
      req.body;

    const item = await Menu.create({
      name,
      category,
      price,
      description: description || "",
      imageUrl: imageUrl || "",
      available: available !== undefined ? !!available : true,
    });

    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
}

export async function updateMenuItem(req, res, next) {
  try {
    const allowed = (({
      name,
      category,
      price,
      description,
      imageUrl,
      available,
    }) => ({
      ...(name !== undefined ? { name } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
      ...(available !== undefined ? { available } : {}),
    }))(req.body);

    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      { $set: allowed },
      { new: true, runValidators: true },
    );

    if (!updated)
      return res.status(404).json({ message: "Menu item not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
}

export async function deleteMenuItem(req, res, next) {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
}
