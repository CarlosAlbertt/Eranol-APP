-- =========================================================================================
-- ESQUEMA DE BASE DE DATOS "ESTILO BALDUR'S GATE 3" (RPG COMPLEJO)
-- =========================================================================================
-- Diseñado para soportar persistencia granular, mundo compartido y referencias cruzadas.
-- Autor: Antigravity Agent
-- =========================================================================================

-- 1. LOCALIZACIONES (El Mundo)
-- Define la estructura geográfica.
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id TEXT UNIQUE NOT NULL, -- ej: 'anillo_2_plaza', 'mercado_negro'
    name TEXT NOT NULL,
    description TEXT,
    ring_level INTEGER DEFAULT 2, -- 0, 1, 2, 3
    parent_location_id UUID REFERENCES locations(id), -- Jerarquía (Distrito -> Ciudad)
    image_url TEXT,
    is_safe_zone BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. OBJETOS Y EQUIPAMIENTO (Item Compendium)
-- Catálogo maestro de todos los objetos posibles en el juego.
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id TEXT UNIQUE NOT NULL, -- ej: 'espada_larga', 'pocion_curativa'
    name TEXT NOT NULL,
    description TEXT,
    type Varchar(50) NOT NULL, -- 'weapon', 'armor', 'consumable', 'misc', 'quest'
    rarity Varchar(50) DEFAULT 'common', -- 'common', 'rare', 'legendary'
    weight DECIMAL(5, 2) DEFAULT 0.0,
    price_gold INTEGER DEFAULT 0,
    price_blood INTEGER DEFAULT 0,
    icon_url TEXT,
    
    -- Stats en JSONB para flexibilidad (daño, defensa, efectos)
    -- ej: {"damage": "1d8", "damage_type": "slashing", "ac_bonus": 2}
    stats JSONB DEFAULT '{}'::jsonb,
    
    -- Requisitos (Nivel, Clase, Stats)
    requirements JSONB DEFAULT '{}'::jsonb
);

-- 3. NPCS (Personajes No Jugadores)
-- Definición base de los personajes del mundo.
CREATE TABLE npcs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id TEXT UNIQUE NOT NULL, -- ej: 'npc_zora', 'npc_borg'
    name TEXT NOT NULL,
    role TEXT, -- 'Mercenario', 'Comerciante'
    race TEXT,
    level INTEGER DEFAULT 1,
    location_id UUID REFERENCES locations(id), -- Dónde está por defecto
    
    -- Apariencia
    avatar_url TEXT,
    model_url TEXT,
    
    -- Comportamiento y Diálogo Base
    -- Referencia a archivos JSON de diálogo o árboles de diálogo complejos
    dialogue_tree_id TEXT, 
    
    -- Inventario del NPC (Loot Table base)
    default_loot JSONB DEFAULT '[]'::jsonb,
    
    is_trader BOOLEAN DEFAULT FALSE,
    is_hostile BOOLEAN DEFAULT FALSE
);

-- 4. QUESTS (Misiones)
-- Estructura de misiones y contratos.
CREATE TABLE quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code_id TEXT UNIQUE NOT NULL, -- ej: 'ecos_ignis'
    title TEXT NOT NULL,
    description TEXT,
    giver_npc_id UUID REFERENCES npcs(id),
    
    -- Objetivos (Lista estructurada)
    -- ej: [{"stage": 1, "desc": "Habla con X"}, {"stage": 2, "desc": "Mata Y"}]
    stages JSONB NOT NULL,
    
    -- Recompensas (Items, XP, Oro)
    rewards JSONB NOT NULL, -- {"xp": 500, "gold": 100, "items": ["item_uuid"]}
    
    min_level INTEGER DEFAULT 1,
    is_main_story BOOLEAN DEFAULT FALSE
);

-- =========================================================================================
-- TABLAS DINÁMICAS (ESTADO DEL JUGADOR MULTIJUGADOR)
-- Estas tablas reemplazan el "blob JSON" para un control total tipo MMO/RPG serio.
-- =========================================================================================

-- PLAYER_INVENTORY (Inventario Normalizado)
-- Permite queries como "Quién tiene la Espada Excalibur?"
CREATE TABLE player_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_username TEXT REFERENCES players(username) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id),
    
    quantity INTEGER DEFAULT 1,
    is_equipped BOOLEAN DEFAULT FALSE,
    slot Varchar(50), -- 'head', 'main_hand', etc.
    custom_name TEXT, -- Si el jugador la renombró
    durability INTEGER DEFAULT 100,
    
    acquired_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(player_username, item_id, is_equipped, slot) -- Prevenir duplicados extraños stackeables
);

-- PLAYER_QUESTS (Progreso de Misiones)
CREATE TABLE player_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_username TEXT REFERENCES players(username) ON DELETE CASCADE,
    quest_id UUID REFERENCES quests(id),
    
    status Varchar(20) DEFAULT 'active', -- 'active', 'completed', 'failed'
    current_stage INTEGER DEFAULT 0,
    progress_data JSONB DEFAULT '{}'::jsonb, -- Contadores internos (ej: goblins_killed: 5/10)
    
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    UNIQUE(player_username, quest_id)
);

-- NPC_RELATIONS (Confianza dinámica y persistente)
CREATE TABLE player_npc_relations (
    player_username TEXT REFERENCES players(username) ON DELETE CASCADE,
    npc_id UUID REFERENCES npcs(id),
    
    trust_level INTEGER DEFAULT 50, -- 0 a 100
    is_met BOOLEAN DEFAULT FALSE,
    is_dead_for_player BOOLEAN DEFAULT FALSE, -- Si el NPC murió en "su" mundo
    
    last_interaction TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (player_username, npc_id)
);

-- =========================================================================================
-- DATOS INICIALES (SEED DATA)
-- Ejemplos para poblar la base de datos automáticamente
-- =========================================================================================

-- INSERT INTO locations (code_id, name, description) VALUES 
-- ('anillo_2_taverna', 'La Taberna del Grifo', 'Lugar de reunión de mercenarios.');

-- INSERT INTO items (code_id, name, type, rarity, price_gold) VALUES
-- ('pocion_vida', 'Poción de Curación', 'consumable', 'common', 50),
-- ('espada_hierro', 'Espada de Hierro', 'weapon', 'common', 100);
