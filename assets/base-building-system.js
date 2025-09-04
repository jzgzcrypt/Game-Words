// Sistema de Base Construible Submarina para Cosmic Depths
const BaseBuildingSystem = {
    // Estado del sistema
    state: {
        isBaseOpen: false,
        selectedModule: null,
        buildMode: false,
        gridSize: { width: 20, height: 15 },
        camera: { x: 0, y: 0, zoom: 1 }
    },
    
    // Base del jugador
    playerBase: {
        modules: [],
        grid: [],
        resources: { 
            metal: 1000, 
            crystal: 500, 
            energy: 200,
            titanium: 100,
            gold: 50
        },
        level: 1,
        maxModules: 20,
        defense: 0,
        energy: 0,
        research: 0,
        population: 0,
        maxPopulation: 10
    },
    
    // Módulos disponibles para construir
    availableModules: {
        // MÓDULOS BÁSICOS (Nivel 1)
        'command_center': {
            name: 'Centro de Mando',
            description: 'Núcleo de la base submarina. Controla todas las operaciones.',
            category: 'core',
            cost: { metal: 100, crystal: 50, energy: 0 },
            size: { width: 3, height: 2 },
            effects: { 
                commandRange: 500, 
                defenseBonus: 10,
                population: 2,
                energy: 50
            },
            sprite: 'command_center',
            requiredLevel: 1,
            buildTime: 30, // segundos
            maintenance: { energy: 5, metal: 1 }
        },
        
        'power_generator': {
            name: 'Generador de Energía',
            description: 'Proporciona energía eléctrica a toda la base.',
            category: 'power',
            cost: { metal: 80, crystal: 30, energy: 0 },
            size: { width: 2, height: 2 },
            effects: { 
                energyOutput: 100, 
                heatGeneration: 20,
                population: 1
            },
            sprite: 'power_generator',
            requiredLevel: 1,
            buildTime: 20,
            maintenance: { energy: 0, metal: 2 }
        },
        
        'metal_refinery': {
            name: 'Refinería de Metal',
            description: 'Procesa minerales en metal refinado de alta calidad.',
            category: 'production',
            cost: { metal: 120, crystal: 60, energy: 20 },
            size: { width: 2, height: 3 },
            effects: { 
                metalProduction: 10, 
                energyConsumption: 15,
                population: 2
            },
            sprite: 'metal_refinery',
            requiredLevel: 2,
            buildTime: 45,
            maintenance: { energy: 15, metal: 3 }
        },
        
        'crystal_lab': {
            name: 'Laboratorio de Cristales',
            description: 'Sintetiza cristales artificiales para investigación.',
            category: 'production',
            cost: { metal: 150, crystal: 100, energy: 30 },
            size: { width: 2, height: 2 },
            effects: { 
                crystalProduction: 5, 
                energyConsumption: 20,
                research: 10,
                population: 1
            },
            sprite: 'crystal_lab',
            requiredLevel: 2,
            buildTime: 60,
            maintenance: { energy: 20, crystal: 2 }
        },
        
        // MÓDULOS DEFENSIVOS (Nivel 3+)
        'defense_turret': {
            name: 'Torreta Defensiva',
            description: 'Sistema de defensa automático contra amenazas.',
            category: 'defense',
            cost: { metal: 200, crystal: 80, energy: 40 },
            size: { width: 1, height: 1 },
            effects: { 
                damage: 50, 
                range: 300, 
                fireRate: 2,
                defense: 25
            },
            sprite: 'defense_turret',
            requiredLevel: 3,
            buildTime: 40,
            maintenance: { energy: 10, metal: 2 }
        },
        
        'shield_generator': {
            name: 'Generador de Escudos',
            description: 'Protege la base con un campo de fuerza energético.',
            category: 'defense',
            cost: { metal: 300, crystal: 200, energy: 100 },
            size: { width: 2, height: 2 },
            effects: { 
                shieldStrength: 1000, 
                energyConsumption: 50,
                defense: 100
            },
            sprite: 'shield_generator',
            requiredLevel: 4,
            buildTime: 90,
            maintenance: { energy: 50, crystal: 5 }
        },
        
        // MÓDULOS AVANZADOS (Nivel 5+)
        'research_lab': {
            name: 'Laboratorio de Investigación',
            description: 'Desbloquea nuevas tecnologías y mejoras.',
            category: 'research',
            cost: { metal: 400, crystal: 300, energy: 80 },
            size: { width: 3, height: 3 },
            effects: { 
                researchSpeed: 2.0, 
                techUnlock: true,
                population: 3,
                energy: 30
            },
            sprite: 'research_lab',
            requiredLevel: 5,
            buildTime: 120,
            maintenance: { energy: 30, crystal: 8 }
        },
        
        'advanced_workshop': {
            name: 'Taller Avanzado',
            description: 'Construye equipos y módulos de alta tecnología.',
            category: 'production',
            cost: { metal: 500, crystal: 400, energy: 120 },
            size: { width: 3, height: 2 },
            effects: { 
                buildSpeed: 1.5, 
                moduleQuality: 1.2,
                population: 2,
                energy: 40
            },
            sprite: 'advanced_workshop',
            requiredLevel: 6,
            buildTime: 150,
            maintenance: { energy: 40, metal: 5 }
        },
        
        // MÓDULOS DE LUJO (Nivel 7+)
        'aquarium': {
            name: 'Acuario Gigante',
            description: 'Exhibe criaturas marinas raras y proporciona felicidad.',
            category: 'luxury',
            cost: { metal: 600, crystal: 500, energy: 150 },
            size: { width: 4, height: 3 },
            effects: { 
                happiness: 50, 
                population: 5,
                energy: 20,
                tourism: 100
            },
            sprite: 'aquarium',
            requiredLevel: 7,
            buildTime: 180,
            maintenance: { energy: 20, crystal: 10 }
        },
        
        'command_bridge': {
            name: 'Puente de Mando',
            description: 'Centro de control avanzado con vista panorámica.',
            category: 'luxury',
            cost: { metal: 800, crystal: 600, energy: 200 },
            size: { width: 4, height: 2 },
            effects: { 
                commandRange: 1000, 
                defenseBonus: 50,
                population: 3,
                energy: 100,
                morale: 25
            },
            sprite: 'command_bridge',
            requiredLevel: 8,
            buildTime: 240,
            maintenance: { energy: 100, metal: 10 }
        }
    },
    
    // Inicialización
    init: function() {
        console.log('Sistema de base construible inicializado');
        this.initializeGrid();
        this.loadBaseData();
        this.startResourceProduction();
        this.startMaintenanceCycle();
    },
    
    // Inicializar grid de construcción
    initializeGrid: function() {
        this.playerBase.grid = [];
        for (let y = 0; y < this.state.gridSize.height; y++) {
            this.playerBase.grid[y] = [];
            for (let x = 0; x < this.state.gridSize.width; x++) {
                this.playerBase.grid[y][x] = null;
            }
        }
    },
    
    // Cargar datos de la base
    loadBaseData: function() {
        try {
            const saved = localStorage.getItem('cosmicDepths_baseData');
            if (saved) {
                const data = JSON.parse(saved);
                this.playerBase = { ...this.playerBase, ...data };
                this.initializeGrid(); // Reinicializar grid
                
                // Reconstruir grid con módulos guardados
                if (data.modules) {
                    data.modules.forEach(module => {
                        this.placeModuleOnGrid(module);
                    });
                }
                
                console.log('Datos de la base cargados');
            }
        } catch (e) {
            console.error('Error al cargar datos de la base:', e);
        }
    },
    
    // Guardar datos de la base
    saveBaseData: function() {
        try {
            const data = {
                modules: this.playerBase.modules,
                resources: this.playerBase.resources,
                level: this.playerBase.level,
                maxModules: this.playerBase.maxModules,
                defense: this.playerBase.defense,
                energy: this.playerBase.energy,
                research: this.playerBase.research,
                population: this.playerBase.population,
                maxPopulation: this.playerBase.maxPopulation
            };
            localStorage.setItem('cosmicDepths_baseData', JSON.stringify(data));
        } catch (e) {
            console.error('Error al guardar datos de la base:', e);
        }
    },
    
    // Verificar si se puede construir un módulo
    canBuildModule: function(moduleId, position) {
        const module = this.availableModules[moduleId];
        if (!module) {
            return { success: false, reason: 'Módulo no encontrado' };
        }
        
        // Verificar nivel requerido
        if (gameState.player.level < module.requiredLevel) {
            return { success: false, reason: `Nivel ${module.requiredLevel} requerido` };
        }
        
        // Verificar recursos
        if (!this.hasResources(module.cost)) {
            return { success: false, reason: 'Recursos insuficientes' };
        }
        
        // Verificar espacio disponible
        if (!this.isSpaceAvailable(position, module.size)) {
            return { success: false, reason: 'Espacio no disponible' };
        }
        
        // Verificar límite de módulos
        if (this.playerBase.modules.length >= this.playerBase.maxModules) {
            return { success: false, reason: 'Límite de módulos alcanzado' };
        }
        
        return { success: true };
    },
    
    // Verificar si hay recursos suficientes
    hasResources: function(cost) {
        for (const [resource, amount] of Object.entries(cost)) {
            if (this.playerBase.resources[resource] < amount) {
                return false;
            }
        }
        return true;
    },
    
    // Verificar si hay espacio disponible
    isSpaceAvailable: function(position, size) {
        const { x, y } = position;
        const { width, height } = size;
        
        // Verificar límites del grid
        if (x < 0 || y < 0 || x + width > this.state.gridSize.width || y + height > this.state.gridSize.height) {
            return false;
        }
        
        // Verificar si el espacio está ocupado
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                if (this.playerBase.grid[y + dy][x + dx] !== null) {
                    return false;
                }
            }
        }
        
        return true;
    },
    
    // Construir módulo
    buildModule: function(moduleId, position) {
        const buildCheck = this.canBuildModule(moduleId, position);
        if (!buildCheck.success) {
            this.showMessage(buildCheck.reason, 'error');
            return false;
        }
        
        const module = this.availableModules[moduleId];
        
        // Consumir recursos
        this.consumeResources(module.cost);
        
        // Crear módulo
        const newModule = {
            id: moduleId,
            name: module.name,
            position: position,
            size: module.size,
            health: 100,
            maxHealth: 100,
            level: 1,
            effects: { ...module.effects },
            sprite: module.sprite,
            buildTime: Date.now(),
            buildProgress: 0,
            isBuilt: false,
            maintenance: { ...module.maintenance }
        };
        
        // Añadir a la lista de módulos
        this.playerBase.modules.push(newModule);
        
        // Colocar en el grid
        this.placeModuleOnGrid(newModule);
        
        // Iniciar construcción
        this.startModuleConstruction(newModule);
        
        // Actualizar estadísticas de la base
        this.updateBaseStats();
        
        // Guardar datos
        this.saveBaseData();
        
        this.showMessage(`🏗️ Construyendo ${module.name}...`, 'success');
        return true;
    },
    
    // Colocar módulo en el grid
    placeModuleOnGrid: function(module) {
        const { x, y } = module.position;
        const { width, height } = module.size;
        
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                this.playerBase.grid[y + dy][x + dx] = module.id;
            }
        }
    },
    
    // Iniciar construcción de módulo
    startModuleConstruction: function(module) {
        const moduleData = this.availableModules[module.id];
        const buildDuration = moduleData.buildTime * 1000; // Convertir a milisegundos
        
        const constructionInterval = setInterval(() => {
            const elapsed = Date.now() - module.buildTime;
            module.buildProgress = Math.min((elapsed / buildDuration) * 100, 100);
            
            if (module.buildProgress >= 100) {
                // Construcción completada
                module.isBuilt = true;
                module.buildProgress = 100;
                clearInterval(constructionInterval);
                
                this.showMessage(`✅ ${module.name} construido exitosamente!`, 'success');
                this.updateBaseStats();
                this.saveBaseData();
            }
        }, 100); // Actualizar cada 100ms
    },
    
    // Consumir recursos
    consumeResources: function(cost) {
        for (const [resource, amount] of Object.entries(cost)) {
            this.playerBase.resources[resource] -= amount;
        }
    },
    
    // Actualizar estadísticas de la base
    updateBaseStats: function() {
        let totalDefense = 0;
        let totalEnergy = 0;
        let totalResearch = 0;
        let totalPopulation = 0;
        
        this.playerBase.modules.forEach(module => {
            if (module.isBuilt) {
                if (module.effects.defense) totalDefense += module.effects.defense;
                if (module.effects.energy) totalEnergy += module.effects.energy;
                if (module.effects.research) totalResearch += module.effects.research;
                if (module.effects.population) totalPopulation += module.effects.population;
            }
        });
        
        this.playerBase.defense = totalDefense;
        this.playerBase.energy = totalEnergy;
        this.playerBase.research = totalResearch;
        this.playerBase.population = totalPopulation;
    },
    
    // Producción de recursos
    startResourceProduction: function() {
        setInterval(() => {
            this.playerBase.modules.forEach(module => {
                if (module.isBuilt && module.effects.metalProduction) {
                    this.playerBase.resources.metal += module.effects.metalProduction;
                }
                if (module.isBuilt && module.effects.crystalProduction) {
                    this.playerBase.resources.crystal += module.effects.crystalProduction;
                }
            });
            
            // Guardar cada 10 segundos
            this.saveBaseData();
        }, 10000); // Cada 10 segundos
    },
    
    // Ciclo de mantenimiento
    startMaintenanceCycle: function() {
        setInterval(() => {
            this.playerBase.modules.forEach(module => {
                if (module.isBuilt && module.maintenance) {
                    // Consumir energía de mantenimiento
                    if (module.maintenance.energy) {
                        this.playerBase.resources.energy -= module.maintenance.energy;
                    }
                    
                    // Consumir recursos de mantenimiento
                    if (module.maintenance.metal) {
                        this.playerBase.resources.metal -= module.maintenance.metal;
                    }
                    
                    if (module.maintenance.crystal) {
                        this.playerBase.resources.crystal -= module.maintenance.crystal;
                    }
                }
            });
        }, 60000); // Cada minuto
    },
    
    // Mejorar módulo
    upgradeModule: function(moduleId) {
        const module = this.playerBase.modules.find(m => m.id === moduleId);
        if (!module) return false;
        
        const upgradeCost = this.calculateUpgradeCost(module);
        if (!this.hasResources(upgradeCost)) {
            this.showMessage('Recursos insuficientes para mejorar', 'error');
            return false;
        }
        
        // Consumir recursos
        this.consumeResources(upgradeCost);
        
        // Mejorar módulo
        module.level++;
        module.maxHealth += 25;
        module.health = module.maxHealth;
        
        // Mejorar efectos
        this.upgradeModuleEffects(module);
        
        this.showMessage(`⬆️ ${module.name} mejorado al nivel ${module.level}!`, 'success');
        this.updateBaseStats();
        this.saveBaseData();
        
        return true;
    },
    
    // Calcular costo de mejora
    calculateUpgradeCost: function(module) {
        const baseCost = this.availableModules[module.id].cost;
        const multiplier = Math.pow(1.5, module.level - 1);
        
        const upgradeCost = {};
        for (const [resource, amount] of Object.entries(baseCost)) {
            upgradeCost[resource] = Math.floor(amount * multiplier);
        }
        
        return upgradeCost;
    },
    
    // Mejorar efectos del módulo
    upgradeModuleEffects: function(module) {
        const effects = module.effects;
        
        // Mejorar efectos según el tipo de módulo
        if (effects.damage) effects.damage += 10;
        if (effects.range) effects.range += 50;
        if (effects.energyOutput) effects.energyOutput += 20;
        if (effects.metalProduction) effects.metalProduction += 2;
        if (effects.crystalProduction) effects.crystalProduction += 1;
        if (effects.researchSpeed) effects.researchSpeed += 0.2;
    },
    
    // Demoler módulo
    demolishModule: function(moduleId) {
        const moduleIndex = this.playerBase.modules.findIndex(m => m.id === moduleId);
        if (moduleIndex === -1) return false;
        
        const module = this.playerBase.modules[moduleIndex];
        
        // Remover del grid
        this.removeModuleFromGrid(module);
        
        // Remover de la lista
        this.playerBase.modules.splice(moduleIndex, 1);
        
        // Actualizar estadísticas
        this.updateBaseStats();
        this.saveBaseData();
        
        this.showMessage(`🗑️ ${module.name} demolido`, 'info');
        return true;
    },
    
    // Remover módulo del grid
    removeModuleFromGrid: function(module) {
        const { x, y } = module.position;
        const { width, height } = module.size;
        
        for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
                this.playerBase.grid[y + dy][x + dx] = null;
            }
        }
    },
    
    // Mostrar mensaje
    showMessage: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        // Añadir animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    // Obtener estadísticas de la base
    getBaseStats: function() {
        return {
            level: this.playerBase.level,
            modules: this.playerBase.modules.length,
            maxModules: this.playerBase.maxModules,
            defense: this.playerBase.defense,
            energy: this.playerBase.energy,
            research: this.playerBase.research,
            population: this.playerBase.population,
            maxPopulation: this.playerBase.maxPopulation,
            resources: this.playerBase.resources
        };
    },
    
    // Obtener módulos construidos
    getBuiltModules: function() {
        return this.playerBase.modules.filter(module => module.isBuilt);
    },
    
    // Obtener módulos en construcción
    getBuildingModules: function() {
        return this.playerBase.modules.filter(module => !module.isBuilt);
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.BaseBuildingSystem = BaseBuildingSystem;
}