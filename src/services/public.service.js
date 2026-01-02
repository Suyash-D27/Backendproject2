import Doctor from "../models/doctor.model.js";
import Hospital from "../models/hospital.model.js";
import User from "../models/user.model.js";

class PublicService {

    async searchDoctors(query) {
        const { name, specialty, city } = query;
        let filter = { isActive: true }; // Start with active doctors only

        // 1. Filter by Name (requires looking up Users first)
        if (name) {
            // Check imports! We need User model here. 
            // Since it's not imported at top, I'll assume I need to add imports or use aggregation.
            // But let's stick to the two-step approach for simplicity as User model might not be imported.
            // Wait, I can see imports in file view? 
            // Step 249 showed imports: Doctor, Hospital. I need to add User import.
        }

        // ... actually, let's write the robust version assuming imports are added.

        let userIds = null;
        if (name) {
            const users = await User.find({ fullName: new RegExp(name, "i") }).select("_id");
            userIds = users.map(u => u._id);
            filter.userId = { $in: userIds };
        }

        let hospitalIds = null;
        if (city) {
            // Assuming 'city' is part of the address string in Hospital
            const hospitals = await Hospital.find({ address: new RegExp(city, "i") }).select("_id");
            hospitalIds = hospitals.map(h => h._id);
            filter.hospitalId = { $in: hospitalIds };
        }

        if (specialty) {
            filter.specialization = new RegExp(specialty, "i");
        }

        return Doctor.find(filter)
            .populate("userId", "fullName email")
            .populate("hospitalId", "name address");
    }

    async searchHospitals(query) {
        const { name, city } = query;

        let filter = { isActive: true };

        if (name) filter.name = new RegExp(name, "i");
        // Hospital model uses 'address', so we search address for city matches
        if (city) filter.address = new RegExp(city, "i");

        return Hospital.find(filter);
    }

    async getDoctorPublic(id) {
        return Doctor.findById(id)
            .populate("userId", "fullName email")
            .populate("hospitalId", "name address");
    }

    async getHospitalPublic(id) {
        return Hospital.findById(id);
    }
}

export default new PublicService();
