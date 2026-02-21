const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');

// @desc    Pay a bill
// @route   POST /api/bill-pay
// @access  Private
router.post('/', protect, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { fromAccountId, payeeName, accountNumber, amount } = req.body;

        if (amount <= 0) {
            throw new Error("Amount must be greater than zero");
        }

        // Find sender account and verify ownership
        const fromAccount = await Account.findOne({ _id: fromAccountId, userId: req.user._id }).session(session);
        if (!fromAccount) throw new Error('Source account not found or unauthorized');
        if (fromAccount.balance < amount) throw new Error('Insufficient funds');
        if (fromAccount.status !== 'Active') throw new Error('Source account is not active');

        // Deduct balance
        fromAccount.balance -= amount;
        await fromAccount.save({ session });

        const referenceId = new mongoose.Types.ObjectId().toString();

        // Log tracking for sender (debit for bill payment)
        const debitTx = await Transaction.create([{
            accountId: fromAccount._id,
            type: 'debit',
            amount,
            description: `Bill Payment to ${payeeName} (Acct: ${accountNumber})`,
            referenceId
        }], { session });

        await session.commitTransaction();
        res.json({ message: 'Bill payment successful', referenceId, transaction: debitTx[0] });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;
