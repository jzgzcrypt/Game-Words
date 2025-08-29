// Configuración del juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Cargar sprites marinos
const sprites = {};
let spritesLoaded = false;

// Variables del juego
let gameState = {
    player: null,
    enemies: [],
    projectiles: [],
    gems: [],
    particles: [],
    bubbles: [],
    mouse: { x: 0, y: 0 },
    selectedTarget: null,
    gameRunning: true,
    camera: { x: 0, y: 0 },
    worldOffset: { x: 0, y: 0 }
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

// Clase Jugador (Submarino)
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
        this.speed = 3;
        this.size = 20;
        this.angle = 0;
        
        // Stats de combate
        this.damage = 20;
        this.attackSpeed = 1000;
        this.range = 150;
        this.lastAttack = 0;
        
        // Mejoras
        this.upgrades = {
            shield: 0,
            weapon: 0,
            speed: 0,
            movement: 0
        };
        
        // Animación
        this.propellerAngle = 0;
    }
    
    update() {
        // Seguir el cursor del mouse con mapa infinito
        const targetX = gameState.mouse.x + gameState.camera.x;
        const targetY = gameState.mouse.y + gameState.camera.y;
        
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            const speed = this.speed * (1 + this.upgrades.movement * 0.2);
            this.x += (dx / distance) * speed;
            this.y += (dy / distance) * speed;
        }
        
        // Actualizar ángulo
        this.angle = Math.atan2(dy, dx);
        this.propellerAngle += 0.3;
        
        // Actualizar cámara para seguir al jugador (mapa infinito)
        gameState.camera.x = this.x - canvas.width / 2;
        gameState.camera.y = this.y - canvas.height / 2;
        
        // Ataque automático
        this.autoAttack();
    }
    
    autoAttack() {
        if (!gameState.selectedTarget || Date.now() - this.lastAttack < this.attackSpeed / (1 + this.upgrades.speed * 0.15)) {
            return;
        }
        
        const target = gameState.selectedTarget;
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.range) {
            const projectile = new Projectile(this.x, this.y, target.x, target.y, this.damage * (1 + this.upgrades.weapon * 0.25));
            gameState.projectiles.push(projectile);
            this.lastAttack = Date.now();
            
            // Crear burbujas al disparar
            for (let i = 0; i < 3; i++) {
                gameState.particles.push(new Particle(this.x, this.y, 'bubble'));
            }
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            gameState.gameRunning = false;
            alert('¡Has sido derrotado! Recarga la página para intentar de nuevo.');
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
    
    draw() {
        ctx.save();
        ctx.translate(this.x - gameState.camera.x, this.y - gameState.camera.y);
        ctx.rotate(this.angle);
        
        // Dibujar submarino
        // Cuerpo principal
        ctx.fillStyle = '#2E86AB';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 1.2, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1E5A7D';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Cabina
        ctx.fillStyle = 'rgba(78, 205, 196, 0.8)';
        ctx.beginPath();
        ctx.ellipse(5, 0, this.size * 0.5, this.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ventanas
        ctx.fillStyle = '#A8DADC';
        ctx.beginPath();
        ctx.arc(-2, 0, 3, 0, Math.PI * 2);
        ctx.arc(8, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Hélice
        ctx.save();
        ctx.translate(-this.size * 1.2, 0);
        ctx.rotate(this.propellerAngle);
        ctx.fillStyle = '#457B9D';
        ctx.fillRect(-4, -1, 8, 2);
        ctx.fillRect(-1, -4, 2, 8);
        ctx.restore();
        
        // Indicador de objetivo
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
                ctx.lineTo(dx, dy);
                ctx.stroke();
            }
            ctx.setLineDash([]);
        }
        
        ctx.restore();
        
        // Barra de vida
        const barWidth = 40;
        const barHeight = 4;
        const barY = this.y - this.size - 15 - gameState.camera.y;
        const barX = this.x - barWidth / 2 - gameState.camera.x;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#00FA9A' : healthPercent > 0.25 ? '#FFD700' : '#FF6B6B';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }
}

// Clase Enemigo (Criaturas Marinas)
class Enemy {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.name = enemyNames[Math.floor(Math.random() * enemyNames.length)] + ' Nv.' + level;
        
        // Stats basados en nivel
        this.maxHealth = 50 + level * 20;
        this.health = this.maxHealth;
        this.damage = 10 + level * 5;
        this.speed = 1 + level * 0.1;
        this.size = 15 + level * 0.5;
        this.attackRange = 50;
        this.attackSpeed = 2000 - level * 50;
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
            // Dar experiencia y posible gema
            gameState.player.gainExp(levelTable.getExpGiven(this.level, gameState.player.level));
            
            if (Math.random() < 0.3 + this.level * 0.02) {
                gameState.gems.push(new Gem(this.x, this.y, this.level));
            }
            
            // Efecto de muerte (muchas burbujas)
            for (let i = 0; i < 10; i++) {
                gameState.particles.push(new Particle(this.x, this.y, 'death'));
            }
            
            return false;
        }
        
        // Efecto de daño (pocas burbujas)
        for (let i = 0; i < 3; i++) {
            gameState.particles.push(new Particle(this.x, this.y, 'hit'));
        }
        
        return true;
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
        
        // Dibujar según el tipo de criatura
        this.drawCreature();
        
        ctx.restore();
        
        // Indicador de selección
        if (gameState.selectedTarget === this) {
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.size + 10, 0, Math.PI * 2);
            ctx.stroke();
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
        
        this.vx = (dx / distance) * 8;
        this.vy = (dy / distance) * 8;
        this.angle = Math.atan2(dy, dx);
        this.lifetime = 100;
        this.trail = [];
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
        
        // Dibujar rastro de burbujas
        this.trail.forEach((pos, index) => {
            ctx.save();
            ctx.globalAlpha = index / this.trail.length * 0.5;
            ctx.fillStyle = '#74C0FC';
            ctx.beginPath();
            ctx.arc(pos.x - gameState.camera.x, pos.y - gameState.camera.y, 3 - index * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Dibujar torpedo
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.angle);
        
        // Torpedo principal
        const gradient = ctx.createLinearGradient(-5, 0, 5, 0);
        gradient.addColorStop(0, '#339AF0');
        gradient.addColorStop(0.5, '#74C0FC');
        gradient.addColorStop(1, '#A5D8FF');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Brillo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(-2, -1, 2, 1, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
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
        
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.angle);
        
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
        
        ctx.restore();
    }
}

// Generador de enemigos con mapa infinito
function spawnEnemies() {
    const targetEnemyCount = 20;
    const spawnRadius = 800;
    
    while (gameState.enemies.length < targetEnemyCount) {
        // Generar enemigos alrededor del jugador pero no muy cerca
        const angle = Math.random() * Math.PI * 2;
        const distance = spawnRadius * 0.7 + Math.random() * spawnRadius * 0.3;
        
        const x = gameState.player.x + Math.cos(angle) * distance;
        const y = gameState.player.y + Math.sin(angle) * distance;
        
        // Nivel basado en la distancia del origen
        const distFromOrigin = Math.sqrt(x * x + y * y);
        const baseLevel = Math.floor(distFromOrigin / 500) + 1;
        const level = Math.max(1, baseLevel + Math.floor(Math.random() * 5 - 2));
        
        const enemy = new Enemy(x, y, Math.min(level, 20));
        gameState.enemies.push(enemy);
    }
    
    // Eliminar enemigos muy lejos
    gameState.enemies = gameState.enemies.filter(enemy => {
        const dx = enemy.x - gameState.player.x;
        const dy = enemy.y - gameState.player.y;
        return Math.sqrt(dx * dx + dy * dy) < spawnRadius * 1.5;
    });
}

// Inicializar burbujas del fondo
function initBubbles() {
    for (let i = 0; i < 15; i++) {
        gameState.bubbles.push(new Bubble());
    }
}

// Dibujar fondo oceánico
function drawOceanBackground() {
    // Gradiente de profundidad
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');     // Azul cielo claro
    gradient.addColorStop(0.3, '#4682B4');   // Azul acero
    gradient.addColorStop(0.6, '#1E90FF');   // Azul dodger
    gradient.addColorStop(1, '#000080');     // Azul marino oscuro
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Rayos de luz solar bajo el agua
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#FFFFCC';
    
    for (let i = 0; i < 5; i++) {
        const x = (i * 250 + Date.now() * 0.01) % (canvas.width + 200) - 100;
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
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    gameState.mouse.x = e.clientX - rect.left;
    gameState.mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left + gameState.camera.x;
    const clickY = e.clientY - rect.top + gameState.camera.y;
    
    // Buscar enemigo más cercano al click
    let closestEnemy = null;
    let closestDistance = Infinity;
    
    for (let enemy of gameState.enemies) {
        const dx = enemy.x - clickX;
        const dy = enemy.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < enemy.size + 20 && distance < closestDistance) {
            closestEnemy = enemy;
            closestDistance = distance;
        }
    }
    
    gameState.selectedTarget = closestEnemy;
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
    
    // Actualizar enemigos
    gameState.enemies.forEach(enemy => enemy.update());
    
    // Actualizar proyectiles
    gameState.projectiles = gameState.projectiles.filter(projectile => projectile.update());
    
    // Actualizar gemas
    gameState.gems = gameState.gems.filter(gem => gem.update());
    
    // Actualizar partículas
    gameState.particles = gameState.particles.filter(particle => particle.update());
    
    // Generar más enemigos
    spawnEnemies();
}

// Función de renderizado
function render() {
    // Dibujar fondo oceánico
    drawOceanBackground();
    
    // Dibujar gemas
    gameState.gems.forEach(gem => gem.draw());
    
    // Dibujar enemigos
    gameState.enemies.forEach(enemy => enemy.draw());
    
    // Dibujar proyectiles
    gameState.projectiles.forEach(projectile => projectile.draw());
    
    // Dibujar partículas
    gameState.particles.forEach(particle => particle.draw());
    
    // Dibujar jugador
    gameState.player.draw();
    
    // Indicador de posición en el mapa infinito
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Profundidad: ${Math.floor(Math.sqrt(gameState.player.x * gameState.player.x + gameState.player.y * gameState.player.y) / 10)}m`, 10, canvas.height - 10);
}

// Bucle principal del juego
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Inicialización del juego
function init() {
    gameState.player = new Player(0, 0);
    gameState.player.updateUI();
    initBubbles();
    spawnEnemies();
    gameLoop();
}

// Exponer función globalmente
window.chooseUpgrade = chooseUpgrade;

// Iniciar el juego
init();