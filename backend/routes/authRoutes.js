const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { fullName, username, email, password, phone, address, dateOfBirth, govtId } = req.body;

        // Check if user exists
        let userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            fullName,
            username,
            email,
            password,
            phone,
            address,
            dateOfBirth,
            govtId
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check for user
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(401).json({
                message: `Account is temporarily locked. Try again in ${Math.ceil((user.lockUntil - Date.now()) / 60000)} minutes.`
            });
        }

        if (await user.comparePassword(password)) {
            // Success: Reset attempts
            user.loginAttempts = 0;
            user.lockUntil = undefined;
            await user.save();

            res.json({
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            // Failure: Increment attempts
            user.loginAttempts += 1;
            if (user.loginAttempts >= 3) {
                user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes lock
            }
            await user.save();

            const remaining = 3 - user.loginAttempts;
            const msg = remaining > 0
                ? `Invalid credentials. ${remaining} attempts remaining.`
                : 'Account locked due to multiple failed attempts. Try again in 30 minutes.';

            res.status(401).json({ message: msg });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
