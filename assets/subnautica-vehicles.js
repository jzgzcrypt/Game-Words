// Vehículos Inspirados en Subnautica - Diseño Futurista
const SubnauticaVehicles = {
    // Seamoth - Vehículo de exploración rápido
    seamoth: {
        name: 'Explorador Veloz',
        createSVG: function() {
            return `
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <!-- Gradiente de cristal futurista -->
                    <radialGradient id="seamothGlass" cx="50%" cy="30%">
                        <stop offset="0%" style="stop-color:#E0F7FA;stop-opacity:0.9" />
                        <stop offset="30%" style="stop-color:#4DD0E1;stop-opacity:0.7" />
                        <stop offset="60%" style="stop-color:#0097A7;stop-opacity:0.5" />
                        <stop offset="100%" style="stop-color:#006064;stop-opacity:0.3" />
                    </radialGradient>
                    
                    <!-- Gradiente del casco -->
                    <linearGradient id="seamothHull" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ECEFF1;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#B0BEC5;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#607D8B;stop-opacity:1" />
                    </linearGradient>
                    
                    <!-- Efecto de energía -->
                    <radialGradient id="energyCore">
                        <stop offset="0%" style="stop-color:#00E5FF;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#00ACC1;stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:#006064;stop-opacity:0.3" />
                    </radialGradient>
                    
                    <!-- Filtro de brillo -->
                    <filter id="glowFilter">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Base esférica del vehículo -->
                <ellipse cx="100" cy="50" rx="45" ry="35" fill="url(#seamothHull)"/>
                
                <!-- Cúpula de cristal -->
                <ellipse cx="100" cy="45" rx="38" ry="30" fill="url(#seamothGlass)"/>
                
                <!-- Marco de la cúpula -->
                <ellipse cx="100" cy="45" rx="38" ry="30" fill="none" stroke="#37474F" stroke-width="2"/>
                
                <!-- Líneas de refuerzo -->
                <path d="M 62 45 Q 100 25 138 45" fill="none" stroke="#37474F" stroke-width="1.5" opacity="0.5"/>
                <path d="M 62 45 Q 100 65 138 45" fill="none" stroke="#37474F" stroke-width="1.5" opacity="0.5"/>
                
                <!-- Propulsores laterales -->
                <g id="thruster">
                    <ellipse cx="50" cy="55" rx="12" ry="8" fill="#455A64"/>
                    <rect x="45" y="53" width="10" height="4" fill="#263238"/>
                    <circle cx="48" cy="55" r="3" fill="url(#energyCore)" filter="url(#glowFilter)"/>
                </g>
                <use href="#thruster" transform="translate(100, 0)"/>
                
                <!-- Luces frontales -->
                <ellipse cx="130" cy="50" rx="8" ry="6" fill="#FFF59D" opacity="0.8" filter="url(#glowFilter)"/>
                <ellipse cx="130" cy="50" rx="5" ry="3" fill="#FFEB3B"/>
                
                <!-- Panel de control interior -->
                <rect x="85" y="45" width="30" height="15" rx="2" fill="#263238" opacity="0.5"/>
                <rect x="90" y="48" width="20" height="8" fill="#00E5FF" opacity="0.3"/>
                
                <!-- Detalles técnicos -->
                <circle cx="75" cy="40" r="2" fill="#4DD0E1"/>
                <circle cx="125" cy="40" r="2" fill="#4DD0E1"/>
                
                <!-- Aletas estabilizadoras -->
                <path d="M 55 50 L 40 40 L 45 50 Z" fill="#607D8B" opacity="0.8"/>
                <path d="M 55 50 L 40 60 L 45 50 Z" fill="#607D8B" opacity="0.8"/>
                <path d="M 145 50 L 160 40 L 155 50 Z" fill="#607D8B" opacity="0.8"/>
                <path d="M 145 50 L 160 60 L 155 50 Z" fill="#607D8B" opacity="0.8"/>
                
                <!-- Núcleo de energía -->
                <circle cx="100" cy="60" r="5" fill="url(#energyCore)" filter="url(#glowFilter)"/>
                
                <!-- Marca Alterra (como en Subnautica) -->
                <text x="100" y="75" font-family="Arial" font-size="6" fill="#37474F" text-anchor="middle">ALTERRA</text>
            </svg>`;
        }
    },
    
    // Cyclops - Submarino grande
    cyclops: {
        name: 'Titán de las Profundidades',
        createSVG: function() {
            return `
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <!-- Gradiente del casco masivo -->
                    <linearGradient id="cyclopsHull" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#37474F;stop-opacity:1" />
                        <stop offset="30%" style="stop-color:#455A64;stop-opacity:1" />
                        <stop offset="70%" style="stop-color:#263238;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
                    </linearGradient>
                    
                    <!-- Ventanas del puente -->
                    <linearGradient id="bridgeWindow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#81D4FA;stop-opacity:0.9" />
                        <stop offset="50%" style="stop-color:#0277BD;stop-opacity:0.7" />
                        <stop offset="100%" style="stop-color:#01579B;stop-opacity:0.5" />
                    </linearGradient>
                    
                    <!-- Luces de navegación -->
                    <radialGradient id="navLight">
                        <stop offset="0%" style="stop-color:#FFEB3B;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#FFC107;stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:#FF6F00;stop-opacity:0" />
                    </radialGradient>
                </defs>
                
                <!-- Casco principal alargado -->
                <rect x="20" y="35" width="160" height="35" rx="17" fill="url(#cyclopsHull)"/>
                
                <!-- Sección frontal -->
                <ellipse cx="180" cy="52" rx="20" ry="18" fill="#37474F"/>
                
                <!-- Puente de mando -->
                <rect x="140" y="30" width="35" height="20" rx="5" fill="#455A64"/>
                
                <!-- Ventanas del puente -->
                <rect x="145" y="33" width="25" height="12" rx="2" fill="url(#bridgeWindow)"/>
                
                <!-- Ventanas laterales -->
                <ellipse cx="60" cy="50" rx="10" ry="6" fill="url(#bridgeWindow)" opacity="0.7"/>
                <ellipse cx="85" cy="50" rx="10" ry="6" fill="url(#bridgeWindow)" opacity="0.7"/>
                <ellipse cx="110" cy="50" rx="10" ry="6" fill="url(#bridgeWindow)" opacity="0.7"/>
                
                <!-- Propulsores principales -->
                <ellipse cx="25" cy="52" rx="18" ry="15" fill="#263238"/>
                <circle cx="25" cy="52" r="10" fill="#000000"/>
                <circle cx="25" cy="52" r="7" fill="#0277BD" opacity="0.5"/>
                
                <!-- Aletas de dirección -->
                <polygon points="30,35 15,20 20,35" fill="#37474F"/>
                <polygon points="30,69 15,84 20,69" fill="#37474F"/>
                
                <!-- Torre de comunicaciones -->
                <rect x="100" y="25" width="4" height="15" fill="#607D8B"/>
                <circle cx="102" cy="25" r="3" fill="#FF5252"/>
                
                <!-- Escotilla de acceso -->
                <circle cx="130" cy="52" r="8" fill="#263238"/>
                <circle cx="130" cy="52" r="6" fill="none" stroke="#607D8B" stroke-width="1"/>
                
                <!-- Luces de navegación -->
                <circle cx="170" cy="45" r="4" fill="url(#navLight)" filter="url(#glowFilter)"/>
                <circle cx="170" cy="59" r="4" fill="url(#navLight)" filter="url(#glowFilter)"/>
                
                <!-- Sonar -->
                <circle cx="50" cy="35" r="5" fill="#00E5FF" opacity="0.3"/>
                <circle cx="50" cy="35" r="3" fill="#00E5FF" opacity="0.6"/>
                
                <!-- Detalles del casco -->
                <line x1="30" y1="45" x2="170" y2="45" stroke="#000000" stroke-width="1" opacity="0.3"/>
                <line x1="30" y1="59" x2="170" y2="59" stroke="#000000" stroke-width="1" opacity="0.3"/>
                
                <!-- Logo corporativo -->
                <text x="100" y="55" font-family="Arial Black" font-size="8" fill="#263238" text-anchor="middle">AURORA</text>
            </svg>`;
        }
    },
    
    // PRAWN Suit - Traje mecánico
    prawnSuit: {
        name: 'Exotraje de Combate',
        createSVG: function() {
            return `
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <!-- Gradiente metálico del exoesqueleto -->
                    <linearGradient id="prawnMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFC107;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#FF9800;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#E65100;stop-opacity:1" />
                    </linearGradient>
                    
                    <!-- Cabina de cristal -->
                    <radialGradient id="prawnCockpit">
                        <stop offset="0%" style="stop-color:#E3F2FD;stop-opacity:0.9" />
                        <stop offset="50%" style="stop-color:#1976D2;stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:#0D47A1;stop-opacity:0.4" />
                    </radialGradient>
                    
                    <!-- Articulaciones hidráulicas -->
                    <linearGradient id="hydraulics">
                        <stop offset="0%" style="stop-color:#9E9E9E;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#616161;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#212121;stop-opacity:1" />
                    </linearGradient>
                </defs>
                
                <!-- Torso principal -->
                <rect x="85" y="30" width="30" height="35" rx="5" fill="url(#prawnMetal)"/>
                
                <!-- Cabina del piloto -->
                <ellipse cx="100" cy="40" rx="12" ry="15" fill="url(#prawnCockpit)"/>
                <ellipse cx="100" cy="40" rx="12" ry="15" fill="none" stroke="#E65100" stroke-width="2"/>
                
                <!-- Brazos mecánicos -->
                <!-- Brazo izquierdo -->
                <g transform="translate(75, 45)">
                    <rect x="0" y="0" width="8" height="20" fill="url(#hydraulics)"/>
                    <circle cx="4" cy="20" r="5" fill="#FF9800"/>
                    <rect x="-5" y="20" width="15" height="8" rx="2" fill="url(#prawnMetal)"/>
                    <!-- Garra -->
                    <path d="M -5 28 L -8 35 L -3 32 Z" fill="#E65100"/>
                    <path d="M 10 28 L 13 35 L 8 32 Z" fill="#E65100"/>
                </g>
                
                <!-- Brazo derecho (taladro) -->
                <g transform="translate(115, 45)">
                    <rect x="0" y="0" width="8" height="20" fill="url(#hydraulics)"/>
                    <circle cx="4" cy="20" r="5" fill="#FF9800"/>
                    <!-- Taladro -->
                    <polygon points="2,25 6,25 4,35" fill="#757575"/>
                    <line x1="4" y1="25" x2="4" y2="35" stroke="#424242" stroke-width="1"/>
                </g>
                
                <!-- Piernas mecánicas -->
                <!-- Pierna izquierda -->
                <g transform="translate(88, 60)">
                    <rect x="0" y="0" width="10" height="15" fill="url(#hydraulics)"/>
                    <circle cx="5" cy="15" r="4" fill="#FF9800"/>
                    <rect x="0" y="15" width="10" height="15" fill="url(#prawnMetal)"/>
                    <ellipse cx="5" cy="30" rx="8" ry="4" fill="#E65100"/>
                </g>
                
                <!-- Pierna derecha -->
                <g transform="translate(102, 60)">
                    <rect x="0" y="0" width="10" height="15" fill="url(#hydraulics)"/>
                    <circle cx="5" cy="15" r="4" fill="#FF9800"/>
                    <rect x="0" y="15" width="10" height="15" fill="url(#prawnMetal)"/>
                    <ellipse cx="5" cy="30" rx="8" ry="4" fill="#E65100"/>
                </g>
                
                <!-- Propulsores de salto -->
                <ellipse cx="90" cy="55" rx="5" ry="3" fill="#00E5FF" opacity="0.6" filter="url(#glowFilter)"/>
                <ellipse cx="110" cy="55" rx="5" ry="3" fill="#00E5FF" opacity="0.6" filter="url(#glowFilter)"/>
                
                <!-- Luces del casco -->
                <circle cx="100" cy="35" r="3" fill="#FFEB3B" filter="url(#glowFilter)"/>
                
                <!-- Panel de control -->
                <rect x="95" y="38" width="10" height="6" rx="1" fill="#212121" opacity="0.7"/>
                
                <!-- Detalles mecánicos -->
                <circle cx="90" cy="40" r="2" fill="#757575"/>
                <circle cx="110" cy="40" r="2" fill="#757575"/>
                
                <!-- Identificación -->
                <text x="100" y="25" font-family="Arial" font-size="5" fill="#E65100" text-anchor="middle">P.R.A.W.N</text>
            </svg>`;
        }
    },
    
    // Integración con el sistema de enemigos
    getVehicleSprite: function(level) {
        if (level <= 7) return this.seamoth;
        if (level <= 14) return this.cyclops;
        return this.prawnSuit;
    },
    
    // Convertir SVG a base64
    svgToBase64: function(svgString) {
        const encoded = btoa(unescape(encodeURIComponent(svgString)));
        return `data:image/svg+xml;base64,${encoded}`;
    },
    
    // Cargar todos los sprites
    loadSprites: function() {
        const sprites = {};
        
        sprites.seamoth = this.svgToBase64(this.seamoth.createSVG());
        sprites.cyclops = this.svgToBase64(this.cyclops.createSVG());
        sprites.prawnSuit = this.svgToBase64(this.prawnSuit.createSVG());
        
        return sprites;
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.SubnauticaVehicles = SubnauticaVehicles;
}