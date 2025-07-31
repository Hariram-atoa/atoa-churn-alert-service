import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusinessCategorySeverityEntity1753922495043
  implements MigrationInterface
{
  name = 'BusinessCategorySeverityEntity1753922495043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."business_category_severity_entity_thresholdtype_enum" AS ENUM('GTV', 'TC')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."business_category_severity_entity_severitytype_enum" AS ENUM('Low', 'Medium', 'High', 'Critical')`,
    );
    await queryRunner.query(
      `CREATE TABLE "business_category_severity_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "businessTypeId" character varying(255) NOT NULL, "thresholdType" "public"."business_category_severity_entity_thresholdtype_enum" NOT NULL, "severityType" "public"."business_category_severity_entity_severitytype_enum" NOT NULL, "thresholdValue" integer NOT NULL, CONSTRAINT "PK_3039f6345b998d0b332d86d4d63" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "business_category_severity_entity"`);
    await queryRunner.query(
      `DROP TYPE "public"."business_category_severity_entity_severitytype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."business_category_severity_entity_thresholdtype_enum"`,
    );
  }
}
