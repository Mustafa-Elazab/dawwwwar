import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMerchantCategories1700000003000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add parent_category_id column
        await queryRunner.query(`ALTER TABLE "merchants" ADD "parent_category_id" uuid`);

        // 2. Migrate existing category data (if they are UUIDs of parent categories)
        // Since category column was a string, let's try to cast it.
        await queryRunner.query(`UPDATE "merchants" SET "parent_category_id" = "category"::uuid WHERE "category" IS NOT NULL AND "category" <> ''`);

        // 3. Make parent_category_id NOT NULL and add foreign key
        await queryRunner.query(`ALTER TABLE "merchants" ALTER COLUMN "parent_category_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "merchants" ADD CONSTRAINT "FK_merchants_parent_category" FOREIGN KEY ("parent_category_id") REFERENCES "categories"("id")`);

        // 4. Drop old category column
        await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "category"`);

        // 5. Create junction table for merchant_categories
        await queryRunner.query(`
            CREATE TABLE "merchant_categories" (
                "merchant_id" uuid NOT NULL,
                "category_id" uuid NOT NULL,
                CONSTRAINT "PK_merchant_categories" PRIMARY KEY ("merchant_id", "category_id")
            )
        `);
        await queryRunner.query(`ALTER TABLE "merchant_categories" ADD CONSTRAINT "FK_merchant_categories_merchant" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "merchant_categories" ADD CONSTRAINT "FK_merchant_categories_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchants" ADD "category" character varying`);
        await queryRunner.query(`UPDATE "merchants" SET "category" = "parent_category_id"::varchar`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP CONSTRAINT "FK_merchants_parent_category"`);
        await queryRunner.query(`ALTER TABLE "merchants" DROP COLUMN "parent_category_id"`);
        await queryRunner.query(`DROP TABLE "merchant_categories"`);
    }
}
