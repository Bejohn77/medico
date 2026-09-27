import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Admin, Doctor, Patient } from '../models/index.js';
import { getJwtSecret } from '../config/jwt.js';

function handleAuthenticationError(error, res) {
  if (error.code === 'JWT_CONFIG') {
    return res.status(503).json({ message: 'Authentication service is not configured.' });
  }
  if (mongoose.connection.readyState !== 1 || error.name?.startsWith('Mongo') || error.name?.startsWith('Mongoose')) {
    console.error('Authentication database operation failed.');
    return res.status(503).json({ message: 'Authentication is temporarily unavailable.' });
  }
  return res.status(401).json({ message: 'Invalid or expired session' });
}

export async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const decoded = jwt.verify(token, getJwtSecret());
    if (decoded.role === 'doctor') {
      req.doctor = await Doctor.findById(decoded.id).select('-password');
      if (!req.doctor || req.doctor.status !== 'Active') return res.status(403).json({ message: 'Doctor account is inactive or unavailable' });
      req.staffRole = 'doctor';
      return next();
    }
    if (decoded.role && !['mainDoctor', 'admin'].includes(decoded.role)) return res.status(403).json({ message: 'Staff access required' });
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ message: 'Invalid session' });
    const configuredEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const mainDoctor = configuredEmail
      ? await Admin.findOne({ email: configuredEmail }).select('_id')
      : await Admin.findOne().sort('createdAt').select('_id');
    if (!mainDoctor || String(mainDoctor._id) !== String(req.admin._id)) return res.status(403).json({ message: 'Main Doctor access required' });
    req.staffRole = 'mainDoctor';
    next();
  } catch (error) {
    handleAuthenticationError(error, res);
  }
}

export function protectAdmin(req, res, next) {
  return protect(req, res, () => {
    if (req.staffRole !== 'mainDoctor') return res.status(403).json({ message: 'Main Doctor access required' });
    next();
  });
}

export async function protectPatient(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const decoded = jwt.verify(token, getJwtSecret());
    if (decoded.role !== 'patient') return res.status(403).json({ message: 'Patient access required' });
    req.patient = await Patient.findById(decoded.id).select('-password');
    if (!req.patient) return res.status(401).json({ message: 'Invalid session' });
    next();
  } catch (error) {
    handleAuthenticationError(error, res);
  }
}