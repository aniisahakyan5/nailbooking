require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const url = process.env.DATABASE_URL.trim();
  console.log('Connecting to database...');
  
  const client = new Client({ connectionString: url });
  await client.connect();
  
  console.log('Connected successfully. Starting seed...');

  try {
    // Seed Languages
    await client.query(`
      INSERT INTO "Language" (code, name, "isDefault") 
      VALUES ('hy', 'Armenian', true), ('en', 'English', false), ('ru', 'Russian', false)
      ON CONFLICT (code) DO NOTHING;
    `);

    // Seed Translations
    const translations = [
      ['book_now', 'Book Now', 'Забронировать', 'Ամրագրել'],
      ['hero_title', 'Elevate Your Elegance', 'Подчеркните свою элегантность', 'Ընդգծեք Ձեր նրբագեղությունը'],
      ['hero_subtitle', 'Premium nail care and beauty procedures in the heart of Armenia.', 'Премиальный уход за ногтями и косметические процедуры в сердце Армении.', 'Պրեմիում դասի եղունգների խնամք և գեղեցկության պրոցեդուրաներ Հայաստանի սրտում:'],
      ['our_services', 'Our Services', 'Наши Услуги', 'Մեր Ծառայությունները'],
    ];

    for (const [key, en, ru, hy] of translations) {
      await client.query(`
        INSERT INTO "Translation" (key, en, ru, hy, "updatedAt") 
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (key) DO UPDATE SET en = EXCLUDED.en, ru = EXCLUDED.ru, hy = EXCLUDED.hy, "updatedAt" = NOW();
      `, [key, en, ru, hy]);
    }

    console.log('Seeding finished successfully.');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
