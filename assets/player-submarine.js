// Submarino Profesional del Jugador - Diseño Artístico Premium
const PlayerSubmarine = {
    // Submarino principal del jugador - Diseño futurista y elegante
    createProfessionalSVG: function(level = 1) {
        // Colores que evolucionan con el nivel
        const colors = {
            primary: level < 5 ? '#1E88E5' : level < 10 ? '#0D47A1' : level < 15 ? '#4A148C' : '#B71C1C',
            secondary: level < 5 ? '#42A5F5' : level < 10 ? '#1976D2' : level < 15 ? '#7B1FA2' : '#E53935',
            accent: level < 5 ? '#90CAF9' : level < 10 ? '#64B5F6' : level < 15 ? '#BA68C8' : '#EF5350',
            glow: level < 5 ? '#00BCD4' : level < 10 ? '#00ACC1' : level < 15 ? '#E91E63' : '#FF5722',
            energy: level < 5 ? '#00E5FF' : level < 10 ? '#00B8D4' : level < 15 ? '#FF4081' : '#FF6E40'
        };
        
        return `
        <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Gradiente metálico del casco -->
                <linearGradient id="hullGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:1" />
                    <stop offset="30%" style="stop-color:${colors.secondary};stop-opacity:1" />
                    <stop offset="70%" style="stop-color:${colors.primary};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0A0A0A;stop-opacity:1" />
                </linearGradient>
                
                <!-- Gradiente de cristal reforzado -->
                <radialGradient id="glassGradient" cx="50%" cy="30%">
                    <stop offset="0%" style="stop-color:#E1F5FE;stop-opacity:0.9" />
                    <stop offset="20%" style="stop-color:#81D4FA;stop-opacity:0.7" />
                    <stop offset="50%" style="stop-color:#29B6F6;stop-opacity:0.5" />
                    <stop offset="100%" style="stop-color:#0277BD;stop-opacity:0.3" />
                </radialGradient>
                
                <!-- Núcleo de energía -->
                <radialGradient id="energyCore">
                    <stop offset="0%" style="stop-color:${colors.energy};stop-opacity:1">
                        <animate attributeName="stop-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="50%" style="stop-color:${colors.glow};stop-opacity:0.7" />
                    <stop offset="100%" style="stop-color:${colors.primary};stop-opacity:0.2" />
                </radialGradient>
                
                <!-- Efecto de propulsión -->
                <linearGradient id="thrustGradient" x1="100%" y1="50%" x2="0%" y2="50%">
                    <stop offset="0%" style="stop-color:${colors.energy};stop-opacity:0">
                        <animate attributeName="stop-opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite"/>
                    </stop>
                    <stop offset="50%" style="stop-color:${colors.glow};stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:1" />
                </linearGradient>
                
                <!-- Sombra realista -->
                <filter id="dropShadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="2" dy="4" result="offsetblur"/>
                    <feFlood flood-color="#000000" flood-opacity="0.4"/>
                    <feComposite in2="offsetblur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                
                <!-- Brillo metálico -->
                <filter id="metalShine">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feSpecularLighting result="specOut" in="coloredBlur" specularConstant="2" specularExponent="20" lighting-color="white">
                        <fePointLight x="50" y="20" z="200"/>
                    </feSpecularLighting>
                    <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2"/>
                    <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
                </filter>
            </defs>
            
            <!-- Casco principal hidrodinámico -->
            <path d="M 30 50 
                     Q 20 35, 40 30
                     L 140 28
                     Q 175 30, 185 50
                     Q 175 70, 140 72
                     L 40 70
                     Q 20 65, 30 50 Z" 
                  fill="url(#hullGradient)" 
                  filter="url(#dropShadow)"/>
            
            <!-- Líneas de refuerzo del casco -->
            <path d="M 40 35 L 140 33" stroke="${colors.primary}" stroke-width="1" opacity="0.5"/>
            <path d="M 40 65 L 140 67" stroke="${colors.primary}" stroke-width="1" opacity="0.5"/>
            
            <!-- Cabina de mando -->
            <ellipse cx="120" cy="50" rx="35" ry="18" fill="url(#glassGradient)" filter="url(#metalShine)"/>
            
            <!-- Marco reforzado de la cabina -->
            <ellipse cx="120" cy="50" rx="35" ry="18" fill="none" stroke="${colors.primary}" stroke-width="2" opacity="0.8"/>
            
            <!-- Detalles internos de la cabina -->
            <rect x="105" y="45" width="30" height="10" rx="2" fill="${colors.primary}" opacity="0.3"/>
            <circle cx="115" cy="50" r="2" fill="${colors.energy}"/>
            <circle cx="125" cy="50" r="2" fill="${colors.energy}"/>
            
            <!-- Torre de periscopio (si nivel > 5) -->
            ${level > 5 ? `
                <rect x="95" y="35" width="6" height="15" fill="${colors.secondary}"/>
                <circle cx="98" cy="35" r="3" fill="${colors.accent}"/>
                <line x1="98" y1="30" x2="98" y2="25" stroke="${colors.primary}" stroke-width="2"/>
            ` : ''}
            
            <!-- Aletas estabilizadoras superiores -->
            <path d="M 50 40 L 35 25 L 45 35 Z" fill="${colors.secondary}" opacity="0.9"/>
            <path d="M 50 60 L 35 75 L 45 65 Z" fill="${colors.secondary}" opacity="0.9"/>
            
            <!-- Aleta dorsal (si nivel > 10) -->
            ${level > 10 ? `
                <path d="M 80 35 L 75 20 L 90 22 Z" fill="${colors.primary}" opacity="0.8"/>
            ` : ''}
            
            <!-- Sistema de propulsión principal -->
            <ellipse cx="30" cy="50" rx="12" ry="10" fill="${colors.primary}"/>
            <ellipse cx="30" cy="50" rx="8" ry="7" fill="#000000" opacity="0.8"/>
            
            <!-- Efecto de propulsión -->
            <ellipse cx="20" cy="50" rx="15" ry="8" fill="url(#thrustGradient)" opacity="0.8">
                <animateTransform attributeName="transform" type="scale" 
                    values="1,1;1.2,1.2;1,1" dur="0.5s" repeatCount="indefinite"/>
            </ellipse>
            
            <!-- Propulsores auxiliares (si nivel > 7) -->
            ${level > 7 ? `
                <ellipse cx="60" cy="65" rx="5" ry="3" fill="${colors.secondary}"/>
                <ellipse cx="60" cy="35" rx="5" ry="3" fill="${colors.secondary}"/>
                <ellipse cx="55" cy="65" rx="8" ry="2" fill="url(#thrustGradient)" opacity="0.5"/>
                <ellipse cx="55" cy="35" rx="8" ry="2" fill="url(#thrustGradient)" opacity="0.5"/>
            ` : ''}
            
            <!-- Cañones de torpedos (si nivel > 3) -->
            ${level > 3 ? `
                <rect x="150" y="45" width="15" height="3" fill="${colors.primary}"/>
                <rect x="150" y="52" width="15" height="3" fill="${colors.primary}"/>
                <circle cx="165" cy="46.5" r="2" fill="#000000"/>
                <circle cx="165" cy="53.5" r="2" fill="#000000"/>
            ` : ''}
            
            <!-- Luces de navegación -->
            <circle cx="175" cy="50" r="4" fill="${colors.energy}" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Escudo de energía (si nivel > 12) -->
            ${level > 12 ? `
                <ellipse cx="100" cy="50" rx="90" ry="40" fill="none" 
                    stroke="${colors.energy}" stroke-width="1" opacity="0.3" stroke-dasharray="5,5">
                    <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite"/>
                </ellipse>
            ` : ''}
            
            <!-- Núcleo de energía visible -->
            <circle cx="85" cy="50" r="6" fill="url(#energyCore)">
                <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Detalles técnicos -->
            <rect x="70" y="48" width="20" height="4" fill="${colors.primary}" opacity="0.5"/>
            <rect x="100" y="48" width="15" height="4" fill="${colors.primary}" opacity="0.5"/>
            
            <!-- Antena de comunicaciones (si nivel > 8) -->
            ${level > 8 ? `
                <line x1="110" y1="35" x2="110" y2="28" stroke="${colors.secondary}" stroke-width="1"/>
                <circle cx="110" cy="28" r="2" fill="${colors.accent}"/>
            ` : ''}
            
            <!-- Marcas de batalla (si nivel > 15) -->
            ${level > 15 ? `
                <line x1="50" y1="45" x2="55" y2="48" stroke="#666666" stroke-width="1" opacity="0.5"/>
                <line x1="80" y1="55" x2="85" y2="58" stroke="#666666" stroke-width="1" opacity="0.5"/>
                <line x1="130" y1="42" x2="135" y2="45" stroke="#666666" stroke-width="1" opacity="0.5"/>
            ` : ''}
            
            <!-- Identificación -->
            <text x="100" y="58" font-family="Arial Black" font-size="6" fill="${colors.accent}" 
                text-anchor="middle" opacity="0.7">AX-${1000 + level * 100}</text>
        </svg>`;
    },
    
    // Convertir a base64 para uso en canvas
    toBase64: function(level = 1) {
        const svg = this.createProfessionalSVG(level);
        const encoded = btoa(unescape(encodeURIComponent(svg)));
        return `data:image/svg+xml;base64,${encoded}`;
    },
    
    // Dibujar directamente en canvas
    draw: function(ctx, player) {
        ctx.save();
        
        // Crear imagen si no existe o si cambió el nivel
        if (!this.currentImage || this.lastLevel !== player.level) {
            this.currentImage = new Image();
            this.currentImage.src = this.toBase64(player.level);
            this.lastLevel = player.level;
        }
        
        // Dibujar el submarino
        if (this.currentImage.complete) {
            const scale = player.size / 50;
            ctx.scale(scale, scale);
            ctx.drawImage(this.currentImage, -100, -50, 200, 100);
        }
        
        ctx.restore();
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.PlayerSubmarine = PlayerSubmarine;
}