import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlertEntityChanges1753905864979 implements MigrationInterface {
  name = 'AlertEntityChanges1753905864979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."alert_entity_alerttype_enum" AS ENUM('GTV Drop', 'TC Drop')`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_entity" ADD "alertType" "public"."alert_entity_alerttype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_entity" ADD "assignedToUser" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "alert_entity" ADD "comments" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "alert_entity" DROP COLUMN "comments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_entity" DROP COLUMN "assignedToUser"`,
    );
    await queryRunner.query(
      `ALTER TABLE "alert_entity" DROP COLUMN "alertType"`,
    );
    await queryRunner.query(`DROP TYPE "public"."alert_entity_alerttype_enum"`);
  }
}
