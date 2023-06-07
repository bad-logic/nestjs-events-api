import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1686111008235 implements MigrationInterface {
  name = 'Initial1686111008235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`profiles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`profile_id\` int NULL, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`REL_23371445bd80cb3e413089551b\` (\`profile_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`attendees\` (\`id\` int NOT NULL AUTO_INCREMENT, \`event_id\` int NOT NULL, \`answer\` enum ('1', '2', '3') NOT NULL DEFAULT '1', \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`when\` datetime NOT NULL, \`address\` varchar(255) NOT NULL, \`organizer_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_23371445bd80cb3e413089551bf\` FOREIGN KEY (\`profile_id\`) REFERENCES \`profiles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendees\` ADD CONSTRAINT \`FK_dec87e2c88c7d8137334cd7ca7d\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendees\` ADD CONSTRAINT \`FK_73eca24cd2c4907c8f1b23600d5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD CONSTRAINT \`FK_14c9ce53a2c2a1c781b8390123e\` FOREIGN KEY (\`organizer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_14c9ce53a2c2a1c781b8390123e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendees\` DROP FOREIGN KEY \`FK_73eca24cd2c4907c8f1b23600d5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attendees\` DROP FOREIGN KEY \`FK_dec87e2c88c7d8137334cd7ca7d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_23371445bd80cb3e413089551bf\``,
    );
    await queryRunner.query(`DROP TABLE \`events\``);
    await queryRunner.query(`DROP TABLE \`attendees\``);
    await queryRunner.query(
      `DROP INDEX \`REL_23371445bd80cb3e413089551b\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`profiles\``);
  }
}
