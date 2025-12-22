import { PlayerRepository } from './repository.js';
import { knownUsers } from '../src/js/data/users.js';

export default async function handler(request, response) {
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
        const { username, password } = request.body;
        const userKey = username.toLowerCase();

        // Auth Check
        const known = knownUsers[userKey];
        if (known && known.password !== password) {
            return response.status(401).json({ error: 'Invalid Credentials' });
        }

        const state = await PlayerRepository.loadPlayerState(userKey);

        if (state) {
            return response.status(200).json({ success: true, state });
        } else {
            return response.status(404).json({ error: 'Not Found' });
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
