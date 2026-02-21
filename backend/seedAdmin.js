const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@laxmibank.com';
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            console.error('Error: ADMIN_PASSWORD is not defined in .env');
            process.exit(1);
        }

        // Delete existing admin for clean seed
        await User.deleteOne({ username: adminUsername });
        console.log('Old admin removed (if existed)');

        const adminUser = await User.create({
            fullName: 'System Administrator',
            username: adminUsername,
            email: adminEmail,
            password: adminPassword,
            phone: '0000000000',
            address: 'Head Office, LaxmiBank'
        });

        adminUser.role = 'admin';
        await adminUser.save();

        console.log('Admin user created successfully!');
        console.log(`Username: ${adminUsername}`);
        console.log('Password: (hidden for security - check .env if needed)');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
