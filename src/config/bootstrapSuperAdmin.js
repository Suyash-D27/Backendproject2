import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { ROLES } from "./constants/roles.js";

const bootstrapSuperAdmin = async () => {
    try {
        const exists = await User.findOne({ role: ROLES.SUPER_ADMIN });

        if (exists) {
            console.log("✅ Super admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            process.env.SUPER_ADMIN_PASSWORD || "admin123", // Fallback if env missing
            10
        );

        await User.create({
            fullName: "System Super Admin",
            email: process.env.SUPER_ADMIN_EMAIL || "admin@system.com",
            phone: process.env.SUPER_ADMIN_PHONE,
            password: hashedPassword,
            role: ROLES.SUPER_ADMIN,
            isActive: true
        });

        console.log("🚀 Super admin created successfully");
    } catch (error) {
        console.error("⚠️ Super Admin Bootstrap Warning:", error.message);
        // Do not crash the server
    }
};

export default bootstrapSuperAdmin;

