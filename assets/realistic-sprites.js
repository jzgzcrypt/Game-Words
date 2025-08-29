// Sistema de Sprites Realistas Ultra-Detallados
const RealisticSprites = {
    // Cache de sprites renderizados
    cache: {},
    
    // Configuración de calidad
    quality: {
        shadows: true,
        reflections: true,
        details: 'ultra',
        antialiasing: true
    },
    
    // Sprites SVG ultra-detallados
    sprites: {
        // Submarino del jugador ultra-realista
        playerSubmarine: {
            svg: `
<svg width="128" height="96" viewBox="0 0 128 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradientes metálicos realistas -->
    <linearGradient id="hullGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#5A7A9A;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#3D5A7A;stop-opacity:1" />
      <stop offset="60%" style="stop-color:#2C4A6A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1A3A5A;stop-opacity:1" />
    </linearGradient>
    
    <radialGradient id="cockpitGlass" cx="50%" cy="30%" r="50%">
      <stop offset="0%" style="stop-color:#E0F4FF;stop-opacity:0.9" />
      <stop offset="40%" style="stop-color:#A0D4F4;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#4090C0;stop-opacity:0.7" />
    </radialGradient>
    
    <linearGradient id="metalShine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.3" />
      <stop offset="50%" style="stop-color:#FFFFFF;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
    </linearGradient>
    
    <!-- Filtros para efectos realistas -->
    <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="2" dy="4" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.5"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="innerShadow">
      <feOffset dx="0" dy="2"/>
      <feGaussianBlur stdDeviation="2" result="offset-blur"/>
      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
      <feFlood flood-color="black" flood-opacity="0.3" result="color"/>
      <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
  </defs>
  
  <!-- Sombra principal -->
  <ellipse cx="64" cy="52" rx="45" ry="20" fill="black" opacity="0.3" filter="url(#dropShadow)"/>
  
  <!-- Casco principal con detalles -->
  <g id="mainHull">
    <!-- Casco inferior -->
    <path d="M 20 48 Q 20 65 35 68 L 93 68 Q 108 65 108 48 L 108 45 Q 108 28 93 25 L 35 25 Q 20 28 20 45 Z" 
          fill="url(#hullGradient)" stroke="#1A2A3A" stroke-width="1" filter="url(#innerShadow)"/>
    
    <!-- Líneas de panel -->
    <line x1="30" y1="35" x2="30" y2="58" stroke="#2A3A4A" stroke-width="0.5" opacity="0.5"/>
    <line x1="40" y1="30" x2="40" y2="63" stroke="#2A3A4A" stroke-width="0.5" opacity="0.5"/>
    <line x1="50" y1="28" x2="50" y2="65" stroke="#2A3A4A" stroke-width="0.5" opacity="0.5"/>
    <line x1="60" y1="27" x2="60" y2="66" stroke="#2A3A4A" stroke-width="0.5" opacity="0.5"/>
    <line x1="70" y1="28" x2="70" y2="65" stroke="#2A3A4A" stroke-width="0.5" opacity="0.5"/>
    <line x1="80" y1="30" x2="80" y2="63" stroke="#2A3A4A" stroke-width="0.5" opacity="0.5"/>
    <line x1="90" y1="32" x2="90" y2="61" stroke="#2A3A4A" stroke-width="0.5" opacity="0.5"/>
    <line x1="98" y1="35" x2="98" y2="58" stroke="#2A3A4A" stroke-width="0.5" opacity="0.5"/>
    
    <!-- Remaches -->
    <circle cx="35" cy="40" r="1" fill="#1A2A3A" opacity="0.6"/>
    <circle cx="45" cy="38" r="1" fill="#1A2A3A" opacity="0.6"/>
    <circle cx="55" cy="37" r="1" fill="#1A2A3A" opacity="0.6"/>
    <circle cx="65" cy="37" r="1" fill="#1A2A3A" opacity="0.6"/>
    <circle cx="75" cy="38" r="1" fill="#1A2A3A" opacity="0.6"/>
    <circle cx="85" cy="39" r="1" fill="#1A2A3A" opacity="0.6"/>
    <circle cx="93" cy="41" r="1" fill="#1A2A3A" opacity="0.6"/>
    
    <!-- Paneles de acceso -->
    <rect x="32" y="45" width="8" height="6" fill="#2A3A4A" stroke="#1A2A3A" stroke-width="0.5" rx="1"/>
    <rect x="44" y="44" width="10" height="8" fill="#2A3A4A" stroke="#1A2A3A" stroke-width="0.5" rx="1"/>
    <rect x="74" y="44" width="10" height="8" fill="#2A3A4A" stroke="#1A2A3A" stroke-width="0.5" rx="1"/>
    <rect x="88" y="45" width="8" height="6" fill="#2A3A4A" stroke="#1A2A3A" stroke-width="0.5" rx="1"/>
  </g>
  
  <!-- Torre de mando/Cabina -->
  <g id="commandTower">
    <!-- Base de la torre -->
    <ellipse cx="64" cy="38" rx="22" ry="12" fill="#4A5A6A" stroke="#2A3A4A" stroke-width="1"/>
    
    <!-- Estructura de la cabina -->
    <path d="M 50 38 Q 50 25 64 22 Q 78 25 78 38 Z" fill="#5A6A7A" stroke="#3A4A5A" stroke-width="1"/>
    
    <!-- Ventanas de la cabina con reflejos -->
    <ellipse cx="64" cy="32" rx="10" ry="6" fill="url(#cockpitGlass)" stroke="#2A3A4A" stroke-width="1"/>
    <ellipse cx="64" cy="32" rx="8" ry="4" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
    
    <!-- Ventanas laterales -->
    <ellipse cx="54" cy="34" rx="4" ry="3" fill="url(#cockpitGlass)" stroke="#2A3A4A" stroke-width="0.5"/>
    <ellipse cx="74" cy="34" rx="4" ry="3" fill="url(#cockpitGlass)" stroke="#2A3A4A" stroke-width="0.5"/>
    
    <!-- Periscopio -->
    <rect x="63" y="20" width="2" height="8" fill="#3A4A5A" stroke="#2A3A4A" stroke-width="0.5"/>
    <circle cx="64" cy="19" r="2" fill="#4A5A6A" stroke="#2A3A4A" stroke-width="0.5"/>
    
    <!-- Antenas -->
    <line x1="58" y1="24" x2="58" y2="18" stroke="#3A4A5A" stroke-width="1"/>
    <line x1="70" y1="24" x2="70" y2="18" stroke="#3A4A5A" stroke-width="1"/>
    <circle cx="58" cy="17" r="1" fill="#FF6B6B"/>
    <circle cx="70" cy="17" r="1" fill="#00FA9A"/>
  </g>
  
  <!-- Aletas y estabilizadores -->
  <g id="fins">
    <!-- Aleta dorsal -->
    <path d="M 64 25 L 58 15 L 60 15 L 64 22 L 68 15 L 70 15 Z" 
          fill="#3A4A5A" stroke="#2A3A4A" stroke-width="1" opacity="0.9"/>
    
    <!-- Aletas laterales -->
    <path d="M 25 45 L 15 40 L 15 42 L 23 46 L 15 50 L 15 52 Z" 
          fill="#3A4A5A" stroke="#2A3A4A" stroke-width="1" opacity="0.9"/>
    <path d="M 103 45 L 113 40 L 113 42 L 105 46 L 113 50 L 113 52 Z" 
          fill="#3A4A5A" stroke="#2A3A4A" stroke-width="1" opacity="0.9"/>
    
    <!-- Timón inferior -->
    <path d="M 64 68 L 60 78 L 62 78 L 64 70 L 66 78 L 68 78 Z" 
          fill="#3A4A5A" stroke="#2A3A4A" stroke-width="1" opacity="0.9"/>
  </g>
  
  <!-- Sistemas de propulsión -->
  <g id="propulsion">
    <!-- Propulsor principal -->
    <ellipse cx="20" cy="48" rx="8" ry="12" fill="#2A3A4A" stroke="#1A2A3A" stroke-width="1"/>
    <ellipse cx="20" cy="48" rx="6" ry="10" fill="#3A4A5A" stroke="none"/>
    
    <!-- Toberas -->
    <rect x="10" y="44" width="10" height="8" fill="#4A5A6A" stroke="#2A3A4A" stroke-width="1" rx="2"/>
    
    <!-- Hélice (será animada) -->
    <g id="propeller" transform="translate(15, 48)">
      <rect x="-1" y="-8" width="2" height="16" fill="#5A6A7A" rx="1"/>
      <rect x="-8" y="-1" width="16" height="2" fill="#5A6A7A" rx="1"/>
      <circle cx="0" cy="0" r="2" fill="#6A7A8A"/>
    </g>
  </g>
  
  <!-- Armamento -->
  <g id="weapons">
    <!-- Cañones frontales -->
    <rect x="100" y="42" width="15" height="3" fill="#3A4A5A" stroke="#2A3A4A" stroke-width="0.5" rx="1"/>
    <rect x="100" y="48" width="15" height="3" fill="#3A4A5A" stroke="#2A3A4A" stroke-width="0.5" rx="1"/>
    <circle cx="115" cy="43.5" r="1.5" fill="#2A3A4A"/>
    <circle cx="115" cy="49.5" r="1.5" fill="#2A3A4A"/>
    
    <!-- Lanzatorpedos -->
    <rect x="85" y="38" width="12" height="4" fill="#4A5A6A" stroke="#2A3A4A" stroke-width="0.5" rx="1"/>
    <rect x="85" y="51" width="12" height="4" fill="#4A5A6A" stroke="#2A3A4A" stroke-width="0.5" rx="1"/>
    <circle cx="97" cy="40" r="2" fill="#1A2A3A"/>
    <circle cx="97" cy="53" r="2" fill="#1A2A3A"/>
  </g>
  
  <!-- Detalles y marcas -->
  <g id="details">
    <!-- Número de identificación -->
    <text x="64" y="50" font-family="Arial" font-size="6" fill="#8A9AAA" text-anchor="middle">X-127</text>
    
    <!-- Luces de navegación -->
    <circle cx="105" cy="45" r="2" fill="#FF6B6B" opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="25" cy="40" r="1.5" fill="#00FA9A" opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="25" cy="56" r="1.5" fill="#FF6B6B" opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Rejillas de ventilación -->
    <rect x="35" y="55" width="8" height="0.5" fill="#1A2A3A" opacity="0.5"/>
    <rect x="35" y="56.5" width="8" height="0.5" fill="#1A2A3A" opacity="0.5"/>
    <rect x="35" y="58" width="8" height="0.5" fill="#1A2A3A" opacity="0.5"/>
    
    <rect x="85" y="55" width="8" height="0.5" fill="#1A2A3A" opacity="0.5"/>
    <rect x="85" y="56.5" width="8" height="0.5" fill="#1A2A3A" opacity="0.5"/>
    <rect x="85" y="58" width="8" height="0.5" fill="#1A2A3A" opacity="0.5"/>
  </g>
  
  <!-- Efectos de brillo metálico -->
  <g id="metallic-shine" opacity="0.3">
    <rect x="30" y="30" width="60" height="15" fill="url(#metalShine)" transform="rotate(-20 60 37)"/>
  </g>
</svg>`,
            width: 128,
            height: 96
        },
        
        // Pez robot enemigo ultra-detallado
        fishEnemy: {
            svg: `
<svg width="96" height="64" viewBox="0 0 96 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fishBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FF8A65;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#FF6B6B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#D84315;stop-opacity:1" />
    </linearGradient>
    
    <radialGradient id="fishEye" cx="30%" cy="30%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#FFE082;stop-opacity:1" />
      <stop offset="60%" style="stop-color:#FFA726;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E65100;stop-opacity:1" />
    </radialGradient>
    
    <pattern id="scales" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="2.5" fill="none" stroke="#D84315" stroke-width="0.3" opacity="0.4"/>
    </pattern>
  </defs>
  
  <!-- Sombra -->
  <ellipse cx="48" cy="36" rx="35" ry="15" fill="black" opacity="0.2" filter="blur(3px)"/>
  
  <!-- Cola -->
  <g id="tail">
    <path d="M 15 32 Q 5 20 2 32 Q 5 44 15 32" fill="#D84315" stroke="#8D2E0F" stroke-width="1"/>
    <path d="M 15 32 Q 8 25 5 32 Q 8 39 15 32" fill="#FF6B6B" opacity="0.7"/>
    <!-- Detalles de la cola -->
    <line x1="10" y1="28" x2="6" y2="25" stroke="#8D2E0F" stroke-width="0.5"/>
    <line x1="10" y1="32" x2="4" y2="32" stroke="#8D2E0F" stroke-width="0.5"/>
    <line x1="10" y1="36" x2="6" y2="39" stroke="#8D2E0F" stroke-width="0.5"/>
  </g>
  
  <!-- Cuerpo principal -->
  <g id="body">
    <ellipse cx="48" cy="32" rx="30" ry="20" fill="url(#fishBody)" stroke="#8D2E0F" stroke-width="1.5"/>
    <ellipse cx="48" cy="32" rx="28" ry="18" fill="url(#scales)"/>
    
    <!-- Línea lateral -->
    <path d="M 20 32 Q 48 30 76 32" stroke="#FF9E80" stroke-width="1" fill="none" opacity="0.6"/>
    
    <!-- Branquias -->
    <path d="M 60 28 Q 62 32 60 36" stroke="#8D2E0F" stroke-width="1" fill="none"/>
    <path d="M 63 28 Q 65 32 63 36" stroke="#8D2E0F" stroke-width="1" fill="none"/>
    <path d="M 66 28 Q 68 32 66 36" stroke="#8D2E0F" stroke-width="1" fill="none"/>
  </g>
  
  <!-- Aletas -->
  <g id="fins">
    <!-- Aleta dorsal -->
    <path d="M 45 12 L 40 8 L 45 10 L 50 8 L 55 10 L 60 8 L 62 12 Q 52 14 45 12" 
          fill="#FF6B6B" stroke="#8D2E0F" stroke-width="1" opacity="0.9"/>
    
    <!-- Aleta pectoral -->
    <ellipse cx="55" cy="35" rx="8" ry="12" fill="#FF8A65" stroke="#8D2E0F" stroke-width="1" 
             transform="rotate(30 55 35)" opacity="0.8"/>
    <line x1="52" y1="30" x2="58" y2="40" stroke="#8D2E0F" stroke-width="0.5"/>
    <line x1="54" y1="29" x2="60" y2="39" stroke="#8D2E0F" stroke-width="0.5"/>
    
    <!-- Aleta ventral -->
    <path d="M 45 52 L 42 56 L 45 54 L 48 56 L 51 54 L 54 56 L 56 52 Q 50 50 45 52" 
          fill="#FF6B6B" stroke="#8D2E0F" stroke-width="1" opacity="0.9"/>
  </g>
  
  <!-- Cabeza -->
  <g id="head">
    <!-- Ojo -->
    <circle cx="70" cy="28" r="6" fill="url(#fishEye)" stroke="#8D2E0F" stroke-width="1"/>
    <circle cx="71" cy="27" r="3" fill="#000000"/>
    <circle cx="72" cy="26" r="1" fill="#FFFFFF" opacity="0.8"/>
    
    <!-- Boca -->
    <path d="M 78 32 Q 75 34 78 36" stroke="#8D2E0F" stroke-width="1.5" fill="none"/>
    
    <!-- Dientes -->
    <path d="M 77 33 L 76 34 L 77 35" fill="#FFFFFF" stroke="#8D2E0F" stroke-width="0.3"/>
    <path d="M 76 34 L 75 35 L 76 36" fill="#FFFFFF" stroke="#8D2E0F" stroke-width="0.3"/>
  </g>
  
  <!-- Detalles mecánicos (pez robot) -->
  <g id="mechanical" opacity="0.6">
    <!-- Panel de acceso -->
    <rect x="35" y="28" width="12" height="8" fill="none" stroke="#8D2E0F" stroke-width="0.5" rx="1"/>
    <circle cx="38" cy="30" r="0.5" fill="#8D2E0F"/>
    <circle cx="44" cy="30" r="0.5" fill="#8D2E0F"/>
    <circle cx="38" cy="34" r="0.5" fill="#8D2E0F"/>
    <circle cx="44" cy="34" r="0.5" fill="#8D2E0F"/>
    
    <!-- Articulaciones -->
    <circle cx="25" cy="32" r="2" fill="none" stroke="#8D2E0F" stroke-width="0.5"/>
    <circle cx="25" cy="32" r="1" fill="#8D2E0F"/>
  </g>
</svg>`,
            width: 96,
            height: 64
        },
        
        // Medusa bioluminiscente ultra-realista
        jellyfishEnemy: {
            svg: `
<svg width="80" height="100" viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="jellyGlow" cx="50%" cy="30%">
      <stop offset="0%" style="stop-color:#E91E63;stop-opacity:0.2" />
      <stop offset="50%" style="stop-color:#9C27B0;stop-opacity:0.4" />
      <stop offset="100%" style="stop-color:#673AB7;stop-opacity:0.1" />
    </radialGradient>
    
    <radialGradient id="jellyBody" cx="50%" cy="40%">
      <stop offset="0%" style="stop-color:#F8BBD0;stop-opacity:0.8" />
      <stop offset="60%" style="stop-color:#E91E63;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#9C27B0;stop-opacity:0.4" />
    </radialGradient>
    
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Aura de resplandor -->
  <ellipse cx="40" cy="35" rx="35" ry="30" fill="url(#jellyGlow)" filter="url(#glow)"/>
  
  <!-- Campana principal -->
  <g id="bell">
    <ellipse cx="40" cy="35" rx="25" ry="20" fill="url(#jellyBody)" stroke="#9C27B0" stroke-width="0.5"/>
    
    <!-- Patrón interno -->
    <ellipse cx="40" cy="35" rx="20" ry="16" fill="none" stroke="#E91E63" stroke-width="0.3" opacity="0.5"/>
    <ellipse cx="40" cy="35" rx="15" ry="12" fill="none" stroke="#E91E63" stroke-width="0.3" opacity="0.4"/>
    <ellipse cx="40" cy="35" rx="10" ry="8" fill="none" stroke="#E91E63" stroke-width="0.3" opacity="0.3"/>
    
    <!-- Puntos bioluminiscentes -->
    <circle cx="30" cy="30" r="2" fill="#FFFFFF" opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="50" cy="30" r="2" fill="#FFFFFF" opacity="0.8">
      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="40" cy="25" r="1.5" fill="#F8BBD0" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="35" cy="35" r="1" fill="#F8BBD0" opacity="0.7">
      <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="45" cy="35" r="1" fill="#F8BBD0" opacity="0.7">
      <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite"/>
    </circle>
  </g>
  
  <!-- Tentáculos -->
  <g id="tentacles" opacity="0.7">
    <!-- Tentáculo 1 -->
    <path d="M 25 50 Q 23 60 25 70 Q 27 80 25 90" 
          stroke="#E91E63" stroke-width="3" fill="none" stroke-linecap="round">
      <animate attributeName="d" 
               values="M 25 50 Q 23 60 25 70 Q 27 80 25 90;
                       M 25 50 Q 27 60 25 70 Q 23 80 25 90;
                       M 25 50 Q 23 60 25 70 Q 27 80 25 90"
               dur="4s" repeatCount="indefinite"/>
    </path>
    
    <!-- Tentáculo 2 -->
    <path d="M 32 52 Q 31 62 32 72 Q 33 82 32 92" 
          stroke="#9C27B0" stroke-width="2.5" fill="none" stroke-linecap="round">
      <animate attributeName="d" 
               values="M 32 52 Q 31 62 32 72 Q 33 82 32 92;
                       M 32 52 Q 33 62 32 72 Q 31 82 32 92;
                       M 32 52 Q 31 62 32 72 Q 33 82 32 92"
               dur="3.5s" repeatCount="indefinite"/>
    </path>
    
    <!-- Tentáculo 3 -->
    <path d="M 40 53 Q 40 63 40 73 Q 40 83 40 93" 
          stroke="#E91E63" stroke-width="3" fill="none" stroke-linecap="round">
      <animate attributeName="d" 
               values="M 40 53 Q 40 63 40 73 Q 40 83 40 93;
                       M 40 53 Q 38 63 40 73 Q 42 83 40 93;
                       M 40 53 Q 40 63 40 73 Q 40 83 40 93"
               dur="3s" repeatCount="indefinite"/>
    </path>
    
    <!-- Tentáculo 4 -->
    <path d="M 48 52 Q 49 62 48 72 Q 47 82 48 92" 
          stroke="#9C27B0" stroke-width="2.5" fill="none" stroke-linecap="round">
      <animate attributeName="d" 
               values="M 48 52 Q 49 62 48 72 Q 47 82 48 92;
                       M 48 52 Q 47 62 48 72 Q 49 82 48 92;
                       M 48 52 Q 49 62 48 72 Q 47 82 48 92"
               dur="3.8s" repeatCount="indefinite"/>
    </path>
    
    <!-- Tentáculo 5 -->
    <path d="M 55 50 Q 57 60 55 70 Q 53 80 55 90" 
          stroke="#E91E63" stroke-width="3" fill="none" stroke-linecap="round">
      <animate attributeName="d" 
               values="M 55 50 Q 57 60 55 70 Q 53 80 55 90;
                       M 55 50 Q 53 60 55 70 Q 57 80 55 90;
                       M 55 50 Q 57 60 55 70 Q 53 80 55 90"
               dur="4.2s" repeatCount="indefinite"/>
    </path>
    
    <!-- Tentáculos secundarios más delgados -->
    <path d="M 28 48 Q 26 58 28 68 Q 30 78 28 88" 
          stroke="#F8BBD0" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M 36 49 Q 35 59 36 69 Q 37 79 36 89" 
          stroke="#F8BBD0" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M 44 49 Q 45 59 44 69 Q 43 79 44 89" 
          stroke="#F8BBD0" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
    <path d="M 52 48 Q 54 58 52 68 Q 50 78 52 88" 
          stroke="#F8BBD0" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
  </g>
  
  <!-- Partículas bioluminiscentes -->
  <g id="particles">
    <circle cx="20" cy="60" r="1" fill="#FFFFFF" opacity="0.6">
      <animate attributeName="cy" values="60;55;60" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="60" cy="65" r="1" fill="#F8BBD0" opacity="0.5">
      <animate attributeName="cy" values="65;60;65" dur="2.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="35" cy="70" r="0.5" fill="#FFFFFF" opacity="0.4">
      <animate attributeName="cy" values="70;65;70" dur="1.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="45" cy="75" r="0.5" fill="#F8BBD0" opacity="0.4">
      <animate attributeName="cy" values="75;70;75" dur="2.2s" repeatCount="indefinite"/>
    </circle>
  </g>
</svg>`,
            width: 80,
            height: 100
        }
    },
    
    // Función para crear canvas de alta calidad
    createHighQualityCanvas: function(width, height, scale = 2) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Configurar alta resolución
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        // Escalar el contexto para alta calidad
        ctx.scale(scale, scale);
        
        // Activar antialiasing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        return { canvas, ctx };
    },
    
    // Función para renderizar SVG a canvas con efectos
    renderSVGToCanvas: function(svgString, width, height, effects = {}) {
        return new Promise((resolve) => {
            const { canvas, ctx } = this.createHighQualityCanvas(width, height);
            
            const img = new Image();
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            img.onload = () => {
                // Aplicar sombra si está habilitada
                if (effects.shadow) {
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    ctx.shadowBlur = 10;
                    ctx.shadowOffsetX = 5;
                    ctx.shadowOffsetY = 5;
                }
                
                // Dibujar la imagen
                ctx.drawImage(img, 0, 0, width, height);
                
                // Aplicar efectos post-procesado
                if (effects.glow) {
                    this.applyGlowEffect(ctx, width, height, effects.glowColor);
                }
                
                if (effects.metallic) {
                    this.applyMetallicEffect(ctx, width, height);
                }
                
                URL.revokeObjectURL(url);
                resolve(canvas);
            };
            
            img.src = url;
        });
    },
    
    // Efecto de resplandor
    applyGlowEffect: function(ctx, width, height, color = '#00FFFF') {
        const imageData = ctx.getImageData(0, 0, width * 2, height * 2);
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = width * 2;
        tempCanvas.height = height * 2;
        
        tempCtx.filter = 'blur(4px)';
        tempCtx.putImageData(imageData, 0, 0);
        
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.5;
        ctx.drawImage(tempCanvas, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    },
    
    // Efecto metálico
    applyMetallicEffect: function(ctx, width, height) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
    },
    
    // Cargar todos los sprites
    loadAllSprites: async function() {
        console.log('Cargando sprites ultra-realistas...');
        
        for (let key in this.sprites) {
            const sprite = this.sprites[key];
            const effects = {
                shadow: true,
                glow: key.includes('jellyfish'),
                metallic: key.includes('player') || key.includes('shark'),
                glowColor: key.includes('jellyfish') ? '#E91E63' : '#00FFFF'
            };
            
            this.cache[key] = await this.renderSVGToCanvas(
                sprite.svg,
                sprite.width,
                sprite.height,
                effects
            );
        }
        
        console.log('Sprites ultra-realistas cargados correctamente');
        return true;
    },
    
    // Dibujar sprite con efectos dinámicos
    drawSprite: function(ctx, spriteName, x, y, angle = 0, scale = 1, effects = {}) {
        const canvas = this.cache[spriteName];
        if (!canvas) return;
        
        ctx.save();
        
        // Aplicar transformaciones
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(scale, scale);
        
        // Aplicar efectos dinámicos
        if (effects.damaged) {
            ctx.filter = 'hue-rotate(20deg) brightness(0.8)';
        }
        
        if (effects.powered) {
            ctx.shadowColor = effects.powerColor || '#00FFFF';
            ctx.shadowBlur = 20;
        }
        
        if (effects.opacity !== undefined) {
            ctx.globalAlpha = effects.opacity;
        }
        
        // Dibujar el sprite
        const sprite = this.sprites[spriteName];
        ctx.drawImage(
            canvas,
            -sprite.width/2 * scale,
            -sprite.height/2 * scale,
            sprite.width * scale,
            sprite.height * scale
        );
        
        // Efectos adicionales
        if (effects.shield) {
            this.drawShieldEffect(ctx, sprite.width * scale, sprite.height * scale, effects.shieldColor);
        }
        
        ctx.restore();
    },
    
    // Efecto de escudo
    drawShieldEffect: function(ctx, width, height, color = '#00FFFF') {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.6, height * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    },
    
    // Animar hélices y partes móviles
    animatePropeller: function(ctx, x, y, angle, speed = 0.3) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // Dibujar hélice animada
        const bladeAngle = Date.now() * speed;
        ctx.rotate(bladeAngle);
        
        ctx.fillStyle = '#5A6A7A';
        ctx.globalAlpha = 0.8;
        
        // Aspas de la hélice con efecto de movimiento
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.fillRect(-1, -8, 2, 16);
        }
        
        // Centro de la hélice
        ctx.fillStyle = '#6A7A8A';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
};

// Exportar para uso en el juego
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealisticSprites;
}