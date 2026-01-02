
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { ROLES } from '../config/constants/roles.js';

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const email = "admin@healthcare.com";
        const password = "adminpassword123";

        // Check if exists
        let admin = await User.findOne({ email });

        if (admin) {
            console.log("⚠️ Super Admin already exists:");
            console.log(`Email: ${email}`);
            console.log(`Role: ${admin.role}`);

            if (admin.role !== ROLES.SUPER_ADMIN) {
                console.log("Updating role to SUPER_ADMIN...");
                admin.role = ROLES.SUPER_ADMIN;
                await admin.save();
                console.log("✅ Role Updated!");
            }
        } else {
            // Create new
            const hashedPassword = await bcrypt.hash(password, 10);
            admin = await User.create({
                fullName: "System Super Admin",
                email,
                password: hashedPassword,
                role: ROLES.SUPER_ADMIN,
                isVerified: true
            });
            console.log("✅ Super Admin Created Successfully!");
        }

        console.log("\n📋 Use these credentials to Login:");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

createSuperAdmin();
