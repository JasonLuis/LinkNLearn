import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCoursesTable1631057527098 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new Table({
            name: 'courses',
            columns:[
                {
                    name: 'id_course',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'description',
                    type: 'varchar',
                },
                {
                    name: 'level',
                    type: 'varchar',
                },
                {
                    name: 'startDate',
                    type: 'date',
                },
                {
                    name: 'finishDate',
                    type: 'date',
                },
                {
                    name: 'period',
                    type: 'varchar',
                },
                {
                    name: 'classDate',
                    type: 'varchar',
                },
                {
                    name: 'maxStudent',
                    type: 'integer',
                },
                {
                    name: 'price',
                    type: 'float',
                },
                {
                    name: 'platform',
                    type: 'varchar',
                },
                {
                    name: 'logoCourse',
                    type: 'varchar',
                },
                {
                    name: 'hours',
                    type: 'varchar',
                },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('courses');
        await queryRunner.query('DROP EXTENSION "uuid-ossp"');
    }

}
