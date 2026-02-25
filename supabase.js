// =============================================
// CONFIGURACIÓN DE SUPABASE
// =============================================

const SUPABASE_URL = 'https://suszwzsjwedvgjhdgens.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1c3p3enNqd2VkdmdqaGRnZW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTg0MjEsImV4cCI6MjA4NjY3NDQyMX0.WRLa7CrE1UxrJmIIiDj3khPSZ2vgegum3gvczH10oSY';

// Cliente de Supabase (usamos nombre diferente para evitar conflicto con window.supabase)
let supabaseClient = null;

// Jugador actual en sesión
let currentPlayer = null;
let currentPinHash = null;

// Inicializar Supabase
function initSupabase() {
    try {
        // Supabase v2 CDN expone el cliente como window.supabase
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase inicializado correctamente');

            // Limpiar sesión anterior al cargar la aplicación
            currentPlayer = null;
            currentPinHash = null;
            localStorage.removeItem('farmapalabra_player');
            updatePlayerUI();

            return true;
        } else {
            console.error('La librería de Supabase no está cargada correctamente');
            return false;
        }
    } catch (error) {
        console.error('Error al inicializar Supabase:', error);
        return false;
    }
}

// =============================================
// GESTIÓN DE JUGADORES
// =============================================

// Generar PIN aleatorio de 4 dígitos
function generatePIN() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Hash simple del PIN (para no guardarlo en texto plano)
async function hashPIN(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + 'farmapalabra_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verificar si un alias ya existe
async function checkAliasExists(alias) {
    if (!supabaseClient) return false;

    const { data, error } = await supabaseClient
        .from('players')
        .select('id')
        .eq('alias', alias.toLowerCase())
        .single();

    return data !== null;
}

// Registrar nuevo jugador
async function registerPlayer(alias) {
    if (!supabaseClient) {
        return { success: false, error: 'Base de datos no disponible' };
    }

    const aliasLower = alias.toLowerCase().trim();

    // Verificar que el alias no existe
    const exists = await checkAliasExists(aliasLower);
    if (exists) {
        return { success: false, error: 'Este alias ya está en uso. Elige otro.' };
    }

    // Generar PIN
    const pin = generatePIN();
    const pinHash = await hashPIN(pin);

    // Insertar jugador
    const { data, error } = await supabaseClient
        .from('players')
        .insert([{
            alias: aliasLower,
            pin_hash: pinHash,
            total_points: 0,
            games_played: 0,
            best_score: 0
        }])
        .select()
        .single();

    if (error) {
        console.error('Error al registrar jugador:', error);
        return { success: false, error: 'Error al crear el perfil. Inténtalo de nuevo.' };
    }

    // Guardar en sesión y localStorage
    currentPlayer = data;
    currentPinHash = pinHash;
    savePlayerToStorage(data.id, aliasLower, pin);

    return { success: true, player: data, pin: pin };
}

// Iniciar sesión con alias y PIN
async function loginPlayer(alias, pin) {
    if (!supabaseClient) {
        return { success: false, error: 'Base de datos no disponible' };
    }

    const aliasLower = alias.toLowerCase().trim();
    const pinHash = await hashPIN(pin);

    const { data, error } = await supabaseClient
        .from('players')
        .select('*')
        .eq('alias', aliasLower)
        .eq('pin_hash', pinHash)
        .single();

    if (error || !data) {
        return { success: false, error: 'Alias o PIN incorrecto' };
    }

    // Guardar en sesión y localStorage
    currentPlayer = data;
    currentPinHash = pinHash;
    savePlayerToStorage(data.id, aliasLower, pin);

    return { success: true, player: data };
}

// Guardar jugador en localStorage
function savePlayerToStorage(id, alias, pin) {
    localStorage.setItem('farmapalabra_player', JSON.stringify({
        id: id,
        alias: alias,
        pin: pin
    }));
}

// Cargar jugador guardado
async function loadSavedPlayer() {
    const saved = localStorage.getItem('farmapalabra_player');
    if (!saved) return null;

    try {
        const { id, alias, pin } = JSON.parse(saved);
        const result = await loginPlayer(alias, pin);
        if (result.success) {
            updatePlayerUI();
            return result.player;
        }
    } catch (e) {
        console.error('Error al cargar jugador guardado:', e);
    }

    return null;
}

// Cerrar sesión
function logoutPlayer() {
    currentPlayer = null;
    currentPinHash = null;
    localStorage.removeItem('farmapalabra_player');
    updatePlayerUI();
}

// =============================================
// GESTIÓN DE RESULTADOS
// =============================================

// Guardar resultado de partida (mediante función RPC segura)
async function saveGameResult(score, correctAnswers, incorrectAnswers, pasapalabraCount, difficulty, timeUsed) {
    if (!supabaseClient || !currentPlayer || !currentPinHash) {
        return { success: false, error: 'No hay jugador conectado' };
    }

    // Llamar a la función RPC segura del servidor
    const { data, error } = await supabaseClient
        .rpc('save_game_result', {
            p_player_id: currentPlayer.id,
            p_pin_hash: currentPinHash,
            p_score: score,
            p_correct_answers: correctAnswers,
            p_incorrect_answers: incorrectAnswers,
            p_pasapalabra_count: pasapalabraCount,
            p_difficulty: difficulty,
            p_time_used: timeUsed
        });

    if (error) {
        console.error('Error al guardar resultado:', error);
        return { success: false, error: 'Error al guardar el resultado' };
    }

    if (!data.success) {
        return { success: false, error: data.error };
    }

    // Actualizar datos locales del jugador
    currentPlayer.total_points = data.total_points;
    currentPlayer.games_played = data.games_played;
    currentPlayer.best_score = data.best_score;

    return { success: true, player: currentPlayer };
}

// =============================================
// RANKING / CLASIFICACIÓN
// =============================================

// Obtener ranking por puntuación total
async function getRanking(limit = 10) {
    if (!supabaseClient) {
        return { success: false, error: 'Base de datos no disponible' };
    }

    const { data, error } = await supabaseClient
        .from('players')
        .select('alias, total_points, games_played, best_score')
        .order('total_points', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error al obtener ranking:', error);
        return { success: false, error: 'Error al cargar el ranking' };
    }

    return { success: true, ranking: data };
}

// Obtener posición del jugador actual en el ranking
async function getPlayerRankPosition() {
    if (!supabaseClient || !currentPlayer) {
        return null;
    }

    const { data, error } = await supabaseClient
        .from('players')
        .select('id')
        .gt('total_points', currentPlayer.total_points);

    if (error) {
        return null;
    }

    return data.length + 1;
}

// =============================================
// INTERFAZ DE USUARIO
// =============================================

// Actualizar UI según estado del jugador
function updatePlayerUI() {
    const playerStatus = document.getElementById('playerStatus');
    const loginBtn = document.getElementById('loginBtn');
    const rankingBtn = document.getElementById('rankingBtn');

    if (!playerStatus) return;

    if (currentPlayer) {
        playerStatus.innerHTML = `
            <span class="player-alias">🎮 ${currentPlayer.alias}</span>
            <span class="player-stats">${currentPlayer.total_points} pts</span>
            <button class="logout-btn" onclick="logoutPlayer()" title="Cerrar sesión">✕</button>
        `;
        playerStatus.style.display = 'flex';
        if (loginBtn) loginBtn.textContent = 'Mi perfil';
    } else {
        playerStatus.style.display = 'none';
        if (loginBtn) loginBtn.textContent = 'Guardar resultado';
    }
}

// Mostrar modal de login/registro
function showAuthModal(mode = 'register') {
    console.log('showAuthModal llamado con modo:', mode);

    const modal = document.getElementById('authModal');
    console.log('Modal encontrado:', modal);

    if (!modal) {
        console.error('No se encontró el modal authModal');
        return;
    }

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const registerTab = document.getElementById('registerTab');
    const loginTab = document.getElementById('loginTab');

    // Restaurar el formulario de registro si fue reemplazado
    if (registerForm && !document.getElementById('registerAlias')) {
        registerForm.innerHTML = `
            <div class="form-group">
                <label for="registerAlias">Elige tu alias</label>
                <input type="text" id="registerAlias" placeholder="Ej: Jugador123" maxlength="15" autocomplete="off">
                <span class="form-hint">Solo letras, números y guiones bajos (3-15 caracteres)</span>
            </div>
            <div id="pinDisplay" class="pin-display" style="display: none;">
                <p>Tu código secreto:</p>
                <div id="pinValue" class="pin-value"></div>
                <p class="pin-warning">⚠️ Guárdalo para recuperar tu perfil</p>
            </div>
            <button id="registerBtn" class="primary auth-submit" onclick="handleRegister()">Crear perfil</button>
        `;
    }

    if (mode === 'register') {
        if (registerForm) registerForm.style.display = 'block';
        if (loginForm) loginForm.style.display = 'none';
        if (registerTab) registerTab.classList.add('active');
        if (loginTab) loginTab.classList.remove('active');
    } else {
        if (registerForm) registerForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
        if (registerTab) registerTab.classList.remove('active');
        if (loginTab) loginTab.classList.add('active');
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    console.log('Modal mostrado');
}

// Cerrar modal de auth
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Limpiar formularios
    const aliasInput = document.getElementById('registerAlias');
    const loginAliasInput = document.getElementById('loginAlias');
    const loginPinInput = document.getElementById('loginPin');

    if (aliasInput) aliasInput.value = '';
    if (loginAliasInput) loginAliasInput.value = '';
    if (loginPinInput) loginPinInput.value = '';

    // Ocultar mensajes de error
    hideAuthError();
    hidePinDisplay();
}

// Mostrar error en modal de auth
function showAuthError(message) {
    const errorDiv = document.getElementById('authError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Ocultar error
function hideAuthError() {
    const errorDiv = document.getElementById('authError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Mostrar PIN generado
function showPinDisplay(pin) {
    const pinDisplay = document.getElementById('pinDisplay');
    const pinValue = document.getElementById('pinValue');

    if (pinDisplay && pinValue) {
        pinValue.textContent = pin;
        pinDisplay.style.display = 'block';
    }
}

// Ocultar PIN
function hidePinDisplay() {
    const pinDisplay = document.getElementById('pinDisplay');
    if (pinDisplay) {
        pinDisplay.style.display = 'none';
    }
}

// Manejar registro
async function handleRegister() {
    const aliasInput = document.getElementById('registerAlias');
    const alias = aliasInput.value.trim();

    hideAuthError();

    // Validaciones
    if (!alias) {
        showAuthError('Introduce un alias');
        return;
    }

    if (alias.length < 3) {
        showAuthError('El alias debe tener al menos 3 caracteres');
        return;
    }

    if (alias.length > 15) {
        showAuthError('El alias no puede tener más de 15 caracteres');
        return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(alias)) {
        showAuthError('El alias solo puede contener letras, números y guiones bajos');
        return;
    }

    // Mostrar estado de carga
    const registerBtn = document.getElementById('registerBtn');
    const originalText = registerBtn.textContent;
    registerBtn.textContent = 'Creando...';
    registerBtn.disabled = true;

    const result = await registerPlayer(alias);

    registerBtn.textContent = originalText;
    registerBtn.disabled = false;

    if (result.success) {
        showPinDisplay(result.pin);
        updatePlayerUI();

        // Mostrar mensaje de éxito
        const registerForm = document.getElementById('registerForm');
        registerForm.innerHTML = `
            <div class="register-success">
                <div class="success-icon">✓</div>
                <h3>¡Perfil creado!</h3>
                <p>Tu alias: <strong>${result.player.alias}</strong></p>
                <div class="pin-box">
                    <p>Tu código secreto:</p>
                    <div class="pin-value">${result.pin}</div>
                    <p class="pin-warning">⚠️ Guárdalo para recuperar tu perfil</p>
                </div>
                <button class="primary" onclick="closeAuthModal()">Entendido</button>
            </div>
        `;
    } else {
        showAuthError(result.error);
    }
}

// Manejar login
async function handleLogin() {
    const aliasInput = document.getElementById('loginAlias');
    const pinInput = document.getElementById('loginPin');

    const alias = aliasInput.value.trim();
    const pin = pinInput.value.trim();

    hideAuthError();

    if (!alias || !pin) {
        showAuthError('Introduce tu alias y código');
        return;
    }

    // Mostrar estado de carga
    const loginBtn = document.getElementById('loginSubmitBtn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Entrando...';
    loginBtn.disabled = true;

    const result = await loginPlayer(alias, pin);

    loginBtn.textContent = originalText;
    loginBtn.disabled = false;

    if (result.success) {
        updatePlayerUI();
        closeAuthModal();
    } else {
        showAuthError(result.error);
    }
}

// Mostrar ranking
async function showRankingModal() {
    const modal = document.getElementById('rankingModal');
    if (!modal) return;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Mostrar loading
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '<div class="ranking-loading">Cargando ranking...</div>';

    // Obtener ranking
    const result = await getRanking(20);

    if (!result.success) {
        rankingList.innerHTML = '<div class="ranking-error">Error al cargar el ranking</div>';
        return;
    }

    if (result.ranking.length === 0) {
        rankingList.innerHTML = '<div class="ranking-empty">Aún no hay jugadores en el ranking.<br>¡Sé el primero!</div>';
        return;
    }

    // Construir tabla de ranking
    let html = `
        <table class="ranking-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Jugador</th>
                    <th>Puntos</th>
                    <th>Partidas</th>
                    <th>Mejor</th>
                </tr>
            </thead>
            <tbody>
    `;

    result.ranking.forEach((player, index) => {
        const position = index + 1;
        const isCurrentPlayer = currentPlayer && player.alias === currentPlayer.alias;
        const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : position;

        html += `
            <tr class="${isCurrentPlayer ? 'current-player' : ''}">
                <td class="rank-position">${medal}</td>
                <td class="rank-alias">${player.alias}${isCurrentPlayer ? ' (tú)' : ''}</td>
                <td class="rank-points">${player.total_points}</td>
                <td class="rank-games">${player.games_played}</td>
                <td class="rank-best">${player.best_score}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';

    // Mostrar posición del jugador actual si no está en el top
    if (currentPlayer) {
        const playerInRanking = result.ranking.find(p => p.alias === currentPlayer.alias);
        if (!playerInRanking) {
            const position = await getPlayerRankPosition();
            if (position) {
                html += `
                    <div class="your-position">
                        Tu posición: <strong>#${position}</strong> con ${currentPlayer.total_points} puntos
                    </div>
                `;
            }
        }
    }

    rankingList.innerHTML = html;
}

// Cerrar modal de ranking
function closeRankingModal() {
    const modal = document.getElementById('rankingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Preguntar si guardar resultado (para mostrar al final del juego)
function showSaveScorePrompt(score) {
    if (currentPlayer) {
        // Ya está logueado, guardar directamente
        return true;
    }

    // Mostrar modal para registrarse
    showAuthModal('register');
    return false;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando Supabase...');

    // Esperar a que Supabase esté cargado
    setTimeout(() => {
        initSupabase();
    }, 500);
});

// Exponer funciones globalmente para que funcionen con onclick
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.showRankingModal = showRankingModal;
window.closeRankingModal = closeRankingModal;
window.logoutPlayer = logoutPlayer;

console.log('supabase.js cargado correctamente');
