import knexLib from 'knex';
import config from "../config/index.mjs";

const knex = knexLib({
    client: "postgres",
    connection: {
        host : config.db.host,
        port : config.db.port,
        database : config.db.database,
        user : config.db.user,
        password : config.db.password,
    },
    pool: {
        min: 2,
        max: 10
    },
});

export default knex;