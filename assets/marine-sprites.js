// Sprites marinos en formato SVG para el juego
const marineSprites = {
    // Submarino del jugador (azul/verde agua)
    playerSubmarine: `
        <svg width="40" height="30" viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg">
            <!-- Cuerpo principal del submarino -->
            <ellipse cx="20" cy="15" rx="18" ry="8" fill="#2E86AB" stroke="#1E5A7D" stroke-width="1"/>
            <!-- Cabina -->
            <ellipse cx="22" cy="12" rx="8" ry="6" fill="#4ECDC4" opacity="0.8"/>
            <!-- Ventanas -->
            <circle cx="18" cy="12" r="2" fill="#A8DADC" opacity="0.9"/>
            <circle cx="24" cy="12" r="2" fill="#A8DADC" opacity="0.9"/>
            <!-- Aleta trasera -->
            <path d="M 5 15 L 2 10 L 2 20 Z" fill="#1E5A7D"/>
            <!-- Hélice -->
            <rect x="0" y="13" width="4" height="4" fill="#457B9D"/>
            <!-- Detalles -->
            <line x1="10" y1="15" x2="30" y2="15" stroke="#1E5A7D" stroke-width="0.5" opacity="0.5"/>
        </svg>
    `,
    
    // Pez enemigo nivel 1 (naranja/rojo)
    enemyFish1: `
        <svg width="35" height="25" viewBox="0 0 35 25" xmlns="http://www.w3.org/2000/svg">
            <!-- Cuerpo -->
            <ellipse cx="17" cy="12" rx="14" ry="9" fill="#FF6B6B" stroke="#C92A2A" stroke-width="1"/>
            <!-- Cola -->
            <path d="M 30 12 L 35 7 L 35 17 Z" fill="#C92A2A"/>
            <!-- Ojo -->
            <circle cx="8" cy="10" r="3" fill="white"/>
            <circle cx="8" cy="10" r="2" fill="black"/>
            <!-- Aleta dorsal -->
            <path d="M 15 3 L 20 3 L 17 8 Z" fill="#C92A2A"/>
            <!-- Aleta ventral -->
            <path d="M 15 21 L 20 21 L 17 16 Z" fill="#C92A2A"/>
            <!-- Boca -->
            <path d="M 3 11 Q 5 13 3 15" stroke="#C92A2A" stroke-width="1.5" fill="none"/>
        </svg>
    `,
    
    // Medusa enemigo nivel 2 (púrpura/rosa)
    enemyJellyfish: `
        <svg width="30" height="35" viewBox="0 0 30 35" xmlns="http://www.w3.org/2000/svg">
            <!-- Campana -->
            <ellipse cx="15" cy="12" rx="12" ry="10" fill="#CC5DE8" opacity="0.8" stroke="#9C36B5" stroke-width="1"/>
            <!-- Tentáculos -->
            <path d="M 8 20 Q 7 25 8 30" stroke="#CC5DE8" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M 12 20 Q 11 26 12 32" stroke="#CC5DE8" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M 15 20 Q 15 27 15 33" stroke="#CC5DE8" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M 18 20 Q 19 26 18 32" stroke="#CC5DE8" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M 22 20 Q 23 25 22 30" stroke="#CC5DE8" stroke-width="2" fill="none" opacity="0.7"/>
            <!-- Puntos bioluminiscentes -->
            <circle cx="10" cy="10" r="1.5" fill="#F8B8D0" opacity="0.9"/>
            <circle cx="20" cy="10" r="1.5" fill="#F8B8D0" opacity="0.9"/>
            <circle cx="15" cy="8" r="1" fill="#F8B8D0" opacity="0.9"/>
        </svg>
    `,
    
    // Tiburón enemigo nivel 3 (gris oscuro)
    enemyShark: `
        <svg width="45" height="30" viewBox="0 0 45 30" xmlns="http://www.w3.org/2000/svg">
            <!-- Cuerpo principal -->
            <ellipse cx="22" cy="15" rx="20" ry="10" fill="#495057" stroke="#212529" stroke-width="1"/>
            <!-- Aleta dorsal -->
            <path d="M 20 5 L 25 5 L 22 10 Z" fill="#212529"/>
            <!-- Cola -->
            <path d="M 40 15 L 45 8 L 45 22 Z" fill="#212529"/>
            <!-- Boca con dientes -->
            <path d="M 3 16 Q 8 18 13 16" stroke="#212529" stroke-width="1" fill="white"/>
            <path d="M 4 16 L 5 17 L 6 16 L 7 17 L 8 16 L 9 17 L 10 16 L 11 17 L 12 16" 
                  stroke="#212529" stroke-width="0.5" fill="none"/>
            <!-- Ojo -->
            <circle cx="10" cy="12" r="2" fill="black"/>
            <!-- Branquias -->
            <line x1="18" y1="12" x2="18" y2="18" stroke="#212529" stroke-width="1" opacity="0.5"/>
            <line x1="20" y1="12" x2="20" y2="18" stroke="#212529" stroke-width="1" opacity="0.5"/>
            <line x1="22" y1="12" x2="22" y2="18" stroke="#212529" stroke-width="1" opacity="0.5"/>
        </svg>
    `,
    
    // Pulpo enemigo nivel 4 (morado oscuro)
    enemyOctopus: `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <!-- Cabeza -->
            <ellipse cx="20" cy="15" rx="12" ry="10" fill="#6C5CE7" stroke="#5F3DC4" stroke-width="1"/>
            <!-- Tentáculos -->
            <path d="M 10 22 Q 8 28 10 35 Q 12 38 10 40" stroke="#6C5CE7" stroke-width="3" fill="none"/>
            <path d="M 15 23 Q 14 30 15 36 Q 16 39 14 40" stroke="#6C5CE7" stroke-width="3" fill="none"/>
            <path d="M 20 23 Q 20 31 20 37 Q 21 40 19 40" stroke="#6C5CE7" stroke-width="3" fill="none"/>
            <path d="M 25 23 Q 26 30 25 36 Q 24 39 26 40" stroke="#6C5CE7" stroke-width="3" fill="none"/>
            <path d="M 30 22 Q 32 28 30 35 Q 28 38 30 40" stroke="#6C5CE7" stroke-width="3" fill="none"/>
            <!-- Ojos -->
            <ellipse cx="15" cy="13" rx="3" ry="4" fill="white"/>
            <ellipse cx="25" cy="13" rx="3" ry="4" fill="white"/>
            <circle cx="15" cy="14" r="2" fill="black"/>
            <circle cx="25" cy="14" r="2" fill="black"/>
            <!-- Ventosas (puntos en tentáculos) -->
            <circle cx="9" cy="30" r="1" fill="#5F3DC4" opacity="0.5"/>
            <circle cx="15" cy="32" r="1" fill="#5F3DC4" opacity="0.5"/>
            <circle cx="20" cy="33" r="1" fill="#5F3DC4" opacity="0.5"/>
            <circle cx="25" cy="32" r="1" fill="#5F3DC4" opacity="0.5"/>
            <circle cx="31" cy="30" r="1" fill="#5F3DC4" opacity="0.5"/>
        </svg>
    `,
    
    // Gema/Perla
    pearl: `
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <!-- Sombra -->
            <ellipse cx="10" cy="11" rx="7" ry="6" fill="#000" opacity="0.2"/>
            <!-- Perla principal -->
            <circle cx="10" cy="10" r="7" fill="url(#pearlGradient)" stroke="#F8F9FA" stroke-width="0.5"/>
            <!-- Brillo -->
            <ellipse cx="8" cy="7" rx="3" ry="2" fill="white" opacity="0.7"/>
            <defs>
                <radialGradient id="pearlGradient">
                    <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#E9ECEF;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ADB5BD;stop-opacity:1" />
                </radialGradient>
            </defs>
        </svg>
    `,
    
    // Proyectil (burbuja torpedo)
    projectile: `
        <svg width="15" height="8" viewBox="0 0 15 8" xmlns="http://www.w3.org/2000/svg">
            <!-- Torpedo/burbuja -->
            <ellipse cx="7" cy="4" rx="6" ry="3" fill="#74C0FC" stroke="#339AF0" stroke-width="0.5" opacity="0.9"/>
            <!-- Estela -->
            <ellipse cx="12" cy="4" rx="3" ry="2" fill="#A5D8FF" opacity="0.5"/>
            <!-- Brillo -->
            <ellipse cx="5" cy="3" rx="2" ry="1" fill="white" opacity="0.8"/>
        </svg>
    `
};

// Función para convertir SVG a imagen
function svgToImage(svgString) {
    return new Promise((resolve) => {
        const img = new Image();
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        
        img.src = url;
    });
}

// Exportar para uso en el juego
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { marineSprites, svgToImage };
}