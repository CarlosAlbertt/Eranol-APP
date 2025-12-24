import sql from './db.js';

const toCodeId = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '_');

export const PlayerRepository = {

    async savePlayerState(username, state) {
        // Validation
        if (!username || !state) return { error: 'Invalid data' };

        try {
            return await sql.begin(async sql => {
                // 1. Upsert Player Core (Keep JSON blob for backup/hybrid, but rely on relations)
                await sql`
                    INSERT INTO players (username, state, last_seen)
                    VALUES (${username}, ${state}, NOW())
                    ON CONFLICT (username) 
                    DO UPDATE SET state = ${state}, last_seen = NOW()
                `;

                // 2. PLAYER ITEMS
                // Clear old items to avoid duplicates/sync issues (simplified approach)
                await sql`DELETE FROM player_items WHERE player_username = ${username}`;

                if (state.inventory && state.inventory.length > 0) {
                    for (const item of state.inventory) {
                        const codeId = toCodeId(item.name);
                        // Find item UUID
                        const itemRows = await sql`SELECT id FROM items WHERE code_id = ${codeId} LIMIT 1`;

                        if (itemRows.length > 0) {
                            const itemId = itemRows[0].id;
                            // Insert
                            await sql`
                                INSERT INTO player_items (player_username, item_id, quantity, is_equipped, acquired_at)
                                VALUES (${username}, ${itemId}, ${item.quantity || 1}, ${item.equipped || false}, NOW())
                                ON CONFLICT DO NOTHING
                            `;
                        } else {
                            // Optional: Auto-create unknown items or log warning
                            // console.warn(`Item unknown in DB: ${item.name} (${codeId})`);
                        }
                    }
                }

                // 3. PLAYER QUESTS
                await sql`DELETE FROM player_quests WHERE player_username = ${username}`;

                if (state.missionStatus) {
                    for (const [missionKey, missionData] of Object.entries(state.missionStatus)) {
                        // missionKey is usually the ID like 'ecos_ignis'
                        // missionData is { status: 'active', stage: 1 }
                        const questRows = await sql`SELECT id FROM quests WHERE code_id = ${missionKey} LIMIT 1`;

                        if (questRows.length > 0) {
                            const questId = questRows[0].id;
                            await sql`
                                INSERT INTO player_quests (player_username, quest_id, status, current_stage)
                                VALUES (${username}, ${questId}, ${missionData.status || 'active'}, ${missionData.stage || 0})
                                ON CONFLICT DO NOTHING
                             `;
                        }
                    }
                }

                // 4. PLAYER NPC RELATIONS
                await sql`DELETE FROM player_npc_relations WHERE player_username = ${username}`;

                if (state.npcStatus) {
                    for (const [npcKey, npcData] of Object.entries(state.npcStatus)) {
                        // dvdKey should be 'npc_zora' etc.
                        const npcRows = await sql`SELECT id FROM npcs WHERE code_id = ${npcKey} LIMIT 1`;

                        if (npcRows.length > 0) {
                            const npcId = npcRows[0].id;
                            await sql`
                                INSERT INTO player_npc_relations (player_username, npc_id, trust_level, is_met)
                                VALUES (${username}, ${npcId}, ${npcData.trust || 50}, ${true})
                                ON CONFLICT DO NOTHING
                            `;
                        }
                    }
                }

                return { success: true, username };
            });

        } catch (e) {
            console.error('[DB] Save Error:', e);
            throw e;
        }
    },

    async loadPlayerState(username) {
        try {
            // 1. Get Base
            const player = await sql`SELECT state FROM players WHERE username = ${username}`;
            if (player.length === 0) return null;

            let finalState = player[0].state || {}; // Start with JSON blob as base

            // 2. Rehydrate Inventory from Relations (Source of Truth)
            const dbItems = await sql`
                SELECT i.name, i.type, i.rarity, i.description as desc, i.icon_url as image, pi.quantity, pi.is_equipped
                FROM player_items pi
                JOIN items i ON pi.item_id = i.id
                WHERE pi.player_username = ${username}
            `;

            if (dbItems.length > 0) {
                // Map back to game format
                finalState.inventory = dbItems.map(row => ({
                    name: row.name,
                    type: row.type,
                    rarity: row.rarity,
                    desc: row.desc,
                    image: row.image,
                    quantity: row.quantity,
                    equipped: row.is_equipped
                }));
            }

            // 3. Rehydrate Quests
            const dbQuests = await sql`
                SELECT q.code_id, pq.status, pq.current_stage
                FROM player_quests pq
                JOIN quests q ON pq.quest_id = q.id
                WHERE pq.player_username = ${username}
            `;

            if (dbQuests.length > 0) {
                finalState.missionStatus = {};
                dbQuests.forEach(q => {
                    finalState.missionStatus[q.code_id] = {
                        status: q.status,
                        stage: q.current_stage
                    };
                });
            }

            // 4. Rehydrate NPCs
            const dbNpcs = await sql`
                SELECT n.code_id, nr.trust_level
                FROM player_npc_relations nr
                JOIN npcs n ON nr.npc_id = n.id
                WHERE nr.player_username = ${username}
            `;

            if (dbNpcs.length > 0) {
                if (!finalState.npcStatus) finalState.npcStatus = {};
                dbNpcs.forEach(n => {
                    finalState.npcStatus[n.code_id] = {
                        trust: n.trust_level,
                        met: true
                    };
                });
            }

            return finalState;

        } catch (e) {
            console.error('[DB] Load Error:', e);
            throw e;
        }
    }
};
