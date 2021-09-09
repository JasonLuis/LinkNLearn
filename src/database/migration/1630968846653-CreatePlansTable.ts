import {MigrationInterface, QueryRunner, QueryRunnerAlreadyReleasedError, Table} from "typeorm";

export class CreatePlansTable1630968846653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new Table({
            name: 'plans',
            columns: [
                {
                    name: 'id_plan',
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
                    name: 'price',
                    type: 'numeric(10,2)',
                },
                {
                    name: 'description',
                    type: 'varchar',
                },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('plans');
        await queryRunner.query('DROP EXTENSION "uuid-ossp"');
    }

}
