// Sistema de Compañeros/Mascotas
const PetSystem = {
    // Catálogo de mascotas
    pets: {
        dolphin: {
            id: 'dolphin',
            name: '🐬 Delfín Explorador',
            description: 'Revela tesoros ocultos y aumenta la velocidad de nado',
            unlockLevel: 5,
            price: 200,
            stats: {
                speedBonus: 0.2,
                visionRange: 1.3,
                treasureDetection: true
            },
            abilities: {
                sonarPulse: {
                    name: 'Pulso de Sonar',
                    cooldown: 10000,
                    effect: 'reveal_area',
                    range: 500
                }
            },
            animation: {
                swimPattern: 'circular',
                jumpChance: 0.01,
                soundEffect: 'dolphin_click'
            }
        },
        
        turtle: {
            id: 'turtle',
            name: '🐢 Tortuga Escudo',
            description: 'Absorbe daño y proporciona regeneración de vida',
            unlockLevel: 8,
            price: 350,
            stats: {
                damageReduction: 0.15,
                healthRegen: 1,
                armor: 10
            },
            abilities: {
                shellShield: {
                    name: 'Escudo de Caparazón',
                    cooldown: 15000,
                    duration: 5000,
                    effect: 'invulnerability'
                }
            },
            animation: {
                swimPattern: 'follow_close',
                shellGlow: true
            }
        },
        
        octopus: {
            id: 'octopus',
            name: '🐙 Pulpo Artillero',
            description: 'Dispara proyectiles adicionales y crea nubes de tinta',
            unlockLevel: 12,
            price: 500,
            stats: {
                extraShots: 2,
                attackSpeed: 0.2,
                inkCloudChance: 0.1
            },
            abilities: {
                inkBomb: {
                    name: 'Bomba de Tinta',
                    cooldown: 20000,
                    effect: 'blind_enemies',
                    duration: 3000,
                    radius: 200
                }
            },
            animation: {
                swimPattern: 'patrol',
                tentacleWave: true,
                attackAnimation: 'tentacle_strike'
            }
        },
        
        seahorse: {
            id: 'seahorse',
            name: '🌊 Caballito de Mar Místico',
            description: 'Aumenta la experiencia ganada y otorga suerte',
            unlockLevel: 15,
            price: 750,
            stats: {
                expMultiplier: 1.5,
                luckBonus: 0.2,
                gemDropRate: 0.1
            },
            abilities: {
                luckyCharm: {
                    name: 'Encanto de Suerte',
                    cooldown: 30000,
                    duration: 10000,
                    effect: 'double_rewards'
                }
            },
            animation: {
                swimPattern: 'hover',
                sparkles: true,
                glowColor: '#FFD700'
            }
        },
        
        shark: {
            id: 'shark',
            name: '🦈 Tiburón Guardián',
            description: 'Ataca automáticamente a los enemigos cercanos',
            unlockLevel: 20,
            price: 1000,
            stats: {
                damage: 25,
                attackRange: 150,
                intimidation: 0.3
            },
            abilities: {
                feedingFrenzy: {
                    name: 'Frenesí Alimenticio',
                    cooldown: 25000,
                    duration: 8000,
                    effect: 'berserk_mode',
                    damageMultiplier: 2
                }
            },
            animation: {
                swimPattern: 'aggressive_patrol',
                biteAnimation: true,
                bloodEffect: true
            }
        },
        
        jellyfish: {
            id: 'jellyfish',
            name: '✨ Medusa Eléctrica',
            description: 'Electrocuta enemigos cercanos y proporciona luz',
            unlockLevel: 10,
            price: 400,
            stats: {
                electricDamage: 5,
                stunChance: 0.1,
                lightRadius: 200
            },
            abilities: {
                electricField: {
                    name: 'Campo Eléctrico',
                    cooldown: 18000,
                    duration: 4000,
                    effect: 'area_damage',
                    dps: 10
                }
            },
            animation: {
                swimPattern: 'floating',
                electricPulse: true,
                glowIntensity: 'high'
            }
        }
    },
    
    // Estado actual de las mascotas
    activePets: [],
    maxActivePets: 2,
    unlockedPets: [],
    petInstances: [],
    
    // Inicializar sistema
    init: function() {
        this.unlockedPets = ['dolphin']; // Delfín gratis al inicio
        this.loadSavedPets();
    },
    
    // Cargar mascotas guardadas
    loadSavedPets: function() {
        const saved = localStorage.getItem('unlockedPets');
        if (saved) {
            this.unlockedPets = JSON.parse(saved);
        }
    },
    
    // Guardar progreso
    savePets: function() {
        localStorage.setItem('unlockedPets', JSON.stringify(this.unlockedPets));
    },
    
    // Desbloquear mascota
    unlockPet: function(petId) {
        if (!this.unlockedPets.includes(petId)) {
            this.unlockedPets.push(petId);
            this.savePets();
            return true;
        }
        return false;
    },
    
    // Activar mascota
    activatePet: function(petId, player) {
        if (!this.unlockedPets.includes(petId)) return false;
        if (this.activePets.length >= this.maxActivePets) return false;
        if (this.activePets.includes(petId)) return false;
        
        const petConfig = this.pets[petId];
        if (!petConfig) return false;
        
        // Crear instancia de mascota
        const petInstance = {
            id: petId,
            config: petConfig,
            x: player.x + Math.random() * 100 - 50,
            y: player.y + Math.random() * 100 - 50,
            angle: 0,
            health: 100,
            maxHealth: 100,
            lastAbility: 0,
            animationPhase: Math.random() * Math.PI * 2,
            target: null,
            state: 'following',
            effectActive: false
        };
        
        this.petInstances.push(petInstance);
        this.activePets.push(petId);
        
        // Aplicar bonificaciones al jugador
        this.applyPetBonuses(player, petConfig);
        
        return true;
    },
    
    // Desactivar mascota
    deactivatePet: function(petId, player) {
        const index = this.activePets.indexOf(petId);
        if (index === -1) return false;
        
        this.activePets.splice(index, 1);
        this.petInstances = this.petInstances.filter(p => p.id !== petId);
        
        // Remover bonificaciones
        const petConfig = this.pets[petId];
        this.removePetBonuses(player, petConfig);
        
        return true;
    },
    
    // Aplicar bonificaciones de mascota
    applyPetBonuses: function(player, petConfig) {
        const stats = petConfig.stats;
        
        if (stats.speedBonus) {
            player.speed *= (1 + stats.speedBonus);
        }
        if (stats.damageReduction) {
            player.damageReduction = (player.damageReduction || 0) + stats.damageReduction;
        }
        if (stats.healthRegen) {
            player.healthRegen = (player.healthRegen || 0) + stats.healthRegen;
        }
        if (stats.expMultiplier) {
            player.expMultiplier = (player.expMultiplier || 1) * stats.expMultiplier;
        }
        if (stats.extraShots) {
            player.extraShots = (player.extraShots || 0) + stats.extraShots;
        }
    },
    
    // Actualizar mascotas
    updatePets: function(player, enemies, gameState) {
        for (let pet of this.petInstances) {
            // Actualizar posición
            this.updatePetMovement(pet, player, enemies);
            
            // Actualizar habilidades
            this.updatePetAbilities(pet, player, enemies, gameState);
            
            // Comportamiento específico
            this.updatePetBehavior(pet, player, enemies, gameState);
            
            // Animación
            pet.animationPhase += 0.1;
        }
    },
    
    // Movimiento de mascota
    updatePetMovement: function(pet, player, enemies) {
        const config = pet.config;
        const pattern = config.animation.swimPattern;
        
        switch(pattern) {
            case 'circular':
                // Movimiento circular alrededor del jugador
                const radius = 80;
                const speed = 0.05;
                pet.x = player.x + Math.cos(pet.animationPhase * speed) * radius;
                pet.y = player.y + Math.sin(pet.animationPhase * speed) * radius;
                pet.angle = pet.animationPhase * speed + Math.PI / 2;
                break;
                
            case 'follow_close':
                // Seguir muy cerca del jugador
                const dx = player.x - pet.x;
                const dy = player.y - pet.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 50) {
                    pet.x += dx * 0.1;
                    pet.y += dy * 0.1;
                }
                pet.angle = Math.atan2(dy, dx);
                break;
                
            case 'patrol':
                // Patrullar alrededor buscando enemigos
                if (pet.target && enemies.includes(pet.target)) {
                    // Perseguir objetivo
                    const tdx = pet.target.x - pet.x;
                    const tdy = pet.target.y - pet.y;
                    const tdist = Math.sqrt(tdx * tdx + tdy * tdy);
                    if (tdist > 30) {
                        pet.x += (tdx / tdist) * 3;
                        pet.y += (tdy / tdist) * 3;
                    }
                    pet.angle = Math.atan2(tdy, tdx);
                } else {
                    // Buscar nuevo objetivo
                    pet.target = this.findNearestEnemy(pet, enemies, 200);
                    // Movimiento de patrulla
                    const patrolRadius = 120;
                    pet.x = player.x + Math.cos(pet.animationPhase * 0.03) * patrolRadius;
                    pet.y = player.y + Math.sin(pet.animationPhase * 0.03) * patrolRadius;
                }
                break;
                
            case 'hover':
                // Flotar suavemente cerca del jugador
                pet.x = player.x + 60 + Math.sin(pet.animationPhase * 0.05) * 20;
                pet.y = player.y - 40 + Math.cos(pet.animationPhase * 0.08) * 10;
                pet.angle = 0;
                break;
                
            case 'aggressive_patrol':
                // Patrulla agresiva (tiburón)
                const nearestEnemy = this.findNearestEnemy(pet, enemies, 300);
                if (nearestEnemy) {
                    const edx = nearestEnemy.x - pet.x;
                    const edy = nearestEnemy.y - pet.y;
                    const edist = Math.sqrt(edx * edx + edy * edy);
                    pet.x += (edx / edist) * 4;
                    pet.y += (edy / edist) * 4;
                    pet.angle = Math.atan2(edy, edx);
                    
                    // Atacar si está cerca
                    if (edist < 50) {
                        this.petAttack(pet, nearestEnemy);
                    }
                } else {
                    // Volver al jugador
                    const pdx = player.x - pet.x;
                    const pdy = player.y - pet.y;
                    if (Math.sqrt(pdx * pdx + pdy * pdy) > 150) {
                        pet.x += pdx * 0.05;
                        pet.y += pdy * 0.05;
                    }
                }
                break;
                
            case 'floating':
                // Flotación suave (medusa)
                pet.x = player.x - 50 + Math.sin(pet.animationPhase * 0.02) * 30;
                pet.y = player.y + Math.sin(pet.animationPhase * 0.04) * 40;
                pet.angle = 0;
                break;
        }
    },
    
    // Habilidades de mascota
    updatePetAbilities: function(pet, player, enemies, gameState) {
        const now = Date.now();
        const abilities = pet.config.abilities;
        
        for (let abilityKey in abilities) {
            const ability = abilities[abilityKey];
            
            if (now - pet.lastAbility > ability.cooldown) {
                // Activar habilidad según condiciones
                if (this.shouldUseAbility(pet, ability, player, enemies)) {
                    this.usePetAbility(pet, ability, player, enemies, gameState);
                    pet.lastAbility = now;
                }
            }
        }
    },
    
    // Comportamiento específico de cada mascota
    updatePetBehavior: function(pet, player, enemies, gameState) {
        switch(pet.id) {
            case 'dolphin':
                // Salto ocasional
                if (Math.random() < pet.config.animation.jumpChance) {
                    this.dolphinJump(pet);
                }
                // Detectar tesoros
                this.detectTreasures(pet, gameState);
                break;
                
            case 'octopus':
                // Disparar proyectiles adicionales
                if (player.lastAttack && Date.now() - player.lastAttack < 100) {
                    this.octopusExtraShots(pet, player, gameState);
                }
                break;
                
            case 'jellyfish':
                // Daño eléctrico a enemigos cercanos
                this.jellyfishElectricDamage(pet, enemies);
                break;
                
            case 'seahorse':
                // Generar partículas de suerte
                if (Math.random() < 0.02) {
                    this.createLuckyParticles(pet, gameState);
                }
                break;
        }
    },
    
    // Dibujar mascotas
    drawPets: function(ctx, camera) {
        for (let pet of this.petInstances) {
            const screenX = pet.x - camera.x;
            const screenY = pet.y - camera.y;
            
            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate(pet.angle);
            
            // Dibujar según el tipo de mascota
            this.drawPet(ctx, pet);
            
            ctx.restore();
            
            // Efectos especiales
            this.drawPetEffects(ctx, pet, screenX, screenY);
        }
    },
    
    // Dibujar mascota individual
    drawPet: function(ctx, pet) {
        const config = pet.config;
        const size = 20;
        
        // Efecto de resplandor si tiene habilidad activa
        if (pet.effectActive) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = config.animation.glowColor || '#00FFFF';
        }
        
        switch(pet.id) {
            case 'dolphin':
                this.drawDolphin(ctx, size, pet.animationPhase);
                break;
            case 'turtle':
                this.drawTurtle(ctx, size, pet.animationPhase);
                break;
            case 'octopus':
                this.drawOctopus(ctx, size, pet.animationPhase);
                break;
            case 'seahorse':
                this.drawSeahorse(ctx, size, pet.animationPhase);
                break;
            case 'shark':
                this.drawShark(ctx, size, pet.animationPhase);
                break;
            case 'jellyfish':
                this.drawJellyfish(ctx, size, pet.animationPhase);
                break;
        }
        
        ctx.shadowBlur = 0;
    },
    
    // Dibujar delfín
    drawDolphin: function(ctx, size, phase) {
        // Cuerpo
        ctx.fillStyle = '#4FC3F7';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 1.2, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Aleta dorsal
        ctx.fillStyle = '#29B6F6';
        ctx.beginPath();
        ctx.moveTo(-size * 0.2, -size * 0.5);
        ctx.lineTo(0, -size * 0.8);
        ctx.lineTo(size * 0.2, -size * 0.5);
        ctx.closePath();
        ctx.fill();
        
        // Cola
        const tailWave = Math.sin(phase * 0.3) * 0.2;
        ctx.beginPath();
        ctx.moveTo(-size * 1.2, 0);
        ctx.quadraticCurveTo(-size * 1.5, tailWave * size, -size * 1.8, 0);
        ctx.quadraticCurveTo(-size * 1.5, -tailWave * size, -size * 1.2, 0);
        ctx.fill();
        
        // Ojo
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(size * 0.5, -size * 0.1, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Sonrisa
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(size * 0.6, 0, size * 0.2, 0.2, Math.PI - 0.2);
        ctx.stroke();
    },
    
    // Dibujar tortuga
    drawTurtle: function(ctx, size, phase) {
        // Caparazón
        const shellGlow = Math.sin(phase * 0.1) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(76, 175, 80, ${shellGlow})`;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Patrón del caparazón
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
            ctx.stroke();
        }
        
        // Cabeza
        ctx.fillStyle = '#66BB6A';
        ctx.beginPath();
        ctx.arc(size * 0.8, 0, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Aletas
        const flipperWave = Math.sin(phase * 0.2) * 0.3;
        ctx.beginPath();
        ctx.ellipse(size * 0.5, size * 0.8, size * 0.3, size * 0.6, flipperWave, 0, Math.PI * 2);
        ctx.ellipse(size * 0.5, -size * 0.8, size * 0.3, size * 0.6, -flipperWave, 0, Math.PI * 2);
        ctx.ellipse(-size * 0.5, size * 0.8, size * 0.3, size * 0.6, -flipperWave, 0, Math.PI * 2);
        ctx.ellipse(-size * 0.5, -size * 0.8, size * 0.3, size * 0.6, flipperWave, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Funciones auxiliares
    findNearestEnemy: function(pet, enemies, range) {
        let nearest = null;
        let minDist = range;
        
        for (let enemy of enemies) {
            const dx = enemy.x - pet.x;
            const dy = enemy.y - pet.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        }
        
        return nearest;
    },
    
    petAttack: function(pet, target) {
        if (pet.config.stats.damage && target.takeDamage) {
            target.takeDamage(pet.config.stats.damage);
        }
    },
    
    shouldUseAbility: function(pet, ability, player, enemies) {
        // Lógica para decidir cuándo usar habilidades
        switch(ability.effect) {
            case 'reveal_area':
                return true; // Siempre útil
            case 'invulnerability':
                return player.health < player.maxHealth * 0.3;
            case 'blind_enemies':
                return enemies.length > 5;
            case 'double_rewards':
                return enemies.length > 3;
            case 'berserk_mode':
                return enemies.some(e => e.level > player.level);
            case 'area_damage':
                return enemies.filter(e => {
                    const dx = e.x - pet.x;
                    const dy = e.y - pet.y;
                    return Math.sqrt(dx * dx + dy * dy) < 150;
                }).length > 2;
            default:
                return false;
        }
    },
    
    usePetAbility: function(pet, ability, player, enemies, gameState) {
        pet.effectActive = true;
        
        // Aplicar efecto según tipo
        switch(ability.effect) {
            case 'reveal_area':
                this.revealArea(pet, ability.range, gameState);
                break;
            case 'invulnerability':
                player.invulnerable = true;
                setTimeout(() => {
                    player.invulnerable = false;
                    pet.effectActive = false;
                }, ability.duration);
                break;
            case 'blind_enemies':
                this.blindEnemies(pet, enemies, ability);
                break;
            case 'double_rewards':
                player.rewardMultiplier = 2;
                setTimeout(() => {
                    player.rewardMultiplier = 1;
                    pet.effectActive = false;
                }, ability.duration);
                break;
            case 'berserk_mode':
                pet.berserkMode = true;
                setTimeout(() => {
                    pet.berserkMode = false;
                    pet.effectActive = false;
                }, ability.duration);
                break;
            case 'area_damage':
                this.areaDamage(pet, enemies, ability);
                break;
        }
        
        // Efecto visual de activación
        this.createAbilityEffect(pet, ability, gameState);
    }
};

// Exportar para uso en el juego
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PetSystem;
}