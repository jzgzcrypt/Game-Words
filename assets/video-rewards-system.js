// Sistema de Videos y Recompensas para Cosmic Depths
const VideoRewardsSystem = {
    // Estado del sistema
    state: {
        isAdMobLoaded: false,
        isAdReady: false,
        currentAd: null,
        rewardCallback: null,
        lastAdTime: 0,
        adCooldown: 30000, // 30 segundos entre ads
        dailyAdCount: 0,
        maxDailyAds: 10
    },
    
    // Configuración
    config: {
        // IDs de AdMob (reemplazar con los tuyos)
        adMobConfig: {
            appId: 'ca-app-pub-3940256099942544~3347511713', // ID de prueba
            bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111', // Banner de prueba
            interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712', // Intersticial de prueba
            rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917' // Video recompensado de prueba
        },
        
        // Configuración de recompensas
        rewards: {
            'double_gems': {
                name: 'Gemas Dobles',
                description: 'Duplica las gemas obtenidas por 2 horas',
                duration: 7200000, // 2 horas en ms
                icon: '💎💎',
                multiplier: 2
            },
            'experience_boost': {
                name: 'Boost de Experiencia',
                description: '+50% de experiencia por 1 hora',
                duration: 3600000, // 1 hora en ms
                icon: '⭐',
                multiplier: 1.5
            },
            'resource_boost': {
                name: 'Boost de Recursos',
                description: 'Recursos de base producen 2x por 30 minutos',
                duration: 1800000, // 30 minutos en ms
                icon: '🔩',
                multiplier: 2
            },
            'free_upgrade': {
                name: 'Mejora Gratuita',
                description: 'Una mejora gratis en el panel de evolución',
                icon: '🎁',
                type: 'instant'
            },
            'base_module': {
                name: 'Módulo de Base',
                description: 'Un módulo básico gratis para tu base',
                icon: '🏗️',
                type: 'instant'
            }
        },
        
        // Configuración de ads
        adSettings: {
            maxAdsPerDay: 10,
            minTimeBetweenAds: 30000, // 30 segundos
            autoShowRewarded: false,
            testMode: true // Cambiar a false en producción
        }
    },
    
    // Inicialización
    init: function() {
        console.log('Sistema de videos y recompensas inicializando...');
        this.loadAdMob();
        this.loadDailyStats();
        this.setupEventListeners();
        this.startDailyReset();
    },
    
    // Cargar AdMob
    loadAdMob: function() {
        // Verificar si AdMob ya está cargado
        if (window.admob) {
            this.state.isAdMobLoaded = true;
            this.initializeAdMob();
            return;
        }
        
        // Cargar script de AdMob de forma asíncrona
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.onload = () => {
            this.state.isAdMobLoaded = true;
            this.initializeAdMob();
        };
        script.onerror = () => {
            console.warn('No se pudo cargar AdMob, usando modo offline');
            this.enableOfflineMode();
        };
        
        document.head.appendChild(script);
    },
    
    // Inicializar AdMob
    initializeAdMob: function() {
        try {
            // Configurar AdMob
            if (window.admob) {
                window.admob.start({
                    appId: this.config.adMobConfig.appId,
                    isTesting: this.config.adSettings.testMode
                });
                
                // Configurar eventos
                window.admob.on('load', (event) => {
                    this.state.isAdReady = true;
                    this.state.currentAd = event;
                    console.log('Ad cargado:', event);
                });
                
                window.admob.on('close', (event) => {
                    this.state.isAdReady = false;
                    this.state.currentAd = null;
                    console.log('Ad cerrado:', event);
                });
                
                window.admob.on('reward', (event) => {
                    this.handleReward(event);
                });
                
                console.log('AdMob inicializado correctamente');
            }
        } catch (error) {
            console.error('Error al inicializar AdMob:', error);
            this.enableOfflineMode();
        }
    },
    
    // Habilitar modo offline (para desarrollo)
    enableOfflineMode: function() {
        console.log('Modo offline habilitado - simulando ads para desarrollo');
        this.state.isAdMobLoaded = true;
        this.state.isAdReady = true;
    },
    
    // Mostrar video recompensado
    showRewardedVideo: function(rewardType, callback) {
        if (!this.canShowAd()) {
            this.showMessage('❌ No puedes ver más videos por ahora', 'error');
            return false;
        }
        
        if (this.config.adSettings.testMode || !this.state.isAdMobLoaded) {
            // Simular ad en modo desarrollo
            this.simulateRewardedAd(rewardType, callback);
            return true;
        }
        
        try {
            // Mostrar ad real de AdMob
            if (window.admob && this.state.isAdReady) {
                this.state.rewardCallback = callback;
                window.admob.prepareRewardVideoAd({
                    adUnitId: this.config.adMobConfig.rewardedAdUnitId
                });
                
                window.admob.showRewardVideoAd();
                this.updateAdStats();
                return true;
            } else {
                this.showMessage('❌ Video no disponible en este momento', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error al mostrar video:', error);
            this.showMessage('❌ Error al reproducir video', 'error');
            return false;
        }
    },
    
    // Simular ad recompensado (modo desarrollo)
    simulateRewardedAd: function(rewardType, callback) {
        this.showMessage('🎬 Simulando video recompensado...', 'info');
        
        // Simular tiempo de carga
        setTimeout(() => {
            this.showMessage('✅ Video completado! Recompensa otorgada', 'success');
            
            // Ejecutar callback de recompensa
            if (callback && typeof callback === 'function') {
                callback(rewardType);
            }
            
            this.updateAdStats();
        }, 2000);
    },
    
    // Manejar recompensa del video
    handleReward: function(event) {
        console.log('Recompensa recibida:', event);
        
        if (this.state.rewardCallback && typeof this.state.rewardCallback === 'function') {
            this.state.rewardCallback(event.type || 'default');
        }
        
        this.state.rewardCallback = null;
        this.showMessage('🎁 ¡Recompensa obtenida!', 'success');
    },
    
    // Verificar si se puede mostrar un ad
    canShowAd: function() {
        const now = Date.now();
        
        // Verificar cooldown
        if (now - this.state.lastAdTime < this.config.adSettings.minTimeBetweenAds) {
            return false;
        }
        
        // Verificar límite diario
        if (this.state.dailyAdCount >= this.config.adSettings.maxAdsPerDay) {
            return false;
        }
        
        return true;
    },
    
    // Actualizar estadísticas de ads
    updateAdStats: function() {
        this.state.lastAdTime = Date.now();
        this.state.dailyAdCount++;
        this.saveDailyStats();
    },
    
    // Aplicar recompensa
    applyReward: function(rewardType) {
        const reward = this.config.rewards[rewardType];
        if (!reward) {
            console.error('Tipo de recompensa no válido:', rewardType);
            return false;
        }
        
        try {
            switch (rewardType) {
                case 'double_gems':
                    this.applyGemMultiplier(reward);
                    break;
                case 'experience_boost':
                    this.applyExperienceBoost(reward);
                    break;
                case 'resource_boost':
                    this.applyResourceBoost(reward);
                    break;
                case 'free_upgrade':
                    this.applyFreeUpgrade(reward);
                    break;
                case 'base_module':
                    this.applyFreeBaseModule(reward);
                    break;
                default:
                    console.warn('Tipo de recompensa no implementado:', rewardType);
                    return false;
            }
            
            this.showMessage(`🎁 ${reward.name} aplicado!`, 'success');
            return true;
            
        } catch (error) {
            console.error('Error al aplicar recompensa:', error);
            this.showMessage('❌ Error al aplicar recompensa', 'error');
            return false;
        }
    },
    
    // Aplicar multiplicador de gemas
    applyGemMultiplier: function(reward) {
        if (!gameState.player) return;
        
        // Guardar boost activo
        const activeBoosts = this.getActiveBoosts();
        activeBoosts.gemMultiplier = {
            multiplier: reward.multiplier,
            expiresAt: Date.now() + reward.duration,
            type: 'gem_multiplier'
        };
        
        localStorage.setItem('cosmicDepths_activeBoosts', JSON.stringify(activeBoosts));
        
        // Mostrar indicador visual
        this.showBoostIndicator('Gemas x2', reward.duration);
    },
    
    // Aplicar boost de experiencia
    applyExperienceBoost: function(reward) {
        if (!gameState.player) return;
        
        const activeBoosts = this.getActiveBoosts();
        activeBoosts.experienceBoost = {
            multiplier: reward.multiplier,
            expiresAt: Date.now() + reward.duration,
            type: 'experience_boost'
        };
        
        localStorage.setItem('cosmicDepths_activeBoosts', JSON.stringify(activeBoosts));
        this.showBoostIndicator('EXP +50%', reward.duration);
    },
    
    // Aplicar boost de recursos
    applyResourceBoost: function(reward) {
        const activeBoosts = this.getActiveBoosts();
        activeBoosts.resourceBoost = {
            multiplier: reward.multiplier,
            expiresAt: Date.now() + reward.duration,
            type: 'resource_boost'
        };
        
        localStorage.setItem('cosmicDepths_activeBoosts', JSON.stringify(activeBoosts));
        this.showBoostIndicator('Recursos x2', reward.duration);
    },
    
    // Aplicar mejora gratis
    applyFreeUpgrade: function(reward) {
        if (!gameState.player) return;
        
        // Dar token de mejora gratis
        const freeUpgrades = this.getFreeUpgrades();
        freeUpgrades.upgradeTokens = (freeUpgrades.upgradeTokens || 0) + 1;
        localStorage.setItem('cosmicDepths_freeUpgrades', JSON.stringify(freeUpgrades));
        
        this.showMessage('🎁 Token de mejora gratis añadido!', 'success');
    },
    
    // Aplicar módulo de base gratis
    applyFreeBaseModule: function(reward) {
        const freeModules = this.getFreeModules();
        freeModules.moduleTokens = (freeModules.moduleTokens || 0) + 1;
        localStorage.setItem('cosmicDepths_freeModules', JSON.stringify(freeModules));
        
        this.showMessage('🎁 Token de módulo gratis añadido!', 'success');
    },
    
    // Obtener boosts activos
    getActiveBoosts: function() {
        try {
            const saved = localStorage.getItem('cosmicDepths_activeBoosts');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    },
    
    // Obtener mejoras gratis
    getFreeUpgrades: function() {
        try {
            const saved = localStorage.getItem('cosmicDepths_freeUpgrades');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    },
    
    // Obtener módulos gratis
    getFreeModules: function() {
        try {
            const saved = localStorage.getItem('cosmicDepths_freeModules');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    },
    
    // Verificar boosts expirados
    checkExpiredBoosts: function() {
        const activeBoosts = this.getActiveBoosts();
        const now = Date.now();
        let hasChanges = false;
        
        Object.keys(activeBoosts).forEach(key => {
            if (activeBoosts[key].expiresAt && activeBoosts[key].expiresAt < now) {
                delete activeBoosts[key];
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            localStorage.setItem('cosmicDepths_activeBoosts', JSON.stringify(activeBoosts));
        }
        
        return activeBoosts;
    },
    
    // Mostrar indicador de boost
    showBoostIndicator: function(text, duration) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            font-weight: bold;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;
        indicator.textContent = text;
        
        // Añadir animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(indicator);
        
        // Remover después de la duración del boost
        setTimeout(() => {
            indicator.remove();
        }, Math.min(duration, 5000)); // Máximo 5 segundos en pantalla
    },
    
    // Cargar estadísticas diarias
    loadDailyStats: function() {
        try {
            const saved = localStorage.getItem('cosmicDepths_dailyAdStats');
            if (saved) {
                const data = JSON.parse(saved);
                const today = new Date().toDateString();
                
                if (data.date === today) {
                    this.state.dailyAdCount = data.count || 0;
                } else {
                    this.state.dailyAdCount = 0;
                }
            }
        } catch (e) {
            console.error('Error al cargar estadísticas diarias:', e);
        }
    },
    
    // Guardar estadísticas diarias
    saveDailyStats: function() {
        try {
            const data = {
                date: new Date().toDateString(),
                count: this.state.dailyAdCount
            };
            localStorage.setItem('cosmicDepths_dailyAdStats', JSON.stringify(data));
        } catch (e) {
            console.error('Error al guardar estadísticas diarias:', e);
        }
    },
    
    // Reset diario
    startDailyReset: function() {
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                this.state.dailyAdCount = 0;
                this.saveDailyStats();
                console.log('Estadísticas diarias de ads reseteadas');
            }
        }, 60000); // Verificar cada minuto
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Event listener para tecla R (recompensas)
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.showRewardsPanel();
            }
        });
    },
    
    // Mostrar panel de recompensas
    showRewardsPanel: function() {
        if (this.rewardsPanel && this.rewardsPanel.isVisible) {
            this.rewardsPanel.hide();
        } else {
            this.createRewardsPanel();
        }
    },
    
    // Crear panel de recompensas
    createRewardsPanel: function() {
        if (this.rewardsPanel) {
            this.rewardsPanel.show();
            return;
        }
        
        this.rewardsPanel = {
            isVisible: false,
            panel: null,
            
            create: function() {
                const panel = document.createElement('div');
                panel.id = 'rewardsPanel';
                panel.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    max-height: 80vh;
                    background: linear-gradient(135deg, #0a0e27 0%, #151b3d 50%, #1a1840 100%);
                    border: 2px solid #00CED1;
                    border-radius: 15px;
                    padding: 20px;
                    color: #00FA9A;
                    font-family: 'Arial', sans-serif;
                    z-index: 1000;
                    display: none;
                    overflow-y: auto;
                    box-shadow: 0 0 30px rgba(0, 206, 209, 0.6);
                `;
                
                panel.innerHTML = `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="margin: 0; color: #00FFFF; text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);">
                            🎬 Videos y Recompensas
                        </h2>
                        <p style="margin: 5px 0; color: #87CEEB; font-size: 14px;">
                            Mira videos para obtener recompensas especiales
                        </p>
                    </div>
                    
                    <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #00FFFF; margin: 0 0 10px 0;">📊 Estadísticas del Día</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div>Videos Vistos: <span id="daily-ad-count" style="color: #00FF00;">0</span>/10</div>
                            <div>Próximo Video: <span id="next-ad-time" style="color: #00FF00;">Disponible</span></div>
                        </div>
                    </div>
                    
                    <div id="rewards-list">
                        <!-- Se llena dinámicamente -->
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button id="closeRewardsPanel" style="padding: 12px 30px; background: #666; border: none; color: #fff; border-radius: 8px; cursor: pointer; font-weight: bold;">
                            ❌ Cerrar
                        </button>
                    </div>
                `;
                
                this.panel = panel;
                document.body.appendChild(panel);
                this.setupEvents();
                this.updateContent();
            },
            
            setupEvents: function() {
                this.panel.querySelector('#closeRewardsPanel').addEventListener('click', () => {
                    this.hide();
                });
                
                // Cerrar con Escape
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isVisible) {
                        this.hide();
                    }
                });
            },
            
            updateContent: function() {
                // Actualizar estadísticas
                this.panel.querySelector('#daily-ad-count').textContent = VideoRewardsSystem.state.dailyAdCount;
                
                const nextAdTime = VideoRewardsSystem.canShowAd() ? 'Disponible' : 'En cooldown';
                this.panel.querySelector('#next-ad-time').textContent = nextAdTime;
                
                // Actualizar lista de recompensas
                const rewardsList = this.panel.querySelector('#rewards-list');
                rewardsList.innerHTML = Object.entries(VideoRewardsSystem.config.rewards).map(([key, reward]) => `
                    <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid #00CED1; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="font-size: 24px;">${reward.icon}</div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 5px 0; color: #00FFFF;">${reward.name}</h4>
                                <p style="margin: 0; color: #87CEEB; font-size: 12px;">${reward.description}</p>
                            </div>
                            <button class="watch-video-btn" data-reward="${key}" style="padding: 10px 20px; background: #4CAF50; border: none; color: white; border-radius: 8px; cursor: pointer; font-weight: bold;">
                                🎬 Ver Video
                            </button>
                        </div>
                    </div>
                `).join('');
                
                // Event listeners para botones
                rewardsList.querySelectorAll('.watch-video-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const rewardType = e.target.dataset.reward;
                        VideoRewardsSystem.showRewardedVideo(rewardType, (type) => {
                            VideoRewardsSystem.applyReward(type);
                            this.updateContent();
                        });
                    });
                });
            },
            
            show: function() {
                this.panel.style.display = 'block';
                this.isVisible = true;
                this.updateContent();
            },
            
            hide: function() {
                this.panel.style.display = 'none';
                this.isVisible = false;
            }
        };
        
        this.rewardsPanel.create();
        this.rewardsPanel.show();
    },
    
    // Mostrar mensaje
    showMessage: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 1001;
            animation: slideDown 0.3s ease;
        `;
        notification.textContent = message;
        
        // Añadir animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    // Obtener estadísticas
    getStats: function() {
        return {
            isAdMobLoaded: this.state.isAdMobLoaded,
            isAdReady: this.state.isAdReady,
            dailyAdCount: this.state.dailyAdCount,
            maxDailyAds: this.config.adSettings.maxAdsPerDay,
            canShowAd: this.canShowAd(),
            activeBoosts: this.getActiveBoosts(),
            freeUpgrades: this.getFreeUpgrades(),
            freeModules: this.getFreeModules()
        };
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.VideoRewardsSystem = VideoRewardsSystem;
}