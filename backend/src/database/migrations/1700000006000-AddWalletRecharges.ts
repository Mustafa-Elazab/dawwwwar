import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWalletRecharges1700000006000 implements MigrationInterface {
  name = 'AddWalletRecharges1700000006000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'wallet_recharges_status_enum') THEN
          CREATE TYPE "wallet_recharges_status_enum" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "wallet_recharges" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid NOT NULL,
        "paymob_order_id" character varying NOT NULL,
        "paymob_transaction_id" character varying,
        "amount" numeric(10,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'EGP',
        "status" "wallet_recharges_status_enum" NOT NULL DEFAULT 'PENDING',
        "payment_key" text,
        "checkout_url" text,
        "metadata" jsonb,
        CONSTRAINT "PK_wallet_recharges_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_wallet_recharges_paymob_order_id" UNIQUE ("paymob_order_id"),
        CONSTRAINT "FK_wallet_recharges_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_wallet_recharges_user_id" ON "wallet_recharges" ("user_id")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_wallet_recharges_user_id"');
    await queryRunner.query('DROP TABLE IF EXISTS "wallet_recharges"');
    await queryRunner.query('DROP TYPE IF EXISTS "wallet_recharges_status_enum"');
  }
}
