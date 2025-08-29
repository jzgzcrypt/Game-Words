// Sistema de Mercader y Tienda
const MerchantSystem = {
    // Inventario del jugador
    playerInventory: {
        weapons: [],
        shields: [],
        engines: [],
        special: [],
        equipped: {
            weapon: null,
            shield: null,
            engine: null,
            special: null
        }
    },
    
    // Catálogo de items de la tienda
    shopCatalog: {
        weapons: [
            {
                id: 'torpedo_mk1',
                name: 'Torpedo Básico Mk.I',
                price: 0,
                damage: 10,
                speed: 10,
                level: 1,
                stats: 'Daño: +10 | Velocidad: Normal',
                description: 'Torpedo estándar de la marina. Confiable y preciso.',
                visual: {
                    color: '#74C0FC',
                    size: 6,
                    trail: 5,
                    glow: false
                }
            },
            {
                id: 'torpedo_mk2',
                name: 'Torpedo Mejorado Mk.II',
                price: 100,
                damage: 15,
                speed: 11,
                level: 2,
                stats: 'Daño: +15 | Velocidad: +10%',
                description: 'Versión mejorada con mayor poder explosivo.',
                visual: {
                    color: '#339AF0',
                    size: 7,
                    trail: 7,
                    glow: true,
                    glowColor: 'rgba(51, 154, 240, 0.5)'
                }
            },
            {
                id: 'plasma_torpedo',
                name: 'Torpedo de Plasma',
                price: 250,
                damage: 25,
                speed: 12,
                level: 3,
                stats: 'Daño: +25 | Velocidad: +20%',
                description: 'Tecnología de plasma concentrado. Deja un rastro luminoso.',
                visual: {
                    color: '#00FA9A',
                    size: 8,
                    trail: 10,
                    glow: true,
                    glowColor: 'rgba(0, 250, 154, 0.6)',
                    particles: true
                }
            },
            {
                id: 'quantum_torpedo',
                name: 'Torpedo Cuántico',
                price: 500,
                damage: 35,
                speed: 13,
                level: 4,
                stats: 'Daño: +35 | Velocidad: +30% | Penetración',
                description: 'Arma cuántica experimental. Atraviesa escudos débiles.',
                visual: {
                    color: '#FF6B6B',
                    size: 9,
                    trail: 12,
                    glow: true,
                    glowColor: 'rgba(255, 107, 107, 0.7)',
                    particles: true,
                    electric: true
                }
            },
            {
                id: 'void_torpedo',
                name: 'Torpedo del Vacío',
                price: 1000,
                damage: 50,
                speed: 15,
                level: 5,
                stats: 'Daño: +50 | Velocidad: +50% | Daño en área',
                description: 'El arma definitiva. Crea un vacío que implosiona al impactar.',
                visual: {
                    color: '#9C36B5',
                    size: 10,
                    trail: 15,
                    glow: true,
                    glowColor: 'rgba(156, 54, 181, 0.8)',
                    particles: true,
                    electric: true,
                    vortex: true
                }
            }
        ],
        
        shields: [
            {
                id: 'basic_shield',
                name: 'Escudo Básico',
                price: 0,
                health: 100,
                regen: 0,
                level: 1,
                stats: 'Vida: +100 | Regeneración: 0',
                description: 'Casco estándar de aleación marina.',
                visual: {
                    color: 'rgba(70, 130, 180, 0.3)',
                    thickness: 1
                }
            },
            {
                id: 'reinforced_shield',
                name: 'Escudo Reforzado',
                price: 150,
                health: 150,
                regen: 1,
                level: 2,
                stats: 'Vida: +150 | Regeneración: +1/s',
                description: 'Casco reforzado con titanio submarino.',
                visual: {
                    color: 'rgba(0, 191, 255, 0.4)',
                    thickness: 2,
                    pulse: true
                }
            },
            {
                id: 'energy_shield',
                name: 'Escudo de Energía',
                price: 350,
                health: 200,
                regen: 2,
                level: 3,
                stats: 'Vida: +200 | Regeneración: +2/s | Absorción 10%',
                description: 'Campo de energía que absorbe parte del daño.',
                visual: {
                    color: 'rgba(0, 250, 154, 0.5)',
                    thickness: 3,
                    pulse: true,
                    electric: true
                }
            },
            {
                id: 'quantum_shield',
                name: 'Escudo Cuántico',
                price: 750,
                health: 300,
                regen: 3,
                level: 4,
                stats: 'Vida: +300 | Regeneración: +3/s | Absorción 20%',
                description: 'Escudo cuántico que desvía proyectiles ocasionalmente.',
                visual: {
                    color: 'rgba(255, 215, 0, 0.6)',
                    thickness: 4,
                    pulse: true,
                    electric: true,
                    hexagon: true
                }
            }
        ],
        
        engines: [
            {
                id: 'basic_engine',
                name: 'Motor Básico',
                price: 0,
                speed: 4,
                acceleration: 1,
                level: 1,
                stats: 'Velocidad: +4 | Aceleración: Normal',
                description: 'Motor de propulsión estándar.',
                visual: {
                    thrustColor: '#74C0FC',
                    size: 'normal'
                }
            },
            {
                id: 'turbo_engine',
                name: 'Motor Turbo',
                price: 120,
                speed: 5,
                acceleration: 1.5,
                level: 2,
                stats: 'Velocidad: +5 | Aceleración: +50%',
                description: 'Motor con turbo compresor integrado.',
                visual: {
                    thrustColor: '#00CED1',
                    size: 'medium',
                    afterburner: true
                }
            },
            {
                id: 'ion_engine',
                name: 'Motor Iónico',
                price: 300,
                speed: 6,
                acceleration: 2,
                level: 3,
                stats: 'Velocidad: +6 | Aceleración: +100% | Maniobra +20%',
                description: 'Propulsión iónica de alta eficiencia.',
                visual: {
                    thrustColor: '#00FA9A',
                    size: 'large',
                    afterburner: true,
                    particles: true
                }
            },
            {
                id: 'warp_engine',
                name: 'Motor de Distorsión',
                price: 600,
                speed: 8,
                acceleration: 3,
                level: 4,
                stats: 'Velocidad: +8 | Aceleración: +200% | Teletransporte corto',
                description: 'Motor experimental que distorsiona el espacio.',
                visual: {
                    thrustColor: '#FF6B6B',
                    size: 'huge',
                    afterburner: true,
                    particles: true,
                    warp: true
                }
            }
        ],
        
        special: [
            {
                id: 'sonar_pulse',
                name: 'Pulso de Sonar',
                price: 200,
                level: 2,
                stats: 'Revela enemigos ocultos | Rango: 500px',
                description: 'Emite un pulso que revela todo a tu alrededor.',
                cooldown: 10000
            },
            {
                id: 'decoy_system',
                name: 'Sistema de Señuelos',
                price: 300,
                level: 3,
                stats: 'Crea 3 señuelos | Duración: 5s',
                description: 'Despliega señuelos que distraen a los enemigos.',
                cooldown: 15000
            },
            {
                id: 'emp_blast',
                name: 'Pulso EMP',
                price: 450,
                level: 3,
                stats: 'Paraliza enemigos | Radio: 200px | Duración: 2s',
                description: 'Pulso electromagnético que paraliza enemigos cercanos.',
                cooldown: 20000
            },
            {
                id: 'black_hole',
                name: 'Generador de Agujero Negro',
                price: 1500,
                level: 5,
                stats: 'Atrae enemigos | Daño: 100/s | Duración: 3s',
                description: 'Crea un agujero negro temporal que atrae y daña enemigos.',
                cooldown: 30000
            }
        ]
    },
    
    // Estado actual de la tienda
    currentTab: 'weapons',
    isOpen: false,
    
    // Inicializar el sistema
    init: function() {
        // Dar el arma básica al jugador
        this.playerInventory.weapons.push('torpedo_mk1');
        this.playerInventory.equipped.weapon = 'torpedo_mk1';
        
        // Dar el escudo básico
        this.playerInventory.shields.push('basic_shield');
        this.playerInventory.equipped.shield = 'basic_shield';
        
        // Dar el motor básico
        this.playerInventory.engines.push('basic_engine');
        this.playerInventory.equipped.engine = 'basic_engine';
    },
    
    // Abrir tienda
    openShop: function() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        gameState.gameRunning = false;
        document.getElementById('merchantPanel').style.display = 'block';
        document.getElementById('merchantPerls').textContent = gameState.player.gems;
        this.showTab(this.currentTab);
        
        // Sonido de apertura (simulado)
        this.playSound('open');
    },
    
    // Cerrar tienda
    closeShop: function() {
        this.isOpen = false;
        gameState.gameRunning = true;
        document.getElementById('merchantPanel').style.display = 'none';
        this.playSound('close');
    },
    
    // Mostrar pestaña
    showTab: function(tabName) {
        this.currentTab = tabName;
        
        // Actualizar pestañas activas
        const tabs = document.querySelectorAll('.merchant-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.textContent.toLowerCase().includes(tabName.slice(0, -1))) {
                tab.classList.add('active');
            }
        });
        
        // Generar contenido
        const content = document.getElementById('shopContent');
        content.innerHTML = '';
        
        const items = this.shopCatalog[tabName];
        if (!items) return;
        
        items.forEach(item => {
            const owned = this.playerInventory[tabName].includes(item.id);
            const equipped = this.playerInventory.equipped[tabName.slice(0, -1)] === item.id;
            const canAfford = gameState.player.gems >= item.price;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'shop-item';
            if (owned) itemDiv.classList.add('purchased');
            if (equipped) itemDiv.classList.add('equipped');
            
            itemDiv.innerHTML = `
                <div class="shop-item-header">
                    <span class="shop-item-name">${item.name}</span>
                    <span class="shop-item-price">
                        ${owned ? (equipped ? '✅ EQUIPADO' : '📦 EN INVENTARIO') : `💎 ${item.price}`}
                    </span>
                </div>
                <div class="shop-item-stats">${item.stats}</div>
                <div class="shop-item-description">${item.description}</div>
            `;
            
            itemDiv.onclick = () => {
                if (owned) {
                    if (!equipped) {
                        this.equipItem(tabName, item.id);
                    }
                } else if (canAfford) {
                    this.purchaseItem(tabName, item.id);
                } else {
                    this.showNotification('¡No tienes suficientes perlas!');
                }
            };
            
            content.appendChild(itemDiv);
        });
    },
    
    // Comprar item
    purchaseItem: function(category, itemId) {
        const item = this.shopCatalog[category].find(i => i.id === itemId);
        if (!item) return;
        
        if (gameState.player.gems >= item.price) {
            gameState.player.gems -= item.price;
            gameState.player.updateUI();
            
            this.playerInventory[category].push(itemId);
            
            // Auto-equipar si es mejor que el actual
            const currentEquipped = this.playerInventory.equipped[category.slice(0, -1)];
            if (!currentEquipped || this.getItemLevel(itemId) > this.getItemLevel(currentEquipped)) {
                this.equipItem(category, itemId);
            }
            
            document.getElementById('merchantPerls').textContent = gameState.player.gems;
            this.showTab(this.currentTab);
            this.showNotification(`¡Has comprado ${item.name}!`);
            this.playSound('purchase');
        }
    },
    
    // Equipar item
    equipItem: function(category, itemId) {
        const categoryKey = category.slice(0, -1);
        this.playerInventory.equipped[categoryKey] = itemId;
        
        // Aplicar efectos del item
        this.applyItemEffects(itemId);
        
        this.showTab(this.currentTab);
        this.showNotification(`¡Has equipado ${this.getItemName(itemId)}!`);
        this.playSound('equip');
    },
    
    // Aplicar efectos del item equipado
    applyItemEffects: function(itemId) {
        const item = this.findItem(itemId);
        if (!item) return;
        
        const player = gameState.player;
        
        // Aplicar efectos según el tipo
        if (item.damage) {
            player.weaponVisual = item.visual;
            player.baseDamage = item.damage;
        }
        
        if (item.health) {
            player.maxHealth = item.health;
            player.shieldVisual = item.visual;
            if (item.regen) {
                player.healthRegen = item.regen;
            }
        }
        
        if (item.speed) {
            player.speed = item.speed;
            player.engineVisual = item.visual;
            if (item.acceleration) {
                player.acceleration = item.acceleration;
            }
        }
        
        player.updateUI();
    },
    
    // Obtener item equipado actual
    getEquippedItem: function(category) {
        const itemId = this.playerInventory.equipped[category];
        return this.findItem(itemId);
    },
    
    // Buscar item por ID
    findItem: function(itemId) {
        for (let category in this.shopCatalog) {
            const item = this.shopCatalog[category].find(i => i.id === itemId);
            if (item) return item;
        }
        return null;
    },
    
    // Obtener nivel del item
    getItemLevel: function(itemId) {
        const item = this.findItem(itemId);
        return item ? item.level : 0;
    },
    
    // Obtener nombre del item
    getItemName: function(itemId) {
        const item = this.findItem(itemId);
        return item ? item.name : 'Desconocido';
    },
    
    // Mostrar notificación
    showNotification: function(message) {
        const notification = document.getElementById('merchantNotification');
        notification.innerHTML = `<p>${message}</p>`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    },
    
    // Simular sonido
    playSound: function(type) {
        // En una implementación real, aquí reproducirías sonidos
        console.log(`🔊 Sonido: ${type}`);
    },
    
    // Dibujar efectos visuales del arma equipada
    drawWeaponEffects: function(ctx, projectile) {
        const weapon = this.getEquippedItem('weapon');
        if (!weapon || !weapon.visual) return;
        
        const v = weapon.visual;
        
        // Efecto de resplandor
        if (v.glow) {
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = v.glowColor || v.color;
            ctx.restore();
        }
        
        // Partículas eléctricas
        if (v.electric) {
            ctx.strokeStyle = v.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.6;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(projectile.x - 5, projectile.y);
                ctx.lineTo(
                    projectile.x - 5 + Math.random() * 10 - 5,
                    projectile.y + Math.random() * 10 - 5
                );
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }
        
        // Efecto vórtice
        if (v.vortex) {
            ctx.strokeStyle = v.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(projectile.x, projectile.y, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }
};

// Funciones globales para el HTML
window.showMerchantTab = function(tab) {
    MerchantSystem.showTab(tab);
};

window.closeMerchant = function() {
    MerchantSystem.closeShop();
};

// Exportar para uso en el juego
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MerchantSystem;
}