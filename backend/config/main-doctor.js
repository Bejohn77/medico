import { Admin } from '../models/index.js';

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function getMainDoctorConfig() {
  const email = normalizeEmail(process.env.ADMIN_EMAIL);
  const password = String(process.env.ADMIN_PASSWORD || '');

  if (!email) {
    throw Object.assign(new Error('ADMIN_EMAIL is not configured.'), { code: 'ADMIN_CONFIG' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw Object.assign(new Error('ADMIN_EMAIL is invalid.'), { code: 'ADMIN_CONFIG' });
  }
  if (!password) {
    throw Object.assign(new Error('ADMIN_PASSWORD is not configured.'), { code: 'ADMIN_CONFIG' });
  }
  if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    throw Object.assign(new Error('ADMIN_PASSWORD must be 12 to 72 bytes.'), { code: 'ADMIN_CONFIG' });
  }

  return { email, password };
}

async function passwordMatches(admin, password) {
  if (!admin.password) return false;
  try {
    return await admin.comparePassword(password);
  } catch {
    return false;
  }
}

export async function syncMainDoctorCredentials() {
  const { email, password } = getMainDoctorConfig();
  const accounts = await Admin.find().select('+password').sort({ createdAt: 1, _id: 1 });
  let admin = accounts.find((account) => account.email === email)
    || accounts.find((account) => normalizeEmail(account.email) === email)
    || accounts[0];
  const isNew = !admin;

  if (!admin) admin = new Admin({ name: 'Main Doctor' });
  admin.email = email;
  if (!(await passwordMatches(admin, password))) admin.password = password;

  try {
    await admin.save();
  } catch (error) {
    if (error.code !== 11000 || !isNew) throw error;

    admin = await Admin.findOne({ email }).select('+password');
    if (!admin) throw error;
    if (!(await passwordMatches(admin, password))) admin.password = password;
    await admin.save();
  }

  const savedAdmin = await Admin.findById(admin._id).select('+password');
  if (!savedAdmin || savedAdmin.password === password || !(await passwordMatches(savedAdmin, password))) {
    throw new Error('Main Doctor credential synchronization could not be verified.');
  }
  return savedAdmin;
}