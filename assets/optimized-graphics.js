// Sistema de Gráficos Optimizado para Máxima Fluidez y Calidad Visual
const OptimizedGraphics = {
    // Configuración de rendimiento
    config: {
        targetFPS: 60,
        maxFPS: 120,
        vsync: true,
        quality: 'high', // 'low', 'medium', 'high', 'ultra'
        enableShadows: true,
        enableParticles: true,
        enableLighting: true,
        enableReflections: true,
        enablePostProcessing: true
    },
    
    // Estado del sistema
    state: {
        fps: 60,
        frameTime: 16.67,
        lastFrameTime: 0,
        frameCount: 0,
        renderTime: 0,
        updateTime: 0,
        isLowPerformance: false
    },
    
    // Object pools para optimización
    pools: {
        particles: [],
        effects: [],
        sprites: []
    },
    
    // Cache de renderizado
    renderCache: new Map(),
    
    // Inicialización
    init: function() {
        this.setupCanvas();
        this.createObjectPools();
        this.setupPerformanceMonitoring();
        this.autoDetectCapabilities();
        
        console.log('Sistema de gráficos optimizado inicializado');
        console.log('Calidad configurada:', this.config.quality);
    },
    
    // Configurar canvas para máximo rendimiento
    setupCanvas: function() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d', {
            alpha: false, // Deshabilitar alpha para mejor rendimiento
            desynchronized: true, // Mejorar sincronización
            powerPreference: 'high-performance' // Priorizar rendimiento
        });
        
        // Configurar canvas para suavizado
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Configurar composición para mejor rendimiento
        ctx.globalCompositeOperation = 'source-over';
        
        this.canvas = canvas;
        this.ctx = ctx;
    },
    
    // Crear pools de objetos para reutilización
    createObjectPools: function() {
        // Pool de partículas
        for (let i = 0; i < 200; i++) {
            this.pools.particles.push({
                x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0,
                size: 0, color: '', active: false
            });
        }
        
        // Pool de efectos
        for (let i = 0; i < 50; i++) {
            this.pools.effects.push({
                type: '', x: 0, y: 0, scale: 1, rotation: 0, active: false
            });
        }
    },
    
    // Monitoreo de rendimiento
    setupPerformanceMonitoring: function() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measurePerformance = () => {
            const currentTime = performance.now();
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                this.state.fps = frameCount;
                this.state.frameTime = 1000 / frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Auto-ajustar calidad según rendimiento
                this.autoAdjustQuality();
            }
            
            requestAnimationFrame(measurePerformance);
        };
        
        requestAnimationFrame(measurePerformance);
    },
    
    // Auto-detección de capacidades del dispositivo
    autoDetectCapabilities: function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Detectar si el dispositivo es de gama baja
        const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                        navigator.deviceMemory <= 4 ||
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isLowEnd) {
            this.config.quality = 'low';
            this.config.enableShadows = false;
            this.config.enableParticles = false;
            this.config.enablePostProcessing = false;
            console.log('Dispositivo de gama baja detectado, ajustando calidad automáticamente');
        }
        
        // Detectar si el navegador soporta características avanzadas
        try {
            const testCanvas = document.createElement('canvas');
            testCanvas.width = 1;
            testCanvas.height = 1;
            const testCtx = testCanvas.getContext('2d');
            
            // Probar filtros avanzados
            if (testCtx.filter !== undefined) {
                this.config.enablePostProcessing = true;
            }
            
            // Probar composición avanzada
            testCtx.globalCompositeOperation = 'multiply';
            this.config.enableReflections = true;
            
        } catch (e) {
            this.config.enablePostProcessing = false;
            this.config.enableReflections = false;
        }
    },
    
    // Auto-ajustar calidad según rendimiento
    autoAdjustQuality: function() {
        if (this.state.fps < 30) {
            if (this.config.quality !== 'low') {
                this.setQuality('low');
                console.log('Rendimiento bajo detectado, reduciendo calidad a LOW');
            }
        } else if (this.state.fps < 45) {
            if (this.config.quality !== 'medium') {
                this.setQuality('medium');
                console.log('Rendimiento medio detectado, ajustando calidad a MEDIUM');
            }
        } else if (this.state.fps >= 55 && this.config.quality === 'low') {
            this.setQuality('medium');
            console.log('Rendimiento mejorado, aumentando calidad a MEDIUM');
        }
    },
    
    // Establecer calidad
    setQuality: function(quality) {
        if (!['low', 'medium', 'high', 'ultra'].includes(quality)) return;
        
        this.config.quality = quality;
        
        // Ajustar características según calidad
        switch (quality) {
            case 'low':
                this.config.enableShadows = false;
                this.config.enableParticles = false;
                this.config.enableLighting = false;
                this.config.enableReflections = false;
                this.config.enablePostProcessing = false;
                break;
            case 'medium':
                this.config.enableShadows = true;
                this.config.enableParticles = true;
                this.config.enableLighting = true;
                this.config.enableReflections = false;
                this.config.enablePostProcessing = false;
                break;
            case 'high':
                this.config.enableShadows = true;
                this.config.enableParticles = true;
                this.config.enableLighting = true;
                this.config.enableReflections = true;
                this.config.enablePostProcessing = true;
                break;
            case 'ultra':
                this.config.enableShadows = true;
                this.config.enableParticles = true;
                this.config.enableLighting = true;
                this.config.enableReflections = true;
                this.config.enablePostProcessing = true;
                break;
        }
        
        // Limpiar cache al cambiar calidad
        this.renderCache.clear();
        
        console.log('Calidad ajustada a:', quality);
    },
    
    // Renderizado optimizado con batching
    render: function(gameState, camera) {
        const startTime = performance.now();
        
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Renderizar en capas para mejor rendimiento
        this.renderBackground(gameState, camera);
        this.renderTerrain(gameState, camera);
        this.renderEntities(gameState, camera);
        this.renderEffects(gameState, camera);
        this.renderUI(gameState);
        
        // Post-procesamiento si está habilitado
        if (this.config.enablePostProcessing) {
            this.applyPostProcessing();
        }
        
        this.state.renderTime = performance.now() - startTime;
    },
    
    // Renderizado de fondo optimizado
    renderBackground: function(gameState, camera) {
        const ctx = this.ctx;
        
        // Fondo base con gradiente optimizado
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        
        if (gameState.currentBiome === 'abyss') {
            gradient.addColorStop(0, '#001122');
            gradient.addColorStop(0.5, '#002244');
            gradient.addColorStop(1, '#000011');
        } else if (gameState.currentBiome === 'reef') {
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(0.7, '#4682B4');
            gradient.addColorStop(1, '#1E90FF');
        } else {
            gradient.addColorStop(0, '#006994');
            gradient.addColorStop(0.5, '#0099CC');
            gradient.addColorStop(1, '#00BFFF');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Efectos de luz si están habilitados
        if (this.config.enableLighting) {
            this.renderLighting(gameState, camera);
        }
    },
    
    // Renderizado de iluminación optimizado
    renderLighting: function(gameState, camera) {
        const ctx = this.ctx;
        
        // Rayos de luz simplificados pero efectivos
        if (this.config.quality !== 'low') {
            ctx.save();
            ctx.globalAlpha = 0.1;
            
            for (let i = 0; i < 3; i++) {
                const x = (i * 400 - camera.x * 0.1) % this.canvas.width;
                const gradient = ctx.createLinearGradient(x, 0, x + 100, 0);
                gradient.addColorStop(0, 'rgba(255, 255, 200, 0)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 150, 0.3)');
                gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x, 0, 100, this.canvas.height);
            }
            
            ctx.restore();
        }
    },
    
    // Renderizado de terreno optimizado
    renderTerrain: function(gameState, camera) {
        // Implementar renderizado de terreno optimizado
        // Solo renderizar lo que está visible en pantalla
    },
    
    // Renderizado de entidades optimizado
    renderEntities: function(gameState, camera) {
        const ctx = this.ctx;
        
        // Renderizar en orden de profundidad para transparencias correctas
        const entities = [
            ...gameState.merchantStations,
            ...gameState.gems,
            ...gameState.enemies,
            ...gameState.pets,
            ...gameState.projectiles,
            gameState.player
        ].filter(entity => entity && this.isVisible(entity, camera));
        
        // Ordenar por profundidad (Y coordinate)
        entities.sort((a, b) => (a.y || 0) - (b.y || 0));
        
        // Renderizar con batching
        entities.forEach(entity => {
            if (entity.draw) {
                ctx.save();
                entity.draw(ctx, camera);
                ctx.restore();
            }
        });
    },
    
    // Renderizado de efectos optimizado
    renderEffects: function(gameState, camera) {
        if (!this.config.enableParticles) return;
        
        const ctx = this.ctx;
        
        // Renderizar partículas con object pooling
        gameState.particles.forEach(particle => {
            if (particle.active && this.isVisible(particle, camera)) {
                ctx.save();
                ctx.globalAlpha = particle.opacity || 1;
                ctx.fillStyle = particle.color || '#FFFFFF';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });
        
        // Renderizar efectos especiales
        if (this.config.quality !== 'low') {
            gameState.specialEffects.forEach(effect => {
                if (effect.active && effect.draw) {
                    effect.draw(ctx, camera);
                }
            });
        }
    },
    
    // Renderizado de UI optimizado
    renderUI: function(gameState) {
        const ctx = this.ctx;
        
        // UI básica siempre visible
        this.renderHealthBar(gameState.player);
        this.renderExperienceBar(gameState.player);
        this.renderFPS();
    },
    
    // Barra de salud optimizada
    renderHealthBar: function(player) {
        if (!player) return;
        
        const ctx = this.ctx;
        const barWidth = 200;
        const barHeight = 20;
        const x = 10;
        const y = 10;
        
        // Fondo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Barra de salud
        const healthPercent = player.health / player.maxHealth;
        const healthGradient = ctx.createLinearGradient(x, y, x + barWidth * healthPercent, y);
        
        if (healthPercent > 0.6) {
            healthGradient.addColorStop(0, '#00FF00');
            healthGradient.addColorStop(1, '#00CC00');
        } else if (healthPercent > 0.3) {
            healthGradient.addColorStop(0, '#FFFF00');
            healthGradient.addColorStop(1, '#CCCC00');
        } else {
            healthGradient.addColorStop(0, '#FF0000');
            healthGradient.addColorStop(1, '#CC0000');
        }
        
        ctx.fillStyle = healthGradient;
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
        
        // Borde
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, barWidth, barHeight);
        
        // Texto
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.floor(player.health)}/${player.maxHealth}`, x + barWidth/2, y + 15);
    },
    
    // Barra de experiencia optimizada
    renderExperienceBar: function(player) {
        if (!player) return;
        
        const ctx = this.ctx;
        const barWidth = 200;
        const barHeight = 15;
        const x = 10;
        const y = 40;
        
        // Fondo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Barra de experiencia
        const expPercent = player.exp / player.expRequired;
        const expGradient = ctx.createLinearGradient(x, y, x + barWidth * expPercent, y);
        expGradient.addColorStop(0, '#00FFFF');
        expGradient.addColorStop(1, '#0099CC');
        
        ctx.fillStyle = expGradient;
        ctx.fillRect(x, y, barWidth * expPercent, barHeight);
        
        // Borde
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, barHeight);
        
        // Texto
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Nivel ${player.level} - ${Math.floor(expPercent * 100)}%`, x + barWidth/2, y + 12);
    },
    
    // Indicador de FPS optimizado
    renderFPS: function() {
        if (this.state.fps < 45) {
            const ctx = this.ctx;
            const color = this.state.fps < 30 ? '#FF0000' : '#FFFF00';
            
            ctx.fillStyle = color;
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`FPS: ${this.state.fps}`, 10, this.canvas.height - 10);
        }
    },
    
    // Post-procesamiento optimizado
    applyPostProcessing: function() {
        if (this.config.quality === 'low') return;
        
        const ctx = this.ctx;
        
        // Efecto de bloom simple
        if (this.config.quality !== 'low') {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.1;
            ctx.filter = 'blur(1px)';
            
            // Aplicar bloom solo a elementos brillantes
            ctx.drawImage(this.canvas, 0, 0);
            
            ctx.restore();
        }
    },
    
    // Verificar si una entidad está visible
    isVisible: function(entity, camera) {
        if (!entity || !camera) return false;
        
        const margin = 100; // Margen para elementos que entran/salen de pantalla
        const x = entity.x || 0;
        const y = entity.y || 0;
        
        return x >= camera.x - margin &&
               x <= camera.x + this.canvas.width + margin &&
               y >= camera.y - margin &&
               y <= camera.y + this.canvas.height + margin;
    },
    
    // Obtener estadísticas de rendimiento
    getPerformanceStats: function() {
        return {
            fps: this.state.fps,
            frameTime: this.state.frameTime,
            renderTime: this.state.renderTime,
            quality: this.config.quality,
            features: {
                shadows: this.config.enableShadows,
                particles: this.config.enableParticles,
                lighting: this.config.enableLighting,
                reflections: this.config.enableReflections,
                postProcessing: this.config.enablePostProcessing
            }
        };
    },
    
    // Limpiar recursos
    cleanup: function() {
        this.renderCache.clear();
        this.pools.particles.length = 0;
        this.pools.effects.length = 0;
        this.pools.sprites.length = 0;
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.OptimizedGraphics = OptimizedGraphics;
}