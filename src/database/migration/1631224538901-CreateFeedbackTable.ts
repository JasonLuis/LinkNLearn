import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateFeedbackTable1631224538901 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'feedback',
            columns: [
                {
                    name: 'description',
                    type: 'varchar'
                },
                {
                    name: 'classification',
                    type: 'numeric(5,2)'
                }
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('feedback');
    }

}
