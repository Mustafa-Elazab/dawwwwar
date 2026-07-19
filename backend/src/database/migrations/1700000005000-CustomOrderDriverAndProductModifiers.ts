import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomOrderDriverAndProductModifiers1700000005000 implements MigrationInterface {
  name = 'CustomOrderDriverAndProductModifiers1700000005000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF to_regtype('orders_status_enum') IS NOT NULL AND NOT EXISTS (
          SELECT 1 FROM pg_enum
          WHERE enumlabel = 'WAITING_DRIVER_ACCEPT'
          AND enumtypid = to_regtype('orders_status_enum')
        ) THEN
          ALTER TYPE "orders_status_enum" ADD VALUE 'WAITING_DRIVER_ACCEPT';
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "modifier_groups" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD COLUMN IF NOT EXISTS "variants" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
    await queryRunner.query(`
      ALTER TABLE "order_items"
      ADD COLUMN IF NOT EXISTS "selected_modifiers" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "order_items" DROP COLUMN IF EXISTS "selected_modifiers"');
    await queryRunner.query('ALTER TABLE "products" DROP COLUMN IF EXISTS "variants"');
    await queryRunner.query('ALTER TABLE "products" DROP COLUMN IF EXISTS "modifier_groups"');
  }
}
