import {MigrationInterface, QueryRunner} from "typeorm";

export class RelationCourseTeacher1631059441524 implements MigrationInterface {
    name = 'RelationCourseTeacher1631059441524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."courses" ADD "id_teacher" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."courses" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "public"."courses" ADD "startDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."courses" DROP COLUMN "finishDate"`);
        await queryRunner.query(`ALTER TABLE "public"."courses" ADD "finishDate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."courses" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "public"."courses" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."courses" ADD CONSTRAINT "FK_c9ae211023098e9b7bb44f5b473" FOREIGN KEY ("id_teacher") REFERENCES "teachers"("id_teacher") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."courses" DROP CONSTRAINT "FK_c9ae211023098e9b7bb44f5b473"`);
        await queryRunner.query(`ALTER TABLE "public"."courses" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "public"."courses" ADD "price" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."courses" DROP COLUMN "finishDate"`);
        await queryRunner.query(`ALTER TABLE "public"."courses" ADD "finishDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."courses" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "public"."courses" ADD "startDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."courses" DROP COLUMN "id_teacher"`);
    }

}
