import sql from './_lib/db.js';
import { allShops } from '../src/js/data/shops.js';
// We would also import npcs/quests if they were in a clear data file.
// For now, let's focus on Items primarily, as they are the most critical for inventory.

export default async function handler(request, response) {
    if (request.method !== 'POST') return response.status(405).json({ error: 'POST required' });

    try {
        const report = { items: 0, errors: [] };

        // 1. SEED ITEMS from Shops
        for (const shop of allShops) {
            if (!shop.items) continue;
            for (const item of shop.items) {
                try {
                    // Generate a CODE_ID from name (e.g. "Espada Larga" -> "espada_larga")
                    const codeId = item.name.toLowerCase().replace(/[^a-z0-9]/g, '_');

                    await sql`
                        INSERT INTO items (code_id, name, type, rarity, price_gold, description, stats, icon_url)
                        VALUES (
                            ${codeId}, 
                            ${item.name}, 
                            ${item.type || 'misc'}, 
                            ${item.rarity || 'common'}, 
                            ${item.price || 0}, 
                            ${item.desc || ''},
                            ${JSON.stringify(item)},
                            ${item.image || ''}
                        )
                        ON CONFLICT (code_id) DO UPDATE SET 
                            price_gold = ${item.price || 0},
                            description = ${item.desc || ''},
                            icon_url = ${item.image || ''}
                    `;
                    report.items++;
                } catch (e) {
                    report.errors.push(`Item ${item.name}: ${e.message}`);
                }
            }
        }

        // 2. SEED LOCATIONS (Basic)
        // We can add the shop locations themselves
        for (const shop of allShops) {
            try {
                await sql`
                    INSERT INTO locations (code_id, name, ring_level, description)
                    VALUES (${shop.id}, ${shop.name}, ${shop.ring}, ${shop.description})
                    ON CONFLICT (code_id) DO NOTHING
                `;
            } catch (e) { }
        }

        // 3. SEED BASIC NPCS (Hardcoded for now based on Dialogue.js knowledge)
        const npcs = [
            { id: 'npc_zora', name: "Zora 'La Cicatriz'", role: 'Mercenario' },
            { id: 'npc_borg', name: "Borg", role: 'Tabernero' },
            { id: 'npc_vance', name: "'Dedos' Vance", role: 'Ladrón' }
        ];

        for (const npc of npcs) {
            try {
                await sql`
                    INSERT INTO npcs (code_id, name, role)
                    VALUES (${npc.id}, ${npc.name}, ${npc.role})
                    ON CONFLICT (code_id) DO NOTHING
                `;
            } catch (e) { }
        }

        // 4. SEED QUESTS (Basic)
        const quests = [
            { id: 'ecos_ignis', title: 'Ecos de Ignis' },
            { id: 'el_cobrador', title: 'El Cobrador' },
            { id: 'sangre_arena', title: 'Sangre y Arena' }
        ];
        for (const q of quests) {
            try {
                await sql`
                    INSERT INTO quests (code_id, title, stages, rewards)
                    VALUES (${q.id}, ${q.title}, '[]'::jsonb, '{}'::jsonb)
                    ON CONFLICT (code_id) DO NOTHING
                `;
            } catch (e) { }
        }


        return response.status(200).json({ success: true, report });
    } catch (e) {
        return response.status(500).json({ error: e.message });
    }
}
