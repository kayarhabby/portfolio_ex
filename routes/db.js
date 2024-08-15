import pg from 'pg';

const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "PortfolioDB",
    password: "Pascia1877!",
    port: 5432,
});

export default pool;
