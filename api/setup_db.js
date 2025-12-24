import sql from './_lib/db.js';

export default async function handler(request, response) {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS players (
                username TEXT PRIMARY KEY,
                state JSONB,
                last_seen TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        return response.status(200).json({ success: true, message: 'Table initialized' });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.message });
    }
}
