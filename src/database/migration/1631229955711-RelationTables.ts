import {MigrationInterface, QueryRunner} from "typeorm";

export class RelationTables1631229955711 implements MigrationInterface {
    name = 'RelationTables1631229955711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ALTER COLUMN "purchaseDate" SET DEFAULT '"2021-09-09T23:25:58.012Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ALTER COLUMN "purchaseDate" SET DEFAULT '2021-09-09 22:47:33.64'`);
    }

}
