// Sistema de Integración de Boosts para Cosmic Depths
const BoostIntegration = {
    // Estado del sistema
    state: {
        activeBoosts: {},
        boostCheckInterval: null
    },
    
    // Inicialización
    init: function() {
        console.log('Sistema de integración de boosts inicializado');
        this.loadActiveBoosts();
        this.startBoostMonitoring();
    },
    
    // Cargar boosts activos
    loadActiveBoosts: function() {
        try {
            const saved = localStorage.getItem('cosmicDepths_activeBoosts');
            if (saved) {
                this.state.activeBoosts = JSON.parse(saved);
                console.log('Boosts activos cargados:', this.state.activeBoosts);
            }
        } catch (e) {
            console.error('Error al cargar boosts activos:', e);
        }
    },
    
    // Iniciar monitoreo de boosts
    startBoostMonitoring: function() {
        this.state.boostCheckInterval = setInterval(() => {
            this.checkExpiredBoosts();
            this.applyActiveBoosts();
        }, 1000); // Verificar cada segundo
    },
    
    // Verificar boosts expirados
    checkExpiredBoosts: function() {
        const now = Date.now();
        let hasChanges = false;
        
        Object.keys(this.state.activeBoosts).forEach(key => {
            if (this.state.activeBoosts[key].expiresAt && this.state.activeBoosts[key].expiresAt < now) {
                console.log(`Boost expirado: ${key}`);
                delete this.state.activeBoosts[key];
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            this.saveActiveBoosts();
        }
    },
    
    // Aplicar boosts activos
    applyActiveBoosts: function() {
        // Aplicar boost de gemas
        if (this.state.activeBoosts.gemMultiplier) {
            this.applyGemMultiplier();
        }
        
        // Aplicar boost de experiencia
        if (this.state.activeBoosts.experienceBoost) {
            this.applyExperienceBoost();
        }
        
        // Aplicar boost de recursos
        if (this.state.activeBoosts.resourceBoost) {
            this.applyResourceBoost();
        }
    },
    
    // Aplicar multiplicador de gemas
    applyGemMultiplier: function() {
        const boost = this.state.activeBoosts.gemMultiplier;
        if (!boost || !boost.multiplier || !gameState.player) return;
        
        // Interceptar la función de recolección de gemas
        if (!this.originalCollectGem) {
            this.originalCollectGem = gameState.player.collectGem;
        }
        
        // Aplicar multiplicador
        gameState.player.collectGem = function(amount = 1) {
            const baseAmount = amount;
            const multipliedAmount = Math.floor(baseAmount * boost.multiplier);
            
            // Llamar a la función original
            this.originalCollectGem.call(this, multipliedAmount);
            
            // Mostrar indicador visual
            this.showGemMultiplierIndicator(baseAmount, multipliedAmount);
        }.bind(this);
    },
    
    // Mostrar indicador de multiplicador de gemas
    showGemMultiplierIndicator: function(baseAmount, multipliedAmount) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: white;
            padding: 8px 12px;
            border-radius: 15px;
            font-weight: bold;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
            font-size: 12px;
        `;
        indicator.textContent = `💎 ${baseAmount} → ${multipliedAmount}`;
        
        document.body.appendChild(indicator);
        
        // Remover después de 2 segundos
        setTimeout(() => {
            indicator.remove();
        }, 2000);
    },
    
    // Aplicar boost de experiencia
    applyExperienceBoost: function() {
        const boost = this.state.activeBoosts.experienceBoost;
        if (!boost || !boost.multiplier || !gameState.player) return;
        
        // Interceptar la función de ganar experiencia
        if (!this.originalGainExperience) {
            this.originalGainExperience = gameState.player.gainExperience;
        }
        
        // Aplicar multiplicador
        gameState.player.gainExperience = function(amount) {
            const baseAmount = amount;
            const multipliedAmount = Math.floor(baseAmount * boost.multiplier);
            
            // Llamar a la función original
            this.originalGainExperience.call(this, multipliedAmount);
            
            // Mostrar indicador visual
            this.showExperienceBoostIndicator(baseAmount, multipliedAmount);
        }.bind(this);
    },
    
    // Mostrar indicador de boost de experiencia
    showExperienceBoostIndicator: function(baseAmount, multipliedAmount) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 160px;
            right: 20px;
            background: linear-gradient(45deg, #4CAF50, #45B7D1);
            color: white;
            padding: 8px 12px;
            border-radius: 15px;
            font-weight: bold;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 2px 10px rgba(76, 175, 80, 0.5);
            font-size: 12px;
        `;
        indicator.textContent = `⭐ ${baseAmount} → ${multipliedAmount}`;
        
        document.body.appendChild(indicator);
        
        // Remover después de 2 segundos
        setTimeout(() => {
            indicator.remove();
        }, 2000);
    },
    
    // Aplicar boost de recursos
    applyResourceBoost: function() {
        const boost = this.state.activeBoosts.resourceBoost;
        if (!boost || !boost.multiplier) return;
        
        // Interceptar la producción de recursos de la base
        if (window.BaseBuildingSystem) {
            this.applyBaseResourceBoost(boost);
        }
    },
    
    // Aplicar boost de recursos de base
    applyBaseResourceBoost: function(boost) {
        // Interceptar la función de producción de recursos
        if (!this.originalResourceProduction) {
            this.originalResourceProduction = window.BaseBuildingSystem.startResourceProduction;
        }
        
        // Aplicar multiplicador a la producción
        const originalInterval = window.BaseBuildingSystem.startResourceProduction;
        window.BaseBuildingSystem.startResourceProduction = function() {
            // Llamar a la función original
            originalInterval.call(this);
            
            // Aplicar boost adicional
            this.applyBoostToResourceProduction(boost.multiplier);
        }.bind(window.BaseBuildingSystem);
    },
    
    // Aplicar boost a la producción de recursos
    applyBoostToResourceProduction: function(multiplier) {
        if (!window.BaseBuildingSystem || !window.BaseBuildingSystem.playerBase) return;
        
        const base = window.BaseBuildingSystem.playerBase;
        
        // Aplicar boost a módulos de producción
        base.modules.forEach(module => {
            if (module.isBuilt && module.effects.metalProduction) {
                const boostedProduction = Math.floor(module.effects.metalProduction * multiplier);
                base.resources.metal += boostedProduction;
            }
            
            if (module.isBuilt && module.effects.crystalProduction) {
                const boostedProduction = Math.floor(module.effects.crystalProduction * multiplier);
                base.resources.crystal += boostedProduction;
            }
        });
    },
    
    // Guardar boosts activos
    saveActiveBoosts: function() {
        try {
            localStorage.setItem('cosmicDepths_activeBoosts', JSON.stringify(this.state.activeBoosts));
        } catch (e) {
            console.error('Error al guardar boosts activos:', e);
        }
    },
    
    // Obtener boosts activos
    getActiveBoosts: function() {
        return this.state.activeBoosts;
    },
    
    // Verificar si un boost está activo
    isBoostActive: function(boostType) {
        return this.state.activeBoosts[boostType] && 
               this.state.activeBoosts[boostType].expiresAt > Date.now();
    },
    
    // Obtener tiempo restante de un boost
    getBoostTimeRemaining: function(boostType) {
        const boost = this.state.activeBoosts[boostType];
        if (!boost || !boost.expiresAt) return 0;
        
        const remaining = boost.expiresAt - Date.now();
        return Math.max(0, remaining);
    },
    
    // Formatear tiempo restante
    formatTimeRemaining: function(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    },
    
    // Mostrar indicadores de boosts activos en la UI
    showActiveBoostIndicators: function() {
        const boostContainer = document.getElementById('boost-indicators');
        if (!boostContainer) return;
        
        let html = '';
        Object.entries(this.state.activeBoosts).forEach(([key, boost]) => {
            if (boost.expiresAt && boost.expiresAt > Date.now()) {
                const timeRemaining = this.formatTimeRemaining(boost.expiresAt - Date.now());
                const boostInfo = this.getBoostInfo(key);
                
                html += `
                    <div class="boost-indicator" style="
                        background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
                        color: white;
                        padding: 8px 12px;
                        border-radius: 15px;
                        margin: 5px;
                        font-size: 12px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <span>${boostInfo.icon}</span>
                        <span>${boostInfo.name}</span>
                        <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 8px;">
                            ${timeRemaining}
                        </span>
                    </div>
                `;
            }
        });
        
        boostContainer.innerHTML = html;
    },
    
    // Obtener información de un boost
    getBoostInfo: function(boostType) {
        const boostInfo = {
            'gemMultiplier': { name: 'Gemas x2', icon: '💎💎' },
            'experienceBoost': { name: 'EXP +50%', icon: '⭐' },
            'resourceBoost': { name: 'Recursos x2', icon: '🔩' }
        };
        
        return boostInfo[boostType] || { name: 'Boost', icon: '⚡' };
    },
    
    // Limpiar boosts expirados
    cleanup: function() {
        if (this.state.boostCheckInterval) {
            clearInterval(this.state.boostCheckInterval);
        }
    },
    
    // Restaurar funciones originales
    restoreOriginalFunctions: function() {
        if (this.originalCollectGem && gameState.player) {
            gameState.player.collectGem = this.originalCollectGem;
        }
        
        if (this.originalGainExperience && gameState.player) {
            gameState.player.gainExperience = this.originalGainExperience;
        }
        
        if (this.originalResourceProduction && window.BaseBuildingSystem) {
            window.BaseBuildingSystem.startResourceProduction = this.originalResourceProduction;
        }
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.BoostIntegration = BoostIntegration;
}