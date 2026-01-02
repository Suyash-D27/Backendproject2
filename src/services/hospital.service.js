
import Hospital from "../models/hospital.model.js";

class HospitalService {
    /**
     * Create a new hospital
     * @param {Object} data 
     * @returns {Promise<Hospital>}
     */
    async createHospital(data) {
        const { name, registrationNumber, address, contactNumber, email } = data;

        // Check if hospital already exists
        const existingHospital = await Hospital.findOne({ registrationNumber });
        if (existingHospital) {
            throw new Error(`Hospital with registration number ${registrationNumber} already exists`);
        }

        const hospital = await Hospital.create({
            name,
            registrationNumber,
            address,
            contactNumber,
            email
        });

        return hospital;
    }

    /**
     * Get all hospitals
     * @returns {Promise<Array<Hospital>>}
     */
    async getAllHospitals() {
        return await Hospital.find({ isActive: true });
    }

    /**
     * Soft delete a hospital
     * @param {String} hospitalId 
     * @returns {Promise<Hospital>}
     */
    async deleteHospital(hospitalId) {
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            throw new Error("Hospital not found");
        }

        // Soft delete by setting isActive to false
        hospital.isActive = false;
        await hospital.save();

        return hospital;
    }
}

export default new HospitalService();
