import { Pool } from 'pg';

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "portfolioDB",
    password: "Pascia1877!",
    port: 5432,
});

export default pool;
