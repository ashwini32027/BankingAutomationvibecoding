const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    accountNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Savings', 'Current'], required: true },
    balance: { type: Number, default: 0, min: 0 },
    branchId: { type: String, default: 'LXMB001' },
    ifscCode: { type: String, default: 'LXMB0001001' },
    nomineeName: { type: String },
    nomineeRelationship: { type: String },
    beneficiaryMobile: { type: String },
    status: { type: String, enum: ['Active', 'Closed', 'Frozen'], default: 'Active' },
}, { timestamps: true });

// Auto-generate account number before saving if it doesn't exist
AccountSchema.pre('validate', function (next) {
    if (!this.accountNumber) {
        this.accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10 digit random
    }
    next();
});

module.exports = mongoose.model('Account', AccountSchema);
