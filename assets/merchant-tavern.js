// Estación de Comercio Submarina - Diseño Integrado con el Entorno
const MerchantTavern = {
    // Crear el diseño de la estación de comercio submarina
    createTavernSVG: function() {
        return `
        <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Gradiente de coral -->
                <linearGradient id="coralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#FF6B9D;stop-opacity:0.8" />
                    <stop offset="30%" style="stop-color:#C44569;stop-opacity:0.9" />
                    <stop offset="70%" style="stop-color:#A8395C;stop-opacity:0.9" />
                    <stop offset="100%" style="stop-color:#723C5C;stop-opacity:1" />
                </linearGradient>
                
                <!-- Gradiente de estructura metálica submarina -->
                <linearGradient id="metalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#B0BEC5;stop-opacity:1" />
                    <stop offset="25%" style="stop-color:#78909C;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#546E7A;stop-opacity:1" />
                    <stop offset="75%" style="stop-color:#455A64;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#37474F;stop-opacity:1" />
                </linearGradient>
                
                <!-- Luz bioluminiscente -->
                <radialGradient id="bioGlow">
                    <stop offset="0%" style="stop-color:#00E5FF;stop-opacity:1" />
                    <stop offset="30%" style="stop-color:#00ACC1;stop-opacity:0.8" />
                    <stop offset="60%" style="stop-color:#00838F;stop-opacity:0.5" />
                    <stop offset="100%" style="stop-color:#006064;stop-opacity:0" />
                </radialGradient>
                
                <!-- Cristal de domo -->
                <radialGradient id="domeGradient" cx="50%" cy="30%">
                    <stop offset="0%" style="stop-color:#E0F7FA;stop-opacity:0.3" />
                    <stop offset="50%" style="stop-color:#4DD0E1;stop-opacity:0.2" />
                    <stop offset="100%" style="stop-color:#0097A7;stop-opacity:0.1" />
                </radialGradient>
                
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
            
            <!-- Base de coral viviente -->
            <g id="coralBase">
                <!-- Coral principal -->
                <path d="M 100 150 Q 80 130, 90 110 T 100 90 Q 110 100, 120 110 T 130 130 Q 120 140, 100 150" 
                      fill="url(#coralGradient)" opacity="0.8"/>
                <path d="M 170 140 Q 160 125, 165 110 T 175 95 Q 180 105, 185 115 T 190 130 Q 180 135, 170 140" 
                      fill="url(#coralGradient)" opacity="0.7"/>
                <path d="M 200 145 Q 195 135, 198 125 T 205 115 Q 208 120, 210 125 T 212 135 Q 207 140, 200 145" 
                      fill="url(#coralGradient)" opacity="0.6"/>
                
                <!-- Anémonas -->
                <ellipse cx="80" cy="140" rx="15" ry="25" fill="#FF6B9D" opacity="0.5"/>
                <ellipse cx="220" cy="135" rx="12" ry="20" fill="#C44569" opacity="0.5"/>
            </g>
            
            <!-- Estructura principal de la estación -->
            <!-- Base metálica circular -->
            <ellipse cx="150" cy="120" rx="80" ry="30" fill="url(#metalGradient)" opacity="0.9"/>
            
            <!-- Soportes estructurales -->
            <rect x="110" y="90" width="6" height="40" fill="#37474F"/>
            <rect x="184" y="90" width="6" height="40" fill="#37474F"/>
            <rect x="147" y="85" width="6" height="45" fill="#37474F"/>
            
            <!-- Domo de cristal -->
            <ellipse cx="150" cy="100" rx="70" ry="45" fill="url(#domeGradient)"/>
            <ellipse cx="150" cy="100" rx="70" ry="45" fill="none" stroke="#4DD0E1" stroke-width="2" opacity="0.5"/>
            
            <!-- Detalles del domo -->
            <path d="M 80 100 Q 150 70, 220 100" stroke="#00ACC1" stroke-width="1" opacity="0.4" fill="none"/>
            <path d="M 90 90 Q 150 75, 210 90" stroke="#00ACC1" stroke-width="1" opacity="0.3" fill="none"/>
            <path d="M 100 80 Q 150 65, 200 80" stroke="#00ACC1" stroke-width="1" opacity="0.2" fill="none"/>
            
            <!-- Plataforma de intercambio -->
            <ellipse cx="150" cy="110" rx="40" ry="15" fill="#546E7A" opacity="0.8"/>
            <ellipse cx="150" cy="108" rx="35" ry="12" fill="#607D8B"/>
            
            <!-- Panel holográfico de comercio -->
            <rect x="120" y="85" width="60" height="40" rx="3" fill="rgba(0, 229, 255, 0.1)" stroke="#00E5FF" stroke-width="1"/>
            
            <!-- Interfaz holográfica -->
            <line x1="125" y1="95" x2="175" y2="95" stroke="#00E5FF" stroke-width="0.5" opacity="0.7"/>
            <line x1="125" y1="105" x2="175" y2="105" stroke="#00E5FF" stroke-width="0.5" opacity="0.7"/>
            <line x1="125" y1="115" x2="175" y2="115" stroke="#00E5FF" stroke-width="0.5" opacity="0.7"/>
            
            <!-- Contenedores de mercancía flotantes -->
            <!-- Cápsula de almacenamiento 1 -->
            <ellipse cx="110" cy="100" rx="12" ry="20" fill="rgba(77, 208, 225, 0.3)" stroke="#4DD0E1" stroke-width="1"/>
            <ellipse cx="110" cy="95" rx="8" ry="3" fill="#4DD0E1" opacity="0.7"/>
            <ellipse cx="110" cy="105" rx="8" ry="3" fill="#4DD0E1" opacity="0.7"/>
            
            <!-- Cápsula de almacenamiento 2 -->
            <ellipse cx="190" cy="100" rx="12" ry="20" fill="rgba(77, 208, 225, 0.3)" stroke="#4DD0E1" stroke-width="1"/>
            <ellipse cx="190" cy="95" rx="8" ry="3" fill="#4DD0E1" opacity="0.7"/>
            <ellipse cx="190" cy="105" rx="8" ry="3" fill="#4DD0E1" opacity="0.7"/>
            
            <!-- Perlas y gemas flotantes -->
            <circle cx="130" cy="95" r="3" fill="#E0F7FA" opacity="0.9"/>
            <circle cx="170" cy="98" r="3" fill="#B2EBF2" opacity="0.9"/>
            <circle cx="150" cy="100" r="4" fill="#80DEEA" opacity="0.8"/>
            
            <!-- Luces bioluminiscentes -->
            <g id="bioLight">
                <circle cx="0" cy="0" r="8" fill="url(#bioGlow)" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="0" cy="0" r="4" fill="#00E5FF" opacity="0.9"/>
            </g>
            <use href="#bioLight" transform="translate(100, 70)"/>
            <use href="#bioLight" transform="translate(200, 70)"/>
            <use href="#bioLight" transform="translate(150, 60)"/>
            
            <!-- Identificación holográfica -->
            <text x="150" y="75" font-family="Arial" font-size="10" fill="#00E5FF" text-anchor="middle" opacity="0.8">ESTACIÓN DE COMERCIO</text>
            <text x="150" y="130" font-family="Arial" font-size="8" fill="#4DD0E1" text-anchor="middle" opacity="0.6">SECTOR 7-A</text>
            
            <!-- Tubos de conexión -->
            <rect x="70" y="105" width="30" height="8" rx="4" fill="#455A64" opacity="0.7"/>
            <rect x="200" y="105" width="30" height="8" rx="4" fill="#455A64" opacity="0.7"/>
            <circle cx="75" cy="109" r="3" fill="#00ACC1" opacity="0.8"/>
            <circle cx="225" cy="109" r="3" fill="#00ACC1" opacity="0.8"/>
            
            <!-- Plantas acuáticas bioluminiscentes -->
            <g id="seaweed">
                <path d="M 0 20 Q -5 15, 0 10 T 0 0" stroke="#00E676" stroke-width="2" fill="none" opacity="0.6">
                    <animate attributeName="d" 
                        values="M 0 20 Q -5 15, 0 10 T 0 0;
                                M 0 20 Q 5 15, 0 10 T 0 0;
                                M 0 20 Q -5 15, 0 10 T 0 0"
                        dur="4s" repeatCount="indefinite"/>
                </path>
                <circle cx="0" cy="5" r="2" fill="#00E676" opacity="0.5"/>
                <circle cx="0" cy="15" r="2" fill="#00E676" opacity="0.5"/>
            </g>
            <use href="#seaweed" transform="translate(60, 130)"/>
            <use href="#seaweed" transform="translate(240, 125) scale(0.8)"/>
            <use href="#seaweed" transform="translate(90, 135) scale(1.2)"/>
            
            <!-- Escáner de identificación -->
            <rect x="145" y="90" width="10" height="15" rx="2" fill="#37474F"/>
            <rect x="147" y="92" width="6" height="6" fill="#00E5FF" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite"/>
            </rect>
            
            <!-- Burbujas ambientales animadas -->
            <circle cx="70" cy="90" r="3" fill="#B2EBF2" opacity="0.4">
                <animate attributeName="cy" values="90;70;50" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0.2;0" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="230" cy="95" r="2" fill="#B2EBF2" opacity="0.4">
                <animate attributeName="cy" values="95;75;55" dur="3.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0.2;0" dur="3.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="150" cy="150" r="4" fill="#B2EBF2" opacity="0.3">
                <animate attributeName="cy" values="150;130;110" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.1;0" dur="4s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Campo de energía de protección -->
            <ellipse cx="150" cy="100" rx="95" ry="55" fill="none" stroke="#00E5FF" stroke-width="0.5" 
                     stroke-dasharray="5,10" opacity="0.3">
                <animate attributeName="stroke-dashoffset" from="0" to="15" dur="10s" repeatCount="indefinite"/>
            </ellipse>
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