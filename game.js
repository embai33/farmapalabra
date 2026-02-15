// =============================================
// FarmaPalabra: Trasplante - Archivo JavaScript
// Hospital U.P. La Fe - Servicio de Farmacia
// =============================================

// Configuración de niveles de dificultad
const difficultySettings = {
    facil: {
        name: "Fácil",
        time: 420, // 7 minutos
        hints: 5,
        difficultyBonus: 0, // Sin bonificación
        description: "7 minutos, 5 pistas disponibles"
    },
    normal: {
        name: "Normal",
        time: 300, // 5 minutos
        hints: 3,
        difficultyBonus: 2, // +2 puntos por terminar a tiempo
        description: "5 minutos, 3 pistas disponibles"
    },
    dificil: {
        name: "Difícil",
        time: 180, // 3 minutos
        hints: 0,
        difficultyBonus: 5, // +5 puntos por terminar a tiempo
        description: "3 minutos, sin pistas"
    }
};

let currentDifficulty = 'normal';

// Diccionario ampliado con términos verificados de fuentes médicas fiables
// Fuentes: SEFH, Hospital La Fe, PubMed, Organización Nacional de Trasplantes
const allWords = {
    A: [
        {word: "Advagraf", definition: "Medicamento inmunosupresor de liberación prolongada que se toma una vez al día"},
        {word: "Adherencia", definition: "Cumplimiento del tratamiento farmacológico según las indicaciones médicas"},
        {word: "Azatioprina", definition: "Medicamento inmunosupresor antiproliferativo, comercializado como Imurel"},
        {word: "Antifúngico", definition: "Tipo de medicamento usado para prevenir o tratar infecciones por hongos"},
        {word: "Analítica", definition: "Prueba de sangre que se realiza periódicamente para controlar niveles de medicamentos"}
    ],
    B: [
        {word: "Biopsia", definition: "Procedimiento médico para detectar rechazo en el órgano trasplantado"},
        {word: "Basiliximab", definition: "Anticuerpo monoclonal usado en la inducción del trasplante para prevenir rechazo"},
        {word: "Bacterias", definition: "Microorganismos que pueden causar infecciones en pacientes inmunodeprimidos"}
    ],
    C: [
        {word: "Ciclosporina", definition: "Medicamento inmunosupresor inhibidor de la calcineurina, el primero en usarse en trasplantes"},
        {word: "Colesterol", definition: "Sustancia que se debe controlar en la dieta post-trasplante por efectos de la medicación"},
        {word: "Corticoides", definition: "Medicamentos con efectos inmunosupresores y antiinflamatorios, como la prednisona"},
        {word: "Citomegalovirus", definition: "Virus que puede causar infecciones graves en pacientes trasplantados"},
        {word: "Calcineurina", definition: "Enzima que inhiben medicamentos como tacrolimus y ciclosporina"}
    ],
    D: [
        {word: "Dieta", definition: "Régimen alimenticio que debe seguirse para evitar el aumento de peso y controlar factores de riesgo"},
        {word: "Diarrea", definition: "Efecto secundario frecuente de algunos inmunosupresores que requiere control"},
        {word: "Donante", definition: "Persona que cede un órgano para trasplante, puede ser vivo o cadáver"},
        {word: "Diabetes", definition: "Complicación metabólica que puede aparecer como efecto secundario de la medicación"},
        {word: "Dosis", definition: "Cantidad de medicamento que debe tomarse según prescripción médica"}
    ],
    E: [
        {word: "Everolimus", definition: "Medicamento inmunosupresor inhibidor de mTOR, alternativa a otros inmunosupresores"},
        {word: "Esternón", definition: "Hueso que necesita un periodo de recuperación después del trasplante cardíaco"},
        {word: "Ecocardiograma", definition: "Prueba de imagen del corazón que se realiza en el seguimiento post-trasplante"},
        {word: "Edema", definition: "Hinchazón por acumulación de líquidos, posible efecto secundario de algunos medicamentos"}
    ],
    F: [
        {word: "Fiebre", definition: "Síntoma de alerta que debe ser comunicado al médico si supera los 38 grados"},
        {word: "Farmacia", definition: "Servicio donde se dispensan los medicamentos inmunosupresores tras el alta"},
        {word: "Fungica", definition: "Tipo de infección causada por hongos, prevenible con antifúngicos como nistatina"}
    ],
    G: [
        {word: "Gripe", definition: "Enfermedad viral contra la que se recomienda vacunarse anualmente"},
        {word: "Grasas", definition: "Tipo de nutrientes que deben limitarse en la dieta post-trasplante"},
        {word: "Glucosa", definition: "Nivel en sangre que puede alterarse por efecto de los inmunosupresores"}
    ],
    H: [
        {word: "Higiene", definition: "Conjunto de prácticas fundamentales para prevenir infecciones en pacientes trasplantados"},
        {word: "Hipertensión", definition: "Aumento de la tensión arterial, efecto secundario frecuente de algunos inmunosupresores"},
        {word: "Hepatico", definition: "Relativo al hígado, uno de los órganos que pueden trasplantarse"},
        {word: "Horario", definition: "Momento fijo del día en que deben tomarse los medicamentos inmunosupresores"}
    ],
    I: [
        {word: "Inmunosupresores", definition: "Medicamentos esenciales para prevenir el rechazo del órgano trasplantado"},
        {word: "Infección", definition: "Complicación que se debe prevenir con medidas higiénicas y medicamentos profilácticos"},
        {word: "Imurel", definition: "Nombre comercial de la azatioprina, medicamento antiproliferativo"},
        {word: "Inmunoglobulina", definition: "Anticuerpo usado para prevenir infecciones como el citomegalovirus"}
    ],
    J: [
        {word: "Jabón", definition: "Producto esencial para el lavado frecuente de manos y prevención de infecciones"}
    ],
    L: [
        {word: "Lamivudina", definition: "Medicamento antiviral usado para prevenir reactivación de hepatitis B"},
        {word: "Lavado", definition: "Acción de higiene frecuente recomendada especialmente para las manos"},
        {word: "Letermovir", definition: "Antiviral de nombre comercial Prevymis, usado para prevenir infección por citomegalovirus"}
    ],
    M: [
        {word: "Micofenolato", definition: "Inmunosupresor antiproliferativo que no afecta la función renal, se toma dos veces al día"},
        {word: "Mascarilla", definition: "Elemento de protección recomendado en lugares concurridos durante los primeros meses"},
        {word: "Metilprednisolona", definition: "Corticoide potente usado en el tratamiento del rechazo agudo"},
        {word: "Myfortic", definition: "Nombre comercial de una presentación de ácido micofenólico"}
    ],
    N: [
        {word: "Nistatina", definition: "Medicamento antifúngico utilizado para prevenir infecciones orales por hongos"},
        {word: "Nutrición", definition: "Aspecto fundamental a cuidar después del trasplante para evitar complicaciones"},
        {word: "Niveles", definition: "Concentración de medicamentos en sangre que debe controlarse periódicamente"}
    ],
    O: [
        {word: "Omeprazol", definition: "Protector gástrico que se toma por la mañana durante los primeros meses post-trasplante"},
        {word: "Osteoporosis", definition: "Pérdida de masa ósea que puede ocurrir como efecto secundario de los corticoides"}
    ],
    P: [
        {word: "Prograf", definition: "Nombre comercial del tacrolimus, uno de los inmunosupresores más utilizados"},
        {word: "Prednisona", definition: "Corticoide con potentes efectos inmunosupresores, se reduce gradualmente"},
        {word: "Pomelo", definition: "Fruta que debe evitarse porque interacciona con los medicamentos inmunosupresores"},
        {word: "Profilaxis", definition: "Tratamiento preventivo para evitar infecciones en pacientes inmunodeprimidos"},
        {word: "Pancreas", definition: "Órgano que puede trasplantarse, frecuentemente junto con el riñón en diabéticos"}
    ],
    R: [
        {word: "Rechazo", definition: "Reacción del sistema inmune contra el órgano trasplantado que debe prevenirse"},
        {word: "Renal", definition: "Relativo al riñón, el órgano más frecuentemente trasplantado"},
        {word: "Rapamune", definition: "Nombre comercial del sirolimus, inmunosupresor inhibidor de mTOR"},
        {word: "Revisión", definition: "Control médico periódico necesario durante toda la vida del paciente trasplantado"}
    ],
    S: [
        {word: "Sirolimus", definition: "Inmunosupresor inhibidor de mTOR, alternativa cuando hay toxicidad renal"},
        {word: "Sandimmun", definition: "Nombre comercial de la ciclosporina, primer inmunosupresor utilizado en trasplantes"},
        {word: "Sol", definition: "Radiación a la que la piel es más sensible, requiriendo protección solar alta"},
        {word: "Seguimiento", definition: "Control médico continuo necesario después del trasplante"}
    ],
    T: [
        {word: "Tacrolimus", definition: "Inmunosupresor inhibidor de la calcineurina que debe tomarse con el estómago vacío"},
        {word: "Temblor", definition: "Efecto secundario neurológico que pueden causar algunos inmunosupresores"},
        {word: "Trasplante", definition: "Procedimiento quirúrgico de sustitución de un órgano enfermo por uno sano"},
        {word: "Triglicéridos", definition: "Tipo de grasa en sangre que puede aumentar por efecto de la medicación"}
    ],
    V: [
        {word: "Vacuna", definition: "Medida preventiva recomendada anualmente contra la gripe y otras enfermedades"},
        {word: "Valganciclovir", definition: "Antiviral usado para prevenir y tratar infección por citomegalovirus"},
        {word: "Viral", definition: "Tipo de infección causada por virus, frecuente en pacientes inmunodeprimidos"}
    ],
    Z: [
        {word: "Zumo", definition: "Bebida de frutas que debe evitarse si es de pomelo por interacciones farmacológicas"},
        {word: "Zoster", definition: "Infección viral causada por reactivación del virus varicela que puede prevenirse con vacunación"}
    ]
};

// Variables de estado del juego
let words = [];
let currentIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let pasapalabraCount = 0;
let correctPoints = 0;
let incorrectPoints = 0;
let pasapalabraPoints = 0;
let timeBonus = 0;
let difficultyBonus = 0;
let totalPoints = 0;
let remainingWords = [];
let answeredWords = [];
let userAnswers = {};
let timerInterval;
let timeLeft = 300;
let hintsUsed = 0;
let maxHints = 3;
let pasapalabraUsed = [];
let gameStarted = false;
let playerName = '';
let soundEnabled = true;

// Contexto de audio para sonidos
let audioContext = null;

// =============================================
// FUNCIONES DE NORMALIZACIÓN DE TEXTO
// =============================================

/**
 * Normaliza un texto eliminando acentos y convirtiendo a minúsculas
 * Esto permite comparar respuestas ignorando diferencias de acentuación
 */
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Elimina marcas diacríticas (acentos)
        .replace(/ñ/g, 'n') // Opcionalmente mantener ñ como n (descomenta si lo deseas)
        .trim();
}

/**
 * Compara dos textos de forma normalizada (ignorando acentos y mayúsculas)
 */
function compareAnswers(userAnswer, correctAnswer) {
    const normalizedUser = normalizeText(userAnswer);
    const normalizedCorrect = normalizeText(correctAnswer);
    return normalizedUser === normalizedCorrect;
}

// =============================================
// FUNCIONES DE AUDIO
// =============================================

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playCorrectSound() {
    if (!soundEnabled) return;
    try {
        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
    } catch (e) {
        console.log('Audio no disponible');
    }
}

function playIncorrectSound() {
    if (!soundEnabled) return;
    try {
        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.log('Audio no disponible');
    }
}

function playPassSound() {
    if (!soundEnabled) return;
    try {
        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.setValueAtTime(300, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
        console.log('Audio no disponible');
    }
}

function playGameEndSound(won) {
    if (!soundEnabled) return;
    try {
        const ctx = initAudioContext();

        if (won) {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
                gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
                osc.start(ctx.currentTime + i * 0.15);
                osc.stop(ctx.currentTime + i * 0.15 + 0.3);
            });
        } else {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        }
    } catch (e) {
        console.log('Audio no disponible');
    }
}

// =============================================
// FUNCIONES DE FEEDBACK VISUAL
// =============================================

function showFeedback(type) {
    // Feedback visual deshabilitado
}

function updateProgress() {
    const answered = words.length - remainingWords.length;
    const total = words.length;
    const percentage = (answered / total) * 100;

    document.getElementById('progressCount').textContent = answered;
    document.getElementById('progressTotal').textContent = total;
    document.getElementById('progressFill').style.width = `${percentage}%`;
}

// =============================================
// FUNCIONES DE SELECCIÓN DE PALABRAS
// =============================================

function selectRandomWords() {
    words = [];
    for (let letter in allWords) {
        const randomIndex = Math.floor(Math.random() * allWords[letter].length);
        words.push({letter: letter, ...allWords[letter][randomIndex]});
    }
}

// =============================================
// FUNCIONES DE DIFICULTAD Y INICIO
// =============================================

function selectDifficulty(difficulty) {
    currentDifficulty = difficulty;

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('selected');
}

function startGame() {
    playerName = document.getElementById('playerName').value.trim();
    soundEnabled = document.getElementById('soundEnabled').checked;

    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';

    const playerDisplay = document.getElementById('playerDisplay');
    if (playerName) {
        playerDisplay.textContent = playerName;
    } else {
        playerDisplay.textContent = '';
    }

    const badge = document.getElementById('difficultyBadge');
    const diffSettings = difficultySettings[currentDifficulty];
    badge.textContent = diffSettings.name;
    badge.className = 'difficulty-badge ' + currentDifficulty;

    initGame();
}

function showStartScreen() {
    clearInterval(timerInterval);
    gameStarted = false;
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
}

// =============================================
// FUNCIONES PRINCIPALES DEL JUEGO
// =============================================

function initGame() {
    const difficulty = difficultySettings[currentDifficulty];
    timeLeft = difficulty.time;
    maxHints = difficulty.hints;

    selectRandomWords();
    currentIndex = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    pasapalabraCount = 0;
    hintsUsed = 0;
    correctPoints = 0;
    incorrectPoints = 0;
    pasapalabraPoints = 0;
    timeBonus = 0;
    difficultyBonus = 0;
    totalPoints = 0;
    remainingWords = [...words];
    answeredWords = new Array(words.length).fill(null);
    userAnswers = {};
    pasapalabraUsed = [];
    gameStarted = true;

    remainingWords.sort((a, b) => a.letter.localeCompare(b.letter));

    const rosco = document.getElementById('rosco');
    rosco.innerHTML = '';

    const roscoContainer = document.querySelector('.rosco-container');
    const containerWidth = roscoContainer.offsetWidth;
    const containerHeight = roscoContainer.offsetHeight;
    const radius = Math.min(containerWidth, containerHeight) * 0.44;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    words.forEach((word, index) => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter';
        letterDiv.textContent = word.letter;
        const angle = (index / words.length) * 2 * Math.PI - Math.PI / 2;

        const x = Math.cos(angle) * radius + centerX;
        const y = Math.sin(angle) * radius + centerY;

        letterDiv.style.left = `${x}px`;
        letterDiv.style.top = `${y}px`;
        letterDiv.style.transform = 'translate(-50%, -50%)';
        rosco.appendChild(letterDiv);
    });

    document.getElementById('pointsCount').textContent = totalPoints;
    document.getElementById('answer').disabled = false;
    document.querySelector('button[onclick="checkAnswer()"]').disabled = false;
    document.querySelector('button[onclick="pasapalabra()"]').disabled = false;
    document.getElementById('finalScore').textContent = '';
    document.getElementById('viewResults').style.display = 'none';
    document.getElementById('results').style.display = 'none';

    document.getElementById('answer').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });

    addHintButton();
    updateProgress();
    updateGame();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft <= 60) {
        document.getElementById('timer').style.color = '#e74c3c';
        document.getElementById('timer').classList.add('animate-pulse');
    } else {
        document.getElementById('timer').style.color = '';
        document.getElementById('timer').classList.remove('animate-pulse');
    }
}

function updateGame() {
    const letters = document.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
        letter.classList.remove('current');
        if (words[index] === remainingWords[currentIndex]) {
            letter.classList.add('current');
        }
    });

    if (remainingWords.length > 0) {
        const currentWord = remainingWords[currentIndex];
        document.getElementById('definition').textContent = currentWord.definition;
        document.getElementById('currentLetterDisplay').textContent = currentWord.letter;
    } else {
        document.getElementById('definition').textContent = "¡Has completado todas las palabras!";
        document.getElementById('currentLetterDisplay').textContent = "";
    }

    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();

    document.getElementById('correctCount').textContent = correctAnswers;
    document.getElementById('incorrectCount').textContent = incorrectAnswers;
    document.getElementById('pointsCount').textContent = totalPoints;
}

function checkAnswer() {
    if (remainingWords.length === 0) {
        endGame();
        return;
    }

    const currentHint = document.getElementById('current-hint');
    if (currentHint) {
        currentHint.remove();
    }

    const userAnswer = document.getElementById('answer').value.trim();
    const correctAnswer = remainingWords[currentIndex].word;
    const currentLetter = remainingWords[currentIndex].letter;
    const letterIndex = words.findIndex(word => word.letter === currentLetter);
    const letters = document.querySelectorAll('.letter');

    userAnswers[currentLetter] = userAnswer;

    // Usar comparación normalizada (ignora acentos y mayúsculas)
    if (compareAnswers(userAnswer, correctAnswer)) {
        playCorrectSound();
        showFeedback('correct');

        letters[letterIndex].classList.remove('current');
        letters[letterIndex].classList.add('correct', 'animate-correct');
        correctAnswers++;
        answeredWords[letterIndex] = true;

        correctPoints += 3;
        totalPoints += 3;
    } else {
        playIncorrectSound();
        showFeedback('incorrect');

        letters[letterIndex].classList.remove('current');
        letters[letterIndex].classList.add('incorrect', 'animate-incorrect');
        incorrectAnswers++;
        answeredWords[letterIndex] = false;

        incorrectPoints -= 2;
        totalPoints -= 2;
    }

    remainingWords.splice(currentIndex, 1);
    updateProgress();

    if (remainingWords.length === 0) {
        endGame();
    } else {
        if (currentIndex >= remainingWords.length) {
            currentIndex = 0;
        }
        updateGame();
    }
}

function pasapalabra() {
    if (remainingWords.length > 1) {
        playPassSound();

        const currentHint = document.getElementById('current-hint');
        if (currentHint) {
            currentHint.remove();
        }

        const currentLetter = remainingWords[currentIndex].letter;
        if (!pasapalabraUsed.includes(currentLetter)) {
            pasapalabraUsed.push(currentLetter);
            pasapalabraCount++;

            pasapalabraPoints -= 1;
            totalPoints -= 1;
        }

        currentIndex = (currentIndex + 1) % remainingWords.length;
        updateGame();
    } else if (remainingWords.length === 1) {
        alert("Solo queda una palabra. Debes responderla.");
    } else {
        endGame();
    }
}

function showHint() {
    if (hintsUsed < maxHints && remainingWords.length > 0) {
        const currentWord = remainingWords[currentIndex].word;
        const firstLetter = currentWord.charAt(0);
        const hint = `La palabra comienza con "${firstLetter}" y tiene ${currentWord.length} letras`;

        const existingHint = document.getElementById('current-hint');
        if (existingHint) {
            existingHint.remove();
        }

        const hintElement = document.createElement('div');
        hintElement.id = 'current-hint';
        hintElement.textContent = hint;
        hintElement.style.position = 'absolute';
        hintElement.style.top = '50%';
        hintElement.style.left = '50%';
        hintElement.style.transform = 'translate(-50%, -50%)';
        hintElement.style.backgroundColor = 'rgba(52, 152, 219, 0.9)';
        hintElement.style.color = 'white';
        hintElement.style.padding = '15px 25px';
        hintElement.style.borderRadius = '10px';
        hintElement.style.fontSize = '18px';
        hintElement.style.fontWeight = 'bold';
        hintElement.style.zIndex = '1000';
        hintElement.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        hintElement.style.animation = 'fadeIn 0.3s ease-out';

        document.querySelector('.rosco-container').appendChild(hintElement);

        hintsUsed++;

        const hintsLeftElement = document.querySelector('.hints-left');
        if (hintsLeftElement) {
            hintsLeftElement.textContent = maxHints - hintsUsed;
        }
    } else if (hintsUsed >= maxHints) {
        alert("Has agotado todas tus pistas disponibles.");
    }
}

function calculateTimeBonus() {
    if (correctAnswers >= 10) {
        const usedTime = difficultySettings[currentDifficulty].time - timeLeft;

        if (usedTime <= 60) {
            return 30;
        } else if (usedTime <= 120) {
            return 20;
        } else if (usedTime <= 180) {
            return 10;
        }
    }
    return 0;
}

function endGame() {
    clearInterval(timerInterval);

    const letters = document.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
        if (answeredWords[index] === null) {
            letter.classList.remove('current');
            letter.classList.add('incorrect');
            incorrectAnswers++;
            incorrectPoints -= 2;
            totalPoints -= 2;
            userAnswers[words[index].letter] = "";
        }
    });

    timeBonus = calculateTimeBonus();
    totalPoints += timeBonus;

    // Bonificación por dificultad (solo si se termina dentro del tiempo)
    if (timeLeft > 0) {
        difficultyBonus = difficultySettings[currentDifficulty].difficultyBonus;
        totalPoints += difficultyBonus;
    } else {
        difficultyBonus = 0;
    }

    const won = correctAnswers > incorrectAnswers;
    playGameEndSound(won);

    const finalScore = document.getElementById('finalScore');
    const usedTime = difficultySettings[currentDifficulty].time - timeLeft;

    finalScore.innerHTML = `
        <h3>¡Juego terminado!</h3>
        <p>Tu puntuación final:</p>
        <p><span class="score-value correct-score">${correctAnswers}</span> correctas |
        <span class="score-value incorrect-score">${incorrectAnswers}</span> incorrectas |
        <span class="score-value">${pasapalabraCount}</span> pasapalabras</p>
        <p>Tiempo utilizado: ${formatTime(usedTime)}</p>

        <div class="points-breakdown">
            <h3>Desglose de puntuación</h3>
            <p>· Puntos obtenidos por aciertos: <strong>+${correctPoints}</strong></p>
            <p>· Puntos restados por fallos: <strong>${incorrectPoints}</strong></p>
            <p>· Puntos restados por pasapalabras: <strong>${pasapalabraPoints}</strong></p>
            <p>· Bonificación por tiempo: <strong>+${timeBonus}</strong></p>
            <p>· Bonificación por dificultad (${difficultySettings[currentDifficulty].name}): <strong>+${difficultyBonus}</strong></p>
            <div class="total-points">PUNTUACIÓN TOTAL: ${totalPoints}</div>
        </div>
        <div id="saveScoreSection" class="save-score-section"></div>
    `;

    document.getElementById('answer').disabled = true;
    document.querySelector('button[onclick="checkAnswer()"]').disabled = true;
    document.querySelector('button[onclick="pasapalabra()"]').disabled = true;
    document.getElementById('viewResults').style.display = 'inline-block';

    if (correctAnswers > incorrectAnswers) {
        showConfetti();
    }

    // Guardar resultado si hay jugador conectado, o mostrar opción
    handleSaveScore(usedTime);
}

// Manejar el guardado de puntuación
async function handleSaveScore(usedTime) {
    const saveSection = document.getElementById('saveScoreSection');
    if (!saveSection) return;

    if (currentPlayer) {
        // Jugador conectado: guardar automáticamente
        saveSection.innerHTML = '<p class="saving-score">Guardando puntuación...</p>';

        const result = await saveGameResult(
            totalPoints,
            correctAnswers,
            incorrectAnswers,
            pasapalabraCount,
            currentDifficulty,
            usedTime
        );

        if (result.success) {
            saveSection.innerHTML = `
                <div class="score-saved">
                    <span class="save-icon">✓</span>
                    <p>¡Puntuación guardada!</p>
                    <p class="player-total">Total acumulado: <strong>${result.player.total_points} puntos</strong></p>
                </div>
            `;
        } else {
            saveSection.innerHTML = `
                <div class="score-error">
                    <p>Error al guardar: ${result.error}</p>
                </div>
            `;
        }
    } else {
        // No hay jugador: ofrecer guardar
        saveSection.innerHTML = `
            <div class="save-prompt">
                <p>¿Quieres guardar tu puntuación en el ranking?</p>
                <button class="primary save-score-btn" onclick="showAuthModal('register')">Guardar récord</button>
            </div>
        `;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function showConfetti() {
    // Placeholder para efecto de confeti
}

function newRosco() {
    showStartScreen();
}

// =============================================
// FUNCIONES DE RESULTADOS
// =============================================

function showResults() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Resultados del FarmaPalabra: Trasplante</h2>';
    resultsDiv.style.display = 'block';

    const correctWords = [];
    const incorrectWords = [];

    words.forEach(word => {
        const userAnswer = userAnswers[word.letter] || "No contestada";
        // Usar comparación normalizada
        const isCorrect = compareAnswers(userAnswer, word.word);

        if (isCorrect) {
            correctWords.push(word);
        } else {
            incorrectWords.push(word);
        }
    });

    const summaryDiv = document.createElement('div');
    summaryDiv.innerHTML = `
        <div style="background-color: rgba(44, 62, 80, 0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <h3>Resumen de resultados</h3>
            <p><strong>Aciertos:</strong> ${correctAnswers} de ${words.length} (${Math.round(correctAnswers/words.length*100)}%)</p>
            <p><strong>Pasapalabras utilizados:</strong> ${pasapalabraCount}</p>
            <p><strong>Tiempo utilizado:</strong> ${formatTime(difficultySettings[currentDifficulty].time - timeLeft)}</p>

            <div class="points-breakdown">
                <h3>Desglose de puntuación</h3>
                <p>· Puntos obtenidos por aciertos: <strong>+${correctPoints}</strong></p>
                <p>· Puntos restados por fallos: <strong>${incorrectPoints}</strong></p>
                <p>· Puntos restados por pasapalabras: <strong>${pasapalabraPoints}</strong></p>
                <p>· Bonificación por tiempo: <strong>+${timeBonus}</strong></p>
                <p>· Bonificación por dificultad (${difficultySettings[currentDifficulty].name}): <strong>+${difficultyBonus}</strong></p>
                <div class="total-points">PUNTUACIÓN TOTAL: ${totalPoints}</div>
            </div>
        </div>
    `;
    resultsDiv.appendChild(summaryDiv);

    if (correctWords.length > 0) {
        const correctTitle = document.createElement('h3');
        correctTitle.textContent = 'Respuestas correctas';
        correctTitle.style.color = 'var(--correct-color)';
        resultsDiv.appendChild(correctTitle);

        correctWords.forEach(word => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item result-correct';

            let resultHTML = `<strong>${word.letter}: ${word.definition}</strong><br>`;
            resultHTML += `Tu respuesta: ${word.word}`;

            resultItem.innerHTML = resultHTML;
            resultsDiv.appendChild(resultItem);
        });
    }

    if (incorrectWords.length > 0) {
        const incorrectTitle = document.createElement('h3');
        incorrectTitle.textContent = 'Respuestas incorrectas';
        incorrectTitle.style.color = 'var(--incorrect-color)';
        incorrectTitle.style.marginTop = '20px';
        resultsDiv.appendChild(incorrectTitle);

        incorrectWords.forEach(word => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item result-incorrect';

            const userAnswer = userAnswers[word.letter] || "No contestada";

            let resultHTML = `<strong>${word.letter}: ${word.definition}</strong><br>`;
            resultHTML += `Tu respuesta: ${userAnswer}<br>`;
            resultHTML += `Respuesta correcta: <strong>${word.word}</strong>`;

            resultItem.innerHTML = resultHTML;
            resultsDiv.appendChild(resultItem);
        });
    }

    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.textAlign = 'center';
    buttonsDiv.style.marginTop = '30px';

    const pdfButton = document.createElement('button');
    pdfButton.textContent = 'Descargar PDF';
    pdfButton.onclick = generatePDF;
    pdfButton.className = 'primary';

    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'Nuevo juego';
    newGameButton.onclick = newRosco;
    newGameButton.className = 'success';
    newGameButton.style.marginLeft = '15px';

    buttonsDiv.appendChild(pdfButton);
    buttonsDiv.appendChild(newGameButton);
    resultsDiv.appendChild(buttonsDiv);
}

// =============================================
// GENERACIÓN DE PDF
// =============================================

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Colores del tema profesional
    const colors = {
        navyBlue: [0, 51, 102],      // Azul marino oscuro para títulos
        dark: [40, 40, 40],
        medium: [100, 100, 100],
        light: [150, 150, 150],
        background: [248, 248, 248],
        success: [39, 174, 96],
        error: [192, 57, 43],
        barGreen: [46, 204, 113],
        barRed: [231, 76, 60],
        barYellow: [241, 196, 15],
        barBlue: [52, 152, 219],
        barPurple: [155, 89, 182]
    };

    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // === CABECERA ===
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(...colors.navyBlue);
    pdf.text("FarmaPalabra: Trasplante", 15, 15);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.navyBlue);
    pdf.text("Servicio de Farmacia · Hospital U.P. La Fe", 15, 22);

    pdf.setDrawColor(...colors.navyBlue);
    pdf.setLineWidth(0.5);
    pdf.line(15, 26, 195, 26);

    // === INFORMACIÓN DEL JUGADOR Y PARTIDA ===
    let yPos = 34;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.medium);

    // Nombre del paciente (si existe)
    if (playerName && playerName.trim() !== '') {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...colors.dark);
        pdf.text(`Paciente: ${playerName}`, 15, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...colors.medium);
        pdf.text(`Dificultad: ${difficultySettings[currentDifficulty].name}`, 100, yPos);
    } else {
        pdf.text(`Dificultad: ${difficultySettings[currentDifficulty].name}`, 15, yPos);
    }

    pdf.text(fechaFormateada, 195, yPos, { align: "right" });

    // === PUNTUACIÓN PRINCIPAL (más compacta) ===
    yPos += 10;

    pdf.setFillColor(...colors.background);
    pdf.roundedRect(15, yPos, 180, 22, 2, 2, 'F');

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(...colors.navyBlue);
    pdf.text(`${totalPoints}`, 105, yPos + 15, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.medium);
    pdf.text("puntos", 130, yPos + 15);

    // Tiempo utilizado
    pdf.setFontSize(8);
    pdf.text(`Tiempo: ${formatTime(difficultySettings[currentDifficulty].time - timeLeft)} / ${formatTime(difficultySettings[currentDifficulty].time)}`, 195, yPos + 15, { align: "right" });

    // === ESTADÍSTICAS EN LÍNEA ===
    yPos += 28;

    const statsWidth = 180 / 4;
    const stats = [
        { label: "Aciertos", value: correctAnswers, color: colors.success },
        { label: "Errores", value: incorrectAnswers, color: colors.error },
        { label: "Pasapalabra", value: pasapalabraCount, color: colors.medium },
        { label: "Total", value: words.length, color: colors.dark }
    ];

    stats.forEach((stat, i) => {
        const x = 15 + (i * statsWidth) + (statsWidth / 2);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(...stat.color);
        pdf.text(`${stat.value}`, x, yPos, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor(...colors.light);
        pdf.text(stat.label, x, yPos + 5, { align: "center" });
    });

    // === DESGLOSE DE PUNTUACIÓN CON GRÁFICO DE BARRAS ===
    yPos += 12;

    pdf.setDrawColor(...colors.light);
    pdf.setLineWidth(0.2);
    pdf.line(15, yPos, 195, yPos);

    yPos += 8;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.navyBlue);
    pdf.text("Desglose de puntuación", 15, yPos);

    yPos += 8;

    const breakdown = [
        { label: "Aciertos", value: `+${correctPoints}`, points: correctPoints, color: colors.barGreen },
        { label: "Errores", value: `${incorrectPoints}`, points: incorrectPoints, color: colors.barRed },
        { label: "Pasapalabra", value: `${pasapalabraPoints}`, points: pasapalabraPoints, color: colors.barYellow },
        { label: "Bonif. tiempo", value: `+${timeBonus}`, points: timeBonus, color: colors.barBlue },
        { label: "Bonif. dificultad", value: `+${difficultyBonus}`, points: difficultyBonus, color: colors.barPurple }
    ];

    // Calcular escala para las barras
    const maxPoints = Math.max(...breakdown.map(b => Math.abs(b.points)), 1);
    const barMaxWidth = 70;
    const barHeight = 6;
    const barStartX = 105;

    pdf.setFontSize(8);
    breakdown.forEach((item, i) => {
        // Etiqueta
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...colors.medium);
        pdf.text(item.label, 20, yPos + 4);

        // Valor
        pdf.setFont("helvetica", "bold");
        if (item.points > 0) {
            pdf.setTextColor(...colors.success);
        } else if (item.points < 0) {
            pdf.setTextColor(...colors.error);
        } else {
            pdf.setTextColor(...colors.light);
        }
        pdf.text(item.value, 60, yPos + 4, { align: "right" });

        // Barra
        const barWidth = (Math.abs(item.points) / maxPoints) * barMaxWidth;
        if (barWidth > 0) {
            pdf.setFillColor(...item.color);
            pdf.roundedRect(barStartX, yPos, barWidth, barHeight, 1, 1, 'F');
        }

        yPos += 9;
    });

    // Línea de total
    pdf.setDrawColor(...colors.light);
    pdf.line(20, yPos, 100, yPos);

    yPos += 5;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.navyBlue);
    pdf.text("TOTAL", 20, yPos);
    pdf.text(`${totalPoints}`, 60, yPos, { align: "right" });

    // === RESULTADOS DETALLADOS ===
    yPos += 10;

    pdf.setDrawColor(...colors.light);
    pdf.setLineWidth(0.2);
    pdf.line(15, yPos, 195, yPos);

    yPos += 8;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.navyBlue);
    pdf.text("Resultados por letra", 15, yPos);

    yPos += 7;

    // Clasificar palabras
    const correctWords = [];
    const incorrectWords = [];

    words.forEach(word => {
        const userAnswer = userAnswers[word.letter] || "Sin respuesta";
        const isCorrect = compareAnswers(userAnswer, word.word);

        if (isCorrect) {
            correctWords.push({...word, userAnswer});
        } else {
            incorrectWords.push({...word, userAnswer});
        }
    });

    // Función para añadir nueva página si es necesario
    function checkNewPage(requiredSpace) {
        if (yPos > 275 - requiredSpace) {
            pdf.addPage();
            yPos = 20;
            return true;
        }
        return false;
    }

    // Función para dibujar cabecera de página de continuación
    function drawContinuationHeader() {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(...colors.light);
        pdf.text("FarmaPalabra: Trasplante — Resultados (continuación)", 15, 12);
        pdf.setDrawColor(...colors.light);
        pdf.setLineWidth(0.2);
        pdf.line(15, 14, 195, 14);
    }

    // Aciertos
    if (correctWords.length > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...colors.success);
        pdf.text(`Correctas (${correctWords.length})`, 15, yPos);
        yPos += 6;

        correctWords.forEach(word => {
            if (checkNewPage(12)) {
                drawContinuationHeader();
            }

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(8);
            pdf.setTextColor(...colors.dark);
            pdf.text(`${word.letter}.`, 20, yPos);
            pdf.text(word.word, 28, yPos);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(7);
            pdf.setTextColor(...colors.medium);
            const defLines = pdf.splitTextToSize(word.definition, 160);
            pdf.text(defLines[0], 28, yPos + 4);

            yPos += 10;
        });
    }

    // Errores
    if (incorrectWords.length > 0) {
        yPos += 3;

        if (checkNewPage(15)) {
            drawContinuationHeader();
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...colors.error);
        pdf.text(`Incorrectas (${incorrectWords.length})`, 15, yPos);
        yPos += 6;

        incorrectWords.forEach(word => {
            if (checkNewPage(15)) {
                drawContinuationHeader();
            }

            const userAnswer = userAnswers[word.letter] || "Sin respuesta";

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(8);
            pdf.setTextColor(...colors.dark);
            pdf.text(`${word.letter}.`, 20, yPos);
            pdf.text(word.word, 28, yPos);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(7);
            pdf.setTextColor(...colors.medium);
            const defLines = pdf.splitTextToSize(word.definition, 160);
            pdf.text(defLines[0], 28, yPos + 4);

            pdf.setTextColor(...colors.error);
            pdf.text(`Respuesta: ${userAnswer}`, 28, yPos + 8);

            yPos += 14;
        });
    }

    // === PIE DE PÁGINA EN TODAS LAS PÁGINAS ===
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        pdf.setDrawColor(...colors.light);
        pdf.setLineWidth(0.2);
        pdf.line(15, 285, 195, 285);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6);
        pdf.setTextColor(...colors.light);
        pdf.text("Hospital Universitario y Politécnico La Fe · Servicio de Farmacia", 15, 290);
        pdf.text(`${i}/${totalPages}`, 195, 290, { align: "right" });
    }

    pdf.save('Resultados_FarmaPalabra.pdf');
}

// =============================================
// FUNCIONES AUXILIARES
// =============================================

function addHintButton() {
    const btnContainer = document.querySelector('#gameScreen .btn-container');

    const existingButton = document.getElementById('hintButton');
    if (existingButton) {
        existingButton.remove();
    }

    if (maxHints > 0) {
        const hintButton = document.createElement('button');
        hintButton.id = 'hintButton';
        hintButton.className = 'danger';
        hintButton.innerHTML = `Pista <span class="hints-left">${maxHints}</span>`;
        hintButton.onclick = showHint;

        btnContainer.appendChild(hintButton);
    }
}

function recalculateRoscoPositions() {
    const letters = document.querySelectorAll('.letter');
    if (letters.length === 0) return;

    const roscoContainer = document.querySelector('.rosco-container');
    if (!roscoContainer) return;

    const containerWidth = roscoContainer.offsetWidth;
    const containerHeight = roscoContainer.offsetHeight;
    const radius = Math.min(containerWidth, containerHeight) * 0.44;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    letters.forEach((letter, index) => {
        const angle = (index / letters.length) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * radius + centerX;
        const y = Math.sin(angle) * radius + centerY;
        letter.style.left = `${x}px`;
        letter.style.top = `${y}px`;
        letter.style.transform = 'translate(-50%, -50%)';
    });
}

// =============================================
// INICIALIZACIÓN
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('load', recalculateRoscoPositions);

    const container = document.querySelector('.game-container');
    const themeToggle = document.createElement('button');
    themeToggle.textContent = '🌙';
    themeToggle.id = 'themeToggle';
    themeToggle.style.position = 'absolute';
    themeToggle.style.top = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.fontSize = '18px';
    themeToggle.style.width = '40px';
    themeToggle.style.height = '40px';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.border = 'none';
    themeToggle.style.background = 'rgba(52, 152, 219, 0.2)';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.zIndex = '100';

    let darkMode = false;

    themeToggle.addEventListener('click', function() {
        if (darkMode) {
            document.documentElement.style.setProperty('--primary-color', '#2c3e50');
            document.documentElement.style.setProperty('--accent-color', '#3498db');
            document.documentElement.style.setProperty('--bg-color', '#ecf0f1');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#333333');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.style.setProperty('--primary-color', '#ecf0f1');
            document.documentElement.style.setProperty('--accent-color', '#3498db');
            document.documentElement.style.setProperty('--bg-color', '#2c3e50');
            document.documentElement.style.setProperty('--card-bg', '#34495e');
            document.documentElement.style.setProperty('--text-color', '#ecf0f1');
            themeToggle.textContent = '☀️';
        }
        darkMode = !darkMode;
    });

    container.appendChild(themeToggle);
});

window.addEventListener('resize', recalculateRoscoPositions);

// Registrar Service Worker para PWA (solo funciona con HTTP/HTTPS, no con file://)
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado correctamente:', registration.scope);
            })
            .catch(function(error) {
                console.log('Error al registrar ServiceWorker:', error);
            });
    });
}

// =============================================
// MODAL DE INFORMACIÓN
// =============================================

function openInfoModal() {
    const modal = document.getElementById('infoModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeInfoModal() {
    const modal = document.getElementById('infoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer clic fuera del contenido
document.addEventListener('click', function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target === modal) {
        closeInfoModal();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('infoModal');
        if (modal && modal.style.display === 'flex') {
            closeInfoModal();
        }
    }
});
