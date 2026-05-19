import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategoryChildren1700000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Helper: insert a child under a parent by parent name
    const insertChild = async (
      parentName: string,
      name: string,
      nameAr: string,
      icon: string,
      sortOrder: number,
    ) => {
      await queryRunner.query(`
        INSERT INTO categories (id, name, name_ar, icon, slug, sort_order, parent_id, is_active, created_at, updated_at)
        SELECT
          gen_random_uuid(),
          $1::varchar, $2::varchar, $3::varchar,
          LOWER(REPLACE($1::text, ' ', '-')) || '-' || LOWER(REPLACE(p.name, ' ', '-')),
          $4::int,
          p.id,
          true,
          NOW(), NOW()
        FROM categories p
        WHERE p.name = $5::varchar
        ON CONFLICT DO NOTHING
      `, [name, nameAr, icon, sortOrder, parentName]);
    };

    // ── Restaurants children ──────────────────────────────────────────────
    await insertChild('Restaurants', 'Pizza',           'بيتزا',            '🍕', 1);
    await insertChild('Restaurants', 'Burgers',          'برجر',             '🍔', 2);
    await insertChild('Restaurants', 'Shawarma',         'شاورما وسندوتشات', '🌮', 3);
    await insertChild('Restaurants', 'Egyptian Food',    'أكل مصري',         '🍱', 4);
    await insertChild('Restaurants', 'Fried Chicken',    'دجاج مقلي',        '🍗', 5);
    await insertChild('Restaurants', 'Healthy & Salads', 'صحي وسلطات',       '🥗', 6);
    await insertChild('Restaurants', 'Sushi & Asian',    'سوشي وآسيوي',      '🍣', 7);
    await insertChild('Restaurants', 'Grills & BBQ',     'مشاوي وكباب',      '🥩', 8);
    await insertChild('Restaurants', 'Seafood',          'مأكولات بحرية',    '🦐', 9);
    await insertChild('Restaurants', 'Desserts',         'حلويات',           '🍰', 10);
    await insertChild('Restaurants', 'Pasta & Italian',  'باستا وإيطالي',    '🍝', 11);
    await insertChild('Restaurants', 'Indian Food',      'مطبخ هندي',        '🍛', 12);

    // ── Supermarkets children ─────────────────────────────────────────────
    await insertChild('Supermarkets', 'Fresh Produce',   'خضروات وفاكهة',   '🥦', 1);
    await insertChild('Supermarkets', 'Dairy & Cheese',  'ألبان وأجبان',    '🧀', 2);
    await insertChild('Supermarkets', 'Meat & Poultry',  'لحوم ودواجن',     '🥩', 3);
    await insertChild('Supermarkets', 'Snacks',          'سناكس ومقرمشات',  '🍿', 4);
    await insertChild('Supermarkets', 'Beverages',       'مشروبات',         '🧃', 5);
    await insertChild('Supermarkets', 'Cleaning',        'منظفات',          '🧹', 6);
    await insertChild('Supermarkets', 'Baby Products',   'منتجات الأطفال',  '🍼', 7);

    // ── Pharmacies children ───────────────────────────────────────────────
    await insertChild('Pharmacies', 'Medications',       'أدوية',           '💊', 1);
    await insertChild('Pharmacies', 'First Aid',         'إسعافات أولية',   '🩹', 2);
    await insertChild('Pharmacies', 'Vitamins',          'فيتامينات ومكملات','💪', 3);
    await insertChild('Pharmacies', 'Baby Care',         'عناية بالطفل',    '👶', 4);
    await insertChild('Pharmacies', 'Personal Care',     'عناية شخصية',     '🧴', 5);

    // ── Bakeries children ─────────────────────────────────────────────────
    await insertChild('Bakeries', 'Bread',               'خبز',             '🍞', 1);
    await insertChild('Bakeries', 'Cakes',               'كيك',             '🎂', 2);
    await insertChild('Bakeries', 'Pastries',            'معجنات',          '🥐', 3);
    await insertChild('Bakeries', 'Sweets',              'حلوى شرقية',      '🍯', 4);

    // ── Butchers children ─────────────────────────────────────────────────
    await insertChild('Butchers', 'Beef',                'لحم بقري',        '🥩', 1);
    await insertChild('Butchers', 'Chicken',             'دواجن',           '🍗', 2);
    await insertChild('Butchers', 'Lamb',                'لحم ضأن',         '🐑', 3);
    await insertChild('Butchers', 'Seafood',             'أسماك ومأكولات بحرية','🦐', 4);

    // ── Fruits & Veg children ─────────────────────────────────────────────
    await insertChild('Fruits & Veg', 'Vegetables',      'خضروات',          '🥦', 1);
    await insertChild('Fruits & Veg', 'Fruits',          'فاكهة',           '🍎', 2);
    await insertChild('Fruits & Veg', 'Herbs',           'أعشاب وبهارات',   '🌿', 3);
    await insertChild('Fruits & Veg', 'Mixed Boxes',     'صناديق مشكلة',    '📦', 4);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove all children (records where parentId is not null)
    await queryRunner.query(`DELETE FROM categories WHERE parent_id IS NOT NULL`);
  }
}
