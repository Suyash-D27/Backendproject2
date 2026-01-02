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
  // -------------------------------------------------------------
  // 1️⃣ REGISTER USER (patient, doctor, staff)
  // -------------------------------------------------------------
  async registerUser(data) {
    let { fullName, email, phone, password, role, hospitalId, aadhaar, licenseNumber, bloodGroup, age, gender, weight } = data;

    // Default to GUEST if role is missing
    if (!role) {
      role = "GUEST"; // or ROLES.GUEST if I can ensure import
    }

    // 1. Validate Identifier (Email OR Phone)
    if (!email && !phone) {
      throw new Error("Either Email or Phone is required");
    }

    // 2. Check duplicates
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) throw new Error("Email already in use");
    }
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) throw new Error("Phone already in use");
    }

    // 4. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 5. Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      // uniqueId: Generated ONLY after first appointment (Role Upgrade)
      password: hashed,
      role,
      hospitalId: hospitalId || null,
      isVerified: false,
    });

    // 6. Role Profile Creation (Doctor/Patient logic...)
    if (role === ROLES.DOCTOR) {
      if (!licenseNumber || !hospitalId) throw new Error("Doctor details incomplete");
      await Doctor.create({
        userId: user._id,
        hospitalId,
        licenseNumber,
        specialization: data.specialization,
        isApproved: false,
      });
    }

    if (role === ROLES.PATIENT) {
      // Logic for pre-declared PATIENT role signup? Usually uncommon if upgrading from GUEST, but supported.
      await Patient.create({
        userId: user._id,
        hospitalId,
        aadhaar,
        bloodGroup, age, gender, weight,
        isVerified: false,
      });
    }

    return user;
  }

  // -------------------------------------------------------------
  // 2️⃣ LOGIN USER
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 2️⃣ LOGIN USER OR PATIENT
  // -------------------------------------------------------------
  async loginUser(identifier, password) {
    // A. TRY LOGIN AS USER (Email/Phone)
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
        // { uniqueId: identifier } // Removed User uniqueId login preference if needed, or keep for legacy
      ]
    }).select("+password");

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return this.generateTokenResponse(user, ROLES.USER); // Or user.role
      }
    }

    // B. TRY LOGIN AS PATIENT (patientUid)
    // Identifier must look like 'pat-...' or just match patientUid
    const patient = await Patient.findOne({ patientUid: identifier }).select("+password");

    if (patient) {
      const match = await bcrypt.compare(password, patient.password);
      if (match) {
        // Patient Login Successful
        // Note: Patients might NOT be Users. Token payload reflects this.
        return this.generateTokenResponse(patient, ROLES.PATIENT, true);
      }
    }

    throw new Error("Invalid credentials");
  }

  // Helper to generate token
  generateTokenResponse(entity, role, isPatientEntity = false) {
    // console.log("DEBUG: generateToken token gen for:", entity._id, "Role:", role, "isPatient:", isPatientEntity);
    const payload = {
      userId: isPatientEntity ? (entity.userId || null) : entity._id,
      patientId: isPatientEntity ? entity._id : null,
      role: isPatientEntity ? ROLES.PATIENT : entity.role,
      hospitalId: entity.hospitalId || null,
      isPatientLogin: isPatientEntity
    };
    // console.log("DEBUG: generateToken payload:", payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET || "fallback-secret-key-123", {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: entity._id,
        name: entity.fullName || entity.name, // User has fullName, Patient has name
        email: entity.email,
        phone: entity.phone,
        role: payload.role,
        patientUid: entity.patientUid || undefined
      }
    };
  }

  // -------------------------------------------------------------
  // 3️⃣ GET CURRENT USER DETAILS
  // -------------------------------------------------------------
  async getCurrentUser(userId) {
    return await User.findById(userId).select("-password");
  }

  async getCurrentPatient(patientId) {
    return await Patient.findById(patientId).select("-password");
  }
}

export default new AuthService();