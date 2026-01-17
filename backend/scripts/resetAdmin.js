import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

dotenv.config();

const resetAdmin = async () => {
    try {
        console.log('🔄 Resetting admin user...\n');

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'portfolio',
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected to MongoDB\n');

        // Delete existing admin
        await Admin.deleteMany({});
        console.log('🗑️  Deleted existing admin users\n');

        // Create new admin
        const passwordHash = await Admin.hashPassword(process.env.ADMIN_PASSWORD);

        const admin = new Admin({
            username: process.env.ADMIN_USERNAME.toLowerCase(),
            passwordHash
        });

        await admin.save();
        console.log('✅ New admin user created successfully');
        console.log(`   Username: ${admin.username}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD}\n`);

        console.log('🎉 Admin reset completed!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting admin:', error);
        process.exit(1);
    }
};

resetAdmin();
