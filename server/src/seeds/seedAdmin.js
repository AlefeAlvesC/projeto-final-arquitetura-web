require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const name = process.env.ADMIN_NAME || 'Administrador';
const email = process.env.ADMIN_EMAIL || 'admin@geekverse.com';
const password = process.env.ADMIN_PASSWORD || 'admin123';

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashed = await bcrypt.hash(password, 10);

  // Cria o admin, ou promove/atualiza se o e-mail já existir
  await User.findOneAndUpdate(
    { email },
    { name, email, password: hashed, role: 'Admin' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin pronto: ${email} / ${password}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Erro no seed:', err.message);
  process.exit(1);
});