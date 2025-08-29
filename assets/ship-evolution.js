// Sistema de Evolución Visual de la Nave
const ShipEvolution = {
    // Configuración de evolución por niveles
    levelTiers: [
        {
            minLevel: 1,
            maxLevel: 5,
            name: 'Submarino Básico',
            baseColor: '#2565A3',
            accentColor: '#4A90E2',
            size: 25,
            features: {
                hull: 'basic',
                cockpit: 'simple',
                fins: 'small',
                details: 'minimal'
            },
            effects: {
                trail: false,
                glow: false,
                particles: false
            }
        },
        {
            minLevel: 6,
            maxLevel: 10,
            name: 'Submarino Mejorado',
            baseColor: '#1E90FF',
            accentColor: '#87CEEB',
            size: 30,
            features: {
                hull: 'reinforced',
                cockpit: 'advanced',
                fins: 'medium',
                details: 'moderate',
                lights: 'bright'
            },
            effects: {
                trail: true,
                glow: false,
                particles: true,
                bubbles: 'small'
            }
        },
        {
            minLevel: 11,
            maxLevel: 15,
            name: 'Nave de Combate',
            baseColor: '#0047AB',
            accentColor: '#FFD700',
            size: 35,
            features: {
                hull: 'armored',
                cockpit: 'tactical',
                fins: 'large',
                details: 'complex',
                cannons: 'visible',
                sensors: true,
                lights: 'pulsing'
            },
            effects: {
                trail: true,
                glow: true,
                particles: true,
                bubbles: 'medium',
                energyField: 'weak'
            }
        },
        {
            minLevel: 16,
            maxLevel: 20,
            name: 'Crucero de Guerra',
            baseColor: '#191970',
            accentColor: '#C0C0C0',
            size: 40,
            features: {
                hull: 'heavy_armor',
                cockpit: 'command',
                fins: 'angular',
                details: 'battle_worn',
                cannons: 'multiple',
                shields: 'visible',
                propulsors: 'dual',
                battleScars: true
            },
            effects: {
                trail: true,
                glow: true,
                particles: true,
                bubbles: 'large',
                energyField: 'medium',
                aura: true
            }
        },
        {
            minLevel: 21,
            maxLevel: 999,
            name: 'Acorazado Legendario',
            baseColor: '#4B0082',
            accentColor: '#FF00FF',
            size: 45,
            features: {
                hull: 'quantum',
                cockpit: 'holographic',
                fins: 'energy',
                details: 'futuristic',
                cannons: 'plasma',
                shields: 'hexagonal',
                propulsors: 'quantum',
                energyCore: true,
                battleScars: true
            },
            effects: {
                trail: true,
                glow: true,
                particles: true,
                bubbles: 'plasma',
                energyField: 'strong',
                aura: true,
                distortion: true,
                lightning: true
            }
        }
    ],
    
    // Modificaciones visuales por equipo
    equipmentVisuals: {
        shields: {
            basic_shield: {
                effect: 'none',
                color: 'transparent',
                opacity: 0
            },
            reinforced_shield: {
                effect: 'glow',
                color: '#00BFFF',
                opacity: 0.2,
                pulse: true
            },
            energy_shield: {
                effect: 'bubble',
                color: '#00FA9A',
                opacity: 0.3,
                pulse: true,
                electric: true
            },
            quantum_shield: {
                effect: 'hexagonal',
                color: '#FFD700',
                opacity: 0.4,
                pulse: true,
                electric: true,
                rotation: true
            }
        },
        weapons: {
            torpedo_mk1: {
                cannons: 1,
                position: 'front',
                size: 'small',
                color: '#74C0FC'
            },
            torpedo_mk2: {
                cannons: 2,
                position: 'front',
                size: 'medium',
                color: '#339AF0',
                glow: true
            },
            plasma_torpedo: {
                cannons: 2,
                position: 'front_sides',
                size: 'medium',
                color: '#00FA9A',
                glow: true,
                energy: true
            },
            quantum_torpedo: {
                cannons: 4,
                position: 'turrets',
                size: 'large',
                color: '#FF6B6B',
                glow: true,
                energy: true,
                rotating: true
            },
            void_torpedo: {
                cannons: 1,
                position: 'central',
                size: 'massive',
                color: '#9C36B5',
                glow: true,
                energy: true,
                vortex: true
            }
        },
        engines: {
            basic_engine: {
                thrusters: 1,
                size: 'small',
                color: '#74C0FC',
                trail: 'bubbles'
            },
            turbo_engine: {
                thrusters: 2,
                size: 'medium',
                color: '#00CED1',
                trail: 'stream',
                afterburner: true
            },
            ion_engine: {
                thrusters: 3,
                size: 'large',
                color: '#00FA9A',
                trail: 'plasma',
                afterburner: true,
                particles: true
            },
            warp_engine: {
                thrusters: 4,
                size: 'huge',
                color: '#FF6B6B',
                trail: 'distortion',
                afterburner: true,
                particles: true,
                warp: true
            }
        }
    },
    
    // Obtener configuración visual actual
    getCurrentVisuals: function(player) {
        // Obtener tier de nivel
        const tier = this.levelTiers.find(t => 
            player.level >= t.minLevel && player.level <= t.maxLevel
        ) || this.levelTiers[0];
        
        // Obtener modificaciones de equipo
        const equipment = {
            shield: null,
            weapon: null,
            engine: null
        };
        
        if (window.MerchantSystem) {
            equipment.shield = window.MerchantSystem.getEquippedItem('shield');
            equipment.weapon = window.MerchantSystem.getEquippedItem('weapon');
            equipment.engine = window.MerchantSystem.getEquippedItem('engine');
        }
        
        return {
            tier: tier,
            equipment: equipment,
            health: player.health / player.maxHealth
        };
    },
    
    // Dibujar la nave evolucionada
    drawEvolvedShip: function(ctx, player) {
        const visuals = this.getCurrentVisuals(player);
        const tier = visuals.tier;
        const screenX = player.x - gameState.camera.x;
        const screenY = player.y - gameState.camera.y;
        
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(player.angle);
        
        // Efectos de daño
        if (visuals.health < 0.5) {
            this.drawDamageEffects(ctx, visuals.health, tier.size);
        }
        
        // Dibujar escudo si existe
        if (visuals.equipment.shield) {
            this.drawShieldEffect(ctx, visuals.equipment.shield, tier.size);
        }
        
        // Dibujar aura de nivel
        if (tier.effects.aura) {
            this.drawLevelAura(ctx, tier, player.level);
        }
        
        // Dibujar casco principal
        this.drawHull(ctx, tier, visuals.health);
        
        // Dibujar mejoras de armas
        if (visuals.equipment.weapon) {
            this.drawWeaponSystems(ctx, visuals.equipment.weapon, tier.size);
        }
        
        // Dibujar propulsores
        if (visuals.equipment.engine) {
            this.drawEngineSystems(ctx, visuals.equipment.engine, tier.size, player.propellerAngle);
        }
        
        // Dibujar cabina
        this.drawCockpit(ctx, tier);
        
        // Dibujar detalles y efectos
        this.drawDetails(ctx, tier, player.level);
        
        ctx.restore();
        
        // Efectos post-procesado
        if (tier.effects.distortion) {
            this.drawDistortionField(ctx, screenX, screenY, tier.size);
        }
    },
    
    // Dibujar casco principal
    drawHull: function(ctx, tier, healthPercent) {
        // Color base con daño
        let hullColor = tier.baseColor;
        if (healthPercent < 0.5) {
            // Oscurecer el color según el daño
            hullColor = this.darkenColor(tier.baseColor, (0.5 - healthPercent) * 40);
        }
        
        // Casco principal
        ctx.fillStyle = hullColor;
        ctx.strokeStyle = this.darkenColor(hullColor, 20);
        ctx.lineWidth = 2;
        
        // Forma según el tier
        switch(tier.features.hull) {
            case 'basic':
                ctx.beginPath();
                ctx.ellipse(0, 0, tier.size * 1.2, tier.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;
                
            case 'reinforced':
                ctx.beginPath();
                ctx.ellipse(0, 0, tier.size * 1.3, tier.size * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                // Placas de refuerzo
                ctx.strokeStyle = tier.accentColor;
                ctx.lineWidth = 1;
                ctx.strokeRect(-tier.size * 0.8, -tier.size * 0.3, tier.size * 0.4, tier.size * 0.6);
                ctx.strokeRect(tier.size * 0.4, -tier.size * 0.3, tier.size * 0.4, tier.size * 0.6);
                break;
                
            case 'armored':
                // Casco angular
                ctx.beginPath();
                ctx.moveTo(tier.size * 1.5, 0);
                ctx.lineTo(tier.size * 0.8, -tier.size * 0.6);
                ctx.lineTo(-tier.size * 0.8, -tier.size * 0.6);
                ctx.lineTo(-tier.size * 1.5, 0);
                ctx.lineTo(-tier.size * 0.8, tier.size * 0.6);
                ctx.lineTo(tier.size * 0.8, tier.size * 0.6);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // Líneas doradas
                ctx.strokeStyle = tier.accentColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-tier.size, 0);
                ctx.lineTo(tier.size, 0);
                ctx.stroke();
                break;
                
            case 'heavy_armor':
            case 'quantum':
                // Diseño futurista angular
                ctx.beginPath();
                ctx.moveTo(tier.size * 1.6, 0);
                ctx.lineTo(tier.size * 1.2, -tier.size * 0.4);
                ctx.lineTo(tier.size * 0.6, -tier.size * 0.7);
                ctx.lineTo(-tier.size * 0.6, -tier.size * 0.7);
                ctx.lineTo(-tier.size * 1.2, -tier.size * 0.4);
                ctx.lineTo(-tier.size * 1.6, 0);
                ctx.lineTo(-tier.size * 1.2, tier.size * 0.4);
                ctx.lineTo(-tier.size * 0.6, tier.size * 0.7);
                ctx.lineTo(tier.size * 0.6, tier.size * 0.7);
                ctx.lineTo(tier.size * 1.2, tier.size * 0.4);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Núcleo de energía para quantum
                if (tier.features.energyCore) {
                    const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, tier.size * 0.3);
                    coreGradient.addColorStop(0, tier.accentColor);
                    coreGradient.addColorStop(0.5, this.lightenColor(tier.accentColor, 50));
                    coreGradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = coreGradient;
                    ctx.beginPath();
                    ctx.arc(0, 0, tier.size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }
        
        // Marcas de batalla
        if (tier.features.battleScars && healthPercent < 0.75) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.random() * tier.size - tier.size/2, Math.random() * tier.size - tier.size/2);
                ctx.lineTo(Math.random() * tier.size - tier.size/2, Math.random() * tier.size - tier.size/2);
                ctx.stroke();
            }
        }
    },
    
    // Dibujar cabina
    drawCockpit: function(ctx, tier) {
        const cockpitSize = tier.size * 0.5;
        
        switch(tier.features.cockpit) {
            case 'simple':
                ctx.fillStyle = 'rgba(168, 218, 220, 0.8)';
                ctx.beginPath();
                ctx.arc(tier.size * 0.3, 0, cockpitSize * 0.4, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'advanced':
                ctx.fillStyle = 'rgba(168, 218, 220, 0.9)';
                ctx.beginPath();
                ctx.ellipse(tier.size * 0.3, 0, cockpitSize * 0.6, cockpitSize * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#336699';
                ctx.lineWidth = 1;
                ctx.stroke();
                break;
                
            case 'tactical':
                // Cabina con ventanas múltiples
                ctx.fillStyle = 'rgba(168, 218, 220, 0.7)';
                ctx.strokeStyle = tier.accentColor;
                ctx.lineWidth = 1;
                for (let i = -1; i <= 1; i++) {
                    ctx.beginPath();
                    ctx.arc(tier.size * 0.3 + i * 8, 0, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
                break;
                
            case 'command':
            case 'holographic':
                // Cabina de comando con HUD
                const gradient = ctx.createRadialGradient(tier.size * 0.3, 0, 0, tier.size * 0.3, 0, cockpitSize);
                gradient.addColorStop(0, 'rgba(0, 255, 255, 0.9)');
                gradient.addColorStop(0.5, 'rgba(168, 218, 220, 0.7)');
                gradient.addColorStop(1, 'rgba(51, 102, 153, 0.5)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(tier.size * 0.3, 0, cockpitSize * 0.8, cockpitSize * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // HUD holográfico
                if (tier.features.cockpit === 'holographic') {
                    ctx.strokeStyle = tier.accentColor;
                    ctx.lineWidth = 0.5;
                    ctx.globalAlpha = 0.5;
                    for (let i = 0; i < 3; i++) {
                        ctx.beginPath();
                        ctx.arc(tier.size * 0.3, 0, cockpitSize * (0.6 + i * 0.2), 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    ctx.globalAlpha = 1;
                }
                break;
        }
    },
    
    // Dibujar sistemas de armas
    drawWeaponSystems: function(ctx, weapon, baseSize) {
        if (!weapon || !weapon.visual) return;
        
        const v = this.equipmentVisuals.weapons[weapon.id];
        if (!v) return;
        
        ctx.fillStyle = v.color;
        ctx.strokeStyle = this.darkenColor(v.color, 30);
        ctx.lineWidth = 1;
        
        switch(v.position) {
            case 'front':
                for (let i = 0; i < v.cannons; i++) {
                    const offset = (i - (v.cannons - 1) / 2) * 8;
                    ctx.fillRect(baseSize * 0.8, offset - 2, baseSize * 0.3, 4);
                    if (v.glow) {
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = v.color;
                    }
                }
                break;
                
            case 'front_sides':
                // Cañones frontales y laterales
                ctx.fillRect(baseSize * 0.8, -2, baseSize * 0.3, 4);
                ctx.fillRect(baseSize * 0.5, -baseSize * 0.4, 8, 4);
                ctx.fillRect(baseSize * 0.5, baseSize * 0.4 - 4, 8, 4);
                break;
                
            case 'turrets':
                // Torretas giratorias
                for (let i = 0; i < v.cannons; i++) {
                    const angle = (i / v.cannons) * Math.PI * 2;
                    const x = Math.cos(angle) * baseSize * 0.6;
                    const y = Math.sin(angle) * baseSize * 0.6;
                    
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    
                    // Base de la torreta
                    ctx.beginPath();
                    ctx.arc(0, 0, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Cañón
                    ctx.fillRect(0, -1.5, 10, 3);
                    
                    ctx.restore();
                }
                break;
                
            case 'central':
                // Cañón masivo central
                const cannonGradient = ctx.createRadialGradient(baseSize * 0.9, 0, 0, baseSize * 0.9, 0, 8);
                cannonGradient.addColorStop(0, v.color);
                cannonGradient.addColorStop(0.5, this.lightenColor(v.color, 30));
                cannonGradient.addColorStop(1, v.color);
                ctx.fillStyle = cannonGradient;
                ctx.beginPath();
                ctx.ellipse(baseSize * 0.9, 0, 12, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                // Núcleo de energía del cañón
                if (v.vortex) {
                    ctx.fillStyle = this.lightenColor(v.color, 50);
                    ctx.beginPath();
                    ctx.arc(baseSize * 0.9, 0, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
        }
        
        ctx.shadowBlur = 0;
    },
    
    // Dibujar sistemas de motor
    drawEngineSystems: function(ctx, engine, baseSize, propellerAngle) {
        if (!engine || !engine.visual) return;
        
        const v = this.equipmentVisuals.engines[engine.id];
        if (!v) return;
        
        // Dibujar propulsores
        for (let i = 0; i < v.thrusters; i++) {
            const offset = (i - (v.thrusters - 1) / 2) * 10;
            
            ctx.save();
            ctx.translate(-baseSize * 1.2, offset);
            
            // Propulsor
            ctx.fillStyle = '#457B9D';
            ctx.strokeStyle = '#1A457D';
            ctx.lineWidth = 1;
            ctx.fillRect(-6, -4, 12, 8);
            ctx.stroke();
            
            // Hélice animada
            ctx.rotate(propellerAngle * (1 + i * 0.1));
            ctx.fillStyle = v.color;
            ctx.globalAlpha = 0.7;
            ctx.fillRect(-8, -1, 16, 2);
            ctx.fillRect(-1, -8, 2, 16);
            ctx.globalAlpha = 1;
            
            ctx.restore();
        }
        
        // Efecto de propulsión
        if (v.afterburner) {
            const thrustGradient = ctx.createLinearGradient(-baseSize * 1.5, 0, -baseSize * 2, 0);
            thrustGradient.addColorStop(0, v.color);
            thrustGradient.addColorStop(0.5, this.lightenColor(v.color, 50));
            thrustGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = thrustGradient;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(-baseSize * 1.3, 0);
            ctx.lineTo(-baseSize * 2, -baseSize * 0.3);
            ctx.lineTo(-baseSize * 2, baseSize * 0.3);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    },
    
    // Dibujar efecto de escudo
    drawShieldEffect: function(ctx, shield, baseSize) {
        const v = this.equipmentVisuals.shields[shield.id];
        if (!v || v.effect === 'none') return;
        
        ctx.save();
        ctx.globalAlpha = v.opacity;
        
        switch(v.effect) {
            case 'glow':
                ctx.strokeStyle = v.color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.ellipse(0, 0, baseSize * 1.5, baseSize * 1.2, 0, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'bubble':
                const bubbleGradient = ctx.createRadialGradient(0, 0, baseSize, 0, 0, baseSize * 1.8);
                bubbleGradient.addColorStop(0, 'transparent');
                bubbleGradient.addColorStop(0.7, v.color);
                bubbleGradient.addColorStop(1, 'transparent');
                ctx.fillStyle = bubbleGradient;
                ctx.beginPath();
                ctx.ellipse(0, 0, baseSize * 1.8, baseSize * 1.5, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'hexagonal':
                // Escudo hexagonal
                ctx.strokeStyle = v.color;
                ctx.lineWidth = 2;
                const hexRadius = baseSize * 1.6;
                for (let i = 0; i < 6; i++) {
                    const angle1 = (i / 6) * Math.PI * 2;
                    const angle2 = ((i + 1) / 6) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.moveTo(Math.cos(angle1) * hexRadius, Math.sin(angle1) * hexRadius);
                    ctx.lineTo(Math.cos(angle2) * hexRadius, Math.sin(angle2) * hexRadius);
                    ctx.stroke();
                }
                
                // Líneas internas
                if (v.rotation) {
                    ctx.globalAlpha = v.opacity * 0.5;
                    for (let i = 0; i < 6; i++) {
                        const angle = (i / 6) * Math.PI * 2;
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
                        ctx.stroke();
                    }
                }
                break;
        }
        
        // Efectos eléctricos
        if (v.electric) {
            ctx.strokeStyle = v.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = v.opacity * 0.5;
            for (let i = 0; i < 3; i++) {
                const startAngle = Math.random() * Math.PI * 2;
                const endAngle = startAngle + Math.random() * Math.PI;
                const startR = baseSize * (1.3 + Math.random() * 0.4);
                const endR = baseSize * (1.3 + Math.random() * 0.4);
                
                ctx.beginPath();
                ctx.moveTo(Math.cos(startAngle) * startR, Math.sin(startAngle) * startR);
                ctx.lineTo(Math.cos(endAngle) * endR, Math.sin(endAngle) * endR);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    },
    
    // Dibujar aura de nivel
    drawLevelAura: function(ctx, tier, level) {
        ctx.save();
        ctx.globalAlpha = 0.3 + (level / 50) * 0.3;
        
        const auraGradient = ctx.createRadialGradient(0, 0, tier.size, 0, 0, tier.size * 2);
        auraGradient.addColorStop(0, 'transparent');
        auraGradient.addColorStop(0.5, tier.accentColor);
        auraGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, tier.size * 2, tier.size * 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    },
    
    // Dibujar efectos de daño
    drawDamageEffects: function(ctx, healthPercent, baseSize) {
        // Humo
        if (healthPercent < 0.5) {
            ctx.save();
            ctx.globalAlpha = 0.3 * (0.5 - healthPercent) * 2;
            ctx.fillStyle = '#333333';
            
            for (let i = 0; i < 3; i++) {
                const x = (Math.random() - 0.5) * baseSize;
                const y = (Math.random() - 0.5) * baseSize;
                const size = Math.random() * 10 + 5;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        
        // Chispas
        if (healthPercent < 0.25) {
            ctx.save();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;
            
            for (let i = 0; i < 5; i++) {
                const x = (Math.random() - 0.5) * baseSize;
                const y = (Math.random() - 0.5) * baseSize;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.random() * 10 - 5, y + Math.random() * 10 - 5);
                ctx.stroke();
            }
            ctx.restore();
        }
    },
    
    // Dibujar detalles adicionales
    drawDetails: function(ctx, tier, level) {
        // Luces de navegación
        if (tier.features.lights) {
            ctx.fillStyle = tier.features.lights === 'pulsing' 
                ? `rgba(255, 255, 255, ${0.5 + Math.sin(Date.now() * 0.005) * 0.5})`
                : 'rgba(255, 255, 255, 0.8)';
            
            // Luz frontal
            ctx.beginPath();
            ctx.arc(tier.size * 1.2, 0, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Luces laterales
            ctx.fillStyle = 'rgba(0, 250, 154, 0.8)';
            ctx.beginPath();
            ctx.arc(-tier.size * 0.8, -tier.size * 0.3, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 107, 107, 0.8)';
            ctx.beginPath();
            ctx.arc(-tier.size * 0.8, tier.size * 0.3, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Sensores y antenas
        if (tier.features.sensors) {
            ctx.strokeStyle = tier.accentColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.7;
            
            // Antena
            ctx.beginPath();
            ctx.moveTo(0, -tier.size * 0.6);
            ctx.lineTo(0, -tier.size * 0.9);
            ctx.stroke();
            
            // Sensor giratorio
            const sensorAngle = Date.now() * 0.002;
            ctx.beginPath();
            ctx.arc(0, -tier.size * 0.9, 3, sensorAngle, sensorAngle + Math.PI);
            ctx.stroke();
            
            ctx.globalAlpha = 1;
        }
        
        // Aletas
        if (tier.features.fins) {
            ctx.fillStyle = this.darkenColor(tier.baseColor, 30);
            
            const finSize = tier.features.fins === 'small' ? 0.4 : 
                           tier.features.fins === 'medium' ? 0.6 : 
                           tier.features.fins === 'large' ? 0.8 : 1;
            
            // Aleta superior
            ctx.beginPath();
            ctx.moveTo(0, -tier.size * 0.6);
            ctx.lineTo(-tier.size * 0.3 * finSize, -tier.size * (0.9 * finSize));
            ctx.lineTo(tier.size * 0.3 * finSize, -tier.size * (0.9 * finSize));
            ctx.closePath();
            ctx.fill();
            
            // Aleta inferior
            ctx.beginPath();
            ctx.moveTo(0, tier.size * 0.6);
            ctx.lineTo(-tier.size * 0.3 * finSize, tier.size * (0.9 * finSize));
            ctx.lineTo(tier.size * 0.3 * finSize, tier.size * (0.9 * finSize));
            ctx.closePath();
            ctx.fill();
        }
    },
    
    // Dibujar campo de distorsión
    drawDistortionField: function(ctx, x, y, size) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            const radius = size * (2 + i * 0.5) + Math.sin(Date.now() * 0.001 + i) * 5;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    },
    
    // Funciones auxiliares de color
    lightenColor: function(color, percent) {
        if (color.startsWith('#')) {
            const num = parseInt(color.slice(1), 16);
            const r = Math.min(255, ((num >> 16) & 255) + percent);
            const g = Math.min(255, ((num >> 8) & 255) + percent);
            const b = Math.min(255, (num & 255) + percent);
            return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
    },
    
    darkenColor: function(color, percent) {
        if (color.startsWith('#')) {
            const num = parseInt(color.slice(1), 16);
            const r = Math.max(0, ((num >> 16) & 255) - percent);
            const g = Math.max(0, ((num >> 8) & 255) - percent);
            const b = Math.max(0, (num & 255) - percent);
            return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
    }
};

// Exportar para uso en el juego
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShipEvolution;
}