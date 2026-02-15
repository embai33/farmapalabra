-- =============================================
-- SCRIPT DE CONFIGURACIÓN DE SUPABASE
-- FarmaPalabra: Trasplante
-- =============================================
-- Ejecuta este script en el SQL Editor de Supabase
-- (Proyecto > SQL Editor > New Query)

-- 1. CREAR TABLA DE JUGADORES
-- =============================================
CREATE TABLE IF NOT EXISTS players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alias TEXT NOT NULL UNIQUE,
    pin_hash TEXT NOT NULL,
    total_points INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas por alias
CREATE INDEX IF NOT EXISTS idx_players_alias ON players(alias);

-- Índice para ranking por puntos
CREATE INDEX IF NOT EXISTS idx_players_total_points ON players(total_points DESC);

-- 2. CREAR TABLA DE RESULTADOS DE PARTIDAS
-- =============================================
CREATE TABLE IF NOT EXISTS game_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    incorrect_answers INTEGER DEFAULT 0,
    pasapalabra_count INTEGER DEFAULT 0,
    difficulty TEXT NOT NULL,
    time_used INTEGER DEFAULT 0,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para consultas por jugador
CREATE INDEX IF NOT EXISTS idx_game_results_player ON game_results(player_id);

-- Índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_game_results_date ON game_results(played_at DESC);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE SEGURIDAD PARA PLAYERS
-- =============================================
-- Permitir a cualquiera leer jugadores (para el ranking)
CREATE POLICY "Permitir lectura pública de jugadores" ON players
    FOR SELECT USING (true);

-- Permitir a cualquiera insertar nuevos jugadores (registro)
CREATE POLICY "Permitir registro de nuevos jugadores" ON players
    FOR INSERT WITH CHECK (true);

-- Permitir actualización (solo el jugador puede actualizar sus datos)
-- Como no usamos auth de Supabase, permitimos todas las actualizaciones
-- La seguridad se maneja con el PIN en la aplicación
CREATE POLICY "Permitir actualización de jugadores" ON players
    FOR UPDATE USING (true);

-- 5. POLÍTICAS DE SEGURIDAD PARA GAME_RESULTS
-- =============================================
-- Permitir lectura pública (para estadísticas)
CREATE POLICY "Permitir lectura pública de resultados" ON game_results
    FOR SELECT USING (true);

-- Permitir insertar resultados
CREATE POLICY "Permitir insertar resultados" ON game_results
    FOR INSERT WITH CHECK (true);

-- 6. VISTA PARA EL RANKING (OPCIONAL)
-- =============================================
CREATE OR REPLACE VIEW ranking_view AS
SELECT
    alias,
    total_points,
    games_played,
    best_score,
    RANK() OVER (ORDER BY total_points DESC) as position
FROM players
WHERE games_played > 0
ORDER BY total_points DESC;

-- =============================================
-- FIN DEL SCRIPT
-- =============================================
-- Después de ejecutar este script, las tablas estarán listas.
-- Puedes verificarlo en: Table Editor > players / game_results
