// This script creates an admin user in your database
// Run with: node scripts/create-admin.js

require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔧 Creating admin user...');
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@vidyasangam.in' },
      update: { 
        role: 'ADMIN',
        name: 'Admin',
      },
      create: {
        email: 'admin@vidyasangam.in',
        name: 'Admin',
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('📧 Email: admin@vidyasangam.in');
    console.log('🔐 OTP: 000000 (dev mode)');
    console.log('👤 Role: ADMIN');
    console.log('');
    console.log('Now you can:');
    console.log('1. Go to http://localhost:3000/login');
    console.log('2. Enter: admin@vidyasangam.in');
    console.log('3. Get OTP: 000000');
    console.log('4. Access /admin panel');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
