// Sistemas Avanzados del Juego

// Sistema de Respawn y Checkpoints
const RespawnSystem = {
    checkpoints: [],
    lastCheckpoint: null,
    deathCount: 0,
    
    // Crear checkpoint
    createCheckpoint: function(player) {
        const checkpoint = {
            level: player.level,
            x: player.x,
            y: player.y,
            gems: Math.floor(player.gems * 0.9), // Pierdes 10% de perlas
            health: player.maxHealth,
            exp: player.exp,
            timestamp: Date.now()
        };
        
        this.checkpoints.push(checkpoint);
        this.lastCheckpoint = checkpoint;
        
        // Mantener solo los últimos 5 checkpoints
        if (this.checkpoints.length > 5) {
            this.checkpoints.shift();
        }
        
        this.showCheckpointNotification();
        return checkpoint;
    },
    
    // Respawn del jugador
    respawn: function(player) {
        if (!this.lastCheckpoint) {
            // Respawn inicial si no hay checkpoint
            this.lastCheckpoint = {
                level: 1,
                x: 0,
                y: 0,
                gems: 0,
                health: 100,
                exp: 0
            };
        }
        
        const cp = this.lastCheckpoint;
        player.level = cp.level;
        player.x = cp.x;
        player.y = cp.y;
        player.gems = cp.gems;
        player.health = cp.health;
        player.maxHealth = cp.health;
        player.exp = cp.exp;
        player.expRequired = levelTable.getExpRequired(cp.level);
        
        // Invulnerabilidad temporal
        player.invulnerable = true;
        player.invulnerableTime = Date.now() + 3000; // 3 segundos
        
        this.deathCount++;
        this.showRespawnNotification();
        
        // Limpiar enemigos cercanos
        if (window.gameState) {
            window.gameState.enemies = window.gameState.enemies.filter(enemy => {
                const dx = enemy.x - player.x;
                const dy = enemy.y - player.y;
                return Math.sqrt(dx * dx + dy * dy) > 300;
            });
        }
    },
    
    showCheckpointNotification: function() {
        const notification = document.createElement('div');
        notification.className = 'checkpoint-notification';
        notification.innerHTML = '✓ Checkpoint Guardado';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #00C853, #00E676);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10000;
            animation: slideDown 0.5s ease;
            box-shadow: 0 4px 20px rgba(0, 200, 83, 0.5);
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    },
    
    showRespawnNotification: function() {
        const notification = document.createElement('div');
        notification.className = 'respawn-notification';
        notification.innerHTML = `⚡ Respawn Activado - Invulnerable por 3 segundos<br>
                                 <small>Muertes: ${this.deathCount} | Perlas perdidas: 10%</small>`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #FF6B6B, #FF8787);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            z-index: 10000;
            animation: pulse 0.5s ease;
            box-shadow: 0 4px 20px rgba(255, 107, 107, 0.5);
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
};

// Sistema de Habilidades Ultimate
const UltimateSystem = {
    availableUltimates: [
        {
            id: 'tsunami',
            name: '🌊 Tsunami Devastador',
            description: 'Crea una ola gigante que barre a todos los enemigos',
            unlockLevel: 5,
            cooldown: 60000, // 60 segundos
            duration: 0,
            icon: '🌊',
            key: 'R',
            effect: function(player) {
                // Crear ola gigante que elimina enemigos
                const wave = {
                    x: player.x - 500,
                    y: player.y - 300,
                    width: 1000,
                    height: 600,
                    speed: 10,
                    damage: 100,
                    lifetime: 100,
                    type: 'tsunami',
                    draw: function(ctx, camera) {
                        ctx.save();
                        const screenX = this.x - camera.x;
                        const screenY = this.y - camera.y;
                        
                        const gradient = ctx.createLinearGradient(screenX, screenY, screenX, screenY + this.height);
                        gradient.addColorStop(0, 'rgba(0, 150, 255, 0.3)');
                        gradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.5)');
                        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
                        
                        ctx.fillStyle = gradient;
                        ctx.fillRect(screenX, screenY, this.width, this.height);
                        
                        // Espuma
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        for (let i = 0; i < this.width; i += 20) {
                            ctx.lineTo(screenX + i, screenY + Math.sin(i * 0.1 + Date.now() * 0.01) * 20);
                        }
                        ctx.stroke();
                        ctx.restore();
                        
                        this.lifetime--;
                    }
                };
                
                if (window.gameState) {
                    window.gameState.specialEffects.push(wave);
                    // Dañar a todos los enemigos en el área
                    window.gameState.enemies.forEach(enemy => {
                        const dx = Math.abs(enemy.x - player.x);
                        const dy = Math.abs(enemy.y - player.y);
                        if (dx < 500 && dy < 300) {
                            enemy.takeDamage(wave.damage);
                        }
                    });
                }
            }
        },
        {
            id: 'berserker',
            name: '⚡ Furia del Abismo',
            description: 'Duplica tu daño y velocidad durante 10 segundos',
            unlockLevel: 5,
            cooldown: 45000,
            duration: 10000,
            icon: '⚡',
            key: 'R',
            effect: function(player) {
                player.berserkerMode = true;
                player.berserkerEndTime = Date.now() + this.duration;
                
                // Duplicar stats temporalmente
                player.damage *= 2;
                player.speed *= 1.5;
                player.attackSpeed *= 0.5;
                
                // Efecto visual
                player.aura = {
                    color: '#FF0000',
                    size: 50,
                    pulse: true
                };
                
                // Restaurar después
                setTimeout(() => {
                    player.berserkerMode = false;
                    player.damage /= 2;
                    player.speed /= 1.5;
                    player.attackSpeed *= 2;
                    player.aura = null;
                }, this.duration);
            }
        },
        {
            id: 'vortex',
            name: '🌀 Vórtice Submarino',
            description: 'Crea un remolino que atrae y daña enemigos',
            unlockLevel: 5,
            cooldown: 50000,
            duration: 8000,
            icon: '🌀',
            key: 'R',
            effect: function(player) {
                const vortex = {
                    x: player.x,
                    y: player.y,
                    radius: 200,
                    pullForce: 5,
                    damage: 5, // Daño por segundo
                    lifetime: 160, // 8 segundos a 20 fps
                    type: 'vortex',
                    update: function() {
                        // Atraer y dañar enemigos
                        if (window.gameState) {
                            window.gameState.enemies.forEach(enemy => {
                                const dx = this.x - enemy.x;
                                const dy = this.y - enemy.y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                
                                if (dist < this.radius && dist > 10) {
                                    // Atraer hacia el centro
                                    enemy.x += (dx / dist) * this.pullForce;
                                    enemy.y += (dy / dist) * this.pullForce;
                                    
                                    // Aplicar daño
                                    if (Math.random() < 0.1) { // 10% chance por frame
                                        enemy.takeDamage(this.damage);
                                    }
                                }
                            });
                        }
                        this.lifetime--;
                        return this.lifetime > 0;
                    },
                    draw: function(ctx, camera) {
                        const screenX = this.x - camera.x;
                        const screenY = this.y - camera.y;
                        
                        ctx.save();
                        ctx.translate(screenX, screenY);
                        ctx.rotate(Date.now() * 0.005);
                        
                        // Espirales del vórtice
                        for (let i = 0; i < 5; i++) {
                            ctx.strokeStyle = `rgba(0, 150, 255, ${0.5 - i * 0.1})`;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            
                            for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
                                const r = angle * 15 + i * 20;
                                if (r < this.radius) {
                                    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                                }
                            }
                            ctx.stroke();
                        }
                        
                        ctx.restore();
                    }
                };
                
                if (window.gameState) {
                    window.gameState.specialEffects.push(vortex);
                }
            }
        },
        {
            id: 'shield',
            name: '🛡️ Escudo Atlante',
            description: 'Invulnerabilidad total durante 5 segundos',
            unlockLevel: 5,
            cooldown: 90000,
            duration: 5000,
            icon: '🛡️',
            key: 'R',
            effect: function(player) {
                player.invulnerable = true;
                player.invulnerableTime = Date.now() + this.duration;
                
                // Escudo visual
                player.shield = {
                    active: true,
                    color: '#00CED1',
                    radius: 40,
                    opacity: 0.5
                };
                
                setTimeout(() => {
                    player.invulnerable = false;
                    player.shield = null;
                }, this.duration);
            }
        },
        {
            id: 'lightning',
            name: '⚡ Tormenta Eléctrica',
            description: 'Rayos que saltan entre enemigos cercanos',
            unlockLevel: 5,
            cooldown: 40000,
            duration: 0,
            icon: '⚡',
            key: 'R',
            effect: function(player) {
                if (!window.gameState) return;
                
                const enemies = window.gameState.enemies;
                const hitEnemies = [];
                
                // Encontrar enemigo más cercano
                let currentTarget = null;
                let minDist = 300;
                
                enemies.forEach(enemy => {
                    const dx = enemy.x - player.x;
                    const dy = enemy.y - player.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < minDist) {
                        minDist = dist;
                        currentTarget = enemy;
                    }
                });
                
                // Cadena de rayos
                let chainCount = 5;
                while (currentTarget && chainCount > 0) {
                    hitEnemies.push(currentTarget);
                    currentTarget.takeDamage(50);
                    
                    // Efecto visual del rayo
                    const lightning = {
                        from: hitEnemies.length === 1 ? player : hitEnemies[hitEnemies.length - 2],
                        to: currentTarget,
                        lifetime: 20,
                        type: 'lightning',
                        draw: function(ctx, camera) {
                            ctx.save();
                            ctx.strokeStyle = '#FFFF00';
                            ctx.lineWidth = 3 + Math.random() * 2;
                            ctx.shadowBlur = 20;
                            ctx.shadowColor = '#FFFF00';
                            
                            ctx.beginPath();
                            ctx.moveTo(this.from.x - camera.x, this.from.y - camera.y);
                            
                            // Rayo con zigzag
                            const segments = 5;
                            for (let i = 1; i <= segments; i++) {
                                const t = i / segments;
                                const x = this.from.x + (this.to.x - this.from.x) * t;
                                const y = this.from.y + (this.to.y - this.from.y) * t;
                                const offset = (Math.random() - 0.5) * 30;
                                ctx.lineTo(x - camera.x + offset, y - camera.y + offset);
                            }
                            
                            ctx.stroke();
                            ctx.restore();
                            
                            this.lifetime--;
                            return this.lifetime > 0;
                        }
                    };
                    
                    window.gameState.specialEffects.push(lightning);
                    
                    // Buscar siguiente enemigo
                    let nextTarget = null;
                    let nextMinDist = 200;
                    
                    enemies.forEach(enemy => {
                        if (!hitEnemies.includes(enemy)) {
                            const dx = enemy.x - currentTarget.x;
                            const dy = enemy.y - currentTarget.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < nextMinDist) {
                                nextMinDist = dist;
                                nextTarget = enemy;
                            }
                        }
                    });
                    
                    currentTarget = nextTarget;
                    chainCount--;
                }
            }
        }
    ],
    
    selectedUltimate: null,
    lastUseTime: 0,
    
    // Seleccionar ultimate
    selectUltimate: function(ultimateId) {
        const ultimate = this.availableUltimates.find(u => u.id === ultimateId);
        if (ultimate) {
            this.selectedUltimate = ultimate;
            this.saveSelection();
            return true;
        }
        return false;
    },
    
    // Usar ultimate
    useUltimate: function(player) {
        if (!this.selectedUltimate) return false;
        
        const now = Date.now();
        if (now - this.lastUseTime < this.selectedUltimate.cooldown) {
            const remaining = Math.ceil((this.selectedUltimate.cooldown - (now - this.lastUseTime)) / 1000);
            this.showCooldownNotification(remaining);
            return false;
        }
        
        this.selectedUltimate.effect(player);
        this.lastUseTime = now;
        this.showUltimateNotification();
        return true;
    },
    
    showUltimateNotification: function() {
        const notification = document.createElement('div');
        notification.innerHTML = `${this.selectedUltimate.icon} ${this.selectedUltimate.name} ACTIVADO!`;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #000;
            padding: 30px 60px;
            border-radius: 15px;
            font-size: 24px;
            font-weight: bold;
            z-index: 10000;
            animation: ultimateFlash 0.5s ease;
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.8);
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    },
    
    showCooldownNotification: function(seconds) {
        const notification = document.createElement('div');
        notification.innerHTML = `⏱️ Ultimate en cooldown: ${seconds}s`;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #FF6B6B;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            z-index: 10000;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    },
    
    saveSelection: function() {
        if (this.selectedUltimate) {
            localStorage.setItem('selectedUltimate', this.selectedUltimate.id);
        }
    },
    
    loadSelection: function() {
        const savedId = localStorage.getItem('selectedUltimate');
        if (savedId) {
            this.selectUltimate(savedId);
        }
    }
};

// Sistema de Biomas y Mapa
const BiomeSystem = {
    biomes: {
        shallows: {
            name: 'Aguas Poco Profundas',
            color: '#87CEEB',
            depth: [0, 500],
            enemyMultiplier: 0.8,
            gemMultiplier: 1.0,
            visibility: 1.0,
            particles: 'bubbles',
            description: 'Zona inicial segura con luz solar'
        },
        reef: {
            name: 'Arrecife de Coral',
            color: '#FF7F50',
            depth: [500, 1000],
            enemyMultiplier: 1.0,
            gemMultiplier: 1.2,
            visibility: 0.9,
            particles: 'fish',
            description: 'Colorido arrecife lleno de vida'
        },
        kelp: {
            name: 'Bosque de Kelp',
            color: '#228B22',
            depth: [1000, 1500],
            enemyMultiplier: 1.2,
            gemMultiplier: 1.3,
            visibility: 0.7,
            particles: 'leaves',
            description: 'Denso bosque submarino'
        },
        abyss: {
            name: 'Fosa Abisal',
            color: '#191970',
            depth: [1500, 2500],
            enemyMultiplier: 1.5,
            gemMultiplier: 1.5,
            visibility: 0.5,
            particles: 'plankton',
            description: 'Oscuras profundidades misteriosas'
        },
        volcanic: {
            name: 'Zona Volcánica',
            color: '#8B0000',
            depth: [2500, 3500],
            enemyMultiplier: 2.0,
            gemMultiplier: 2.0,
            visibility: 0.6,
            particles: 'lava',
            description: 'Géiseres y lava submarina'
        },
        trench: {
            name: 'Fosa de las Marianas',
            color: '#000033',
            depth: [3500, 999999],
            enemyMultiplier: 3.0,
            gemMultiplier: 3.0,
            visibility: 0.3,
            particles: 'darkness',
            description: 'El punto más profundo del océano'
        }
    },
    
    getCurrentBiome: function(x, y) {
        const depth = Math.sqrt(x * x + y * y);
        
        for (let biomeKey in this.biomes) {
            const biome = this.biomes[biomeKey];
            if (depth >= biome.depth[0] && depth < biome.depth[1]) {
                return biome;
            }
        }
        
        return this.biomes.shallows;
    },
    
    drawBiomeBackground: function(ctx, camera, player) {
        const biome = this.getCurrentBiome(player.x, player.y);
        
        // Gradiente de fondo según bioma
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        
        if (biome.name === 'Aguas Poco Profundas') {
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(0.5, '#5F9EA0');
            gradient.addColorStop(1, '#4682B4');
        } else if (biome.name === 'Arrecife de Coral') {
            gradient.addColorStop(0, '#FF7F50');
            gradient.addColorStop(0.5, '#FF6347');
            gradient.addColorStop(1, '#CD5C5C');
        } else if (biome.name === 'Bosque de Kelp') {
            gradient.addColorStop(0, '#228B22');
            gradient.addColorStop(0.5, '#006400');
            gradient.addColorStop(1, '#004225');
        } else if (biome.name === 'Fosa Abisal') {
            gradient.addColorStop(0, '#191970');
            gradient.addColorStop(0.5, '#000080');
            gradient.addColorStop(1, '#000033');
        } else if (biome.name === 'Zona Volcánica') {
            gradient.addColorStop(0, '#8B0000');
            gradient.addColorStop(0.5, '#660000');
            gradient.addColorStop(1, '#330000');
        } else {
            gradient.addColorStop(0, '#000033');
            gradient.addColorStop(0.5, '#000022');
            gradient.addColorStop(1, '#000011');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Efectos especiales por bioma
        this.drawBiomeEffects(ctx, camera, biome);
    },
    
    drawBiomeEffects: function(ctx, camera, biome) {
        const time = Date.now() * 0.001;
        
        if (biome.name === 'Arrecife de Coral') {
            // Corales
            for (let i = 0; i < 5; i++) {
                const x = (i * 200 - camera.x % 1000 + 1000) % 1000;
                const y = ctx.canvas.height - 100 + Math.sin(time + i) * 20;
                
                ctx.fillStyle = `hsl(${i * 60}, 70%, 60%)`;
                ctx.beginPath();
                ctx.ellipse(x, y, 30, 50, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (biome.name === 'Bosque de Kelp') {
            // Algas
            ctx.strokeStyle = 'rgba(34, 139, 34, 0.5)';
            ctx.lineWidth = 10;
            for (let i = 0; i < 10; i++) {
                const x = (i * 100 - camera.x % 1000 + 1000) % 1000;
                ctx.beginPath();
                ctx.moveTo(x, ctx.canvas.height);
                
                for (let j = ctx.canvas.height; j > 100; j -= 20) {
                    const wave = Math.sin(time + i + j * 0.01) * 20;
                    ctx.lineTo(x + wave, j);
                }
                ctx.stroke();
            }
        } else if (biome.name === 'Zona Volcánica') {
            // Burbujas de lava
            for (let i = 0; i < 3; i++) {
                const x = (i * 300 - camera.x % 900 + 900) % 900;
                const y = ctx.canvas.height - 50 - (time * 50 + i * 100) % 500;
                
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
                gradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0.2)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    },
    
    showBiomeNotification: function(biomeName) {
        const notification = document.createElement('div');
        notification.className = 'biome-notification';
        notification.innerHTML = `📍 Entrando a: ${biomeName}`;
        notification.style.cssText = `
            position: fixed;
            top: 150px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000;
            border-left: 4px solid #00CED1;
            animation: slideInRight 0.5s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};

// Sistema de Guardado Automático
const SaveSystem = {
    autoSaveInterval: 30000, // Cada 30 segundos
    lastSaveTime: 0,
    saveSlot: 'oceanDepthsSave',
    
    // Guardar juego
    saveGame: function(gameState) {
        const saveData = {
            player: {
                level: gameState.player.level,
                exp: gameState.player.exp,
                gems: gameState.player.gems,
                x: gameState.player.x,
                y: gameState.player.y,
                health: gameState.player.health,
                maxHealth: gameState.player.maxHealth,
                upgrades: gameState.player.upgrades
            },
            stats: gameState.stats,
            merchantInventory: window.MerchantSystem ? window.MerchantSystem.playerInventory : null,
            unlockedPets: window.PetSystem ? window.PetSystem.unlockedPets : [],
            activePets: window.PetSystem ? window.PetSystem.activePets : [],
            defeatedBosses: window.BossSystem ? window.BossSystem.defeatedBosses : {},
            selectedUltimate: window.UltimateSystem ? window.UltimateSystem.selectedUltimate?.id : null,
            checkpoint: window.RespawnSystem ? window.RespawnSystem.lastCheckpoint : null,
            timestamp: Date.now(),
            version: '1.0.0'
        };
        
        try {
            localStorage.setItem(this.saveSlot, JSON.stringify(saveData));
            this.lastSaveTime = Date.now();
            this.showSaveNotification();
            return true;
        } catch (e) {
            console.error('Error al guardar:', e);
            return false;
        }
    },
    
    // Cargar juego
    loadGame: function() {
        try {
            const savedData = localStorage.getItem(this.saveSlot);
            if (!savedData) return null;
            
            const saveData = JSON.parse(savedData);
            
            // Verificar versión
            if (saveData.version !== '1.0.0') {
                console.warn('Versión de guardado incompatible');
                return null;
            }
            
            return saveData;
        } catch (e) {
            console.error('Error al cargar:', e);
            return null;
        }
    },
    
    // Aplicar datos cargados
    applySaveData: function(saveData, gameState) {
        if (!saveData || !gameState.player) return false;
        
        // Restaurar jugador
        const playerData = saveData.player;
        gameState.player.level = playerData.level;
        gameState.player.exp = playerData.exp;
        gameState.player.gems = playerData.gems;
        gameState.player.x = playerData.x;
        gameState.player.y = playerData.y;
        gameState.player.health = playerData.health;
        gameState.player.maxHealth = playerData.maxHealth;
        gameState.player.upgrades = playerData.upgrades;
        gameState.player.expRequired = levelTable.getExpRequired(playerData.level);
        
        // Restaurar estadísticas
        if (saveData.stats) {
            gameState.stats = saveData.stats;
        }
        
        // Restaurar inventario del mercader
        if (saveData.merchantInventory && window.MerchantSystem) {
            window.MerchantSystem.playerInventory = saveData.merchantInventory;
        }
        
        // Restaurar mascotas
        if (saveData.unlockedPets && window.PetSystem) {
            window.PetSystem.unlockedPets = saveData.unlockedPets;
            saveData.activePets.forEach(petId => {
                window.PetSystem.activatePet(petId, gameState.player);
            });
        }
        
        // Restaurar jefes derrotados
        if (saveData.defeatedBosses && window.BossSystem) {
            window.BossSystem.defeatedBosses = saveData.defeatedBosses;
        }
        
        // Restaurar ultimate seleccionado
        if (saveData.selectedUltimate && window.UltimateSystem) {
            window.UltimateSystem.selectUltimate(saveData.selectedUltimate);
        }
        
        // Restaurar checkpoint
        if (saveData.checkpoint && window.RespawnSystem) {
            window.RespawnSystem.lastCheckpoint = saveData.checkpoint;
        }
        
        // Actualizar UI
        gameState.player.updateUI();
        
        this.showLoadNotification();
        return true;
    },
    
    // Auto-guardado
    startAutoSave: function(gameState) {
        setInterval(() => {
            if (gameState.gameRunning && gameState.player) {
                this.saveGame(gameState);
            }
        }, this.autoSaveInterval);
    },
    
    showSaveNotification: function() {
        const notification = document.createElement('div');
        notification.innerHTML = '💾 Juego Guardado';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 200, 83, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    },
    
    showLoadNotification: function() {
        const notification = document.createElement('div');
        notification.innerHTML = '📂 Juego Cargado';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 150, 255, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }
};

// Rebalanceo de Economía
const EconomyBalance = {
    // Nuevas tasas de drop
    dropRates: {
        gem: 0.5, // 50% (antes 30%)
        rareGem: 0.1, // 10% para gema rara
        chest: 0.02 // 2% para cofre del tesoro
    },
    
    // Valor de perlas por nivel
    gemValues: {
        base: 10,
        perLevel: 5,
        rareMultiplier: 3,
        chestMultiplier: 10
    },
    
    // Calcular recompensa
    calculateReward: function(enemyLevel, playerLevel) {
        const levelDiff = enemyLevel - playerLevel;
        const baseReward = this.gemValues.base + (enemyLevel * this.gemValues.perLevel);
        
        // Bonus por enemigo difícil
        let multiplier = 1;
        if (levelDiff > 0) {
            multiplier = 1 + (levelDiff * 0.2);
        }
        
        return Math.floor(baseReward * multiplier);
    },
    
    // Generar drop
    generateDrop: function(enemy, player) {
        const drops = [];
        
        // Gema normal
        if (Math.random() < this.dropRates.gem) {
            drops.push({
                type: 'gem',
                value: this.calculateReward(enemy.level, player.level)
            });
        }
        
        // Gema rara
        if (Math.random() < this.dropRates.rareGem) {
            drops.push({
                type: 'rareGem',
                value: this.calculateReward(enemy.level, player.level) * this.gemValues.rareMultiplier
            });
        }
        
        // Cofre del tesoro
        if (Math.random() < this.dropRates.chest) {
            drops.push({
                type: 'chest',
                value: this.calculateReward(enemy.level, player.level) * this.gemValues.chestMultiplier
            });
        }
        
        return drops;
    },
    
    // Rebalancear precios de la tienda
    rebalancePrices: function() {
        if (window.MerchantSystem) {
            // Reducir precios en 30%
            const catalog = window.MerchantSystem.shopCatalog;
            
            for (let category in catalog) {
                catalog[category].forEach(item => {
                    if (item.price > 0) {
                        item.price = Math.floor(item.price * 0.7);
                    }
                });
            }
        }
    }
};

// Exportar sistemas
if (typeof window !== 'undefined') {
    window.RespawnSystem = RespawnSystem;
    window.UltimateSystem = UltimateSystem;
    window.BiomeSystem = BiomeSystem;
    window.SaveSystem = SaveSystem;
    window.EconomyBalance = EconomyBalance;
}