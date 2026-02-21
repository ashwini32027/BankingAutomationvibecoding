const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date },
    govtId: { type: String }, // PAN or Aadhaar
    status: { type: String, enum: ['Active', 'Pending', 'Blocked'], default: 'Active' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Exclude password field when sending user document back to clients
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', UserSchema);
