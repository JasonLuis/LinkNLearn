import {MigrationInterface, QueryRunner} from "typeorm";

export class RelationStudentsCourses1631142629281 implements MigrationInterface {
    name = 'RelationStudentsCourses1631142629281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ADD "id_course" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ADD CONSTRAINT "PK_c8c516e1356391d0e1e935e0ff0" PRIMARY KEY ("id_course")`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ADD "id_students" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" DROP CONSTRAINT "PK_c8c516e1356391d0e1e935e0ff0"`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ADD CONSTRAINT "PK_1aa2cb23e82b905f65978b49e91" PRIMARY KEY ("id_course", "id_students")`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ALTER COLUMN "status" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" DROP COLUMN "purchaseDate"`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ADD "purchaseDate" TIMESTAMP NOT NULL DEFAULT '"2021-09-08T23:10:32.968Z"'`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ADD CONSTRAINT "FK_c8c516e1356391d0e1e935e0ff0" FOREIGN KEY ("id_course") REFERENCES "courses"("id_course") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ADD CONSTRAINT "FK_1cadebfbc92867f9b9eed476887" FOREIGN KEY ("id_students") REFERENCES "students"("id_students") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."students_courses" DROP CONSTRAINT "FK_1cadebfbc92867f9b9eed476887"`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" DROP CONSTRAINT "FK_c8c516e1356391d0e1e935e0ff0"`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" DROP COLUMN "purchaseDate"`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ADD "purchaseDate" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" DROP CONSTRAINT "PK_1aa2cb23e82b905f65978b49e91"`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" ADD CONSTRAINT "PK_c8c516e1356391d0e1e935e0ff0" PRIMARY KEY ("id_course")`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" DROP COLUMN "id_students"`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" DROP CONSTRAINT "PK_c8c516e1356391d0e1e935e0ff0"`);
        await queryRunner.query(`ALTER TABLE "public"."students_courses" DROP COLUMN "id_course"`);
    }

}
