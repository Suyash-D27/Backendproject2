import multer from "multer";

// Store file in memory buffer
const storage = multer.memoryStorage();

export const upload = multer({ storage });
