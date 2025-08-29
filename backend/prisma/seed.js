const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sweetmerry.com' },
    update: {},
    create: {
      email: 'admin@sweetmerry.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+1234567890',
      address: '123 Admin Street'
    }
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@sweetmerry.com' },
    update: {},
    create: {
      email: 'user@sweetmerry.com',
      password: userPassword,
      name: 'Regular User',
      role: 'USER',
      phone: '+0987654321',
      address: '456 User Avenue'
    }
  });

  // Create services
  const services = await prisma.service.createMany({
    data: [
      {
        name: 'Haircut & Styling',
        description: 'Professional haircut and styling service',
        price: 35.00,
        duration: 60,
        category: 'Hair',
        image: '/images/haircut.jpg'
      },
      {
        name: 'Manicure',
        description: 'Complete nail care and polish',
        price: 25.00,
        duration: 45,
        category: 'Nails',
        image: '/images/manicure.jpg'
      },
      {
        name: 'Facial Treatment',
        description: 'Relaxing facial with deep cleansing',
        price: 50.00,
        duration: 90,
        category: 'Skin Care',
        image: '/images/facial.jpg'
      },
      {
        name: 'Massage Therapy',
        description: 'Full body relaxation massage',
        price: 65.00,
        duration: 60,
        category: 'Massage',
        image: '/images/massage.jpg'
      },
      {
        name: 'Waxing',
        description: 'Professional waxing service',
        price: 40.00,
        duration: 30,
        category: 'Hair Removal',
        image: '/images/waxing.jpg'
      }
    ],
    skipDuplicates: true
  });

  console.log('Seed completed successfully!');
  console.log('Admin user created:', admin.email);
  console.log('Regular user created:', user.email);
  console.log('Services created:', services.count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
