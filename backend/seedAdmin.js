const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete existing admin for clean seed
        await User.deleteOne({ username: 'admin' });
        console.log('Old admin removed (if existed)');

        const adminUser = await User.create({
            fullName: 'System Administrator',
            username: 'admin',
            email: 'admin@laxmibank.com',
            password: 'LaxmiEliteAdmin#2026!789',
            phone: '0000000000',
            address: 'Head Office, LaxmiBank'
        });

        adminUser.role = 'admin';
        await adminUser.save();

        console.log('Admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: LaxmiEliteAdmin#2026!789');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
