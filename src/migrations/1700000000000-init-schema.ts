import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "schema" (
        "id" TEXT NOT NULL,
        "version" INT NOT NULL,
        "definition_json" JSONB NOT NULL,
        "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY ("id","version")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "product" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "sku" TEXT NOT NULL UNIQUE,
        "price" NUMERIC(12,2) NOT NULL,
        "stock" INT NOT NULL,
        "status" TEXT NOT NULL,
        "schema_id" TEXT NOT NULL,
        "schema_version" INT NOT NULL,
        "data" JSONB NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_product_schema" ON "product" ("schema_id","schema_version");
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
          CREATE TYPE property_type AS ENUM ('string','int','bool','date','decimal');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "product_properties" (
        "id" BIGSERIAL PRIMARY KEY,
        "product_id" UUID NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
        "schema_id" TEXT NOT NULL,
        "schema_version" INT NOT NULL,
        "property_key" TEXT NOT NULL,
        "property_type" property_type NOT NULL,
        "value_string" TEXT NULL,
        "value_int" INT NULL,
        "value_bool" BOOLEAN NULL,
        "value_date" TIMESTAMPTZ NULL,
        "value_decimal" NUMERIC(12,2) NULL,
        "value_casefold" TEXT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_pp_product" ON "product_properties" ("product_id");`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_pp_key" ON "product_properties" ("property_key");`);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_pp_key_str" ON "product_properties" ("property_key","value_casefold")
      WHERE "property_type"='string';
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_pp_key_int" ON "product_properties" ("property_key","value_int")
      WHERE "property_type"='int';
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_pp_key_bool" ON "product_properties" ("property_key","value_bool")
      WHERE "property_type"='bool';
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_pp_key_date" ON "product_properties" ("property_key","value_date")
      WHERE "property_type"='date';
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_pp_key_dec" ON "product_properties" ("property_key","value_decimal")
      WHERE "property_type"='decimal';
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "collection" (
        "id" TEXT PRIMARY KEY,
        "description" TEXT NULL,
        "filters_json" JSONB NULL,
        "sort_json" JSONB NULL,
        "pagination_json" JSONB NULL,
        "metadata_json" JSONB NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "collection";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pp_key_dec";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pp_key_date";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pp_key_bool";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pp_key_int";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pp_key_str";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pp_key";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pp_product";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product_properties";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product";`);
    await queryRunner.query(`DROP TYPE IF EXISTS property_type;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "schema";`);
  }
}
