const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isArchived: { type: Boolean, default: false },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      isResolved: { type: Boolean, default: false },
    },
  ],
}, { timestamps: true });

