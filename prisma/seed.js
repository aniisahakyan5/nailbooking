const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed Languages
  await prisma.language.upsert({
    where: { code: 'hy' },
    update: {},
    create: { code: 'hy', name: 'Armenian', isDefault: true }
  });
  await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: { code: 'en', name: 'English', isDefault: false }
  });
  await prisma.language.upsert({
    where: { code: 'ru' },
    update: {},
    create: { code: 'ru', name: 'Russian', isDefault: false }
  });

  // Seed Translations
  const translations = [
    { key: 'book_now', en: 'Book Now', ru: 'Забронировать', hy: 'Ամրագրել' },
    { key: 'hero_title', en: 'Elevate Your Elegance', ru: 'Подчеркните свою элегантность', hy: 'Ընդգծեք Ձեր նրբագեղությունը' },
    { key: 'hero_subtitle', en: 'Premium nail care and beauty procedures in the heart of Armenia.', ru: 'Премиальный уход за ногтями и косметические процедуры в сердце Армении.', hy: 'Պրեմիում դասի եղունգների խնամք և գեղեցկության պրոցեդուրաներ Հայաստանի սրտում:' },
    { key: 'our_services', en: 'Our Services', ru: 'Наши Услуги', hy: 'Մեր Ծառայությունները' },
  ];

  for (const t of translations) {
    await prisma.translation.upsert({
      where: { key: t.key },
      update: t,
      create: t
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
