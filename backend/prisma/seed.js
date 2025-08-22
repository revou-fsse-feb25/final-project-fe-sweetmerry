const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sweetmerry.com' },
    update: {},
    create: {
      email: 'admin@sweetmerry.com',
      password: adminPassword,
      name: 'Admin SweetMerry',
      role: 'ADMIN',
    },
  });

  // Create sample user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@sweetmerry.com' },
    update: {},
    create: {
      email: 'user@sweetmerry.com',
      password: userPassword,
      name: 'User Sample',
      role: 'USER',
    },
  });

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Kue Cokelat Premium',
        description: 'Kue cokelat dengan topping premium',
        price: 150000,
        category: 'Kue',
      },
    }),
    prisma.product.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Kue Keju Lembut',
        description: 'Kue keju dengan tekstur lembut',
        price: 130000,
        category: 'Kue',
      },
    }),
    prisma.product.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Paket Snack Box A',
        description: 'Paket snack untuk 50 porsi',
        price: 25000,
        category: 'Snack',
      },
    }),
    prisma.product.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Paket Nasi Kotak B',
        description: 'Paket nasi kotak untuk 50 porsi',
        price: 35000,
        category: 'Catering',
      },
    }),
    prisma.product.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Tumpeng Mini',
        description: 'Tumpeng mini untuk acara kecil',
        price: 75000,
        category: 'Catering',
      },
    }),
  ]);

  console.log({ admin, user, products });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
