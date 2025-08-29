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
      phone: '081234567890',
      address: 'Jl. Admin No. 1, Jakarta'
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@sweetmerry.com' },
    update: {},
    create: {
      email: 'user@sweetmerry.com',
      password: userPassword,
      name: 'John Doe',
      role: 'USER',
      phone: '081234567891',
      address: 'Jl. User No. 1, Jakarta'
    },
  });

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-1' },
      update: {},
      create: {
        id: 'service-1',
        name: 'Facial Treatment',
        description: 'Deep cleansing facial treatment with premium products',
        price: 150000,
        duration: 60,
        category: 'Beauty',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-2' },
      update: {},
      create: {
        id: 'service-2',
        name: 'Massage Therapy',
        description: 'Relaxing full body massage therapy',
        price: 200000,
        duration: 90,
        category: 'Wellness',
        image: 'https://images.unsplash.com/photo-1544161512-4ab6ade6db2f?w=400'
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-3' },
      update: {},
      create: {
        id: 'service-3',
        name: 'Hair Styling',
        description: 'Professional hair styling and treatment',
        price: 100000,
        duration: 45,
        category: 'Beauty',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400'
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-4' },
      update: {},
      create: {
        id: 'service-4',
        name: 'Nail Art',
        description: 'Creative nail art and manicure service',
        price: 80000,
        duration: 30,
        category: 'Beauty',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-5' },
      update: {},
      create: {
        id: 'service-5',
        name: 'Spa Treatment',
        description: 'Complete spa treatment with aromatherapy',
        price: 300000,
        duration: 120,
        category: 'Wellness',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400'
      },
    })
  ]);

  // Create sample bookings
  const bookings = await Promise.all([
    prisma.booking.upsert({
      where: { id: 'booking-1' },
      update: {},
      create: {
        id: 'booking-1',
        userId: user.id,
        serviceId: 'service-1',
        date: new Date('2024-01-15'),
        time: '10:00',
        status: 'CONFIRMED',
        notes: 'Please use sensitive skin products'
      },
    }),
    prisma.booking.upsert({
      where: { id: 'booking-2' },
      update: {},
      create: {
        id: 'booking-2',
        userId: user.id,
        serviceId: 'service-2',
        date: new Date('2024-01-20'),
        time: '14:00',
        status: 'PENDING',
        notes: 'Focus on back and shoulders'
      },
    })
  ]);

  console.log('Seed data created successfully!');
  console.log('Admin user:', admin.email);
  console.log('Regular user:', user.email);
  console.log('Services created:', services.length);
  console.log('Bookings created:', bookings.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
