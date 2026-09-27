import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import { getMainDoctorConfig, syncMainDoctorCredentials } from '../config/main-doctor.js';

try {
  getMainDoctorConfig();
  await connectDatabase();
  await syncMainDoctorCredentials();
  console.log('Main Doctor credentials synchronized successfully.');
} catch (error) {
  if (error.code === 'ADMIN_CONFIG') console.error(error.message);
  else if (error.code === 'MONGODB_CONFIG') console.error('MONGODB_URI is not configured.');
  else if (error.code === 'MONGODB_CONNECTION') console.error('MongoDB connection failed. Check the URI and network access settings.');
  else if (error.name?.startsWith('Mongo') || error.name?.startsWith('Mongoose')) console.error('MongoDB operation failed during Main Doctor synchronization.');
  else console.error('Main Doctor synchronization failed. Check the database connection and account configuration.');
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState) await mongoose.disconnect();
}