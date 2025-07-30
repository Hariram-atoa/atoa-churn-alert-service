import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1753870201672 implements MigrationInterface {
  name = 'InitialMigration1753870201672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_snapshot_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "merchantId" uuid, "userId" uuid NOT NULL, "monthStart" date NOT NULL, "monthEnd" date NOT NULL, "metaData" jsonb, "storeId" uuid NOT NULL, "transactionCount" integer, "transactionVolume" numeric(8,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b545296c610b908575e588eff5d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "user_snapshot_entity_store_id_index" ON "user_snapshot_entity" ("storeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "user_snapshot_entity_userid_index" ON "user_snapshot_entity" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "user_snapshot_entity_merchant_id_index" ON "user_snapshot_entity" ("merchantId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "alert_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "severity" character varying(255) NOT NULL, "merchantId" uuid NOT NULL, "summary" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying(255) NOT NULL, "followUpDate" date, "followUpReason" character varying, CONSTRAINT "PK_ff36cd7694aa7383f54792290f7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "alert_entity_merchant_id_index" ON "alert_entity" ("merchantId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "call_log_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "callId" character varying, "calledBy" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "callStatus" character varying(255) NOT NULL, "summary" character varying(255), "alert_id" uuid, CONSTRAINT "PK_7e304109cab3f2faa4ee8939f67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "call_log_entity" ADD CONSTRAINT "FK_8aed2a50c05ef8e2d197b9fc894" FOREIGN KEY ("alert_id") REFERENCES "alert_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "call_log_entity" DROP CONSTRAINT "FK_8aed2a50c05ef8e2d197b9fc894"`,
    );
    await queryRunner.query(`DROP TABLE "call_log_entity"`);
    await queryRunner.query(
      `DROP INDEX "public"."alert_entity_merchant_id_index"`,
    );
    await queryRunner.query(`DROP TABLE "alert_entity"`);
    await queryRunner.query(
      `DROP INDEX "public"."user_snapshot_entity_merchant_id_index"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."user_snapshot_entity_userid_index"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."user_snapshot_entity_store_id_index"`,
    );
    await queryRunner.query(`DROP TABLE "user_snapshot_entity"`);
  }
}
