# Sqlite migrations

## Install 

```shell
npm install --save @daanvanberkel/sqlite-migrations
```

## Migration files

Store the database migrations in a separate folder and start the name of the migrations with a number.
Example structure:

```
project
└── migrations
    ├── 01-InitialTableCreation.sql
    └── 02-AlterColumnX.sql
```

All files starting with a `.` (dot) are ignored. Only files ending with `.sql` are used.

## Usage

```js
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const migrations = require('@daanvanberkel/sqlite-migrations');

(async () => {
    const db = await sqlite.open({
        filename: __dirname + '/storage.db',
        driver: sqlite3.Database
    });

    await migrations(db, "<PATH_TO_MIGRATIONS_FOLDER>");
})();
```
