import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateStudentCoursesTable1631140538403 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'students_courses',
            columns: [
                {
                    name: 'status',
                    type: 'boolean',
                },
                {
                    name: 'purchaseDate',
                    type: 'date',
                },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
