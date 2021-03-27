const fs = require('fs/promises');

async function migrateDatabase(db, migrations, path) {
    await makeSureMigrationTableExists(db);

    const lastMigration = await db.get('SELECT name FROM migrations ORDER BY name DESC LIMIT 1;');

    if (lastMigration) {
        const index = migrations.indexOf(lastMigration.name);
        migrations.splice(0, index + 1);
    }

    for (const migration of migrations) {
        const sql = await fs.readFile(path + migration, {encoding: 'utf8'});
        await db.exec(sql);
        await db.run('INSERT INTO migrations (name) VALUES (?)', migration);
    }
}

async function makeSureMigrationTableExists(db) {
    const result = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='migrations';");

    if (!result) {
        await db.exec('CREATE TABLE migrations (name TEXT NOT NULL UNIQUE);');
    }
}

async function execute(database, migrationsPath) {
    if (!migrationsPath) {
        migrationsPath = process.cwd();
    }

    let migrations = await fs.readdir(migrationsPath);
    migrations = migrations.filter(m => !m.startsWith('.') && m.endsWith('.sql'));
    migrations.sort((a, b) => {
        const numberA = parseInt(a.split('-')[0]);
        const numberB = parseInt(b.split('-')[0]);
        if (isNaN(numberA) || isNaN(numberB)) return 0;
        if (numberA < numberB) return -1;
        if (numberA > numberB) return 1;
        return 0;
    });

    await migrateDatabase(database, migrations, migrationsPath);
}

module.exports = execute;
