const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    description: { type: String, required: true },
    referenceId: { type: String }, // Links debit and credit parts of a transfer
}, { timestamps: true });

// Adding indexes manually for efficient find by date queries
TransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
