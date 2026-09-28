import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Limpiar datos existentes respetando la relación
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Crear Tenant con usuarios anidados
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Acme Corp',
      users: {
        create: [
          {
            email: 'admin@acme.com',
            name: 'Admin Acme',
            password: 'password123',
            telephone: '+50588888888',
            role: Role.ADMIN,
          },
          {
            email: 'user@acme.com',
            name: 'Empleado Regular',
            password: 'password123',
            telephone: '+50577777777',
            role: Role.USER,
          },
        ],
      },
    },
    include: {
      users: true,
    },
  });

  console.log('Seed ejecutado exitosamente:');
  console.dir(tenant, { depth: null });
}

main()
  .catch((e) => {
    console.error('Error durante la ejecución del seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });