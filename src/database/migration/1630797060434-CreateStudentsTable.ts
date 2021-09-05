import {MigrationInterface, QueryRunner, QueryRunnerAlreadyReleasedError, Table} from "typeorm";

export class CreateStudentsTable1630797060434 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new Table({
            name: 'students',
            columns: [
                {
                    name: 'id_students',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                   name: 'last_name',
                   type: 'varchar',
                },
                {
                    name: 'cpf',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'birthDate',
                    type: 'date',
                },
                {
                    name: 'gender',
                    type: 'varchar',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'pictureProfile',
                    type: 'varchar',
                },
                {
                    name: 'educationLevel',
                    type: 'varchar',
                },
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('students');
        await queryRunner.query('DROP EXTENSION "uuid-ossp"');
    }

}
