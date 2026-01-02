  import mongoose from "mongoose";

  const userSchema = new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
        trim: true
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
      },

      password: {
        type: String,
        required: true,
        select: false   // password will not come by default in queries
      },

      role: {
        type: String,
        enum: ["GUEST", "PATIENT", "DOCTOR", "LAB_ADMIN", "HOSPITAL_ADMIN", "SUPER_ADMIN", "DR_Reception"],
        default: "GUEST"
      },

      aadhaar: {
        type: String,
        unique: true,
        sparse: true   // allows null for non-patients
      },

      isAadhaarVerified: {
        type: Boolean,
        default: false
      },

      profileImageUrl: { type: String, default: null },


      isActive: {
        type: Boolean,
        default: true
      }
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // Allow null/undefined if phone is provided
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    uniqueId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false   // password will not come by default in queries
    },

    role: {
      type: String,
      enum: ["GUEST", "PATIENT", "DOCTOR", "LAB_ADMIN", "HOSPITAL_ADMIN", "SUPER_ADMIN", "DR_Reception"],
      default: "GUEST"
    },

    aadhaar: {
      type: String,
      unique: true,
      sparse: true   // allows null for non-patients
    },

    isAadhaarVerified: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  );

  const User = mongoose.model("User", userSchema);

  export default User;
