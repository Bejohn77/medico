import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import { Admin } from '../models/index.js';

function readHidden(prompt) {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    throw new Error('Run this command in an interactive terminal.');
  }

  return new Promise((resolve, reject) => {
    let value = '';
    process.stdout.write(prompt);
    input.setRawMode(true);
    input.resume();

    const finish = (error) => {
      input.off('data', onData);
      input.setRawMode(false);
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(value);
    };

    const onData = (chunk) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') return finish(new Error('Password reset cancelled.'));
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u007f' || character === '\b') value = value.slice(0, -1);
        else if (character >= ' ') value += character;
      }
    };

    input.on('data', onData);
  });
}

try {
  await connectDatabase();
  const configuredEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  let mainDoctor = configuredEmail
    ? await Admin.findOne({ email: configuredEmail })
    : await Admin.findOne().sort('createdAt');

  if (!mainDoctor) {
    if (!configuredEmail) throw new Error('No Main Doctor account exists. Set ADMIN_EMAIL in backend/.env first.');
    mainDoctor = new Admin({ email: configuredEmail, name: 'Main Doctor' });
  }

  process.stdout.write(`Reset password for Main Doctor account ${mainDoctor.email}.\n`);
  const password = await readHidden('New password (12-72 bytes): ');
  const confirmation = await readHidden('Confirm new password: ');
  if (password.length < 12 || Buffer.byteLength(password) > 72) {
    throw new Error('Password must be at least 12 characters and no more than 72 bytes.');
  }
  if (password !== confirmation) throw new Error('Passwords do not match.');

  mainDoctor.password = password;
  await mainDoctor.save();
  process.stdout.write('Main Doctor password updated. Sign in at /admin/login.\n');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState) await mongoose.disconnect();
}