const mongoose = require('mongoose');

const ProfileEditRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    oldValue: { type: Object, required: true },
    newValue: { type: Object, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    adminComment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ProfileEditRequest', ProfileEditRequestSchema);
