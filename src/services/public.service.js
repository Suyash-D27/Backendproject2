import Doctor from "../models/doctor.model.js";
import Hospital from "../models/hospital.model.js";

class PublicService {
  async searchDoctors(query) {
    const { name, specialty, city } = query;

    let filter = { isApproved: true };

    if (name) filter["user.name"] = new RegExp(name, "i");
    if (city) filter.city = new RegExp(city, "i");
    if (specialty) filter.specialty = new RegExp(specialty, "i");

    return Doctor.find(filter).populate("user", "name email profileImage");
  }

  async searchHospitals(query) {
    const { name, city } = query;

    let filter = {};

    if (name) filter.name = new RegExp(name, "i");
    if (city) filter.city = new RegExp(city, "i");

    return Hospital.find(filter);
  }

  async getDoctorPublic(id) {
    return Doctor.findById(id).populate("user", "name profileImage email");
  }

  async getHospitalPublic(id) {
    return Hospital.findById(id);
  }
}

export default new PublicService();
