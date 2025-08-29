// Configuración del juego
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables del juego
let gameState = {
    player: null,
    enemies: [],
    projectiles: [],
    gems: [],
    particles: [],
    mouse: { x: 0, y: 0 },
    selectedTarget: null,
    gameRunning: true
};

// Nombres aleatorios para enemigos
const enemyNames = [
    'Kestrel', 'Viper', 'Hawk', 'Falcon', 'Eagle', 'Raven', 'Phoenix', 'Dragon',
    'Stinger', 'Barracuda', 'Shark', 'Kraken', 'Leviathan', 'Nautilus', 'Manta',
    'Coral', 'Abyss', 'Tide', 'Current', 'Deep', 'Reef', 'Pearl', 'Shell',
    'Starfish', 'Jellyfish', 'Seahorse', 'Octopus', 'Squid', 'Whale', 'Dolphin'
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

// Clase Jugador
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
        this.size = 15;
        this.angle = 0;
        
        // Stats de combate
        this.damage = 20;
        this.attackSpeed = 1000; // ms entre ataques
        this.range = 150;
        this.lastAttack = 0;
        
        // Mejoras
        this.upgrades = {
            shield: 0,
            weapon: 0,
            speed: 0,
            movement: 0
        };
    }
    
    update() {
        // Seguir el cursor del mouse
        const dx = gameState.mouse.x - this.x;
        const dy = gameState.mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            const speed = this.speed * (1 + this.upgrades.movement * 0.2);
            this.x += (dx / distance) * speed;
            this.y += (dy / distance) * speed;
        }
        
        // Actualizar ángulo
        this.angle = Math.atan2(dy, dx);
        
        // Ataque automático si hay objetivo seleccionado
        this.autoAttack();
        
        // Mantener en los límites del canvas
        this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
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
            // Crear proyectil
            const projectile = new Projectile(
                this.x, this.y, 
                Math.atan2(dy, dx),
                this.damage * (1 + this.upgrades.weapon * 0.25),
                'player'
            );
            gameState.projectiles.push(projectile);
            this.lastAttack = Date.now();
        }
    }
    
    gainExp(amount) {
        this.exp += amount;
        if (this.exp >= this.expRequired) {
            this.levelUp();
        }
        this.updateUI();
    }
    
    levelUp() {
        this.level++;
        this.exp -= this.expRequired;
        this.expRequired = levelTable.getExpRequired(this.level);
        
        // Mostrar panel de mejoras
        document.getElementById('upgradePanel').style.display = 'block';
        gameState.gameRunning = false;
    }
    
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            // Game Over logic aquí
        }
        this.updateUI();
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('playerLevel').textContent = this.level;
        document.getElementById('playerHealth').textContent = this.health;
        document.getElementById('playerMaxHealth').textContent = this.maxHealth;
        document.getElementById('playerExp').textContent = this.exp;
        document.getElementById('playerExpNext').textContent = this.expRequired;
        document.getElementById('playerGems').textContent = this.gems;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Cuerpo de la nave (forma de manta raya espacial)
        ctx.fillStyle = '#4a90e2';
        ctx.strokeStyle = '#87ceeb';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size * 0.8, -this.size * 0.6);
        ctx.lineTo(-this.size * 0.3, 0);
        ctx.lineTo(-this.size * 0.8, this.size * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Detalles de la nave
        ctx.fillStyle = '#87ceeb';
        ctx.beginPath();
        ctx.arc(this.size * 0.3, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Dibujar rango de ataque si hay objetivo
        if (gameState.selectedTarget) {
            ctx.strokeStyle = 'rgba(74, 144, 226, 0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

// Clase Enemigo
class Enemy {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.name = enemyNames[Math.floor(Math.random() * enemyNames.length)];
        this.maxHealth = Math.floor(80 + level * 20);
        this.health = this.maxHealth;
        this.damage = Math.floor(15 + level * 5);
        this.speed = 1 + level * 0.1;
        this.size = 10 + level * 2;
        this.angle = Math.random() * Math.PI * 2;
        this.lastAttack = 0;
        this.attackSpeed = 1500 - level * 50;
        this.range = 100 + level * 10;
        this.aggressive = false;
        
        // Color basado en nivel
        const hue = (level * 15) % 360;
        this.color = `hsl(${hue}, 70%, 50%)`;
    }
    
    update() {
        const player = gameState.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Solo atacar si el jugador está dentro de 15 niveles
        if (Math.abs(this.level - player.level) <= 15) {
            this.aggressive = true;
            
            // Moverse hacia el jugador
            if (distance > this.range * 0.8) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
            
            // Actualizar ángulo hacia el jugador
            this.angle = Math.atan2(dy, dx);
            
            // Atacar si está en rango
            if (distance <= this.range && Date.now() - this.lastAttack > this.attackSpeed) {
                this.attack();
            }
        } else {
            // Movimiento aleatorio si no es agresivo
            this.angle += (Math.random() - 0.5) * 0.1;
            this.x += Math.cos(this.angle) * this.speed * 0.5;
            this.y += Math.sin(this.angle) * this.speed * 0.5;
        }
        
        // Mantener en los límites
        this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
    }
    
    attack() {
        const player = gameState.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        
        const projectile = new Projectile(
            this.x, this.y,
            Math.atan2(dy, dx),
            this.damage,
            'enemy'
        );
        gameState.projectiles.push(projectile);
        this.lastAttack = Date.now();
    }
    
    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Cuerpo del enemigo (forma de pez/criatura marina)
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.aggressive ? '#ff6b6b' : '#333';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Cola
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(-this.size * 1.5, -this.size * 0.3);
        ctx.lineTo(-this.size * 1.3, 0);
        ctx.lineTo(-this.size * 1.5, this.size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
        
        // Nombre y nivel
        ctx.fillStyle = this.aggressive ? '#ff6b6b' : '#888';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.name} Lv.${this.level}`, this.x, this.y - this.size - 10);
        
        // Barra de vida
        if (this.health < this.maxHealth) {
            const barWidth = this.size * 2;
            const barHeight = 4;
            const healthPercent = this.health / this.maxHealth;
            
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x - barWidth/2, this.y - this.size - 25, barWidth, barHeight);
            
            ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
            ctx.fillRect(this.x - barWidth/2, this.y - this.size - 25, barWidth * healthPercent, barHeight);
        }
        
        // Indicador de objetivo seleccionado
        if (gameState.selectedTarget === this) {
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

// Clase Proyectil
class Projectile {
    constructor(x, y, angle, damage, owner) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.damage = damage;
        this.owner = owner;
        this.speed = 8;
        this.size = 3;
        this.life = 100; // Frames de vida
    }
    
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life--;
        
        // Verificar colisiones
        if (this.owner === 'player') {
            gameState.enemies.forEach((enemy, index) => {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < enemy.size + this.size) {
                    if (enemy.takeDamage(this.damage)) {
                        // Enemigo muerto
                        const expGained = levelTable.getExpGiven(enemy.level, gameState.player.level);
                        gameState.player.gainExp(expGained);
                        
                        // Crear gema
                        const gem = new Gem(enemy.x, enemy.y, enemy.level);
                        gameState.gems.push(gem);
                        
                        gameState.enemies.splice(index, 1);
                        
                        // Deseleccionar si era el objetivo
                        if (gameState.selectedTarget === enemy) {
                            gameState.selectedTarget = null;
                        }
                    }
                    this.life = 0;
                }
            });
        } else if (this.owner === 'enemy') {
            const player = gameState.player;
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < player.size + this.size) {
                player.takeDamage(this.damage);
                this.life = 0;
            }
        }
        
        return this.life > 0;
    }
    
    draw() {
        ctx.fillStyle = this.owner === 'player' ? '#87ceeb' : '#ff6b6b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Clase Gema
class Gem {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.size = 5 + level * 0.5;
        this.angle = 0;
        this.rotationSpeed = 0.1;
        this.value = Math.floor(level * 2);
        this.bobOffset = Math.random() * Math.PI * 2;
        this.collected = false;
    }
    
    update() {
        this.angle += this.rotationSpeed;
        
        // Efecto de flotación
        this.y += Math.sin(Date.now() * 0.01 + this.bobOffset) * 0.2;
        
        // Verificar recolección por el jugador
        const player = gameState.player;
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.size + this.size) {
            player.gems += this.value;
            player.updateUI();
            this.collected = true;
        }
        
        return !this.collected;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Gema brillante
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, '#87ceeb');
        gradient.addColorStop(0.7, '#4a90e2');
        gradient.addColorStop(1, '#2d3561');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#87ceeb';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
    }
}

// Generador de enemigos
function spawnEnemies() {
    const targetEnemyCount = 15;
    
    while (gameState.enemies.length < targetEnemyCount) {
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        
        switch (edge) {
            case 0: x = Math.random() * canvas.width; y = -50; break;
            case 1: x = canvas.width + 50; y = Math.random() * canvas.height; break;
            case 2: x = Math.random() * canvas.width; y = canvas.height + 50; break;
            case 3: x = -50; y = Math.random() * canvas.height; break;
        }
        
        // Nivel aleatorio entre 1 y 20
        const level = Math.floor(Math.random() * 20) + 1;
        const enemy = new Enemy(x, y, level);
        gameState.enemies.push(enemy);
    }
}

// Event Listeners
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    gameState.mouse.x = e.clientX - rect.left;
    gameState.mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Buscar enemigo más cercano al click
    let closestEnemy = null;
    let closestDistance = Infinity;
    
    gameState.enemies.forEach(enemy => {
        const dx = enemy.x - clickX;
        const dy = enemy.y - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < enemy.size + 20 && distance < closestDistance) {
            closestEnemy = enemy;
            closestDistance = distance;
        }
    });
    
    gameState.selectedTarget = closestEnemy;
});

// Función para elegir mejora
function chooseUpgrade(type) {
    const player = gameState.player;
    
    switch (type) {
        case 'shield':
            player.upgrades.shield++;
            player.maxHealth += 20;
            player.health = player.maxHealth; // Curación completa
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
    
    // Generar más enemigos
    spawnEnemies();
}

// Función de renderizado
function render() {
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fondo estrellado
    drawStarfield();
    
    // Dibujar gemas
    gameState.gems.forEach(gem => gem.draw());
    
    // Dibujar enemigos
    gameState.enemies.forEach(enemy => enemy.draw());
    
    // Dibujar proyectiles
    gameState.projectiles.forEach(projectile => projectile.draw());
    
    // Dibujar jugador
    gameState.player.draw();
}

// Fondo estrellado animado
let stars = [];
function initStarfield() {
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1
        });
    }
}

function drawStarfield() {
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.size / 2})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Mover estrella
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// Bucle principal del juego
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Inicialización del juego
function init() {
    gameState.player = new Player(canvas.width / 2, canvas.height / 2);
    gameState.player.updateUI();
    initStarfield();
    spawnEnemies();
    gameLoop();
}

// Exponer función globalmente para los botones
window.chooseUpgrade = chooseUpgrade;

// Iniciar el juego
init();