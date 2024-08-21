import bcrypt from 'bcrypt';
import pg from 'pg';
import readline from 'readline';

const saltRounds = 10;
const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "PortfolioDB",
    password: "Pascia1877!",
    port: 5432,
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fonction pour lire les entrées de l'utilisateur
function prompt(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function registerUser() {
    try {
        const email = await prompt('Enter the email: ');
        const password = await prompt('Enter the password: ');

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertion dans la base de données
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        console.log('User registered successfully.');

    } catch (err) {
        console.error('Error during registration:', err);
    } finally {
        await pool.end();
        rl.close();
    }
}

registerUser();
