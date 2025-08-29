// Taberna/Tenderete Submarino del Mercader - Diseño Artístico Realista
const MerchantTavern = {
    // Crear el diseño de la taberna submarina
    createTavernSVG: function() {
        return `
        <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Gradiente de roca -->
                <linearGradient id="rockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#5D4E37;stop-opacity:1" />
                    <stop offset="30%" style="stop-color:#3E2723;stop-opacity:1" />
                    <stop offset="70%" style="stop-color:#4E342E;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#3E2723;stop-opacity:1" />
                </linearGradient>
                
                <!-- Gradiente de madera -->
                <linearGradient id="woodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#8D6E63;stop-opacity:1" />
                    <stop offset="25%" style="stop-color:#6D4C41;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#5D4037;stop-opacity:1" />
                    <stop offset="75%" style="stop-color:#6D4C41;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#4E342E;stop-opacity:1" />
                </linearGradient>
                
                <!-- Luz cálida de linterna -->
                <radialGradient id="lanternGlow">
                    <stop offset="0%" style="stop-color:#FFE082;stop-opacity:1" />
                    <stop offset="30%" style="stop-color:#FFB74D;stop-opacity:0.8" />
                    <stop offset="60%" style="stop-color:#FF9800;stop-opacity:0.5" />
                    <stop offset="100%" style="stop-color:#E65100;stop-opacity:0" />
                </radialGradient>
                
                <!-- Tela del toldo -->
                <linearGradient id="canvasGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#D7CCC8;stop-opacity:0.9" />
                    <stop offset="50%" style="stop-color:#BCAAA4;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#8D6E63;stop-opacity:0.9" />
                </linearGradient>
                
                <!-- Agua con reflejos -->
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#006064;stop-opacity:0.3" />
                    <stop offset="50%" style="stop-color:#00838F;stop-opacity:0.2" />
                    <stop offset="100%" style="stop-color:#0097A7;stop-opacity:0.1" />
                </linearGradient>
                
                <!-- Sombra -->
                <filter id="shadow">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                    <feOffset dx="3" dy="5" result="offsetblur"/>
                    <feFlood flood-color="#000000" flood-opacity="0.5"/>
                    <feComposite in2="offsetblur" operator="in"/>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Formación rocosa -->
            <path d="M 0 100 Q 30 70, 80 80 L 100 85 Q 120 90, 140 85 L 180 80 Q 220 70, 250 85 L 280 90 L 300 95 L 300 200 L 0 200 Z" 
                  fill="url(#rockGradient)"/>
            
            <!-- Grietas en la roca -->
            <path d="M 50 90 L 55 120 L 52 150" stroke="#2E1A1A" stroke-width="2" opacity="0.5" fill="none"/>
            <path d="M 120 85 L 118 110 L 122 140" stroke="#2E1A1A" stroke-width="2" opacity="0.5" fill="none"/>
            <path d="M 200 82 L 195 105 L 198 130" stroke="#2E1A1A" stroke-width="2" opacity="0.5" fill="none"/>
            
            <!-- Cueva/hueco en la roca -->
            <ellipse cx="150" cy="120" rx="70" ry="40" fill="#1A1A1A" opacity="0.7"/>
            
            <!-- Estructura del tenderete -->
            <!-- Postes de madera -->
            <rect x="95" y="60" width="8" height="80" fill="url(#woodGradient)" filter="url(#shadow)"/>
            <rect x="195" y="60" width="8" height="80" fill="url(#woodGradient)" filter="url(#shadow)"/>
            
            <!-- Viga horizontal -->
            <rect x="95" y="60" width="108" height="10" fill="url(#woodGradient)"/>
            
            <!-- Toldo/tela -->
            <path d="M 85 65 Q 150 50, 215 65 L 210 90 Q 150 85, 90 90 Z" 
                  fill="url(#canvasGradient)" filter="url(#shadow)"/>
            
            <!-- Parches en el toldo -->
            <rect x="120" y="70" width="15" height="10" fill="#A1887F" opacity="0.7" transform="rotate(-5 127.5 75)"/>
            <rect x="160" y="68" width="12" height="12" fill="#8D6E63" opacity="0.6" transform="rotate(3 166 74)"/>
            
            <!-- Mostrador de madera -->
            <rect x="100" y="110" width="100" height="8" fill="url(#woodGradient)"/>
            <rect x="100" y="118" width="100" height="25" fill="#4E342E"/>
            
            <!-- Detalles del mostrador -->
            <line x1="100" y1="125" x2="200" y2="125" stroke="#3E2723" stroke-width="1"/>
            <line x1="100" y1="135" x2="200" y2="135" stroke="#3E2723" stroke-width="1"/>
            
            <!-- Objetos sobre el mostrador -->
            <!-- Balanza antigua -->
            <ellipse cx="120" cy="110" rx="8" ry="2" fill="#8D6E63"/>
            <line x1="120" y1="110" x2="120" y2="100" stroke="#6D4C41" stroke-width="2"/>
            <line x1="110" y1="100" x2="130" y2="100" stroke="#6D4C41" stroke-width="2"/>
            <circle cx="110" cy="102" r="4" fill="#795548"/>
            <circle cx="130" cy="98" r="4" fill="#795548"/>
            
            <!-- Cofre del tesoro -->
            <rect x="160" y="100" width="25" height="15" rx="2" fill="#6D4C41"/>
            <rect x="160" y="100" width="25" height="8" rx="2" fill="#8D6E63"/>
            <rect x="170" y="105" width="5" height="5" fill="#FFD700"/>
            
            <!-- Botellas -->
            <rect x="140" y="95" width="6" height="15" fill="#1B5E20" opacity="0.8"/>
            <ellipse cx="143" cy="95" rx="3" ry="2" fill="#2E7D32"/>
            <rect x="148" y="98" width="5" height="12" fill="#0D47A1" opacity="0.8"/>
            <ellipse cx="150.5" cy="98" rx="2.5" ry="1.5" fill="#1565C0"/>
            
            <!-- Linternas colgantes -->
            <g id="lantern">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#3E2723" stroke-width="1"/>
                <rect x="-5" y="10" width="10" height="12" fill="#5D4037"/>
                <rect x="-4" y="11" width="8" height="10" fill="#FFE082" opacity="0.7"/>
                <circle cx="0" cy="16" r="15" fill="url(#lanternGlow)" opacity="0.6"/>
            </g>
            <use href="#lantern" transform="translate(110, 65)"/>
            <use href="#lantern" transform="translate(190, 65)"/>
            
            <!-- Cartel de madera -->
            <rect x="130" y="30" width="40" height="25" fill="url(#woodGradient)" transform="rotate(-3 150 42.5)"/>
            <text x="150" y="40" font-family="serif" font-size="8" fill="#D7CCC8" text-anchor="middle">MERCADER</text>
            <text x="150" y="48" font-family="serif" font-size="6" fill="#BCAAA4" text-anchor="middle">SUBMARINO</text>
            
            <!-- Cuerda con objetos colgando -->
            <path d="M 95 70 Q 150 75, 203 70" stroke="#6D4C41" stroke-width="2" fill="none"/>
            
            <!-- Objetos colgando de la cuerda -->
            <!-- Red de pesca -->
            <g transform="translate(115, 75)">
                <path d="M 0 0 L -5 8 L 0 10 L 5 8 Z" fill="none" stroke="#8D6E63" stroke-width="0.5"/>
                <path d="M -2 2 L 2 2 M -3 4 L 3 4 M -4 6 L 4 6" stroke="#8D6E63" stroke-width="0.5"/>
            </g>
            
            <!-- Concha -->
            <g transform="translate(150, 73)">
                <ellipse cx="0" cy="0" rx="6" ry="8" fill="#F8BBD0" transform="rotate(10)"/>
                <path d="M -6 0 L 0 -8 L 6 0" stroke="#E91E63" stroke-width="0.5" fill="none"/>
            </g>
            
            <!-- Ancla pequeña -->
            <g transform="translate(180, 75)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#546E7A" stroke-width="2"/>
                <path d="M -4 6 Q 0 10, 4 6" stroke="#546E7A" stroke-width="2" fill="none"/>
                <circle cx="0" cy="1" r="1.5" fill="none" stroke="#546E7A" stroke-width="1"/>
            </g>
            
            <!-- Barriles apilados al lado -->
            <ellipse cx="80" cy="130" rx="12" ry="6" fill="#6D4C41"/>
            <rect x="68" y="115" width="24" height="15" fill="#5D4037"/>
            <ellipse cx="80" cy="115" rx="12" ry="6" fill="#795548"/>
            <line x1="68" y1="120" x2="92" y2="120" stroke="#4E342E" stroke-width="1"/>
            <line x1="68" y1="125" x2="92" y2="125" stroke="#4E342E" stroke-width="1"/>
            
            <ellipse cx="220" cy="135" rx="10" ry="5" fill="#6D4C41"/>
            <rect x="210" y="125" width="20" height="10" fill="#5D4037"/>
            <ellipse cx="220" cy="125" rx="10" ry="5" fill="#795548"/>
            
            <!-- Algas decorativas -->
            <path d="M 60 140 Q 55 120, 60 100" stroke="#2E7D32" stroke-width="3" fill="none" opacity="0.6"/>
            <path d="M 240 140 Q 245 125, 240 110" stroke="#388E3C" stroke-width="3" fill="none" opacity="0.6"/>
            
            <!-- Burbujas ambientales -->
            <circle cx="70" cy="90" r="3" fill="#B2EBF2" opacity="0.4"/>
            <circle cx="230" cy="95" r="2" fill="#B2EBF2" opacity="0.4"/>
            <circle cx="150" cy="150" r="4" fill="#B2EBF2" opacity="0.3"/>
            
            <!-- Reflejo de agua -->
            <ellipse cx="150" cy="180" rx="120" ry="20" fill="url(#waterGradient)"/>
        </svg>`;
    },
    
    // Dibujar el mercader en el canvas
    draw: function(ctx, station) {
        ctx.save();
        
        // Crear imagen si no existe
        if (!this.tavernImage) {
            this.tavernImage = new Image();
            const svg = this.createTavernSVG();
            const encoded = btoa(unescape(encodeURIComponent(svg)));
            this.tavernImage.src = `data:image/svg+xml;base64,${encoded}`;
        }
        
        // Dibujar la taberna
        if (this.tavernImage.complete) {
            // Escalar según el tamaño de la estación
            const scale = station.size / 50;
            ctx.scale(scale, scale);
            
            // Dibujar la imagen centrada
            ctx.drawImage(this.tavernImage, -150, -100, 300, 200);
        } else {
            // Fallback mientras carga
            ctx.fillStyle = '#8D6E63';
            ctx.fillRect(-station.size, -station.size/2, station.size*2, station.size);
            ctx.fillStyle = '#FFEB3B';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('MERCADER', 0, 0);
        }
        
        // Indicador de distancia
        const distance = Math.sqrt(
            Math.pow(station.x - gameState.player.x, 2) + 
            Math.pow(station.y - gameState.player.y, 2)
        );
        
        if (distance > 100) {
            ctx.fillStyle = '#FFEB3B';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.floor(distance)}m`, 0, station.size + 20);
        }
        
        // Texto de interacción si está cerca
        if (distance < 50) {
            ctx.fillStyle = '#FFE082';
            ctx.font = 'bold 14px serif';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#FF6F00';
            ctx.fillText('¡TABERNA ABIERTA!', 0, -station.size - 20);
            ctx.font = '10px Arial';
            ctx.fillText('[ESC] para entrar', 0, -station.size - 5);
            ctx.shadowBlur = 0;
        }
        
        ctx.restore();
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.MerchantTavern = MerchantTavern;
}