import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSnapShotNullable1753875196422 implements MigrationInterface {
  name = 'UpdateSnapShotNullable1753875196422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."user_snapshot_entity_merchant_id_index"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_snapshot_entity" DROP COLUMN "merchantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_snapshot_entity" ADD "businessId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_snapshot_entity" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_snapshot_entity" ALTER COLUMN "storeId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "user_snapshot_entity_business_id_index" ON "user_snapshot_entity" ("businessId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."user_snapshot_entity_business_id_index"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_snapshot_entity" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_snapshot_entity" ALTER COLUMN "storeId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_snapshot_entity" DROP COLUMN "businessId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_snapshot_entity" ADD "merchantId" uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "user_snapshot_entity_merchant_id_index" ON "user_snapshot_entity" ("merchantId") `,
    );
  }
}
