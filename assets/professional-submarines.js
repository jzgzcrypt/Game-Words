// Sprites Profesionales de Submarinos - Diseño Ultra Detallado
const ProfessionalSubmarines = {
    // Submarino Militar Moderno
    militarySubmarine: {
        name: 'Submarino de Ataque',
        createSVG: function() {
            return `
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <!-- Gradientes metálicos -->
                    <linearGradient id="hullGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#4A5568;stop-opacity:1" />
                        <stop offset="30%" style="stop-color:#718096;stop-opacity:1" />
                        <stop offset="60%" style="stop-color:#2D3748;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1A202C;stop-opacity:1" />
                    </linearGradient>
                    
                    <linearGradient id="towerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#718096;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#4A5568;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#2D3748;stop-opacity:1" />
                    </linearGradient>
                    
                    <radialGradient id="windowGlow">
                        <stop offset="0%" style="stop-color:#63B3ED;stop-opacity:0.9" />
                        <stop offset="50%" style="stop-color:#3182CE;stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:#2C5282;stop-opacity:0.3" />
                    </radialGradient>
                    
                    <!-- Sombras -->
                    <filter id="submarineShadow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                        <feOffset dx="0" dy="2" result="offsetblur"/>
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.5"/>
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Casco principal -->
                <ellipse cx="100" cy="50" rx="80" ry="25" fill="url(#hullGradient)" filter="url(#submarineShadow)"/>
                
                <!-- Detalles del casco - líneas de presión -->
                <line x1="30" y1="45" x2="170" y2="45" stroke="#1A202C" stroke-width="1" opacity="0.5"/>
                <line x1="30" y1="55" x2="170" y2="55" stroke="#1A202C" stroke-width="1" opacity="0.5"/>
                
                <!-- Torre de mando -->
                <rect x="85" y="25" width="30" height="25" rx="3" fill="url(#towerGradient)" filter="url(#submarineShadow)"/>
                
                <!-- Periscopio -->
                <rect x="98" y="15" width="4" height="15" fill="#2D3748"/>
                <circle cx="100" cy="15" r="3" fill="#4A5568"/>
                
                <!-- Ventanas de observación -->
                <ellipse cx="60" cy="50" rx="8" ry="5" fill="url(#windowGlow)"/>
                <ellipse cx="80" cy="50" rx="8" ry="5" fill="url(#windowGlow)"/>
                <ellipse cx="120" cy="50" rx="8" ry="5" fill="url(#windowGlow)"/>
                <ellipse cx="140" cy="50" rx="8" ry="5" fill="url(#windowGlow)"/>
                
                <!-- Hélice trasera -->
                <g transform="translate(20, 50)">
                    <circle cx="0" cy="0" r="8" fill="#1A202C"/>
                    <rect x="-2" y="-15" width="4" height="30" fill="#2D3748" transform="rotate(0)"/>
                    <rect x="-2" y="-15" width="4" height="30" fill="#2D3748" transform="rotate(60)"/>
                    <rect x="-2" y="-15" width="4" height="30" fill="#2D3748" transform="rotate(120)"/>
                </g>
                
                <!-- Aletas estabilizadoras -->
                <polygon points="25,50 10,35 10,45 20,50" fill="#2D3748"/>
                <polygon points="25,50 10,65 10,55 20,50" fill="#2D3748"/>
                
                <!-- Detalles técnicos -->
                <rect x="90" y="35" width="20" height="3" rx="1" fill="#1A202C" opacity="0.7"/>
                <circle cx="95" cy="30" r="2" fill="#EF4444"/>
                <circle cx="105" cy="30" r="2" fill="#10B981"/>
                
                <!-- Tubos de torpedo -->
                <circle cx="175" cy="45" r="3" fill="#1A202C"/>
                <circle cx="175" cy="55" r="3" fill="#1A202C"/>
            </svg>`;
        }
    },
    
    // Submarino de Exploración
    explorationSubmarine: {
        name: 'Submarino de Exploración',
        createSVG: function() {
            return `
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="explorerHull" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FCD34D;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#F59E0B;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#D97706;stop-opacity:1" />
                    </linearGradient>
                    
                    <radialGradient id="domeGlass">
                        <stop offset="0%" style="stop-color:#DBEAFE;stop-opacity:0.8" />
                        <stop offset="50%" style="stop-color:#93C5FD;stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:#60A5FA;stop-opacity:0.4" />
                    </radialGradient>
                    
                    <filter id="glowEffect">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Casco principal más redondeado -->
                <ellipse cx="100" cy="55" rx="70" ry="30" fill="url(#explorerHull)"/>
                
                <!-- Cúpula de observación -->
                <ellipse cx="100" cy="40" rx="35" ry="25" fill="url(#domeGlass)" opacity="0.9"/>
                <ellipse cx="100" cy="40" rx="32" ry="22" fill="none" stroke="#F59E0B" stroke-width="2"/>
                
                <!-- Luces de exploración -->
                <circle cx="160" cy="55" r="8" fill="#FEF3C7" filter="url(#glowEffect)"/>
                <circle cx="160" cy="55" r="5" fill="#FDE68A"/>
                
                <!-- Brazos mecánicos -->
                <g transform="translate(140, 70)">
                    <rect x="0" y="0" width="25" height="5" fill="#78716C"/>
                    <rect x="25" y="-2" width="15" height="4" fill="#57534E" transform="rotate(25 25 0)"/>
                    <circle cx="38" cy="5" r="4" fill="#A8A29E"/>
                </g>
                
                <!-- Sensores y antenas -->
                <line x1="80" y1="25" x2="80" y2="10" stroke="#78716C" stroke-width="2"/>
                <circle cx="80" cy="10" r="3" fill="#EF4444"/>
                <line x1="120" y1="25" x2="120" y2="10" stroke="#78716C" stroke-width="2"/>
                <circle cx="120" cy="10" r="3" fill="#10B981"/>
                
                <!-- Propulsores laterales -->
                <ellipse cx="40" cy="60" rx="12" ry="8" fill="#78716C"/>
                <rect x="35" y="58" width="10" height="4" fill="#57534E"/>
                
                <!-- Ventanas de observación -->
                <circle cx="85" cy="40" r="6" fill="#DBEAFE" opacity="0.8"/>
                <circle cx="100" cy="40" r="6" fill="#DBEAFE" opacity="0.8"/>
                <circle cx="115" cy="40" r="6" fill="#DBEAFE" opacity="0.8"/>
                
                <!-- Marcas de identificación -->
                <text x="100" y="65" font-family="Arial" font-size="8" fill="#92400E" text-anchor="middle">EXP-01</text>
            </svg>`;
        }
    },
    
    // Submarino Stealth
    stealthSubmarine: {
        name: 'Submarino Stealth',
        createSVG: function() {
            return `
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="stealthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#111827;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#1F2937;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
                    </linearGradient>
                    
                    <pattern id="carbonFiber" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                        <rect width="2" height="2" fill="#1F2937"/>
                        <rect x="2" y="2" width="2" height="2" fill="#1F2937"/>
                        <rect x="0" y="2" width="2" height="2" fill="#374151"/>
                        <rect x="2" y="0" width="2" height="2" fill="#374151"/>
                    </pattern>
                    
                    <filter id="stealthShadow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                        <feOffset dx="0" dy="3"/>
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.7"/>
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Casco angular stealth -->
                <polygon points="30,50 170,45 180,50 170,55 30,50" fill="url(#stealthGradient)" filter="url(#stealthShadow)"/>
                
                <!-- Paneles de carbono -->
                <polygon points="40,48 80,46 80,54 40,52" fill="url(#carbonFiber)" opacity="0.5"/>
                <polygon points="90,46 130,45 130,55 90,54" fill="url(#carbonFiber)" opacity="0.5"/>
                <polygon points="140,45 170,45 170,55 140,55" fill="url(#carbonFiber)" opacity="0.5"/>
                
                <!-- Torre de mando baja -->
                <polygon points="90,40 110,40 105,50 95,50" fill="#1F2937" filter="url(#stealthShadow)"/>
                
                <!-- Sistema de propulsión silenciosa -->
                <ellipse cx="25" cy="50" rx="15" ry="10" fill="#111827" opacity="0.8"/>
                <circle cx="25" cy="50" r="6" fill="#1F2937"/>
                
                <!-- Luces tácticas mínimas -->
                <rect x="160" y="48" width="8" height="2" fill="#DC2626" opacity="0.7"/>
                <rect x="150" y="51" width="8" height="2" fill="#DC2626" opacity="0.7"/>
                
                <!-- Sensores pasivos -->
                <line x1="95" y1="40" x2="95" y2="35" stroke="#374151" stroke-width="1"/>
                <line x1="105" y1="40" x2="105" y2="35" stroke="#374151" stroke-width="1"/>
                
                <!-- Compuertas de torpedo ocultas -->
                <rect x="165" y="47" width="10" height="2" fill="#111827" opacity="0.5"/>
                <rect x="165" y="51" width="10" height="2" fill="#111827" opacity="0.5"/>
                
                <!-- Código de identificación stealth -->
                <text x="100" y="52" font-family="monospace" font-size="6" fill="#374151" text-anchor="middle" opacity="0.3">GHOST-7</text>
            </svg>`;
        }
    },
    
    // Submarino de Combate Pesado
    battleSubmarine: {
        name: 'Submarino de Batalla',
        createSVG: function() {
            return `
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="battleHull" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#7F1D1D;stop-opacity:1" />
                        <stop offset="30%" style="stop-color:#991B1B;stop-opacity:1" />
                        <stop offset="70%" style="stop-color:#7F1D1D;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#450A0A;stop-opacity:1" />
                    </linearGradient>
                    
                    <radialGradient id="weaponGlow">
                        <stop offset="0%" style="stop-color:#FCA5A5;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#DC2626;stop-opacity:0.5" />
                    </radialGradient>
                    
                    <filter id="heavyShadow">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                        <feOffset dx="2" dy="4"/>
                        <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Casco reforzado -->
                <rect x="20" y="40" width="160" height="30" rx="15" fill="url(#battleHull)" filter="url(#heavyShadow)"/>
                
                <!-- Placas de blindaje -->
                <rect x="30" y="42" width="25" height="26" rx="2" fill="#991B1B" stroke="#450A0A" stroke-width="1"/>
                <rect x="60" y="42" width="25" height="26" rx="2" fill="#991B1B" stroke="#450A0A" stroke-width="1"/>
                <rect x="90" y="42" width="25" height="26" rx="2" fill="#991B1B" stroke="#450A0A" stroke-width="1"/>
                <rect x="120" y="42" width="25" height="26" rx="2" fill="#991B1B" stroke="#450A0A" stroke-width="1"/>
                <rect x="150" y="42" width="25" height="26" rx="2" fill="#991B1B" stroke="#450A0A" stroke-width="1"/>
                
                <!-- Torre de mando fortificada -->
                <rect x="85" y="25" width="30" height="20" rx="2" fill="#7F1D1D" filter="url(#heavyShadow)"/>
                <rect x="90" y="30" width="20" height="10" fill="#450A0A" opacity="0.7"/>
                
                <!-- Cañones de torpedo múltiples -->
                <g transform="translate(175, 50)">
                    <circle cx="0" cy="-8" r="4" fill="#450A0A"/>
                    <circle cx="0" cy="0" r="4" fill="#450A0A"/>
                    <circle cx="0" cy="8" r="4" fill="#450A0A"/>
                    <rect x="0" y="-10" width="12" height="4" fill="#7F1D1D"/>
                    <rect x="0" y="-2" width="12" height="4" fill="#7F1D1D"/>
                    <rect x="0" y="6" width="12" height="4" fill="#7F1D1D"/>
                </g>
                
                <!-- Sistema de misiles -->
                <rect x="70" y="35" width="8" height="15" fill="#991B1B"/>
                <polygon points="70,35 74,30 78,35" fill="#DC2626"/>
                <rect x="122" y="35" width="8" height="15" fill="#991B1B"/>
                <polygon points="122,35 126,30 130,35" fill="#DC2626"/>
                
                <!-- Luces de combate -->
                <circle cx="160" cy="55" r="5" fill="url(#weaponGlow)" filter="url(#glowEffect)"/>
                <circle cx="40" cy="55" r="3" fill="#DC2626"/>
                <circle cx="50" cy="55" r="3" fill="#DC2626"/>
                
                <!-- Marcas de batalla -->
                <line x1="35" y1="50" x2="45" y2="60" stroke="#450A0A" stroke-width="2" opacity="0.5"/>
                <line x1="35" y1="60" x2="45" y2="50" stroke="#450A0A" stroke-width="2" opacity="0.5"/>
                
                <!-- Identificación -->
                <text x="100" y="58" font-family="Arial Black" font-size="10" fill="#450A0A" text-anchor="middle">TITAN</text>
            </svg>`;
        }
    },
    
    // Convertir SVG a imagen base64
    svgToBase64: function(svgString) {
        const encoded = btoa(unescape(encodeURIComponent(svgString)));
        return `data:image/svg+xml;base64,${encoded}`;
    },
    
    // Cargar todos los sprites
    loadSprites: function() {
        const sprites = {};
        
        sprites.military = this.svgToBase64(this.militarySubmarine.createSVG());
        sprites.exploration = this.svgToBase64(this.explorationSubmarine.createSVG());
        sprites.stealth = this.svgToBase64(this.stealthSubmarine.createSVG());
        sprites.battle = this.svgToBase64(this.battleSubmarine.createSVG());
        
        return sprites;
    },
    
    // Integración con el sistema de enemigos
    getSubmarineForLevel: function(level) {
        if (level <= 5) return 'exploration';
        if (level <= 10) return 'military';
        if (level <= 15) return 'stealth';
        return 'battle';
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.ProfessionalSubmarines = ProfessionalSubmarines;
}