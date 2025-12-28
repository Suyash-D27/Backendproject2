// src/services/auth.service.js

import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
//import Hospital from "../models/hospital.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ROLES } from "../config/constants/roles.js";

class AuthService {

  // -------------------------------------------------------------
  // 1️⃣ REGISTER USER (patient, doctor, staff)
  // -------------------------------------------------------------
  async registerUser(data) {
    const { name, email, password, role, hospitalId, aadhaar, licenseNumber } = data;

    // 1. Check duplicate email
    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email already in use");

    // 2. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 3. Validate role creation logic
    if (role === ROLES.DOCTOR) {
      if (!licenseNumber) throw new Error("Doctor must provide licenseNumber");

      // Doctor must be linked to a hospital
      if (!hospitalId) throw new Error("Doctor must belong to a hospital");
    }

    if (role === ROLES.PATIENT) {
      if (!aadhaar) throw new Error("Patient must provide Aadhaar number");
    }

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      hospitalId: hospitalId || null,
      isVerified: false,   // Admin verifies doctors separately
    });

    // 5. Create role-specific profiles
    if (role === ROLES.DOCTOR) {
      await Doctor.create({
        userId: user._id,
        hospitalId,
        licenseNumber,
        specialization: data.specialization,
        isApproved: false,  // Approved by Hospital Admin
      });
    }

    if (role === ROLES.PATIENT) {
      await Patient.create({
        userId: user._id,
        hospitalId,
        aadhaar,
      });
    }

    return user;
  }

  // -------------------------------------------------------------
  // 2️⃣ LOGIN USER
  // -------------------------------------------------------------
  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    // JWT payload
    const payload = {
      userId: user._id,
      role: user.role,
      hospitalId: user.hospitalId || null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        hospitalId: user.hospitalId,
      },
    };
  }

  // -------------------------------------------------------------
  // 3️⃣ GET CURRENT USER DETAILS
  // -------------------------------------------------------------
  async getCurrentUser(userId) {
    return await User.findById(userId).select("-password");
  }
}

export default new AuthService();