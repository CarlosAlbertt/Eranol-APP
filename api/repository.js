import sql from './db.js';

export const PlayerRepository = {
    // Upsert Player State
    // We assume 'username' is the unique key. 
    // In a real app we'd use IDs, but here we use the clean username.
    async savePlayerState(username, stateJson) {
        try {
            // Upsert logic: simple
            // We need a table 'players' with (username TEXT PK, state JSONB, last_seen TIMESTAMPTZ)
            const result = await sql`
                INSERT INTO players (username, state, last_seen)
                VALUES (${username}, ${stateJson}, NOW())
                ON CONFLICT (username) 
                DO UPDATE SET 
                    state = ${stateJson}, 
                    last_seen = NOW()
                RETURNING username;
            `;
            return { success: true, username: result[0].username };
        } catch (e) {
            console.error('[DB] Save Error:', e);
            throw e;
        }
    },

    // Load Player State
    async loadPlayerState(username) {
        try {
            const result = await sql`
                SELECT state FROM players 
                WHERE username = ${username}
            `;

            if (result.length > 0) {
                return result[0].state;
            }
            return null;
        } catch (e) {
            console.error('[DB] Load Error:', e);
            throw e;
        }
    }
};
