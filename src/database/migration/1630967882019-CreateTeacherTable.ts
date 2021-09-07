import {MigrationInterface, QueryRunner, QueryRunnerAlreadyReleasedError, Table} from "typeorm";

export class CreateTeacherTable1630967882019 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new Table({
            name: 'teachers',
            columns: [
                {
                    name: 'id_teacher',
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
                    name: 'biography',
                    type: 'varchar', 
                },
                {
                    name: 'linkedin',
                    type: 'varchar', 
                },
                {
                    name: 'portifolio',
                    type: 'varchar', 
                },
                {
                    name: 'contact',
                    type: 'varchar', 
                },
                {
                    name: 'pix',
                    type: 'varchar', 
                },
            ]
        }));
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('teachers');
        await queryRunner.query('DROP EXTENSION "uuid-ossp"');
    }

}
