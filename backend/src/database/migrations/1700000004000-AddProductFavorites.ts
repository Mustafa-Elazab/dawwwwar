import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductFavorites1700000004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "merchantId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "favorites" ADD "productId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_favorites_user_product" ON "favorites" ("userId", "productId") WHERE "productId" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_favorites_user_product"`);
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_product"`);
    await queryRunner.query(`ALTER TABLE "favorites" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "merchantId" SET NOT NULL`);
  }
}
