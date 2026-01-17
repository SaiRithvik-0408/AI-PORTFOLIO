import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Config from '../models/Config.js';

// Load environment variables
dotenv.config();

// Default configuration
const DEFAULT_CONFIG = {
    colors: {
        primary: 'indigo-500',
        secondary: 'purple-500',
        accent: 'pink-500',
        glow: 'from-indigo-500/50 via-purple-500/50 to-pink-500/50',
        background: '#0f172a'
    },
    sections: {
        home: true,
        about: true,
        resume: true,
        projects: true,
        certificates: true,
        coding: true,
        contact: true,
        background3D: false
    }
};

const seedAdmin = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected to MongoDB\n');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({
            username: process.env.ADMIN_USERNAME.toLowerCase()
        });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists. Skipping admin creation.\n');
        } else {
            // Create admin user
            const passwordHash = await Admin.hashPassword(process.env.ADMIN_PASSWORD);

            const admin = new Admin({
                username: process.env.ADMIN_USERNAME.toLowerCase(),
                passwordHash
            });

            await admin.save();
            console.log('✅ Admin user created successfully');
            console.log(`   Username: ${admin.username}\n`);
        }

        // Check if config already exists
        const existingConfig = await Config.findOne({ configKey: 'portfolio' });

        if (existingConfig) {
            console.log('⚠️  Portfolio config already exists. Skipping config creation.\n');
        } else {
            // Create default config
            const config = new Config({
                configKey: 'portfolio',
                configData: DEFAULT_CONFIG
            });

            await config.save();
            console.log('✅ Default portfolio configuration created\n');
        }

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('You can now login with:');
        console.log(`   Username: ${process.env.ADMIN_USERNAME}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD}\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedAdmin();
