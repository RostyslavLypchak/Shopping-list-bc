const ShoppingList = require('../models/ShoppingList');

// List all accessible shopping lists
exports.listShoppingLists = async (req, res) => {
  try {
    const lists = await ShoppingList.find({ isArchived: false });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shopping lists' });
  }
};

// Get a single shopping list
exports.getShoppingList = async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) return res.status(404).json({ error: 'Shopping list not found' });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch the shopping list' });
  }
};

// Create a shopping list
exports.createShoppingList = async (req, res) => {
  try {
    const list = new ShoppingList(req.body);
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create shopping list' });
  }
};

// Delete a shopping list
exports.deleteShoppingList = async (req, res) => {
  try {
    const result = await ShoppingList.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Shopping list not found' });
    res.json({ message: 'Shopping list deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete the shopping list' });
  }
};

// Update a shopping list
exports.updateShoppingList = async (req, res) => {
  try {
    const list = await ShoppingList.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!list) return res.status(404).json({ error: 'Shopping list not found' });
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update shopping list' });
  }
};
