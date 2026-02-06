import Menu from "../models/Menu.js";

export async function getMenu(req, res, next) {
  try {
    const items = await Menu.find({}).sort({ createdAt: -1 });
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
    const created = await Menu.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function updateMenuItem(req, res, next) {
  try {
    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
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
