import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserProfile1753720126277 implements MigrationInterface {
    name = 'AddUserProfile1753720126277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_profiles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`bio\` varchar(255) NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_9b6c0b832a6b0b6b0b6b0b6b0b\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_profiles\` ADD CONSTRAINT \`FK_9b6c0b832a6b0b6b0b6b0b6b0b6b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profiles\` DROP FOREIGN KEY \`FK_9b6c0b832a6b0b6b0b6b0b6b0b6b\``);
        await queryRunner.query(`DROP INDEX \`REL_9b6c0b832a6b0b6b0b6b0b6b0b\` ON \`user_profiles\``);
        await queryRunner.query(`DROP TABLE \`user_profiles\``);
    }
} 