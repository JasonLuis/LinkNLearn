import {MigrationInterface, QueryRunner} from "typeorm";

export class RelationTeacherPlan1630988359257 implements MigrationInterface {
    name = 'RelationTeacherPlan1630988359257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."teachers" DROP CONSTRAINT "FK_0c17cbbb057af676c3ebcdc4e8a"`);
        await queryRunner.query(`ALTER TABLE "public"."teachers" DROP CONSTRAINT "UQ_0c17cbbb057af676c3ebcdc4e8a"`);
        await queryRunner.query(`ALTER TABLE "public"."teachers" ADD CONSTRAINT "FK_0c17cbbb057af676c3ebcdc4e8a" FOREIGN KEY ("id_plan") REFERENCES "plans"("id_plan") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."teachers" DROP CONSTRAINT "FK_0c17cbbb057af676c3ebcdc4e8a"`);
        await queryRunner.query(`ALTER TABLE "public"."teachers" ADD CONSTRAINT "UQ_0c17cbbb057af676c3ebcdc4e8a" UNIQUE ("id_plan")`);
        await queryRunner.query(`ALTER TABLE "public"."teachers" ADD CONSTRAINT "FK_0c17cbbb057af676c3ebcdc4e8a" FOREIGN KEY ("id_plan") REFERENCES "plans"("id_plan") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
