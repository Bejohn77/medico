# Database model notes

- `Admin`: the Main Doctor's bcrypt-hashed credentials and chamber-wide weekly availability.
- `Doctor`: public dentist profiles with bcrypt-hashed account credentials and active/inactive status; the Main Doctor provisions and manages these accounts. `Service`, `Gallery`, `Blog`, and `Review` remain website content.
- `Patient`: password-hashed portal accounts; guest bookings may omit email. Account emails are unique, and `assignedDoctors` limits doctor record access.
- `Appointment`: new bookings reference `Patient` and the Main Doctor (`Admin`), with optional `assignedDoctor`; patient booking does not select a dentist. Optional legacy `Doctor` and `Service` references remain for old records. Status is Pending, Confirmed, Rescheduled, Completed, or Cancelled.
- `Visit`: append-only encounters with per-visit tests, prescriptions, diagnosis, treatment, and follow-up state. `MedicalDocument.testId` links uploaded test reports to the relevant test and visit.
- `ContactMessage`: stores contact form messages for follow-up.
- `DentalRecord`: protected one-to-one record for a patient. It stores optional medical history, chief complaint, examination, tooth findings, investigations/test report URLs, diagnoses, treatment plans, prescriptions, follow-ups, and a timeline.

All schemas use Mongoose timestamps. Image fields store URL strings rather than binary files; send the URL in the normal resource create or update request.

Clinical endpoints accept the Main Doctor and active doctors; doctor endpoints require assignment to the patient. Main Doctor-only routes manage doctor accounts, patient/appointment assignments, chamber hours, and global website content. Patients use separate owner-scoped read routes; public content endpoints never return `DentalRecord` data.
