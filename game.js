// Configuración del juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Incluir el script de sprites
const script = document.createElement('script');
script.src = 'assets/sprites.js';
document.head.appendChild(script);

// Incluir el sistema del mercader
const merchantScript = document.createElement('script');
merchantScript.src = 'assets/merchant-system.js';
document.head.appendChild(merchantScript);

// Incluir el sistema de evolución de la nave
const evolutionScript = document.createElement('script');
evolutionScript.src = 'assets/ship-evolution.js';
document.head.appendChild(evolutionScript);

// Incluir sprites realistas de alta calidad
const realisticScript = document.createElement('script');
realisticScript.src = 'assets/realistic-sprites.js';
document.head.appendChild(realisticScript);

// Incluir sistema de jefes
const bossScript = document.createElement('script');
bossScript.src = 'assets/boss-system.js';
document.head.appendChild(bossScript);

// Incluir sistema de mascotas
const petScript = document.createElement('script');
petScript.src = 'assets/pet-system.js';
document.head.appendChild(petScript);

// Incluir sistemas avanzados del juego
const systemsScript = document.createElement('script');
systemsScript.src = 'assets/game-systems.js';
document.head.appendChild(systemsScript);

// Incluir sprites realistas de enemigos
const enemySpritesScript = document.createElement('script');
enemySpritesScript.src = 'assets/enemy-sprites.js';
document.head.appendChild(enemySpritesScript);

// Variables del juego
let gameState = {
    player: null,
    enemies: [],
    projectiles: [],
    gems: [],
    particles: [],
    bubbles: [],
    merchantStations: [],
    boss: null,
    pets: [],
    specialEffects: [],
    mouse: { x: canvas.width/2, y: canvas.height/2 },
    selectedTarget: null,
    gameRunning: true,
    camera: { x: 0, y: 0 },
    keys: {},
    spritesLoaded: false,
    realisticSpritesLoaded: false,
    stats: {
        enemiesDefeated: 0,
        totalDamageDealt: 0,
        totalDistanceTraveled: 0,
        bossesDefeated: []
    }
};

// Sistema de burbujas para el fondo
class Bubble {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 15 + 5;
        this.speed = (20 - this.size) * 0.1 + 0.5;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        this.opacity = Math.random() * 0.3 + 0.1;
    }
    
    update() {
        this.y -= this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;
        
        if (this.y < -this.size) {
            this.reset();
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Burbuja principal
        const gradient = ctx.createRadialGradient(
            this.x - this.size * 0.3, this.y - this.size * 0.3, 0,
            this.x, this.y, this.size
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(173, 216, 230, 0.4)');
        gradient.addColorStop(1, 'rgba(135, 206, 235, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Brillo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Nombres aleatorios para criaturas marinas
const enemyNames = [
    'Barracuda', 'Tiburón', 'Manta', 'Pulpo', 'Calamar', 'Medusa', 'Pez Globo',
    'Morena', 'Piraña', 'Angula', 'Pez Espada', 'Marlín', 'Atún', 'Delfín',
    'Orca', 'Ballena', 'Tortuga', 'Cangrejo', 'Langosta', 'Camarón', 'Estrella',
    'Erizo', 'Coral', 'Anémona', 'Nautilus', 'Sepia', 'Pez Payaso', 'Pez Ángel'
];

// Tablas de experiencia y nivel
const levelTable = {
    getExpRequired: (level) => Math.floor(100 * Math.pow(1.5, level - 1)),
    getExpGiven: (enemyLevel, playerLevel) => {
        const baseDiff = enemyLevel - playerLevel;
        const baseExp = Math.floor(50 * Math.pow(1.3, enemyLevel - 1));
        if (baseDiff < -5) return Math.max(1, Math.floor(baseExp * 0.1));
        if (baseDiff < 0) return Math.floor(baseExp * (1 + baseDiff * 0.1));
        return Math.floor(baseExp * (1 + baseDiff * 0.15));
    }
};

// Clase Jugador (Nave Submarina Avanzada)
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.level = 1;
        this.health = 100;
        this.maxHealth = 100;
        this.exp = 0;
        this.expRequired = levelTable.getExpRequired(1);
        this.gems = 0;
        this.speed = 4;
        this.size = 25;
        this.angle = 0;
        
        // Stats de combate (daño reducido al principio)
        this.damage = 10; // Reducido de 20 a 10
        this.baseDamage = 10; // Daño base del arma equipada
        this.attackSpeed = 800; // Más rápido
        this.range = 200; // Mayor rango
        this.lastAttack = 0;
        this.healthRegen = 0; // Regeneración de vida por segundo
        this.lastRegen = Date.now();
        
        // Mejoras
        this.upgrades = {
            shield: 0,
            weapon: 0,
            speed: 0,
            movement: 0
        };
        
        // Animación
        this.propellerAngle = 0;
        this.targetAngle = 0;
        
        // Visuales del equipo
        this.weaponVisual = null;
        this.shieldVisual = null;
        this.engineVisual = null;
    }
    
    update() {
        // Movimiento con teclado (WASD)
        let dx = 0, dy = 0;
        
        if (gameState.keys['w'] || gameState.keys['W']) dy -= 1;
        if (gameState.keys['s'] || gameState.keys['S']) dy += 1;
        if (gameState.keys['a'] || gameState.keys['A']) dx -= 1;
        if (gameState.keys['d'] || gameState.keys['D']) dx += 1;
        
        // Normalizar movimiento diagonal
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        
        // Aplicar movimiento
        const speed = this.speed * (1 + this.upgrades.movement * 0.2);
        this.x += dx * speed;
        this.y += dy * speed;
        
        // Actualizar ángulo hacia el mouse
        const mouseWorldX = gameState.mouse.x + gameState.camera.x;
        const mouseWorldY = gameState.mouse.y + gameState.camera.y;
        this.targetAngle = Math.atan2(mouseWorldY - this.y, mouseWorldX - this.x);
        
        // Suavizar rotación
        let angleDiff = this.targetAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        this.angle += angleDiff * 0.1;
        
        this.propellerAngle += 0.3;
        
        // Actualizar cámara para seguir al jugador (mapa infinito mejorado)
        const cameraLerpSpeed = 0.1;
        gameState.camera.x += (this.x - canvas.width / 2 - gameState.camera.x) * cameraLerpSpeed;
        gameState.camera.y += (this.y - canvas.height / 2 - gameState.camera.y) * cameraLerpSpeed;
        
        // Regeneración de vida
        if (this.healthRegen > 0 && Date.now() - this.lastRegen > 1000) {
            this.health = Math.min(this.maxHealth, this.health + this.healthRegen);
            this.lastRegen = Date.now();
            this.updateUI();
        }
        
        // Ataque automático al objetivo seleccionado
        this.autoAttack();
    }
    
    selectTarget() {
        // Buscar enemigo más cercano al jugador
        let closestEnemy = null;
        let closestDistance = this.range;
        
        for (let enemy of gameState.enemies) {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        }
        
        gameState.selectedTarget = closestEnemy;
        
        // Efecto visual de selección
        if (closestEnemy) {
            for (let i = 0; i < 5; i++) {
                gameState.particles.push(new Particle(closestEnemy.x, closestEnemy.y, 'selection'));
            }
        }
    }
    
    autoAttack() {
        if (!gameState.selectedTarget || Date.now() - this.lastAttack < this.attackSpeed / (1 + this.upgrades.speed * 0.15)) {
            return;
        }
        
        const target = gameState.selectedTarget;
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Verificar si el objetivo sigue vivo
        if (!gameState.enemies.includes(target)) {
            gameState.selectedTarget = null;
            return;
        }
        
        if (distance <= this.range) {
            // Usar el daño del arma equipada
            const weaponDamage = this.baseDamage || this.damage;
            const totalDamage = weaponDamage * (1 + this.upgrades.weapon * 0.25);
            const projectile = new Projectile(this.x, this.y, target.x, target.y, totalDamage);
            
            // Aplicar visual del arma si existe
            if (window.MerchantSystem) {
                const weapon = window.MerchantSystem.getEquippedItem('weapon');
                if (weapon && weapon.visual) {
                    projectile.visual = weapon.visual;
                }
            }
            
            gameState.projectiles.push(projectile);
            this.lastAttack = Date.now();
            
            // Crear burbujas al disparar
            for (let i = 0; i < 3; i++) {
                gameState.particles.push(new Particle(this.x, this.y, 'bubble'));
            }
        }
    }
    
    takeDamage(amount) {
        // Verificar invulnerabilidad
        if (this.invulnerable && Date.now() < this.invulnerableTime) {
            return; // No recibir daño si es invulnerable
        }
        
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            
            // Usar sistema de respawn en lugar de game over
            if (window.RespawnSystem) {
                window.RespawnSystem.respawn(this);
                gameState.gameRunning = true; // Mantener el juego activo
            } else {
                gameState.gameRunning = false;
                alert('¡Has sido derrotado! Recarga la página para intentar de nuevo.');
            }
        }
        this.updateUI();
    }
    
    gainExp(amount) {
        this.exp += amount;
        
        while (this.exp >= this.expRequired) {
            this.exp -= this.expRequired;
            this.levelUp();
        }
        
        this.updateUI();
    }
    
    levelUp() {
        this.level++;
        this.expRequired = levelTable.getExpRequired(this.level);
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.damage += 5;
        
        // Crear checkpoint cada 5 niveles
        if (this.level % 5 === 0 && window.RespawnSystem) {
            window.RespawnSystem.createCheckpoint(this);
        }
        
        // Desbloquear ultimate en nivel 5
        if (this.level === 5 && window.UltimateSystem && !window.UltimateSystem.selectedUltimate) {
            this.showUltimateSelection();
        }
        
        // Mostrar panel de mejoras
        document.getElementById('upgradePanel').style.display = 'block';
        gameState.gameRunning = false;
    }
    
    updateUI() {
        document.getElementById('playerLevel').textContent = this.level;
        document.getElementById('playerHealth').textContent = Math.floor(this.health);
        document.getElementById('playerMaxHealth').textContent = this.maxHealth;
        document.getElementById('playerExp').textContent = Math.floor(this.exp);
        document.getElementById('playerExpNext').textContent = this.expRequired;
        document.getElementById('playerGems').textContent = this.gems;
    }
    
    showUltimateSelection() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            padding: 30px;
            border-radius: 20px;
            max-width: 800px;
            color: white;
        `;
        
        content.innerHTML = `
            <h2 style="text-align: center; color: #FFD700; margin-bottom: 20px;">
                ¡ELIGE TU HABILIDAD ULTIMATE!
            </h2>
            <div id="ultimateButtons" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Agregar botones de ultimates
        const buttonsContainer = document.getElementById('ultimateButtons');
        if (window.UltimateSystem) {
            window.UltimateSystem.availableUltimates.forEach(ult => {
                const btn = document.createElement('button');
                btn.style.cssText = `
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: none;
                    padding: 15px;
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                    transition: transform 0.3s;
                `;
                btn.innerHTML = `
                    <div style="font-size: 30px;">${ult.icon}</div>
                    <div style="font-weight: bold; margin: 10px 0;">${ult.name}</div>
                    <div style="font-size: 12px; opacity: 0.9;">${ult.description}</div>
                    <div style="margin-top: 10px; font-size: 11px;">
                        Cooldown: ${ult.cooldown/1000}s | Tecla: R
                    </div>
                `;
                btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
                btn.onmouseout = () => btn.style.transform = 'scale(1)';
                btn.onclick = () => {
                    window.UltimateSystem.selectUltimate(ult.id);
                    modal.remove();
                };
                buttonsContainer.appendChild(btn);
            });
        }
    }
    
    draw() {
        const screenX = this.x - gameState.camera.x;
        const screenY = this.y - gameState.camera.y;
        
        // Usar sprites realistas si están disponibles
        if (gameState.realisticSpritesLoaded && window.RealisticSprites) {
            const effects = {
                damaged: this.health < this.maxHealth * 0.5,
                powered: this.level > 10,
                powerColor: this.level > 15 ? '#FFD700' : '#00FFFF',
                shield: this.shieldVisual && this.shieldVisual.color,
                shieldColor: this.shieldVisual ? this.shieldVisual.color : '#00FFFF'
            };
            
            window.RealisticSprites.drawSprite(
                ctx, 
                'playerSubmarine', 
                screenX, 
                screenY, 
                this.angle, 
                1 + (this.level * 0.02), // Escala según nivel
                effects
            );
            
            // Animar hélices
            window.RealisticSprites.animatePropeller(
                ctx,
                screenX - Math.cos(this.angle) * 45,
                screenY - Math.sin(this.angle) * 45,
                this.angle,
                0.3 + this.speed * 0.05
            );
            
            // No dibujar más si usamos sprites realistas
            ctx.restore();
            this.drawHealthBar(screenX, screenY);
            this.drawTargetIndicator();
            return;
        }
        
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.angle);
        
        // Si los sprites normales están cargados, usar la imagen
        if (gameState.spritesLoaded && window.GameSprites && window.GameSprites.get('playerSub')) {
            const img = window.GameSprites.get('playerSub');
            ctx.drawImage(img, -img.width/2, -img.height/2);
        } else {
            // Dibujar nave submarina avanzada manualmente
            // Cuerpo principal
            ctx.fillStyle = '#2565A3';
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 1.4, this.size * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#1A457D';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Franja metálica central
            ctx.fillStyle = 'rgba(74, 144, 226, 0.7)';
            ctx.fillRect(-this.size * 1.2, -2, this.size * 2.4, 4);
            
            // Cabina principal
            ctx.fillStyle = 'rgba(90, 163, 214, 0.8)';
            ctx.beginPath();
            ctx.ellipse(this.size * 0.3, 0, this.size * 0.6, this.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Ventanas de la cabina
            ctx.fillStyle = '#A8DADC';
            ctx.strokeStyle = '#336699';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.size * 0.1, 0, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.size * 0.5, 0, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Aletas estabilizadoras
            ctx.fillStyle = '#1A457D';
            ctx.beginPath();
            ctx.moveTo(-this.size * 1.2, 0);
            ctx.lineTo(-this.size * 1.5, -this.size * 0.4);
            ctx.lineTo(-this.size * 1.3, 0);
            ctx.lineTo(-this.size * 1.5, this.size * 0.4);
            ctx.closePath();
            ctx.fill();
            
            // Propulsores con animación
            ctx.save();
            ctx.translate(-this.size * 1.3, 0);
            ctx.rotate(this.propellerAngle);
            ctx.fillStyle = '#457B9D';
            ctx.fillRect(-6, -1, 12, 2);
            ctx.fillRect(-1, -6, 2, 12);
            ctx.restore();
            
            // Cañones de torpedos
            ctx.fillStyle = '#336699';
            ctx.fillRect(this.size * 0.8, -this.size * 0.3, this.size * 0.4, 3);
            ctx.fillRect(this.size * 0.8, this.size * 0.2, this.size * 0.4, 3);
            
            // Luces de navegación
            ctx.fillStyle = 'rgba(255, 107, 107, 0.9)';
            ctx.beginPath();
            ctx.arc(this.size * 1.2, 0, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(0, 250, 154, 0.8)';
            ctx.beginPath();
            ctx.arc(-this.size * 0.8, -this.size * 0.3, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 107, 107, 0.8)';
            ctx.beginPath();
            ctx.arc(-this.size * 0.8, this.size * 0.3, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Indicador de objetivo seleccionado
        if (gameState.selectedTarget) {
            ctx.strokeStyle = '#00FA9A';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(this.size, 0);
            const dx = gameState.selectedTarget.x - this.x;
            const dy = gameState.selectedTarget.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= this.range) {
                const lineEndX = Math.cos(Math.atan2(dy, dx) - this.angle) * Math.min(dist, 100);
                const lineEndY = Math.sin(Math.atan2(dy, dx) - this.angle) * Math.min(dist, 100);
                ctx.lineTo(lineEndX, lineEndY);
                ctx.stroke();
            }
            ctx.setLineDash([]);
        }
        
        ctx.restore();
        
        this.drawHealthBar(screenX, screenY);
        this.drawTargetIndicator();
    }
    
    drawHealthBar(screenX, screenY) {
        // Barra de vida
        const barWidth = 50;
        const barHeight = 5;
        const barY = screenY - this.size - 20;
        const barX = screenX - barWidth / 2;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#00FA9A' : healthPercent > 0.25 ? '#FFD700' : '#FF6B6B';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }
    
    drawTargetIndicator() {
        const screenX = this.x - gameState.camera.x;
        const screenY = this.y - gameState.camera.y;
        
        // Indicador de rango de ataque
        if (gameState.selectedTarget) {
            ctx.strokeStyle = 'rgba(0, 250, 154, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.range, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// Clase Enemigo (Criaturas Marinas)
class Enemy {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.name = enemyNames[Math.floor(Math.random() * enemyNames.length)] + ' Nv.' + level;
        
        // Stats basados en nivel (daño reducido)
        this.maxHealth = 30 + level * 15; // Reducido
        this.health = this.maxHealth;
        this.damage = 5 + level * 2; // Reducido significativamente
        this.speed = 0.8 + level * 0.08;
        this.size = 15 + level * 0.5;
        this.attackRange = 50;
        this.attackSpeed = 2500 - level * 50; // Más lento
        this.lastAttack = 0;
        
        // Tipo de criatura basado en nivel
        this.type = this.getCreatureType(level);
        this.angle = Math.random() * Math.PI * 2;
        this.animationPhase = Math.random() * Math.PI * 2;
    }
    
    getCreatureType(level) {
        if (level <= 5) return 'fish';
        if (level <= 10) return 'jellyfish';
        if (level <= 15) return 'shark';
        return 'octopus';
    }
    
    update() {
        const player = gameState.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Movimiento ondulante
        this.animationPhase += 0.1;
        const wobble = Math.sin(this.animationPhase) * 0.3;
        
        if (distance > this.attackRange) {
            this.x += (dx / distance) * this.speed + Math.sin(this.animationPhase) * 0.5;
            this.y += (dy / distance) * this.speed + Math.cos(this.animationPhase) * 0.5;
        }
        
        this.angle = Math.atan2(dy, dx);
        
        // Atacar al jugador
        if (distance <= this.attackRange && Date.now() - this.lastAttack > this.attackSpeed) {
            player.takeDamage(this.damage);
            this.lastAttack = Date.now();
            
            // Efecto de ataque (burbujas)
            for (let i = 0; i < 5; i++) {
                gameState.particles.push(new Particle(this.x, this.y, 'attack'));
            }
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        if (this.health <= 0) {
            // Dar experiencia
            gameState.player.gainExp(levelTable.getExpGiven(this.level, gameState.player.level));
            
            // Nuevo sistema de drops mejorado
            if (window.EconomyBalance) {
                const drops = window.EconomyBalance.generateDrop(this, gameState.player);
                drops.forEach(drop => {
                    if (drop.type === 'gem' || drop.type === 'rareGem') {
                        const gem = new Gem(this.x, this.y, this.level);
                        gem.value = drop.value;
                        gem.isRare = drop.type === 'rareGem';
                        gameState.gems.push(gem);
                    } else if (drop.type === 'chest') {
                        // Crear cofre del tesoro
                        const chest = new Gem(this.x, this.y, this.level);
                        chest.value = drop.value;
                        chest.isChest = true;
                        gameState.gems.push(chest);
                    }
                });
            } else {
                // Sistema antiguo como fallback
                if (Math.random() < 0.5) {
                    gameState.gems.push(new Gem(this.x, this.y, this.level));
                }
            }
            
            // Efecto de muerte (muchas burbujas)
            for (let i = 0; i < 10; i++) {
                gameState.particles.push(new Particle(this.x, this.y, 'death'));
            }
            
            // Si este era el objetivo seleccionado, limpiar selección
            if (gameState.selectedTarget === this) {
                gameState.selectedTarget = null;
            }
            
            // Actualizar estadísticas
            gameState.stats.enemiesDefeated++;
            
            return false;
        }
        
        // Efecto de daño (pocas burbujas)
        for (let i = 0; i < 3; i++) {
            gameState.particles.push(new Particle(this.x, this.y, 'hit'));
        }
        
        return true;
    }
    
    draw() {
        // Usar el nuevo sistema de sprites ultra-realistas si está disponible
        if (window.EnemySprites) {
            window.EnemySprites.drawEnemy(ctx, this);
            return;
        }
        
        // Fallback al sistema anterior
        const screenX = this.x - gameState.camera.x;
        const screenY = this.y - gameState.camera.y;
        
        // Solo dibujar si está en pantalla
        if (screenX < -50 || screenX > canvas.width + 50 || 
            screenY < -50 || screenY > canvas.height + 50) {
            return;
        }
        
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.angle);
        
        // Dibujar según el tipo de criatura
        this.drawCreature();
        
        ctx.restore();
        
        // Indicador de selección
        if (gameState.selectedTarget === this) {
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.size + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Marcador de objetivo
            ctx.fillStyle = '#FF6B6B';
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + Date.now() * 0.002;
                const x = screenX + Math.cos(angle) * (this.size + 15);
                const y = screenY + Math.sin(angle) * (this.size + 15);
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Barra de vida
        const barWidth = 30;
        const barHeight = 3;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(screenX - barWidth/2, screenY - this.size - 10, barWidth, barHeight);
        
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#00FA9A' : healthPercent > 0.25 ? '#FFD700' : '#FF6B6B';
        ctx.fillRect(screenX - barWidth/2, screenY - this.size - 10, barWidth * healthPercent, barHeight);
        
        // Nombre y nivel
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, screenX, screenY - this.size - 15);
    }
    
    drawCreature() {
        // Usar sprites realistas si están disponibles
        if (gameState.realisticSpritesLoaded && window.RealisticSprites) {
            let spriteName = null;
            const effects = {
                damaged: this.health < this.maxHealth * 0.5,
                opacity: gameState.selectedTarget === this ? 1 : 0.9
            };
            
            switch(this.type) {
                case 'fish': 
                    spriteName = 'fishEnemy';
                    effects.powerColor = '#FF6B6B';
                    break;
                case 'jellyfish': 
                    spriteName = 'jellyfishEnemy';
                    effects.powered = true;
                    effects.powerColor = '#E91E63';
                    break;
                case 'shark': 
                    spriteName = 'fishEnemy'; // Usar fish por ahora
                    effects.powerColor = '#495057';
                    break;
                case 'octopus': 
                    spriteName = 'jellyfishEnemy'; // Usar jellyfish por ahora
                    effects.powered = true;
                    effects.powerColor = '#9C27B0';
                    break;
            }
            
            if (spriteName) {
                const scale = 0.5 + (this.level * 0.02);
                window.RealisticSprites.drawSprite(
                    ctx,
                    spriteName,
                    0, 0,
                    0,
                    scale,
                    effects
                );
                return;
            }
        }
        
        // Usar sprites normales si están cargados
        if (gameState.spritesLoaded && window.GameSprites) {
            let spriteName = null;
            switch(this.type) {
                case 'fish': spriteName = 'fishSmall'; break;
                case 'jellyfish': spriteName = 'jellyfish'; break;
                case 'shark': spriteName = 'shark'; break;
                case 'octopus': spriteName = 'octopus'; break;
            }
            
            const img = window.GameSprites.get(spriteName);
            if (img) {
                const scale = this.size / 20;
                ctx.scale(scale, scale);
                ctx.drawImage(img, -img.width/2, -img.height/2);
                return;
            }
        }
        
        // Dibujo manual si no hay sprites
        switch(this.type) {
            case 'fish':
                this.drawFish();
                break;
            case 'jellyfish':
                this.drawJellyfish();
                break;
            case 'shark':
                this.drawShark();
                break;
            case 'octopus':
                this.drawOctopus();
                break;
        }
    }
    
    drawFish() {
        // Cuerpo
        ctx.fillStyle = `hsl(${this.level * 20}, 70%, 50%)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cola
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(-this.size * 1.5, -this.size * 0.5);
        ctx.lineTo(-this.size * 1.5, this.size * 0.5);
        ctx.closePath();
        ctx.fill();
        
        // Ojo
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.size * 0.5, -this.size * 0.2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.size * 0.5, -this.size * 0.2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Aleta
        const finWave = Math.sin(this.animationPhase) * 0.2;
        ctx.fillStyle = `hsla(${this.level * 20}, 70%, 40%, 0.8)`;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.6);
        ctx.lineTo(-this.size * 0.3, -this.size * (0.9 + finWave));
        ctx.lineTo(this.size * 0.3, -this.size * (0.9 - finWave));
        ctx.closePath();
        ctx.fill();
    }
    
    drawJellyfish() {
        // Campana semi-transparente
        ctx.fillStyle = `hsla(${280 + this.level * 5}, 60%, 60%, 0.6)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tentáculos ondulantes
        ctx.strokeStyle = `hsla(${280 + this.level * 5}, 60%, 50%, 0.7)`;
        ctx.lineWidth = 2;
        for (let i = -3; i <= 3; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 4, this.size * 0.5);
            const wave = Math.sin(this.animationPhase + i) * 5;
            ctx.quadraticCurveTo(
                i * 4 + wave, this.size * 1.2,
                i * 4 - wave, this.size * 1.8
            );
            ctx.stroke();
        }
        
        // Puntos bioluminiscentes
        ctx.fillStyle = 'rgba(255, 200, 220, 0.8)';
        ctx.beginPath();
        ctx.arc(-this.size * 0.3, 0, 2, 0, Math.PI * 2);
        ctx.arc(this.size * 0.3, 0, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawShark() {
        // Cuerpo
        ctx.fillStyle = '#495057';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 1.3, this.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Aleta dorsal
        ctx.fillStyle = '#212529';
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.7);
        ctx.lineTo(-this.size * 0.3, -this.size * 1.2);
        ctx.lineTo(this.size * 0.3, -this.size * 1.2);
        ctx.closePath();
        ctx.fill();
        
        // Cola
        ctx.beginPath();
        ctx.moveTo(-this.size * 1.3, 0);
        ctx.lineTo(-this.size * 1.8, -this.size * 0.6);
        ctx.lineTo(-this.size * 1.8, this.size * 0.6);
        ctx.closePath();
        ctx.fill();
        
        // Boca con dientes
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.size * 0.8, this.size * 0.2, this.size * 0.3, 0, Math.PI);
        ctx.stroke();
        
        // Ojo
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.size * 0.5, -this.size * 0.2, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawOctopus() {
        // Cabeza
        ctx.fillStyle = '#6C5CE7';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tentáculos
        ctx.strokeStyle = '#6C5CE7';
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI - Math.PI/2;
            const wave = Math.sin(this.animationPhase + i * 0.5) * 10;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * this.size * 0.5, Math.sin(angle) * this.size * 0.5);
            ctx.quadraticCurveTo(
                Math.cos(angle) * (this.size + wave), 
                Math.sin(angle) * (this.size + wave) + this.size,
                Math.cos(angle) * this.size * 0.8 + wave * 0.5, 
                Math.sin(angle) * this.size + this.size * 1.5
            );
            ctx.stroke();
        }
        
        // Ojos
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(-this.size * 0.3, -this.size * 0.1, 4, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(this.size * 0.3, -this.size * 0.1, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(-this.size * 0.3, 0, 2, 0, Math.PI * 2);
        ctx.arc(this.size * 0.3, 0, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Clase Proyectil (Torpedo de burbujas)
class Projectile {
    constructor(x, y, targetX, targetY, damage) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.vx = (dx / distance) * 10;
        this.vy = (dy / distance) * 10;
        this.angle = Math.atan2(dy, dx);
        this.lifetime = 100;
        this.trail = [];
        
        // Visual del arma (se asigna desde el jugador)
        this.visual = null;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.lifetime--;
        
        // Agregar posición al rastro
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > 10) {
            this.trail.shift();
        }
        
        // Verificar colisión con enemigos
        for (let enemy of gameState.enemies) {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < enemy.size) {
                if (!enemy.takeDamage(this.damage)) {
                    gameState.enemies = gameState.enemies.filter(e => e !== enemy);
                }
                return false;
            }
        }
        
        return this.lifetime > 0;
    }
    
    draw() {
        const screenX = this.x - gameState.camera.x;
        const screenY = this.y - gameState.camera.y;
        
        // Obtener visual del arma
        const v = this.visual || {
            color: '#74C0FC',
            size: 6,
            trail: 5,
            glow: false
        };
        
        // Efecto de resplandor si el arma lo tiene
        if (v.glow) {
            ctx.save();
            ctx.globalAlpha = 0.6;
            const glowGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, v.size * 3);
            glowGradient.addColorStop(0, v.glowColor || v.color);
            glowGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(screenX, screenY, v.size * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Dibujar rastro de burbujas mejorado
        this.trail.forEach((pos, index) => {
            ctx.save();
            ctx.globalAlpha = index / this.trail.length * 0.7;
            ctx.fillStyle = v.color;
            const trailSize = (v.trail || 5) - index * 0.3;
            ctx.beginPath();
            ctx.arc(pos.x - gameState.camera.x, pos.y - gameState.camera.y, trailSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Partículas adicionales para armas avanzadas
        if (v.particles) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            for (let i = 0; i < 3; i++) {
                const offsetX = Math.random() * 10 - 5;
                const offsetY = Math.random() * 10 - 5;
                ctx.fillStyle = v.color;
                ctx.beginPath();
                ctx.arc(screenX + offsetX, screenY + offsetY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        
        // Efecto eléctrico para armas avanzadas
        if (v.electric) {
            ctx.save();
            ctx.strokeStyle = v.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            for (let i = 0; i < 2; i++) {
                ctx.moveTo(screenX, screenY);
                ctx.lineTo(
                    screenX + Math.random() * 20 - 10,
                    screenY + Math.random() * 20 - 10
                );
            }
            ctx.stroke();
            ctx.restore();
        }
        
        // Dibujar torpedo principal
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.angle);
        
        // Torpedo con color del arma
        const gradient = ctx.createLinearGradient(-v.size, 0, v.size, 0);
        gradient.addColorStop(0, v.color);
        gradient.addColorStop(0.5, this.lightenColor(v.color, 20));
        gradient.addColorStop(1, this.lightenColor(v.color, 40));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, v.size, v.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde del torpedo
        ctx.strokeStyle = v.color;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Brillo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(-v.size * 0.3, -v.size * 0.2, v.size * 0.3, v.size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Efecto vórtice para armas más poderosas
        if (v.vortex) {
            ctx.strokeStyle = v.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.3;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(0, 0, v.size * (2 + i), 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
    
    // Función auxiliar para aclarar colores
    lightenColor(color, percent) {
        // Convertir color hex a RGB y aclarar
        if (color.startsWith('#')) {
            const num = parseInt(color.slice(1), 16);
            const r = Math.min(255, (num >> 16) + percent);
            const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
            const b = Math.min(255, (num & 0x0000FF) + percent);
            return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
    }
}

// Clase Partícula (Burbujas y efectos)
class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.lifetime = 30;
        
        switch(type) {
            case 'bubble':
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = -Math.random() * 2 - 1;
                this.size = Math.random() * 5 + 2;
                this.color = 'rgba(135, 206, 235, 0.6)';
                break;
            case 'attack':
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = (Math.random() - 0.5) * 4;
                this.size = Math.random() * 3 + 1;
                this.color = 'rgba(255, 100, 100, 0.8)';
                break;
            case 'death':
                this.vx = (Math.random() - 0.5) * 6;
                this.vy = -Math.random() * 3 - 2;
                this.size = Math.random() * 8 + 3;
                this.color = 'rgba(135, 206, 235, 0.4)';
                this.lifetime = 50;
                break;
            case 'hit':
                this.vx = (Math.random() - 0.5) * 3;
                this.vy = (Math.random() - 0.5) * 3;
                this.size = Math.random() * 4 + 2;
                this.color = 'rgba(255, 200, 100, 0.7)';
                break;
            case 'selection':
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 3 + 2;
                this.color = 'rgba(0, 250, 154, 0.8)';
                break;
        }
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.type === 'bubble' || this.type === 'death') {
            this.vy -= 0.1; // Flotar hacia arriba
        }
        
        this.lifetime--;
        this.size *= 0.98;
        
        return this.lifetime > 0 && this.size > 0.5;
    }
    
    draw() {
        const screenX = this.x - gameState.camera.x;
        const screenY = this.y - gameState.camera.y;
        
        ctx.save();
        ctx.globalAlpha = this.lifetime / 30;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Brillo en las burbujas
        if (this.type === 'bubble' || this.type === 'death') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(screenX - this.size * 0.3, screenY - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Clase Gema (Perla)
class Gem {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.size = 8 + level * 0.5;
        this.angle = 0;
        this.rotationSpeed = 0.05;
        this.value = Math.floor(level * 2);
        this.bobOffset = Math.random() * Math.PI * 2;
        this.collected = false;
        this.isRare = false;
        this.isChest = false;
        this.shimmer = 0;
    }
    
    update() {
        this.angle += this.rotationSpeed;
        this.shimmer += 0.1;
        
        // Efecto de flotación suave
        this.y += Math.sin(Date.now() * 0.003 + this.bobOffset) * 0.3;
        
        // Verificar recolección
        const player = gameState.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.size + this.size) {
            player.gems += this.value;
            player.updateUI();
            this.collected = true;
            
            // Efecto de recolección
            for (let i = 0; i < 8; i++) {
                const particle = new Particle(this.x, this.y, 'bubble');
                particle.color = 'rgba(255, 255, 255, 0.8)';
                gameState.particles.push(particle);
            }
        }
        
        return !this.collected;
    }
    
    draw() {
        const screenX = this.x - gameState.camera.x;
        const screenY = this.y - gameState.camera.y;
        
        // Solo dibujar si está en pantalla
        if (screenX < -50 || screenX > canvas.width + 50 || 
            screenY < -50 || screenY > canvas.height + 50) {
            return;
        }
        
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.angle);
        
        if (this.isChest) {
            // Dibujar cofre del tesoro
            const size = this.size * 2;
            
            // Resplandor dorado
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#FFD700';
            
            // Cofre
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-size, -size/2, size*2, size);
            
            // Detalles dorados
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.strokeRect(-size, -size/2, size*2, size);
            
            // Cerradura
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(0, 0, size/4, 0, Math.PI * 2);
            ctx.fill();
            
            // Texto de valor
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('+' + this.value, 0, -size - 5);
            
        } else if (this.isRare) {
            // Perla rara - multicolor
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 1.5);
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
            gradient.addColorStop(0.3, 'rgba(255, 105, 180, 0.8)');
            gradient.addColorStop(0.6, 'rgba(138, 43, 226, 0.7)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0.5)');
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FFD700';
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Partículas brillantes
            ctx.shadowBlur = 0;
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2 + this.angle * 2;
                const dist = this.size * 1.5;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Perla normal
            // Resplandor
            const glowSize = this.size * 2 + Math.sin(this.shimmer) * 3;
            const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
            glow.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            glow.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
            glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Perla principal
            const gradient = ctx.createRadialGradient(-this.size * 0.3, -this.size * 0.3, 0, 0, 0, this.size);
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(0.5, '#E9ECEF');
            gradient.addColorStop(1, '#ADB5BD');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Borde
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Brillo
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.ellipse(-this.size * 0.3, -this.size * 0.3, this.size * 0.4, this.size * 0.3, -Math.PI/4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Clase Estación de Mercader
class MerchantStation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.rotation = 0;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.discovered = false;
        this.lastVisit = 0;
        this.cooldown = 5000; // 5 segundos entre visitas
    }
    
    update() {
        // Rotación lenta
        this.rotation += 0.01;
        this.pulsePhase += 0.05;
        
        // Verificar proximidad del jugador
        const player = gameState.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Si el jugador está cerca
        if (distance < this.size + player.size) {
            if (!this.discovered) {
                this.discovered = true;
                this.showDiscoveryNotification();
            }
            
            // Abrir tienda si no está en cooldown
            if (Date.now() - this.lastVisit > this.cooldown) {
                if (window.MerchantSystem && !window.MerchantSystem.isOpen) {
                    window.MerchantSystem.openShop();
                    this.lastVisit = Date.now();
                    
                    // Efecto de entrada
                    for (let i = 0; i < 20; i++) {
                        const particle = new Particle(this.x, this.y, 'bubble');
                        particle.color = 'rgba(255, 215, 0, 0.8)';
                        particle.size = Math.random() * 10 + 5;
                        gameState.particles.push(particle);
                    }
                }
            }
        }
    }
    
    draw() {
        const screenX = this.x - gameState.camera.x;
        const screenY = this.y - gameState.camera.y;
        
        // Solo dibujar si está en pantalla
        if (screenX < -100 || screenX > canvas.width + 100 || 
            screenY < -100 || screenY > canvas.height + 100) {
            return;
        }
        
        ctx.save();
        ctx.translate(screenX, screenY);
        
        // Efecto de resplandor pulsante
        const pulseSize = this.size + Math.sin(this.pulsePhase) * 10;
        const glowGradient = ctx.createRadialGradient(0, 0, pulseSize * 0.5, 0, 0, pulseSize * 1.5);
        glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        glowGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.1)');
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, pulseSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Plataforma principal
        ctx.rotate(this.rotation);
        
        // Base de la estación
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#FF8C00');
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 3;
        
        // Forma octagonal
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Detalles de la estación
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
            ctx.stroke();
        }
        
        // Núcleo central
        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.3);
        coreGradient.addColorStop(0, '#FFFFFF');
        coreGradient.addColorStop(0.5, '#FFD700');
        coreGradient.addColorStop(1, '#FFA500');
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Símbolo del mercader (concha)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐚', 0, 0);
        
        ctx.restore();
        
        // Indicador de distancia si está descubierta
        if (this.discovered) {
            const dx = this.x - gameState.player.x;
            const dy = this.y - gameState.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 200 && distance < 1000) {
                // Flecha indicadora en el borde de la pantalla
                const angle = Math.atan2(dy, dx);
                const edgeX = canvas.width/2 + Math.cos(angle) * 300;
                const edgeY = canvas.height/2 + Math.sin(angle) * 300;
                
                ctx.save();
                ctx.translate(edgeX, edgeY);
                ctx.rotate(angle + Math.PI);
                
                ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
                ctx.beginPath();
                ctx.moveTo(10, 0);
                ctx.lineTo(-10, -10);
                ctx.lineTo(-10, 10);
                ctx.closePath();
                ctx.fill();
                
                ctx.restore();
                
                // Distancia
                ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${Math.floor(distance)}m`, edgeX, edgeY + 20);
            }
        }
        
        // Texto flotante
        if (this.discovered && !window.MerchantSystem?.isOpen) {
            const dx = this.x - gameState.player.x;
            const dy = this.y - gameState.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('¡Mercader Aquí!', screenX, screenY - this.size - 20);
                
                if (distance < this.size + gameState.player.size + 10) {
                    ctx.font = '12px Arial';
                    ctx.fillText('Acércate para comerciar', screenX, screenY - this.size - 35);
                }
            }
        }
    }
    
    showDiscoveryNotification() {
        const notification = document.getElementById('merchantNotification');
        if (notification) {
            notification.innerHTML = '<p>¡Has descubierto una <strong>Estación de Comercio</strong>!</p>';
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }
}

// Generador de estaciones de comercio
function spawnMerchantStations() {
    // Generar estaciones en ubicaciones estratégicas
    const stationDistance = 1500; // Distancia entre estaciones
    const playerZone = Math.floor(Math.sqrt(gameState.player.x ** 2 + gameState.player.y ** 2) / stationDistance);
    
    // Verificar si necesitamos generar nuevas estaciones
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const zoneX = (playerZone + i) * stationDistance;
            const zoneY = (playerZone + j) * stationDistance;
            
            // Verificar si ya existe una estación en esta zona
            const exists = gameState.merchantStations.some(station => {
                const dx = station.x - zoneX;
                const dy = station.y - zoneY;
                return Math.sqrt(dx * dx + dy * dy) < stationDistance / 2;
            });
            
            if (!exists && Math.random() < 0.3) { // 30% de probabilidad por zona
                const offsetX = (Math.random() - 0.5) * stationDistance * 0.5;
                const offsetY = (Math.random() - 0.5) * stationDistance * 0.5;
                gameState.merchantStations.push(new MerchantStation(zoneX + offsetX, zoneY + offsetY));
            }
        }
    }
    
    // Limpiar estaciones muy lejanas
    gameState.merchantStations = gameState.merchantStations.filter(station => {
        const dx = station.x - gameState.player.x;
        const dy = station.y - gameState.player.y;
        return Math.sqrt(dx * dx + dy * dy) < stationDistance * 3;
    });
}

// Generador de enemigos con mapa infinito mejorado
function spawnEnemies() {
    const targetEnemyCount = 15;
    const spawnRadius = 600;
    const minSpawnDistance = 200;
    
    while (gameState.enemies.length < targetEnemyCount) {
        // Generar enemigos alrededor del jugador pero no muy cerca
        const angle = Math.random() * Math.PI * 2;
        const distance = minSpawnDistance + Math.random() * (spawnRadius - minSpawnDistance);
        
        const x = gameState.player.x + Math.cos(angle) * distance;
        const y = gameState.player.y + Math.sin(angle) * distance;
        
        // Nivel basado en la distancia del origen (mapa infinito con dificultad progresiva)
        const distFromOrigin = Math.sqrt(gameState.player.x * gameState.player.x + gameState.player.y * gameState.player.y);
        const baseLevel = Math.floor(distFromOrigin / 1000) + 1;
        const level = Math.max(1, Math.min(20, baseLevel + Math.floor(Math.random() * 3 - 1)));
        
        const enemy = new Enemy(x, y, level);
        gameState.enemies.push(enemy);
    }
    
    // Eliminar enemigos muy lejos para optimizar rendimiento
    gameState.enemies = gameState.enemies.filter(enemy => {
        const dx = enemy.x - gameState.player.x;
        const dy = enemy.y - gameState.player.y;
        return Math.sqrt(dx * dx + dy * dy) < spawnRadius * 2;
    });
}

// Inicializar burbujas del fondo
function initBubbles() {
    for (let i = 0; i < 20; i++) {
        const bubble = new Bubble();
        bubble.y = Math.random() * canvas.height;
        gameState.bubbles.push(bubble);
    }
}

// Dibujar fondo oceánico mejorado
function drawOceanBackground() {
    // Gradiente de profundidad
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');     // Azul cielo claro
    gradient.addColorStop(0.3, '#4682B4');   // Azul acero
    gradient.addColorStop(0.6, '#1E90FF');   // Azul dodger
    gradient.addColorStop(1, '#000080');     // Azul marino oscuro
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Patrón de cuadrícula para mostrar movimiento (mapa infinito)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 100;
    const offsetX = -gameState.camera.x % gridSize;
    const offsetY = -gameState.camera.y % gridSize;
    
    for (let x = offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = offsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Rayos de luz solar bajo el agua
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#FFFFCC';
    
    for (let i = 0; i < 5; i++) {
        const baseX = i * 250 - gameState.camera.x * 0.1;
        const x = (baseX + Date.now() * 0.01) % (canvas.width + 200) - 100;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - 50, canvas.height);
        ctx.lineTo(x + 50, canvas.height);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
    
    // Dibujar burbujas de fondo
    gameState.bubbles.forEach(bubble => {
        bubble.update();
        bubble.draw();
    });
    
    // Efecto de corrientes de agua
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 3; i++) {
        const y = canvas.height * (0.3 + i * 0.3);
        const offset = Math.sin(Date.now() * 0.001 + i) * 50;
        
        ctx.beginPath();
        ctx.moveTo(0, y + offset);
        
        for (let x = 0; x <= canvas.width; x += 50) {
            const wave = Math.sin(x * 0.01 + Date.now() * 0.002) * 20;
            ctx.lineTo(x, y + offset + wave);
        }
        
        ctx.stroke();
    }
    ctx.restore();
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;
    
    // Barra espaciadora para seleccionar objetivo
    if (e.key === ' ') {
        e.preventDefault();
        gameState.player.selectTarget();
    }
    
    // R para usar ultimate
    if ((e.key === 'r' || e.key === 'R') && gameState.player && window.UltimateSystem) {
        e.preventDefault();
        window.UltimateSystem.useUltimate(gameState.player);
    }
    
    // ESC para cerrar el mercader
    if (e.key === 'Escape') {
        if (window.MerchantSystem && window.MerchantSystem.isOpen) {
            window.MerchantSystem.closeShop();
        }
    }
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    gameState.mouse.x = e.clientX - rect.left;
    gameState.mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('click', (e) => {
    // Click para seleccionar enemigo específico
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left + gameState.camera.x;
    const clickY = e.clientY - rect.top + gameState.camera.y;
    
    // Buscar enemigo más cercano al click
    let closestEnemy = null;
    let closestDistance = 30; // Radio de click
    
    for (let enemy of gameState.enemies) {
        const dx = enemy.x - clickX;
        const dy = enemy.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
            closestEnemy = enemy;
            closestDistance = distance;
        }
    }
    
    if (closestEnemy) {
        gameState.selectedTarget = closestEnemy;
        // Efecto visual de selección
        for (let i = 0; i < 5; i++) {
            gameState.particles.push(new Particle(closestEnemy.x, closestEnemy.y, 'selection'));
        }
    }
});

// Función para elegir mejora
function chooseUpgrade(type) {
    const player = gameState.player;
    
    switch (type) {
        case 'shield':
            player.upgrades.shield++;
            player.maxHealth += 20;
            player.health = player.maxHealth;
            break;
        case 'weapon':
            player.upgrades.weapon++;
            player.damage += 5; // Aumentar daño base también
            break;
        case 'speed':
            player.upgrades.speed++;
            break;
        case 'movement':
            player.upgrades.movement++;
            break;
    }
    
    player.updateUI();
    document.getElementById('upgradePanel').style.display = 'none';
    gameState.gameRunning = true;
}

// Función principal de actualización
function update() {
    if (!gameState.gameRunning) return;
    
    // Actualizar jugador
    gameState.player.update();
    
    // Verificar aparición de jefe
    if (window.BossSystem && !window.BossSystem.currentBoss) {
        if (window.BossSystem.checkBossSpawn(gameState.player, gameState.stats.enemiesDefeated)) {
            gameState.boss = window.BossSystem.currentBoss;
        }
    }
    
    // Actualizar jefe si existe
    if (window.BossSystem && window.BossSystem.currentBoss) {
        window.BossSystem.updateBoss(gameState.player, gameState.projectiles, gameState.particles);
    }
    
    // Actualizar mascotas
    if (window.PetSystem && window.PetSystem.petInstances.length > 0) {
        window.PetSystem.updatePets(gameState.player, gameState.enemies, gameState);
    }
    
    // Actualizar enemigos
    gameState.enemies.forEach(enemy => enemy.update());
    
    // Actualizar proyectiles
    gameState.projectiles = gameState.projectiles.filter(projectile => projectile.update());
    
    // Actualizar gemas
    gameState.gems = gameState.gems.filter(gem => gem.update());
    
    // Actualizar partículas (limitar a 200 para rendimiento)
    if (gameState.particles.length > 200) {
        gameState.particles = gameState.particles.slice(-150);
    }
    gameState.particles = gameState.particles.filter(particle => particle.update());
    
    // Actualizar efectos especiales
    gameState.specialEffects = gameState.specialEffects.filter(effect => {
        if (effect.lifetime) {
            effect.lifetime--;
            return effect.lifetime > 0;
        }
        return true;
    });
    
    // Actualizar estaciones de comercio
    gameState.merchantStations.forEach(station => station.update());
    
    // Generar más enemigos y estaciones (menos si hay jefe)
    if (!window.BossSystem?.currentBoss) {
        spawnEnemies();
    }
    spawnMerchantStations();
}

// Función de renderizado
function render() {
    // Dibujar fondo oceánico con biomas
    if (window.BiomeSystem) {
        window.BiomeSystem.drawBiomeBackground(ctx, gameState.camera, gameState.player);
    } else {
        drawOceanBackground();
    }
    
    // Dibujar estaciones de comercio (detrás de todo)
    gameState.merchantStations.forEach(station => station.draw());
    
    // Dibujar gemas
    gameState.gems.forEach(gem => gem.draw());
    
    // Dibujar enemigos
    gameState.enemies.forEach(enemy => enemy.draw());
    
    // Dibujar jefe si existe
    if (window.BossSystem && window.BossSystem.currentBoss) {
        window.BossSystem.drawBoss(ctx, gameState.camera);
    }
    
    // Dibujar mascotas
    if (window.PetSystem && window.PetSystem.petInstances.length > 0) {
        window.PetSystem.drawPets(ctx, gameState.camera);
    }
    
    // Dibujar proyectiles
    gameState.projectiles.forEach(projectile => projectile.draw());
    
    // Dibujar partículas
    gameState.particles.forEach(particle => particle.draw());
    
    // Dibujar efectos especiales
    gameState.specialEffects.forEach(effect => {
        if (effect.draw) effect.draw(ctx, gameState.camera);
    });
    
    // Dibujar jugador con sistema de evolución visual
    if (window.ShipEvolution) {
        window.ShipEvolution.drawEvolvedShip(ctx, gameState.player);
    } else {
        gameState.player.draw();
    }
    
    // UI - Indicadores en pantalla
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, canvas.height - 30, 200, 20);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    const depth = Math.floor(Math.sqrt(gameState.player.x * gameState.player.x + gameState.player.y * gameState.player.y) / 10);
    ctx.fillText(`Profundidad: ${depth}m`, 15, canvas.height - 15);
    
    // Indicador de objetivo seleccionado
    if (gameState.selectedTarget) {
        ctx.fillText(`Objetivo: ${gameState.selectedTarget.name}`, 15, canvas.height - 35);
    }
    
    // Controles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('WASD: Mover | ESPACIO: Seleccionar objetivo | Click: Selección manual | 🐚 Busca mercaderes', canvas.width - 10, canvas.height - 10);
}

// Bucle principal del juego
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Inicialización del juego
function init() {
    // Inicializar jugador en el origen
    gameState.player = new Player(0, 0);
    gameState.player.updateUI();
    
    // Inicializar burbujas
    initBubbles();
    
    // Generar enemigos iniciales
    spawnEnemies();
    
    // Cargar sprites si están disponibles
    if (window.GameSprites) {
        window.GameSprites.loadSprites().then(() => {
            gameState.spritesLoaded = true;
            console.log('Sprites cargados correctamente');
        });
    }
    
    // Cargar sprites realistas de alta calidad
    if (window.RealisticSprites) {
        window.RealisticSprites.loadAllSprites().then(() => {
            gameState.realisticSpritesLoaded = true;
            console.log('Sprites realistas HD cargados');
        });
    }
    
    // Inicializar sistema del mercader
    if (window.MerchantSystem) {
        window.MerchantSystem.init();
        console.log('Sistema del mercader inicializado');
    }
    
    // Inicializar sistema de jefes
    if (window.BossSystem) {
        console.log('Sistema de jefes inicializado');
        // El primer jefe aparecerá cuando se cumplan las condiciones
    }
    
    // Inicializar sistema de mascotas
    if (window.PetSystem) {
        window.PetSystem.init();
        // Dar delfín inicial al jugador
        setTimeout(() => {
            if (window.PetSystem && gameState.player) {
                window.PetSystem.activatePet('dolphin', gameState.player);
                console.log('Mascota inicial (Delfín) activada');
            }
        }, 1000);
    }
    
    // Inicializar sistemas avanzados
    if (window.EconomyBalance) {
        window.EconomyBalance.rebalancePrices();
        console.log('Economía rebalanceada');
    }
    
    if (window.UltimateSystem) {
        window.UltimateSystem.loadSelection();
        console.log('Sistema de ultimates inicializado');
    }
    
    // Intentar cargar partida guardada
    if (window.SaveSystem) {
        const saveData = window.SaveSystem.loadGame();
        if (saveData) {
            window.SaveSystem.applySaveData(saveData, gameState);
            console.log('Partida cargada');
        }
        // Iniciar auto-guardado
        window.SaveSystem.startAutoSave(gameState);
    }
    
    // Generar primera estación de comercio cerca del spawn
    gameState.merchantStations.push(new MerchantStation(300, 300));
    
    // Iniciar bucle del juego
    gameLoop();
}

// Exponer función globalmente
window.chooseUpgrade = chooseUpgrade;

// Esperar a que se cargue el DOM y los scripts
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // Dar tiempo para que se cargue el script de sprites
    setTimeout(init, 100);
}