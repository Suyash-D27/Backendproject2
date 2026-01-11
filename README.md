# Healthcare Management System Backend (1Draft)

This project is a robust backend API for a generic healthcare/hospital management system. It provides comprehensive endpoints for managing users (patients, doctors, admins), appointments, health records, prescriptions, and hospital details.

## 🚀 Features

- **Authentication & Authorization**: Secure user registration and login using JWT and Cookies.
- **Role-Based Access**: Specialized routes for Patients, Doctors, and Admins.
- **Appointment Management**: Book, reschedule, and cancel appointments.
- **Health Records**: Secure storage and retrieval of patient health history.
- **Prescriptions**: Doctor-managed prescription issuance.
- **Lab Tests**: Management of medical tests and results.
- **Hospital Management**: Administration of hospital profiles and services.
- **Verification**: User verification workflows.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **File Storage**: Cloudinary (for reports/images)
- **Middleware**: CORS, Cookie Parser, Multer

## 📂 Project Structure

```bash
src/
├── config/         # Database and third-party service configurations
├── controllers/    # Request handlers for each route
├── middlewares/    # Auth, validation, and error handling middlewares
├── models/         # Mongoose schemas (User, Appointment, Prescription, etc.)
├── routes/         # API route definitions
├── services/       # Business logic (optional)
├── utils/          # Helper functions (AsyncHandler, ApiResponse, etc.)
├── app.js          # Express app setup
└── server.js       # Entry point
```

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd 1Draft
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=8000
    MONGODB_URI=mongodb+srv://<your_mongo_url>
    CORS_ORIGIN=*
    ACCESS_TOKEN_SECRET=<your_access_token_secret>
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    REFRESH_TOKEN_EXPIRY=10d
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
    CLOUDINARY_API_KEY=<your_api_key>
    CLOUDINARY_API_SECRET=<your_api_secret>
    ```

4.  **Run the application**
    ```bash
    # Development mode (using nodemon)
    npm run dev
    
    # Production
    npm start
    ```

## 🔌 API Endpoints

The API is structured around the following resource paths (prefixed with `/api`):

| Resource | Base Path | Description |
| :--- | :--- | :--- |
| **Auth** | `/api/auth` | Login, register, logout, token refresh |
| **Verification** | `/api/verification` | Identity verification |
| **Appointments** | `/api/appointments` | Booking and managing appointments |
| **Records** | `/api/records` | Patient health records |
| **Prescriptions** | `/api/prescriptions` | Digital prescriptions |
| **Tests** | `/api/tests` | Lab tests management |
| **History** | `/api/history` | Patient medical history |
| **Hospitals** | `/api/hospitals` | Hospital information |
| **Public** | `/api/public` | Publicly accessible routes |

## 📚 API Documentation

You can explore and test the API endpoints using my Postman Collection:

[**View Postman Collection**](https://yashdaharwal27-958246.postman.co/workspace/Suyash-Daharwal's-Workspace~c913dfc1-8583-4551-8d33-582d5aee05cb/collection/50136839-2ad0397e-2cba-4fb7-9a3b-7a8569efe625?action=share&creator=50136839&active-environment=50136839-56800efe-6c0d-452d-bed0-ddfe030acc0a)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.
