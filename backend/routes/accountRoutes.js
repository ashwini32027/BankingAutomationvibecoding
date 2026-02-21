const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user accounts
// @route   GET /api/accounts
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const accounts = await Account.find({ userId: req.user._id });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single account details
// @route   GET /api/accounts/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.params.id, userId: req.user._id });
        if (!account) return res.status(404).json({ message: 'Account not found' });
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// @route   POST /api/accounts
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { type, initialDeposit, nomineeName, nomineeRelationship, beneficiaryMobile } = req.body;

        // Requirement ACCT_002: Check for existing account of the same type
        const existingAccount = await Account.findOne({ userId: req.user._id, type });
        if (existingAccount) {
            return res.status(400).json({
                message: `You already have a ${type} Account. Only one account per type is allowed.`
            });
        }

        // Check total account count (Max 2)
        const totalAccounts = await Account.countDocuments({ userId: req.user._id });
        if (totalAccounts >= 2) {
            return res.status(400).json({ message: 'Maximum 2 accounts total per user allowed.' });
        }

        const account = await Account.create({
            userId: req.user._id,
            type,
            balance: initialDeposit || 0,
            nomineeName,
            nomineeRelationship,
            beneficiaryMobile
        });

        if (initialDeposit > 0) {
            await Transaction.create({
                accountId: account._id,
                type: 'credit',
                amount: initialDeposit,
                description: 'Initial Deposit'
            });
        }

        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Transfer funds
// @route   POST /api/accounts/transfer
// @access  Private
router.post('/transfer', protect, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { fromAccountId, toAccountNumber, amount, description } = req.body;

        if (amount <= 0) {
            throw new Error("Amount must be greater than zero");
        }

        // Find sender account and verify ownership
        const fromAccount = await Account.findOne({ _id: fromAccountId, userId: req.user._id }).session(session);
        if (!fromAccount) throw new Error('Source account not found or unauthorized');
        if (fromAccount.balance < amount) throw new Error('Insufficient funds');
        if (fromAccount.status !== 'Active') throw new Error('Source account is not active');

        // Find recipient account
        const toAccount = await Account.findOne({ accountNumber: toAccountNumber }).session(session);
        if (!toAccount) throw new Error('Recipient account not found');
        if (toAccount.status !== 'Active') throw new Error('Recipient account is not active');

        // Perform transfer (Atomicity)
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await fromAccount.save({ session });
        await toAccount.save({ session });

        const referenceId = new mongoose.Types.ObjectId().toString();

        // Log tracking for sender (debit)
        const debitTx = await Transaction.create([{
            accountId: fromAccount._id,
            type: 'debit',
            amount,
            description: description || `Transfer to ${toAccountNumber}`,
            referenceId
        }], { session });

        // Log tracking for receiver (credit)
        const creditTx = await Transaction.create([{
            accountId: toAccount._id,
            type: 'credit',
            amount,
            description: `Transfer from ${fromAccount.accountNumber}`,
            referenceId
        }], { session });

        await session.commitTransaction();
        res.json({ message: 'Transfer successful', referenceId });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
});

// @desc    Get account transactions
// @route   GET /api/accounts/:id/transactions
// @access  Private
router.get('/:id/transactions', protect, async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.params.id, userId: req.user._id });
        if (!account) return res.status(404).json({ message: 'Account not found' });

        const transactions = await Transaction.find({ accountId: account._id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
