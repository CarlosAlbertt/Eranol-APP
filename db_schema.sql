-- Tabla para guardar el estado completo del jugador (JSONB)
CREATE TABLE IF NOT EXISTS players (
    username TEXT PRIMARY KEY,
    state JSONB NOT NULL,
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    password TEXT -- Opcional: si quieres guardar contraseñas simples aquí (mejor usar auth real)
);

-- Ejemplo de Insert
-- INSERT INTO players (username, state) VALUES ('kaiser', '{"gold": 9999}'::jsonb);
