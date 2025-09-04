// Panel de Configuración de Gráficos en Tiempo Real
const GraphicsPanel = {
    // Estado del panel
    isVisible: false,
    panel: null,
    
    // Inicialización
    init: function() {
        this.createPanel();
        this.setupEventListeners();
        console.log('Panel de configuración de gráficos inicializado');
    },
    
    // Crear el panel visual
    createPanel: function() {
        // Crear contenedor principal
        this.panel = document.createElement('div');
        this.panel.id = 'graphicsPanel';
        this.panel.className = 'graphics-panel';
        this.panel.style.cssText = `
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
        
        // Crear contenido del panel
        this.panel.innerHTML = `
            <div class="panel-header" style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #00FFFF; text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);">
                    ⚙️ Configuración de Gráficos
                </h2>
                <p style="margin: 5px 0; color: #87CEEB; font-size: 14px;">
                    Ajusta la calidad visual y rendimiento del juego
                </p>
            </div>
            
            <div class="panel-content">
                <!-- Calidad General -->
                <div class="config-section">
                    <h3 style="color: #00FFFF; border-bottom: 1px solid #00CED1; padding-bottom: 5px;">
                        🎨 Calidad General
                    </h3>
                    <div class="quality-buttons" style="display: flex; gap: 10px; margin: 15px 0;">
                        <button class="quality-btn" data-quality="low" style="flex: 1; padding: 10px; background: #2a2a2a; border: 1px solid #666; color: #ccc; border-radius: 5px; cursor: pointer;">
                            Baja
                        </button>
                        <button class="quality-btn" data-quality="medium" style="flex: 1; padding: 10px; background: #2a2a2a; border: 1px solid #666; color: #ccc; border-radius: 5px; cursor: pointer;">
                            Media
                        </button>
                        <button class="quality-btn" data-quality="high" style="flex: 1; padding: 10px; background: #2a2a2a; border: 1px solid #666; color: #ccc; border-radius: 5px; cursor: pointer;">
                            Alta
                        </button>
                        <button class="quality-btn" data-quality="ultra" style="flex: 1; padding: 10px; background: #2a2a2a; border: 1px solid #666; color: #ccc; border-radius: 5px; cursor: pointer;">
                            Ultra
                        </button>
                    </div>
                </div>
                
                <!-- Características Específicas -->
                <div class="config-section">
                    <h3 style="color: #00FFFF; border-bottom: 1px solid #00CED1; padding-bottom: 5px;">
                        ✨ Características Específicas
                    </h3>
                    <div class="feature-toggles" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
                        <label class="toggle-item">
                            <input type="checkbox" id="shadows" checked>
                            <span>Sombras</span>
                        </label>
                        <label class="toggle-item">
                            <input type="checkbox" id="particles" checked>
                            <span>Partículas</span>
                        </label>
                        <label class="toggle-item">
                            <input type="checkbox" id="lighting" checked>
                            <span>Iluminación</span>
                        </label>
                        <label class="toggle-item">
                            <input type="checkbox" id="reflections" checked>
                            <span>Reflejos</span>
                        </label>
                        <label class="toggle-item">
                            <input type="checkbox" id="postProcessing" checked>
                            <span>Post-Procesamiento</span>
                        </label>
                        <label class="toggle-item">
                            <input type="checkbox" id="glow" checked>
                            <span>Efectos de Luz</span>
                        </label>
                        <label class="toggle-item">
                            <input type="checkbox" id="antiAliasing" checked>
                            <span>Anti-Aliasing</span>
                        </label>
                        <label class="toggle-item">
                            <input type="checkbox" id="oceanEffects" checked>
                            <span>Efectos Oceánicos</span>
                        </label>
                    </div>
                </div>
                
                <!-- Rendimiento -->
                <div class="config-section">
                    <h3 style="color: #00FFFF; border-bottom: 1px solid #00CED1; padding-bottom: 5px;">
                        🚀 Rendimiento
                    </h3>
                    <div class="performance-settings" style="margin: 15px 0;">
                        <div class="setting-item" style="margin: 15px 0;">
                            <label style="display: block; margin-bottom: 5px;">Objetivo de FPS:</label>
                            <select id="targetFPS" style="width: 100%; padding: 8px; background: #2a2a2a; border: 1px solid #666; color: #ccc; border-radius: 5px;">
                                <option value="30">30 FPS</option>
                                <option value="60" selected>60 FPS</option>
                                <option value="120">120 FPS</option>
                            </select>
                        </div>
                        <div class="setting-item" style="margin: 15px 0;">
                            <label style="display: block; margin-bottom: 5px;">
                                <input type="checkbox" id="autoAdjust" checked>
                                Auto-ajustar calidad según FPS
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Efectos Especiales -->
                <div class="config-section">
                    <h3 style="color: #00FFFF; border-bottom: 1px solid #00CED1; padding-bottom: 5px;">
                        🌟 Efectos Especiales
                    </h3>
                    <div class="effects-settings" style="margin: 15px 0;">
                        <div class="setting-item" style="margin: 15px 0;">
                            <label style="display: block; margin-bottom: 5px;">
                                <input type="checkbox" id="bloom" checked>
                                Bloom (Resplandor)
                            </label>
                        </div>
                        <div class="setting-item" style="margin: 15px 0;">
                            <label style="display: block; margin-bottom: 5px;">
                                <input type="checkbox" id="motionBlur">
                                Motion Blur (Desenfoque de Movimiento)
                            </label>
                        </div>
                        <div class="setting-item" style="margin: 15px 0;">
                            <label style="display: block; margin-bottom: 5px;">
                                <input type="checkbox" id="depthOfField">
                                Profundidad de Campo
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Estadísticas de Rendimiento -->
                <div class="config-section">
                    <h3 style="color: #00FFFF; border-bottom: 1px solid #00CED1; padding-bottom: 5px;">
                        📊 Estadísticas de Rendimiento
                    </h3>
                    <div class="performance-stats" style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <div class="stat-item" style="display: flex; justify-content: space-between; margin: 8px 0;">
                            <span>FPS Actual:</span>
                            <span id="currentFPS" style="color: #00FF00;">--</span>
                        </div>
                        <div class="stat-item" style="display: flex; justify-content: space-between; margin: 8px 0;">
                            <span>Tiempo de Frame:</span>
                            <span id="frameTime" style="color: #00FF00;">--</span>
                        </div>
                        <div class="stat-item" style="display: flex; justify-content: space-between; margin: 8px 0;">
                            <span>Tiempo de Renderizado:</span>
                            <span id="renderTime" style="color: #00FF00;">--</span>
                        </div>
                        <div class="stat-item" style="display: flex; justify-content: space-between; margin: 8px 0;">
                            <span>Calidad Actual:</span>
                            <span id="currentQuality" style="color: #00FF00;">--</span>
                        </div>
                    </div>
                </div>
                
                <!-- Botones de Acción -->
                <div class="panel-actions" style="display: flex; gap: 15px; margin-top: 25px;">
                    <button id="applyConfig" style="flex: 1; padding: 12px; background: #00CED1; border: none; color: #000; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        ✅ Aplicar Cambios
                    </button>
                    <button id="resetConfig" style="flex: 1; padding: 12px; background: #FF6B6B; border: none; color: #fff; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        🔄 Restaurar Por Defecto
                    </button>
                    <button id="closePanel" style="flex: 1; padding: 12px; background: #666; border: none; color: #fff; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        ❌ Cerrar
                    </button>
                </div>
            </div>
        `;
        
        // Añadir estilos CSS
        this.addStyles();
        
        // Añadir al DOM
        document.body.appendChild(this.panel);
    },
    
    // Añadir estilos CSS
    addStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .graphics-panel .config-section {
                margin-bottom: 25px;
            }
            
            .graphics-panel .quality-btn {
                transition: all 0.3s ease;
            }
            
            .graphics-panel .quality-btn:hover {
                background: #00CED1 !important;
                color: #000 !important;
                transform: translateY(-2px);
            }
            
            .graphics-panel .quality-btn.active {
                background: #00CED1 !important;
                color: #000 !important;
                border-color: #00FFFF !important;
            }
            
            .graphics-panel .toggle-item {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
            }
            
            .graphics-panel .toggle-item input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: #00CED1;
            }
            
            .graphics-panel .setting-item select {
                transition: all 0.3s ease;
            }
            
            .graphics-panel .setting-item select:focus {
                border-color: #00CED1;
                outline: none;
            }
            
            .graphics-panel button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .graphics-panel button:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Botones de calidad
        const qualityBtns = this.panel.querySelectorAll('.quality-btn');
        qualityBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const quality = e.target.dataset.quality;
                this.setQuality(quality);
                this.updateQualityButtons(quality);
            });
        });
        
        // Botones de acción
        this.panel.querySelector('#applyConfig').addEventListener('click', () => {
            this.applyConfiguration();
        });
        
        this.panel.querySelector('#resetConfig').addEventListener('click', () => {
            this.resetConfiguration();
        });
        
        this.panel.querySelector('#closePanel').addEventListener('click', () => {
            this.hide();
        });
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
        
        // Cerrar al hacer clic fuera del panel
        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.panel.contains(e.target) && !e.target.classList.contains('graphics-toggle')) {
                this.hide();
            }
        });
    },
    
    // Mostrar panel
    show: function() {
        this.panel.style.display = 'block';
        this.isVisible = true;
        this.loadCurrentConfiguration();
        this.startPerformanceMonitoring();
    },
    
    // Ocultar panel
    hide: function() {
        this.panel.style.display = 'none';
        this.isVisible = false;
        this.stopPerformanceMonitoring();
    },
    
    // Alternar visibilidad
    toggle: function() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    },
    
    // Establecer calidad
    setQuality: function(quality) {
        if (window.GraphicsConfig) {
            window.GraphicsConfig.setQuality(quality);
        }
    },
    
    // Actualizar botones de calidad
    updateQualityButtons: function(activeQuality) {
        const qualityBtns = this.panel.querySelectorAll('.quality-btn');
        qualityBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.quality === activeQuality) {
                btn.classList.add('active');
            }
        });
    },
    
    // Aplicar configuración
    applyConfiguration: function() {
        if (window.GraphicsConfig) {
            // Obtener valores de los controles
            const config = {
                quality: {
                    shadows: this.panel.querySelector('#shadows').checked,
                    particles: this.panel.querySelector('#particles').checked,
                    lighting: this.panel.querySelector('#lighting').checked,
                    reflections: this.panel.querySelector('#reflections').checked,
                    postProcessing: this.panel.querySelector('#postProcessing').checked,
                    glow: this.panel.querySelector('#glow').checked,
                    antiAliasing: this.panel.querySelector('#antiAliasing').checked,
                    oceanEffects: this.panel.querySelector('#oceanEffects').checked
                },
                performance: {
                    targetFPS: parseInt(this.panel.querySelector('#targetFPS').value),
                    autoAdjust: this.panel.querySelector('#autoAdjust').checked
                },
                effects: {
                    bloom: this.panel.querySelector('#bloom').checked,
                    motionBlur: this.panel.querySelector('#motionBlur').checked,
                    depthOfField: this.panel.querySelector('#depthOfField').checked
                }
            };
            
            // Aplicar configuración
            Object.assign(window.GraphicsConfig, config);
            window.GraphicsConfig.applyConfiguration();
            window.GraphicsConfig.saveConfig();
            
            // Mostrar confirmación
            this.showNotification('✅ Configuración aplicada correctamente');
        }
    },
    
    // Restaurar configuración por defecto
    resetConfiguration: function() {
        if (window.GraphicsConfig) {
            window.GraphicsConfig.resetToDefault();
            this.loadCurrentConfiguration();
            this.showNotification('🔄 Configuración restaurada por defecto');
        }
    },
    
    // Cargar configuración actual
    loadCurrentConfiguration: function() {
        if (!window.GraphicsConfig) return;
        
        const config = window.GraphicsConfig.getCurrentConfig();
        
        // Actualizar controles
        this.panel.querySelector('#shadows').checked = config.quality.shadows;
        this.panel.querySelector('#particles').checked = config.quality.particles;
        this.panel.querySelector('#lighting').checked = config.quality.lighting;
        this.panel.querySelector('#reflections').checked = config.quality.reflections;
        this.panel.querySelector('#postProcessing').checked = config.quality.postProcessing;
        this.panel.querySelector('#glow').checked = config.quality.glow;
        this.panel.querySelector('#antiAliasing').checked = config.quality.antiAliasing;
        this.panel.querySelector('#oceanEffects').checked = config.quality.oceanEffects;
        
        this.panel.querySelector('#targetFPS').value = config.performance.targetFPS;
        this.panel.querySelector('#autoAdjust').checked = config.performance.autoAdjust;
        
        this.panel.querySelector('#bloom').checked = config.effects.bloom;
        this.panel.querySelector('#motionBlur').checked = config.effects.motionBlur;
        this.panel.querySelector('#depthOfField').checked = config.effects.depthOfField;
        
        // Actualizar botones de calidad
        this.updateQualityButtons(config.quality.level);
    },
    
    // Monitoreo de rendimiento
    performanceMonitor: null,
    
    startPerformanceMonitoring: function() {
        this.performanceMonitor = setInterval(() => {
            this.updatePerformanceStats();
        }, 1000);
    },
    
    stopPerformanceMonitoring: function() {
        if (this.performanceMonitor) {
            clearInterval(this.performanceMonitor);
            this.performanceMonitor = null;
        }
    },
    
    updatePerformanceStats: function() {
        if (window.OptimizedGraphics) {
            const stats = window.OptimizedGraphics.getPerformanceStats();
            
            this.panel.querySelector('#currentFPS').textContent = stats.fps;
            this.panel.querySelector('#frameTime').textContent = `${stats.frameTime.toFixed(2)}ms`;
            this.panel.querySelector('#renderTime').textContent = `${stats.renderTime.toFixed(2)}ms`;
            this.panel.querySelector('#currentQuality').textContent = stats.quality.toUpperCase();
            
            // Color del FPS según rendimiento
            const fpsElement = this.panel.querySelector('#currentFPS');
            if (stats.fps < 30) {
                fpsElement.style.color = '#FF0000';
            } else if (stats.fps < 45) {
                fpsElement.style.color = '#FFFF00';
            } else {
                fpsElement.style.color = '#00FF00';
            }
        }
    },
    
    // Mostrar notificación
    showNotification: function(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #00CED1;
            color: #000;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        // Añadir animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
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
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.GraphicsPanel = GraphicsPanel;
}