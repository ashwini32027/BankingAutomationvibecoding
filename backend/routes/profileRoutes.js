const express = require('express');
const router = express.Router();
const ProfileEditRequest = require('../models/ProfileEditRequest');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Submit a profile edit request
// @route   POST /api/users/profile-request
// @access  Private
router.post('/profile-request', protect, async (req, res) => {
    try {
        const { fullName, email, phone, address, nomineeName, nomineeRelationship } = req.body;

        // Logical check: only allow one pending request per user to avoid spam
        const pendingRequest = await ProfileEditRequest.findOne({ userId: req.user._id, status: 'Pending' });
        if (pendingRequest) {
            return res.status(400).json({ message: 'You already have a pending profile update request.' });
        }

        const request = await ProfileEditRequest.create({
            userId: req.user._id,
            oldValue: {
                fullName: req.user.fullName,
                email: req.user.email,
                phone: req.user.phone,
                address: req.user.address
            },
            newValue: req.body
        });

        res.status(201).json({ message: 'Update request submitted for admin approval.', request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all profile requests (Admin only)
// @route   GET /api/admin/profile-requests
// @access  Private/Admin
router.get('/admin/profile-requests', protect, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    try {
        const requests = await ProfileEditRequest.find().populate('userId', 'fullName username email').sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
