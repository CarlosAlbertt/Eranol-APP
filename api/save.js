import { PlayerRepository } from './_lib/repository.js';
import { knownUsers } from '../src/js/data/users.js'; // Shared auth logic

export default async function handler(request, response) {
    // Enable CORS for development
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { username, password, state } = request.body;

        if (!username || !state) {
            return response.status(400).json({ error: 'Missing Data' });
        }

        // Basic Auth Check (Password Validation)
        // In a real app, use JWT. Here we check against the static list or DB.
        const userKey = username.toLowerCase();
        const known = knownUsers[userKey];

        if (known) {
            if (known.password !== password) {
                return response.status(401).json({ error: 'Invalid Password' });
            }
        }
        // If user is NOT in knownUsers, we allow creating "Guests" or new users?
        // For now, let's allow saving anyone who has a valid session context, 
        // OR strictly enforce knownUsers.
        // Let's enforce knownUsers only if they exist in the list. 
        // If they don't, we might reject or allow "Guest" saves.
        // DECISION: Allow save if user is 'valid' (has password matched OR is new/guest if we supported that)
        // But the prompt implies we are using the known users.

        if (known && known.password !== password) {
            return response.status(403).json({ error: 'Forbidden' });
        }

        // Save to DB
        await PlayerRepository.savePlayerState(userKey, state);

        return response.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
