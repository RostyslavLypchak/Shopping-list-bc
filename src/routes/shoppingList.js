
const express = require('express');
const Joi = require('joi');
const ShoppingList = require('../models/ShoppingList');
const User = require('../models/User'); // Assuming you have a User model
const { authorizeAdmin, authenticate } = require('../middleware/auth');
const shoppingListController = require('../controllers/shoppingListController');

const router = express.Router();

// Input Validation Schemas using Joi
const createListSchema = Joi.object({
  name: Joi.string().required(),
  members: Joi.array().items(Joi.string().hex().length(24)), // Array of user IDs
  isArchived: Joi.boolean(),
  items: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().required(),
    isResolved: Joi.boolean()
  }))
});

// POST /shoppingLists - Create a Shopping List
router.post('/', authenticate, async (req, res) => {
  const { error } = createListSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, members = [], isArchived = false, items = [] } = req.body;

  try {
    const shoppingList = new ShoppingList({
      name,
      ownerId: req.user.id,  // Assuming the authenticated user ID is in req.user
      members,
      isArchived,
      items
    });
    await shoppingList.save();
    res.status(201).json({ shoppingList });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create shopping list' });
  }
});

// POST /shoppingLists/:id/items - Add an Item to a Shopping List
router.post('/:id/items', authenticate, async (req, res) => {
  const { name, quantity, isResolved } = req.body;
  const shoppingListId = req.params.id;

  try {
    const shoppingList = await ShoppingList.findById(shoppingListId);
    if (!shoppingList) return res.status(404).json({ error: 'Shopping list not found' });
    if (!shoppingList.members.includes(req.user.id) && shoppingList.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const item = { name, quantity, isResolved: isResolved || false };
    shoppingList.items.push(item);
    await shoppingList.save();
    res.status(201).json({ shoppingList });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// POST /shoppingLists/:id/assignAdministrator - Assign an Admin to Shopping List
router.post('/:id/assignAdministrator', authenticate, authorizeAdmin, async (req, res) => {
  const { userId } = req.body;
  const shoppingListId = req.params.id;

  try {
    const shoppingList = await ShoppingList.findById(shoppingListId);
    if (!shoppingList) return res.status(404).json({ error: 'Shopping list not found' });

    if (!shoppingList.admins.includes(userId)) {
      shoppingList.admins.push(userId);
      await shoppingList.save();
    }
    res.status(200).json({ message: 'Administrator assigned', shoppingList });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign administrator' });
  }
});

// GET /notifications - Get Notifications (for user-related notifications)
router.get('/notifications', authenticate, async (req, res) => {
  try {
    const notifications = []; // Get notifications for the authenticated user
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// List all shopping lists
router.get('/', shoppingListController.listShoppingLists);

// Get a single shopping list
router.get('/:id', shoppingListController.getShoppingList);

// Create a shopping list
router.post('/', shoppingListController.createShoppingList);

// Delete a shopping list
router.delete('/:id', shoppingListController.deleteShoppingList);

// Update a shopping list
router.patch('/:id', shoppingListController.updateShoppingList);

module.exports = router;
