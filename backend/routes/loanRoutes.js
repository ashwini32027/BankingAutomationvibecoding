const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const { protect } = require('../middleware/authMiddleware');

// @desc    Request a loan
// @route   POST /api/loans
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { amount, income } = req.body;

        const loan = await Loan.create({
            userId: req.user._id,
            amount,
            income
        });

        res.status(201).json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user loans
// @route   GET /api/loans
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.user._id });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
