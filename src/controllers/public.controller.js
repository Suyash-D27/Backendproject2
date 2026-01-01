import publicService from "../services/public.service.js";

class PublicController {
    async searchDoctors(req, res, next) {
        try {
            const doctors = await publicService.searchDoctors(req.query);
            res.json({ success: true, doctors });
        } catch (error) {
            next(error);
        }
    }

    async searchHospitals(req, res, next) {
        try {
            const hospitals = await publicService.searchHospitals(req.query);
            res.json({ success: true, hospitals });
        } catch (error) {
            next(error);
        }
    }

    async doctorPublic(req, res, next) {
        try {
            const doctor = await publicService.getDoctorPublic(req.params.id);
            res.json({ success: true, doctor });
        } catch (error) {
            next(error);
        }
    }

    async hospitalPublic(req, res, next) {
        try {
            const hospital = await publicService.getHospitalPublic(req.params.id);
            res.json({ success: true, hospital });
        } catch (error) {
            next(error);
        }
    }
}

export default new PublicController();