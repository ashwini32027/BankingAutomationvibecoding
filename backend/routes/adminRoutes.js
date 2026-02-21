const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Account = require('../models/Account');
const Loan = require('../models/Loan');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all users (Dashboard data)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalAccounts = await Account.countDocuments();
        const pendingLoans = await Loan.countDocuments({ status: 'Pending' });

        // Sum of all balances
        const accounts = await Account.find();
        const totalAssets = accounts.reduce((acc, curr) => acc + curr.balance, 0);

        res.json({
            totalUsers,
            totalAccounts,
            pendingLoans,
            totalAssets
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all users with their accounts
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all pending loans
// @route   GET /api/admin/loans/pending
// @access  Private/Admin
router.get('/loans/pending', protect, admin, async (req, res) => {
    try {
        const loans = await Loan.find({ status: 'Pending' }).populate('userId', 'fullName email').sort({ createdAt: -1 });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve or Reject Loan
// @route   PUT /api/admin/loans/:id
// @access  Private/Admin
router.put('/loans/:id', protect, admin, async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        loan.status = status;
        await loan.save();

        // Note: In a real system, approving a loan might also involve creating a transaction 
        // to disburse funds to one of the user's accounts. Keeping simple for this scope.

        res.json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all accounts (for search/freeze)
// @route   GET /api/admin/accounts
// @access  Private/Admin
router.get('/accounts', protect, admin, async (req, res) => {
    try {
        const accounts = await Account.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update account status
// @route   PUT /api/admin/accounts/:id/status
// @access  Private/Admin
router.put('/accounts/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body; // 'Active', 'Closed', 'Frozen'
        const account = await Account.findById(req.params.id);

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        account.status = status;
        await account.save();

        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
router.get('/transactions', protect, admin, async (req, res) => {
    try {
        const transactions = await Transaction.find().populate({
            path: 'accountId',
            populate: { path: 'userId', select: 'fullName email' }
        }).sort({ createdAt: -1 }).limit(100);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a user and their accounts
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Security check: Don't delete other admins via this route
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete an administrator' });
        }

        // Delete accounts and their associated items? 
        // For simplicity, just delete user and accounts.
        await Account.deleteMany({ userId: user._id });
        await user.deleteOne();

        res.json({ message: 'Fraudulent user and associated accounts terminated.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const ProfileEditRequest = require('../models/ProfileEditRequest');

// @desc    Get all profile update requests
// @route   GET /api/admin/profile-requests
// @access  Private/Admin
router.get('/profile-requests', protect, admin, async (req, res) => {
    try {
        const requests = await ProfileEditRequest.find().populate('userId', 'fullName email username').sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve or Reject Profile Update Request
// @route   PUT /api/admin/profile-requests/:id
// @access  Private/Admin
router.put('/profile-requests/:id', protect, admin, async (req, res) => {
    try {
        const { status, adminComment } = req.body; // 'Approved' or 'Rejected'
        const request = await ProfileEditRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (status === 'Approved') {
            const user = await User.findById(request.userId);
            if (user) {
                // Update only allowed fields
                const allowedFields = ['fullName', 'email', 'phone', 'address'];
                allowedFields.forEach(field => {
                    if (request.newValue[field]) {
                        user[field] = request.newValue[field];
                    }
                });
                await user.save();
            }
        }

        request.status = status;
        request.adminComment = adminComment;
        await request.save();

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
