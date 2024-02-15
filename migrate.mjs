import pg from "pg";
import fs from "fs";
import { promisify } from "util";

// import.meta.dirname available since Node 21.2.0 and 20.11.0 
const migrationsDir = import.meta.dirname + "/migrations";


// This utility inspired from the blog: https://www.antoniovdlc.me/a-look-at-postgresql-migrations-in-node/

// Add sorting, validating and hashing features from the "postgres-migrations" library (the library is abandoned)

// TODO: Add sorting based on id number in filename
// https://github.com/ThomWright/postgres-migrations/blob/dbfc5ccd7c71d77c24200d403cd72722017eca67/src/files-loader.ts#L44

// TODO: Add filename validations (clash if two people commit files with same id number)
// https://github.com/ThomWright/postgres-migrations/blob/dbfc5ccd7c71d77c24200d403cd72722017eca67/src/validation.ts#L7

// TODO: Add file has checks
// https://github.com/ThomWright/postgres-migrations/blob/dbfc5ccd7c71d77c24200d403cd72722017eca67/src/validation.ts#L17

async function getOutstandingMigrations(migrations = []) {
    promisify
    const files = await promisify(fs.readdir)(migrationsDir);
    const sql = await Promise.all(

        files
            .filter((file) => file.endsWith("-up.sql"))
            .filter((file) => !migrations.includes(file))
            .map(async (file) => ({
                file,
                query: await promisify(fs.readFile)(`${migrationsDir}/${file}`, {
                    encoding: "utf-8",
                }),
            }))
    );
    return sql;
}

async function getClient() {
    const client = new pg.Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    console.log("Connecting to db...");
    await client.connect();
    return client;
}

async function migrate() {
    const client = await getClient();
    console.log("Connected!");
    // Check previous migrations
    let existingMigrations = [];
    try {
        let result = await client.query("SELECT * FROM migrations");
        existingMigrations = result.rows.map(r => r.file)
    } catch {
        console.warn("First migration");
    }
    
    // Get outstanding migrations
    const outstandingMigrations = await getOutstandingMigrations(
        existingMigrations
    );
    
    try {
        // Start transaction
        await client.query("BEGIN");
        
        // Run each migration sequentially in a transaction
        for (let migration of outstandingMigrations) {
            // Run the migration
            await client.query(migration.query.toString());
            // Keep track of the migration
            await client.query("INSERT INTO migrations (file) VALUES ($1)", [
                migration.file,
            ]);
        }
        // All good, we can commit the transaction
        await client.query("COMMIT");
    } catch (err) {
        // Oops, something went wrong, rollback!
        console.log(`ERR: [${err.message}] Rolling back.`);
        await client.query("ROLLBACK");
    } finally {
        // Don't forget to release the client!
        client.end();
    }
}

await migrate();