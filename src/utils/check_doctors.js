
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const checkDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const doctors = await User.find({ role: 'DOCTOR' });

        console.log(`\nFound ${doctors.length} Doctors:`);
        doctors.forEach(d => {
            console.log(`- Name: ${d.fullName}, ID: ${d._id}, Role: ${d.role}`);
        });

        if (doctors.length === 0) {
            console.log("\n⚠️ NO DOCTORS FOUND! You need to create one properly.");
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkDoctors();
