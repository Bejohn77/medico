# Medico Dental Care

Dental clinic website and management workspace with a React frontend and Express/MongoDB backend.

## Run locally

1. Install Node.js 20+ and MongoDB.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`, a random `JWT_SECRET` of at least 32 bytes, `ADMIN_EMAIL`, and an `ADMIN_PASSWORD` of 12 to 72 UTF-8 bytes. Keep `JWT_SECRET` different from `ADMIN_PASSWORD`.
3. Copy `frontend/.env.example` to `frontend/.env`.
4. In `backend`, run `npm install` then `npm run dev`.
5. In `frontend`, run `npm install` then `npm run dev`.
6. Open `http://localhost:5173`. Main Doctor login is at `/admin/login`.

Run `npm run reset-main-doctor-password` from `backend/` to synchronize the Main Doctor email and password from `backend/.env`. It updates the existing Main Doctor account when one exists, creates one only when the Admin collection is empty, and does not modify patient or appointment data. The command is safe to rerun.

## Render and Vercel deployment

- Deploy `backend/` as a Render Web Service with build command `npm install` and start command `npm start`.
- Set the backend environment variables in Render: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. `JWT_SECRET` must be at least 32 bytes and different from `ADMIN_PASSWORD`; the password must be 12 to 72 UTF-8 bytes. `CLIENT_URL` must exactly match the deployed Vercel site origin.
- Set `VITE_API_URL` in the Vercel project to `https://<render-service>.onrender.com/api`, then redeploy the frontend. This value is embedded at build time. Production builds no longer fall back to localhost when it is missing.
- Backend startup and `npm run reset-main-doctor-password` both synchronize the existing Main Doctor account to `ADMIN_EMAIL` and `ADMIN_PASSWORD`; do not create a separate admin manually. To target production from your computer, temporarily set the Render `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the process environment before running the script. Do not put production secrets in source control.
- Both commands load the same `backend/.env` relative to the backend files and connect through the same `connectDatabase()` function. The database name comes from the URI path; if no database name is present, MongoDB uses its `test` default for both.
- Check `https://<render-service>.onrender.com/api/health` for `{"ok":true}` before testing login.

Public-site images remain URL strings stored in MongoDB. Clinical uploads are private files stored under `backend/uploads/`; persist and back up this directory in deployment. Uploads accept PDF/JPEG/PNG/WebP up to 10 MB and are only served by authenticated download endpoints, never as a public static directory.

## API

Public: `GET /api/doctors`, `GET /api/services`, `GET /api/gallery`, `GET /api/reviews`, `GET /api/blogs`, `GET /api/availability?date=YYYY-MM-DD`, `POST /api/appointments`, `POST /api/contact`.

Staff: `POST /api/auth/login` authenticates the Main Doctor; `POST /api/auth/doctor/login` authenticates active, Main-Doctor-created doctor accounts. The Main Doctor manages doctor accounts, assignments, and website content. Other doctors can access only assigned patients, visits, tests, reports, and appointments; they cannot manage staff, chamber settings, or global content. Dentist profiles remain public website content. Configure chamber-wide hours in `/doctor/availability` before offering booking slots.

Patient accounts: `/patient/login` and `/patient/register`; registration creates a password-hashed patient account. Patients can update their contact profile and view their own appointments, shared visits, prescriptions, and explicitly shared reports/documents. Patient tokens cannot access staff endpoints. Existing patient records that have no account cannot be claimed through email alone; they need a clinic-approved identity-verification/linking workflow before account activation.

Management pages: `/doctor`, `/doctor/appointments`, `/doctor/availability`, `/doctor/visits`, `/doctor/tests`, `/doctor/reports`, and `/doctor/assignments`. Patients book the chamber without choosing a dentist; the Main Doctor assigns appointments and patients when needed. Visits are append-only; tests and reports are linked to a specific visit, and report uploads can update the test status. Visits and documents are private to patients by default; authorized doctors can explicitly share them. Legacy clinical data remains in the existing one-to-one `DentalRecord` collection.

## Data model

`Admin` stores the Main Doctor account and chamber hours; `Doctor` records now include password-hashed accounts, qualification/contact data, and active status. `Patient.assignedDoctors` and `Appointment.assignedDoctor` scope doctor access. `Visit` contains dated tests, prescriptions, treatment and follow-up state; `MedicalDocument.testId` links reports to specific tests. New appointments reference the Main Doctor and patient, while old `Doctor`/`Service` references remain readable for existing records. A unique active-slot key plus chamber availability checks prevents duplicate bookings. `DentalRecord` retains the existing longitudinal clinical summary.

Before production, configure HTTPS, a strong JWT secret, database backups, persistent upload storage, rate limits appropriate to deployment, and a verified process for linking pre-existing patient records. Local filesystem uploads are not shared across multiple backend instances; use a private object store or shared persistent volume before horizontal scaling.
