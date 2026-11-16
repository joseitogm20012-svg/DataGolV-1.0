// Base de datos de ratings de equipos destacados (Ataque, Defensa de 1 a 100)
const TEAM_RATINGS = {
    'Real Madrid': { ataque: 91, defensa: 87, liga: 'LaLiga EA Sports' },
    'FC Barcelona': { ataque: 90, defensa: 85, liga: 'LaLiga EA Sports' },
    'Atlético de Madrid': { ataque: 84, defensa: 86, liga: 'LaLiga EA Sports' },
    'Manchester City': { ataque: 93, defensa: 88, liga: 'Premier League' },
    'Arsenal': { ataque: 88, defensa: 89, liga: 'Premier League' },
    'Liverpool': { ataque: 90, defensa: 86, liga: 'Premier League' },
    'Bayern Múnich': { ataque: 92, defensa: 84, liga: 'Bundesliga' },
    'Bayer Leverkusen': { ataque: 87, defensa: 85, liga: 'Bundesliga' },
    'PSG': { ataque: 89, defensa: 83, liga: 'Ligue 1' },
    'Inter de Milán': { ataque: 86, defensa: 88, liga: 'Serie A' },
    'Juventus': { ataque: 83, defensa: 85, liga: 'Serie A' },
    'Boca Juniors': { ataque: 78, defensa: 79, liga: 'Liga Argentina' },
    'River Plate': { ataque: 80, defensa: 79, liga: 'Liga Argentina' },
    'Flamengo': { ataque: 82, defensa: 78, liga: 'Brasileirao' },
    'Palmeiras': { ataque: 81, defensa: 80, liga: 'Brasileirao' }
};

// Generador de rating para cualquier equipo personalizado
function getTeamStats(teamName) {
    // Normalizar nombre
    const normalized = Object.keys(TEAM_RATINGS).find(
        t => t.toLowerCase() === teamName.trim().toLowerCase()
    );

    if (normalized) {
        return TEAM_RATINGS[normalized];
    }

    // Si es un equipo no registrado, generamos métricas basadas en un hash determinista
    let hash = 0;
    for (let i = 0; i < teamName.length; i++) {
        hash = (hash * 31 + teamName.charCodeAt(i)) % 1000;
    }
    const baseAtaque = 70 + (Math.abs(hash) % 20); // 70 a 89
    const baseDefensa = 70 + ((Math.abs(hash * 3)) % 20);

    return { ataque: baseAtaque, defensa: baseDefensa, liga: 'Liga Profesional' };
}

/**
 * Simula y predice el resultado entre equipoLocal y equipoVisitante
 */
function predictMatch(equipoLocal, equipoVisitante, liga = 'UEFA Champions League') {
    const statsLocal = getTeamStats(equipoLocal);
    const statsVisitante = getTeamStats(equipoVisitante);

    // Ventaja de jugar en casa (+6% al poder del local)
    const factorLocalia = 1.06;

    const poderLocal = (statsLocal.ataque * 1.1 + statsLocal.defensa * 0.9) * factorLocalia;
    const poderVisitante = statsVisitante.ataque * 1.1 + statsVisitante.defensa * 0.9;

    const diferenciaPoder = poderLocal - poderVisitante;

    // Cálculo de probabilidades base (deben sumar 100)
    let probLocal = 42 + Math.round(diferenciaPoder * 0.8);
    let probVisitante = 32 - Math.round(diferenciaPoder * 0.6);
    let probEmpate = 100 - (probLocal + probVisitante);

    // Ajustes de límites lógicos
    if (probLocal > 78) probLocal = 78;
    if (probLocal < 18) probLocal = 18;
    if (probVisitante > 70) probVisitante = 70;
    if (probVisitante < 12) probVisitante = 12;

    probEmpate = 100 - probLocal - probVisitante;
    if (probEmpate < 12) {
        probEmpate = 15;
        probLocal -= 2;
        probVisitante -= 1;
    }

    // Estimación de goles esperados
    let golesLocal = 1;
    let golesVisitante = 1;

    if (diferenciaPoder > 18) {
        golesLocal = 3;
        golesVisitante = 0;
    } else if (diferenciaPoder > 8) {
        golesLocal = 2;
        golesVisitante = 1;
    } else if (diferenciaPoder < -15) {
        golesLocal = 0;
        golesVisitante = 2;
    } else if (diferenciaPoder < -5) {
        golesLocal = 1;
        golesVisitante = 2;
    } else {
        // Partido parejo
        if (probLocal > probVisitante + 6) {
            golesLocal = 2;
            golesVisitante = 1;
        } else {
            golesLocal = 1;
            golesVisitante = 1;
        }
    }

    // Pronóstico recomendado
    let pronosticoRecomendado = 'Empate';
    if (golesLocal > golesVisitante) {
        pronosticoRecomendado = 'Gana Local';
    } else if (golesVisitante > golesLocal) {
        pronosticoRecomendado = 'Gana Visitante';
    }

    // Factor clave
    let factorClave = 'Equilibrio táctico y paridad en el mediocampo.';
    if (diferenciaPoder > 10) {
        factorClave = `Supremacía ofensiva de ${equipoLocal} reforzada por la ventaja de local.`;
    } else if (diferenciaPoder < -8) {
        factorClave = `Solidez defensiva y efectividad en contragolpe de ${equipoVisitante}.`;
    }

    // Análisis redactado
    const analisis = `El modelo predictivo proyecta un ${probLocal}% para ${equipoLocal}, ${probEmpate}% de empate y ${probVisitante}% para ${equipoVisitante}. El marcador más probable es ${golesLocal} - ${golesVisitante}. Clave del partido: ${factorClave}`;

    return {
        golesLocalPredicho: golesLocal,
        golesVisitantePredicho: golesVisitante,
        probabilidadLocal: probLocal,
        probabilidadEmpate: probEmpate,
        probabilidadVisitante: probVisitante,
        pronosticoRecomendado,
        factorClave,
        analisis,
        statsLocal,
        statsVisitante
    };
}

module.exports = {
    TEAM_RATINGS,
    predictMatch,
    getTeamStats
};
