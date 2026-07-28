import { PrismaClient, SchengenCountry, UserRole, UserStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Super Admin
  const adminPassword = await hash('Admin@2024', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@visafile.com' },
    update: {},
    create: {
      email: 'admin@visafile.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log('✅ Super Admin created:', admin.email);

  // Create Schengen Countries
  const schengenCountries = [
    { name: 'Austria', nameAr: 'النمسا', code: 'AT', schengenCountry: SchengenCountry.AUSTRIA, isSchengen: true },
    { name: 'Belgium', nameAr: 'بلجيكا', code: 'BE', schengenCountry: SchengenCountry.BELGIUM, isSchengen: true },
    { name: 'Czech Republic', nameAr: 'جمهورية التشيك', code: 'CZ', schengenCountry: SchengenCountry.CZECH_REPUBLIC, isSchengen: true },
    { name: 'Denmark', nameAr: 'الدنمارك', code: 'DK', schengenCountry: SchengenCountry.DENMARK, isSchengen: true },
    { name: 'Estonia', nameAr: 'إستونيا', code: 'EE', schengenCountry: SchengenCountry.ESTONIA, isSchengen: true },
    { name: 'Finland', nameAr: 'فنلندا', code: 'FI', schengenCountry: SchengenCountry.FINLAND, isSchengen: true },
    { name: 'France', nameAr: 'فرنسا', code: 'FR', schengenCountry: SchengenCountry.FRANCE, isSchengen: true },
    { name: 'Germany', nameAr: 'ألمانيا', code: 'DE', schengenCountry: SchengenCountry.GERMANY, isSchengen: true },
    { name: 'Greece', nameAr: 'اليونان', code: 'GR', schengenCountry: SchengenCountry.GREECE, isSchengen: true },
    { name: 'Hungary', nameAr: 'المجر', code: 'HU', schengenCountry: SchengenCountry.HUNGARY, isSchengen: true },
    { name: 'Iceland', nameAr: 'آيسلندا', code: 'IS', schengenCountry: SchengenCountry.ICELAND, isSchengen: true },
    { name: 'Italy', nameAr: 'إيطاليا', code: 'IT', schengenCountry: SchengenCountry.ITALY, isSchengen: true },
    { name: 'Latvia', nameAr: 'لاتفيا', code: 'LV', schengenCountry: SchengenCountry.LATVIA, isSchengen: true },
    { name: 'Lithuania', nameAr: 'ليتوانيا', code: 'LT', schengenCountry: SchengenCountry.LITHUANIA, isSchengen: true },
    { name: 'Luxembourg', nameAr: 'لوكسمبورغ', code: 'LU', schengenCountry: SchengenCountry.LUXEMBOURG, isSchengen: true },
    { name: 'Malta', nameAr: 'مالطا', code: 'MT', schengenCountry: SchengenCountry.MALTA, isSchengen: true },
    { name: 'Netherlands', nameAr: 'هولندا', code: 'NL', schengenCountry: SchengenCountry.NETHERLANDS, isSchengen: true },
    { name: 'Norway', nameAr: 'النرويج', code: 'NO', schengenCountry: SchengenCountry.NORWAY, isSchengen: true },
    { name: 'Poland', nameAr: 'بولندا', code: 'PL', schengenCountry: SchengenCountry.POLAND, isSchengen: true },
    { name: 'Portugal', nameAr: 'البرتغال', code: 'PT', schengenCountry: SchengenCountry.PORTUGAL, isSchengen: true },
    { name: 'Slovakia', nameAr: 'سلوفاكيا', code: 'SK', schengenCountry: SchengenCountry.SLOVAKIA, isSchengen: true },
    { name: 'Slovenia', nameAr: 'سلوفينيا', code: 'SI', schengenCountry: SchengenCountry.SLOVENIA, isSchengen: true },
    { name: 'Spain', nameAr: 'إسبانيا', code: 'ES', schengenCountry: SchengenCountry.SPAIN, isSchengen: true },
    { name: 'Sweden', nameAr: 'السويد', code: 'SE', schengenCountry: SchengenCountry.SWEDEN, isSchengen: true },
    { name: 'Switzerland', nameAr: 'سويسرا', code: 'CH', schengenCountry: SchengenCountry.SWITZERLAND, isSchengen: true },
    { name: 'Liechtenstein', nameAr: 'ليختنشتاين', code: 'LI', schengenCountry: SchengenCountry.LIECHTENSTEIN, isSchengen: true },
  ];

  for (const country of schengenCountries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    });
  }
  console.log(`✅ ${schengenCountries.length} Schengen countries created`);

  // Sample Office
  const office = await prisma.office.upsert({
    where: { id: 'sample-office-001' },
    update: {},
    create: {
      id: 'sample-office-001',
      name: 'Main Office',
      nameAr: 'المكتب الرئيسي',
      city: 'Cairo',
      country: 'Egypt',
      isActive: true,
    },
  });
  console.log('✅ Sample office created:', office.name);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
