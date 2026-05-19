import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustCategoryUniqueness1700000002000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop old unique constraints
        // Note: constraint names might vary, so we'll use a safer approach if possible, 
        // but typically they are UQ_... or based on column names.
        // Let's find them first.
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "UQ_80327f12e84d416b08003612503"`); // name unique
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "UQ_93e62f0f807469a4c0a5996057a"`); // slug unique
        
        // Also check for index-based unique constraints if any
        await queryRunner.query(`DROP INDEX IF EXISTS "UK_80327f12e84d416b08003612503"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "UK_93e62f0f807469a4c0a5996057a"`);

        // Create new composite unique indexes
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_CATEGORIES_NAME_PARENT" ON "categories" ("name", "parent_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_CATEGORIES_SLUG_PARENT" ON "categories" ("slug", "parent_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_CATEGORIES_NAME_PARENT"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_CATEGORIES_SLUG_PARENT"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_80327f12e84d416b08003612503" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_93e62f0f807469a4c0a5996057a" UNIQUE ("slug")`);
    }
}
