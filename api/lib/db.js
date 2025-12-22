import postgres from 'postgres';

// Initialize connection using environment variable
// In Vercel, this comes from Project Settings. Locally, from .env
const sql = postgres(process.env.DATABASE_URL, {
    ssl: 'require',
    max: 10, // Connection pool size
    idle_timeout: 20,
    connect_timeout: 10
});

export default sql;
