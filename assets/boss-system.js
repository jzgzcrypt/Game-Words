// Sistema de Jefes Épicos
const BossSystem = {
    // Configuración de jefes
    bosses: {
        kraken: {
            name: '🐙 KRAKEN, Terror de las Profundidades',
            level: 10,
            health: 2000,
            size: 120,
            color: '#4A148C',
            glowColor: '#9C27B0',
            spawnMessage: '¡El KRAKEN ha despertado de su sueño milenario!',
            defeatMessage: '¡Has derrotado al Kraken! Las aguas se calman...',
            rewards: {
                exp: 5000,
                gems: 500,
                unlocks: ['tentacle_pet', 'kraken_skin']
            },
            attacks: [
                {
                    name: 'Látigo de Tentáculo',
                    damage: 30,
                    cooldown: 2000,
                    animation: 'tentacle_whip',
                    warning: 1000
                },
                {
                    name: 'Abrazo Mortal',
                    damage: 50,
                    cooldown: 5000,
                    animation: 'tentacle_grab',
                    warning: 1500
                },
                {
                    name: 'Tinta Oscura',
                    damage: 20,
                    cooldown: 3000,
                    animation: 'ink_cloud',
                    effect: 'blind',
                    duration: 3000
                },
                {
                    name: 'Llamada del Abismo',
                    damage: 10,
                    cooldown: 8000,
                    animation: 'summon_minions',
                    summons: 5
                }
            ],
            phases: [
                { healthPercent: 1.0, tentacles: 4, speed: 1 },
                { healthPercent: 0.75, tentacles: 6, speed: 1.2, rage: true },
                { healthPercent: 0.5, tentacles: 8, speed: 1.5, rage: true, summons: true },
                { healthPercent: 0.25, tentacles: 10, speed: 2, rage: true, summons: true, berserk: true }
            ]
        },
        
        leviathan: {
            name: '🐋 LEVIATÁN, Devorador de Flotas',
            level: 20,
            health: 4000,
            size: 150,
            color: '#01579B',
            glowColor: '#0288D1',
            spawnMessage: '¡El LEVIATÁN emerge de las profundidades! ¡El océano tiembla!',
            defeatMessage: '¡El Leviatán ha caído! Eres una leyenda del mar.',
            rewards: {
                exp: 10000,
                gems: 1000,
                unlocks: ['whale_pet', 'leviathan_armor']
            },
            attacks: [
                {
                    name: 'Tsunami',
                    damage: 60,
                    cooldown: 6000,
                    animation: 'tsunami_wave',
                    warning: 2000,
                    areaEffect: true
                },
                {
                    name: 'Devorar',
                    damage: 100,
                    cooldown: 8000,
                    animation: 'devour',
                    warning: 2500,
                    oneShot: true
                },
                {
                    name: 'Llamada Sónica',
                    damage: 40,
                    cooldown: 4000,
                    animation: 'sonic_blast',
                    effect: 'stun',
                    duration: 2000
                },
                {
                    name: 'Tormenta Marina',
                    damage: 30,
                    cooldown: 10000,
                    animation: 'storm',
                    effect: 'whirlpool',
                    duration: 5000
                }
            ],
            phases: [
                { healthPercent: 1.0, speed: 0.8, armor: 20 },
                { healthPercent: 0.66, speed: 1.0, armor: 30, enrage: true },
                { healthPercent: 0.33, speed: 1.2, armor: 40, enrage: true, tsunami: true }
            ]
        },
        
        poseidon: {
            name: '🔱 POSEIDÓN, Rey de los Océanos',
            level: 30,
            health: 6000,
            size: 100,
            color: '#FFD700',
            glowColor: '#FFF59D',
            spawnMessage: '¡POSEIDÓN ha llegado! ¡Inclínate ante el Rey del Mar!',
            defeatMessage: '¡Imposible! ¡Has derrotado a un DIOS! El trono del océano es tuyo.',
            rewards: {
                exp: 20000,
                gems: 2000,
                unlocks: ['trident_weapon', 'god_mode', 'poseidon_crown']
            },
            attacks: [
                {
                    name: 'Golpe de Tridente',
                    damage: 80,
                    cooldown: 3000,
                    animation: 'trident_strike',
                    warning: 1000,
                    piercing: true
                },
                {
                    name: 'Ira Divina',
                    damage: 120,
                    cooldown: 10000,
                    animation: 'divine_wrath',
                    warning: 3000,
                    screenEffect: true
                },
                {
                    name: 'Control del Mar',
                    damage: 50,
                    cooldown: 5000,
                    animation: 'water_control',
                    effect: 'reverse_controls',
                    duration: 4000
                },
                {
                    name: 'Ejército Atlante',
                    damage: 0,
                    cooldown: 15000,
                    animation: 'summon_army',
                    summons: 10,
                    summonType: 'atlantean_guard'
                }
            ],
            phases: [
                { healthPercent: 1.0, form: 'human', speed: 1.5 },
                { healthPercent: 0.75, form: 'hybrid', speed: 2, shield: true },
                { healthPercent: 0.5, form: 'titan', speed: 1, size: 150, power: 2 },
                { healthPercent: 0.25, form: 'divine', speed: 3, invulnerable: 'periodic', ultimate: true }
            ]
        }
    },
    
    // Estado actual del boss
    currentBoss: null,
    bossPhase: 0,
    lastAttackTime: 0,
    tentacles: [],
    minions: [],
    
    // Condiciones de aparición
    spawnConditions: {
        kraken: {
            minPlayerLevel: 8,
            enemiesDefeated: 100,
            depth: 500,
            chance: 0.1,
            cooldown: 300000 // 5 minutos entre spawns
        },
        leviathan: {
            minPlayerLevel: 15,
            enemiesDefeated: 300,
            depth: 1500,
            chance: 0.08,
            cooldown: 600000,
            requiresKrakenDefeat: true
        },
        poseidon: {
            minPlayerLevel: 25,
            enemiesDefeated: 500,
            depth: 3000,
            chance: 0.05,
            cooldown: 900000,
            requiresLeviathanDefeat: true
        }
    },
    
    // Historial de derrotas
    defeatedBosses: {
        kraken: false,
        leviathan: false,
        poseidon: false
    },
    
    lastSpawnAttempt: {
        kraken: 0,
        leviathan: 0,
        poseidon: 0
    },
    
    // Verificar si debe aparecer un jefe
    checkBossSpawn: function(player, enemiesDefeatedCount) {
        const now = Date.now();
        const playerDepth = Math.sqrt(player.x * player.x + player.y * player.y);
        
        // Verificar cada jefe
        for (let bossKey in this.spawnConditions) {
            const condition = this.spawnConditions[bossKey];
            
            // Verificar cooldown
            if (now - this.lastSpawnAttempt[bossKey] < condition.cooldown) continue;
            
            // Verificar condiciones
            if (player.level < condition.minPlayerLevel) continue;
            if (enemiesDefeatedCount < condition.enemiesDefeated) continue;
            if (playerDepth < condition.depth) continue;
            
            // Verificar prerequisitos
            if (bossKey === 'leviathan' && !this.defeatedBosses.kraken) continue;
            if (bossKey === 'poseidon' && !this.defeatedBosses.leviathan) continue;
            
            // Verificar probabilidad
            if (Math.random() < condition.chance) {
                this.spawnBoss(bossKey, player.x, player.y);
                this.lastSpawnAttempt[bossKey] = now;
                return true;
            }
        }
        
        return false;
    },
    
    // Spawn del jefe
    spawnBoss: function(bossType, x, y) {
        const bossConfig = this.bosses[bossType];
        if (!bossConfig) return;
        
        // Crear instancia del jefe
        this.currentBoss = {
            type: bossType,
            x: x + (Math.random() - 0.5) * 500,
            y: y + (Math.random() - 0.5) * 500,
            health: bossConfig.health,
            maxHealth: bossConfig.health,
            size: bossConfig.size,
            angle: 0,
            phase: 0,
            lastAttack: {},
            active: true,
            spawnTime: Date.now()
        };
        
        // Mostrar mensaje de aparición
        this.showBossMessage(bossConfig.spawnMessage, 'spawn');
        
        // Efectos dramáticos
        this.createSpawnEffect();
        
        // Música de jefe (si está implementada)
        this.playBossMusic(bossType);
        
        return this.currentBoss;
    },
    
    // Actualizar jefe
    updateBoss: function(player, projectiles, particles) {
        if (!this.currentBoss || !this.currentBoss.active) return;
        
        const boss = this.currentBoss;
        const config = this.bosses[boss.type];
        
        // Actualizar fase según vida
        const healthPercent = boss.health / boss.maxHealth;
        let newPhase = 0;
        for (let i = config.phases.length - 1; i >= 0; i--) {
            if (healthPercent <= config.phases[i].healthPercent) {
                newPhase = i;
                break;
            }
        }
        
        if (newPhase !== boss.phase) {
            boss.phase = newPhase;
            this.onPhaseChange(boss.type, newPhase);
        }
        
        const currentPhase = config.phases[boss.phase];
        
        // Movimiento del jefe
        this.updateBossMovement(boss, player, currentPhase);
        
        // Sistema de ataques
        this.updateBossAttacks(boss, player, config, currentPhase);
        
        // Actualizar tentáculos (Kraken)
        if (boss.type === 'kraken') {
            this.updateTentacles(boss, player, currentPhase);
        }
        
        // Actualizar minions
        this.updateMinions(player);
        
        // Verificar muerte
        if (boss.health <= 0) {
            this.defeatBoss(boss.type);
        }
    },
    
    // Movimiento del jefe
    updateBossMovement: function(boss, player, phase) {
        const dx = player.x - boss.x;
        const dy = player.y - boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Movimiento según el tipo de jefe
        switch(boss.type) {
            case 'kraken':
                // El Kraken se mantiene relativamente estático pero gira
                boss.angle += 0.01 * phase.speed;
                if (distance > 300) {
                    boss.x += (dx / distance) * 0.5 * phase.speed;
                    boss.y += (dy / distance) * 0.5 * phase.speed;
                }
                break;
                
            case 'leviathan':
                // El Leviatán circula alrededor del jugador
                const circleAngle = Date.now() * 0.0005 * phase.speed;
                const circleRadius = 400;
                boss.x = player.x + Math.cos(circleAngle) * circleRadius;
                boss.y = player.y + Math.sin(circleAngle) * circleRadius;
                boss.angle = Math.atan2(dy, dx);
                break;
                
            case 'poseidon':
                // Poseidón se teletransporta y persigue
                if (phase.form === 'divine' && Math.random() < 0.01) {
                    // Teletransporte
                    const teleAngle = Math.random() * Math.PI * 2;
                    const teleDist = 200 + Math.random() * 200;
                    boss.x = player.x + Math.cos(teleAngle) * teleDist;
                    boss.y = player.y + Math.sin(teleAngle) * teleDist;
                    this.createTeleportEffect(boss.x, boss.y);
                } else {
                    // Persecución normal
                    if (distance > 150) {
                        boss.x += (dx / distance) * 2 * phase.speed;
                        boss.y += (dy / distance) * 2 * phase.speed;
                    }
                }
                boss.angle = Math.atan2(dy, dx);
                break;
        }
    },
    
    // Sistema de ataques
    updateBossAttacks: function(boss, player, config, phase) {
        const now = Date.now();
        
        for (let attack of config.attacks) {
            if (!boss.lastAttack[attack.name]) {
                boss.lastAttack[attack.name] = 0;
            }
            
            if (now - boss.lastAttack[attack.name] > attack.cooldown) {
                // Ejecutar ataque
                this.executeBossAttack(boss, player, attack, phase);
                boss.lastAttack[attack.name] = now;
            }
        }
    },
    
    // Ejecutar ataque específico
    executeBossAttack: function(boss, player, attack, phase) {
        // Mostrar advertencia
        if (attack.warning) {
            this.showAttackWarning(boss, attack);
        }
        
        // Ejecutar después del warning
        setTimeout(() => {
            switch(attack.animation) {
                case 'tentacle_whip':
                    this.tentacleWhipAttack(boss, player, attack);
                    break;
                case 'tentacle_grab':
                    this.tentacleGrabAttack(boss, player, attack);
                    break;
                case 'ink_cloud':
                    this.inkCloudAttack(boss, attack);
                    break;
                case 'summon_minions':
                    this.summonMinions(boss, attack.summons || 5);
                    break;
                case 'tsunami_wave':
                    this.tsunamiAttack(boss, player, attack);
                    break;
                case 'devour':
                    this.devourAttack(boss, player, attack);
                    break;
                case 'sonic_blast':
                    this.sonicBlastAttack(boss, player, attack);
                    break;
                case 'trident_strike':
                    this.tridentStrikeAttack(boss, player, attack);
                    break;
                case 'divine_wrath':
                    this.divineWrathAttack(boss, player, attack);
                    break;
                case 'summon_army':
                    this.summonArmy(boss, attack);
                    break;
            }
        }, attack.warning || 0);
    },
    
    // Ataques específicos del Kraken
    tentacleWhipAttack: function(boss, player, attack) {
        // Crear tentáculo que golpea
        const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
        const tentacle = {
            x: boss.x,
            y: boss.y,
            targetX: player.x,
            targetY: player.y,
            angle: angle,
            length: 200,
            animation: 'whip',
            damage: attack.damage,
            lifetime: 1000
        };
        this.tentacles.push(tentacle);
    },
    
    tentacleGrabAttack: function(boss, player, attack) {
        // Tentáculo que intenta agarrar al jugador
        for (let i = 0; i < 3; i++) {
            const offsetAngle = (i - 1) * 0.5;
            const angle = Math.atan2(player.y - boss.y, player.x - boss.x) + offsetAngle;
            const tentacle = {
                x: boss.x + Math.cos(angle) * 100,
                y: boss.y + Math.sin(angle) * 100,
                targetX: player.x,
                targetY: player.y,
                angle: angle,
                length: 300,
                animation: 'grab',
                damage: attack.damage,
                lifetime: 2000
            };
            this.tentacles.push(tentacle);
        }
    },
    
    inkCloudAttack: function(boss, attack) {
        // Crear nube de tinta que ciega
        if (window.gameState) {
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                const particle = {
                    x: boss.x,
                    y: boss.y,
                    vx: Math.cos(angle) * 5,
                    vy: Math.sin(angle) * 5,
                    size: 50,
                    color: 'rgba(0, 0, 0, 0.8)',
                    lifetime: 100,
                    type: 'ink'
                };
                window.gameState.particles.push(particle);
            }
        }
    },
    
    // Invocar minions
    summonMinions: function(boss, count) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const distance = 200;
            const minion = {
                x: boss.x + Math.cos(angle) * distance,
                y: boss.y + Math.sin(angle) * distance,
                health: 50,
                maxHealth: 50,
                damage: 10,
                speed: 2,
                size: 15,
                type: boss.type + '_minion',
                angle: angle + Math.PI
            };
            this.minions.push(minion);
        }
    },
    
    // Ataques del Leviatán
    tsunamiAttack: function(boss, player, attack) {
        // Crear ola gigante
        const wave = {
            x: boss.x,
            y: boss.y,
            width: 800,
            height: 200,
            angle: Math.atan2(player.y - boss.y, player.x - boss.x),
            speed: 5,
            damage: attack.damage,
            lifetime: 3000
        };
        // Añadir a efectos especiales
        if (window.gameState) {
            window.gameState.specialEffects = window.gameState.specialEffects || [];
            window.gameState.specialEffects.push(wave);
        }
    },
    
    // Dibujar jefe
    drawBoss: function(ctx, camera) {
        if (!this.currentBoss || !this.currentBoss.active) return;
        
        const boss = this.currentBoss;
        const config = this.bosses[boss.type];
        const screenX = boss.x - camera.x;
        const screenY = boss.y - camera.y;
        
        ctx.save();
        
        // Efecto de resplandor del jefe
        const glowSize = boss.size * 2;
        const glowGradient = ctx.createRadialGradient(screenX, screenY, boss.size, screenX, screenY, glowSize);
        glowGradient.addColorStop(0, config.glowColor + '40');
        glowGradient.addColorStop(0.5, config.glowColor + '20');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Dibujar según el tipo de jefe
        ctx.translate(screenX, screenY);
        ctx.rotate(boss.angle);
        
        switch(boss.type) {
            case 'kraken':
                this.drawKraken(ctx, boss, config);
                break;
            case 'leviathan':
                this.drawLeviathan(ctx, boss, config);
                break;
            case 'poseidon':
                this.drawPoseidon(ctx, boss, config);
                break;
        }
        
        ctx.restore();
        
        // Dibujar tentáculos
        this.drawTentacles(ctx, camera);
        
        // Dibujar minions
        this.drawMinions(ctx, camera);
        
        // Dibujar barra de vida del jefe
        this.drawBossHealthBar(ctx, boss, config);
    },
    
    // Dibujar Kraken
    drawKraken: function(ctx, boss, config) {
        const phase = config.phases[boss.phase];
        
        // Cuerpo principal
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, boss.size, boss.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ojos brillantes
        ctx.fillStyle = '#FF0000';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FF0000';
        ctx.beginPath();
        ctx.arc(-boss.size * 0.3, -boss.size * 0.2, 10, 0, Math.PI * 2);
        ctx.arc(boss.size * 0.3, -boss.size * 0.2, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Tentáculos base
        for (let i = 0; i < phase.tentacles; i++) {
            const angle = (i / phase.tentacles) * Math.PI * 2;
            const tentacleLength = boss.size * 2;
            const waveOffset = Math.sin(Date.now() * 0.002 + i) * 20;
            
            ctx.strokeStyle = config.color;
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(
                Math.cos(angle) * boss.size + waveOffset,
                Math.sin(angle) * boss.size,
                Math.cos(angle) * tentacleLength,
                Math.sin(angle) * tentacleLength
            );
            ctx.stroke();
        }
        
        // Boca con dientes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(0, boss.size * 0.2, boss.size * 0.3, 0, Math.PI);
        ctx.fill();
        
        // Dientes
        ctx.fillStyle = '#FFFFFF';
        for (let i = -3; i <= 3; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 10, boss.size * 0.2);
            ctx.lineTo(i * 10 - 3, boss.size * 0.35);
            ctx.lineTo(i * 10 + 3, boss.size * 0.35);
            ctx.closePath();
            ctx.fill();
        }
    },
    
    // Dibujar barra de vida del jefe
    drawBossHealthBar: function(ctx, boss, config) {
        const barWidth = 400;
        const barHeight = 30;
        const barX = ctx.canvas.width / 2 - barWidth / 2;
        const barY = 50;
        
        // Fondo de la barra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10);
        
        // Borde decorativo
        ctx.strokeStyle = config.glowColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(barX - 5, barY - 5, barWidth + 10, barHeight + 10);
        
        // Barra de vida
        const healthPercent = boss.health / boss.maxHealth;
        const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY);
        
        if (healthPercent > 0.5) {
            gradient.addColorStop(0, '#00C853');
            gradient.addColorStop(1, '#00E676');
        } else if (healthPercent > 0.25) {
            gradient.addColorStop(0, '#FFB300');
            gradient.addColorStop(1, '#FFD54F');
        } else {
            gradient.addColorStop(0, '#D32F2F');
            gradient.addColorStop(1, '#FF5252');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Segmentos de fase
        const phases = config.phases;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        for (let phase of phases) {
            if (phase.healthPercent < 1) {
                const x = barX + barWidth * phase.healthPercent;
                ctx.beginPath();
                ctx.moveTo(x, barY);
                ctx.lineTo(x, barY + barHeight);
                ctx.stroke();
            }
        }
        
        // Nombre del jefe
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(config.name, ctx.canvas.width / 2, barY - 15);
        
        // Vida numérica
        ctx.font = '16px Arial';
        ctx.fillText(`${Math.floor(boss.health)} / ${boss.maxHealth}`, ctx.canvas.width / 2, barY + barHeight + 20);
    },
    
    // Mostrar mensaje del jefe
    showBossMessage: function(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '30%';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translate(-50%, -50%)';
        messageDiv.style.padding = '20px 40px';
        messageDiv.style.fontSize = '24px';
        messageDiv.style.fontWeight = 'bold';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.zIndex = '9999';
        messageDiv.style.animation = 'bossMessagePulse 0.5s ease';
        messageDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        
        if (type === 'spawn') {
            messageDiv.style.color = '#FF0000';
            messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            messageDiv.style.border = '3px solid #FF0000';
        } else if (type === 'defeat') {
            messageDiv.style.color = '#FFD700';
            messageDiv.style.backgroundColor = 'rgba(0, 50, 0, 0.9)';
            messageDiv.style.border = '3px solid #FFD700';
        }
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // Añadir animación CSS si no existe
        if (!document.getElementById('bossAnimations')) {
            const style = document.createElement('style');
            style.id = 'bossAnimations';
            style.textContent = `
                @keyframes bossMessagePulse {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Eliminar mensaje después de 5 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    },
    
    // Derrotar al jefe
    defeatBoss: function(bossType) {
        const config = this.bosses[bossType];
        
        // Marcar como derrotado
        this.defeatedBosses[bossType] = true;
        this.currentBoss.active = false;
        
        // Mostrar mensaje de victoria
        this.showBossMessage(config.defeatMessage, 'defeat');
        
        // Otorgar recompensas
        if (window.gameState && window.gameState.player) {
            const player = window.gameState.player;
            player.gainExp(config.rewards.exp);
            player.gems += config.rewards.gems;
            player.updateUI();
            
            // Desbloquear items
            if (config.rewards.unlocks) {
                this.unlockRewards(config.rewards.unlocks);
            }
        }
        
        // Efectos de celebración
        this.createVictoryEffect();
        
        // Limpiar
        setTimeout(() => {
            this.currentBoss = null;
            this.tentacles = [];
            this.minions = [];
        }, 3000);
    },
    
    // Efectos especiales
    createSpawnEffect: function() {
        if (!window.gameState) return;
        
        // Crear ondas de choque
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                for (let j = 0; j < 20; j++) {
                    const angle = (j / 20) * Math.PI * 2;
                    const particle = {
                        x: this.currentBoss.x,
                        y: this.currentBoss.y,
                        vx: Math.cos(angle) * (10 - i * 2),
                        vy: Math.sin(angle) * (10 - i * 2),
                        size: 20,
                        color: this.bosses[this.currentBoss.type].glowColor,
                        lifetime: 50,
                        type: 'shockwave'
                    };
                    window.gameState.particles.push(particle);
                }
            }, i * 200);
        }
    },
    
    createVictoryEffect: function() {
        if (!window.gameState || !this.currentBoss) return;
        
        // Explosión de partículas doradas
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2;
            const speed = Math.random() * 10 + 5;
            const particle = {
                x: this.currentBoss.x,
                y: this.currentBoss.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 10 + 5,
                color: '#FFD700',
                lifetime: 100,
                type: 'victory'
            };
            window.gameState.particles.push(particle);
        }
    }
};

// Exportar para uso en el juego
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BossSystem;
}