// Configuración del Sistema de Gráficos - Ajustable por el Usuario
const GraphicsConfig = {
    // Configuración de calidad visual
    quality: {
        // Nivel de calidad general
        level: 'high', // 'low', 'medium', 'high', 'ultra'
        
        // Características específicas
        shadows: true,
        particles: true,
        lighting: true,
        reflections: true,
        postProcessing: true,
        antiAliasing: true,
        glow: true,
        
        // Detalles de sprites
        spriteDetail: 'high', // 'low', 'medium', 'high', 'ultra'
        textureFiltering: 'high', // 'low', 'medium', 'high'
        
        // Efectos oceánicos
        oceanEffects: 'medium', // 'low', 'medium', 'high'
        waveComplexity: 'medium', // 'low', 'medium', 'high'
        particleCount: 'medium' // 'low', 'medium', 'high'
    },
    
    // Configuración de rendimiento
    performance: {
        // Objetivo de FPS
        targetFPS: 60,
        maxFPS: 120,
        
        // Auto-ajuste
        autoAdjust: true,
        lowFPSThreshold: 30,
        mediumFPSThreshold: 45,
        
        // Optimizaciones
        objectPooling: true,
        renderCulling: true,
        frameSkipping: true,
        batchRendering: true
    },
    
    // Configuración de resolución
    resolution: {
        // Escala del canvas
        scale: 1.0,
        
        // Resolución objetivo
        targetWidth: 1920,
        targetHeight: 1080,
        
        // Modo de pantalla completa
        fullscreen: false,
        
        // Mantener proporción
        maintainAspectRatio: true
    },
    
    // Configuración de efectos especiales
    effects: {
        // Bloom
        bloom: {
            enabled: true,
            intensity: 0.3,
            threshold: 0.7,
            radius: 15
        },
        
        // Motion blur
        motionBlur: {
            enabled: false,
            intensity: 0.2,
            samples: 4
        },
        
        // Depth of field
        depthOfField: {
            enabled: false,
            focusDistance: 100,
            blurStrength: 0.5
        },
        
        // Ambient occlusion
        ambientOcclusion: {
            enabled: false,
            radius: 20,
            intensity: 0.3
        }
    },
    
    // Configuración de partículas
    particles: {
        // Cantidad máxima
        maxCount: 200,
        
        // Calidad de partículas
        quality: 'medium', // 'low', 'medium', 'high'
        
        // Tipos de partículas
        types: {
            bubbles: true,
            debris: true,
            sparkles: true,
            smoke: true,
            fire: true
        }
    },
    
    // Configuración de iluminación
    lighting: {
        // Rayos de luz
        lightRays: {
            enabled: true,
            count: 3,
            opacity: 0.1,
            speed: 0.3
        },
        
        // Sombras dinámicas
        dynamicShadows: {
            enabled: true,
            quality: 'medium',
            maxDistance: 300
        },
        
        // Iluminación global
        globalIllumination: {
            enabled: false,
            intensity: 0.2,
            color: '#FFFFFF'
        }
    },
    
    // Configuración de agua
    water: {
        // Transparencia
        transparency: 0.8,
        
        // Refracción
        refraction: {
            enabled: true,
            strength: 0.1
        },
        
        // Ondas
        waves: {
            enabled: true,
            amplitude: 5,
            frequency: 0.02,
            speed: 0.5
        },
        
        // Caustics
        caustics: {
            enabled: false,
            intensity: 0.3,
            scale: 1.0
        }
    },
    
    // Métodos para cambiar configuración
    setQuality: function(level) {
        if (!['low', 'medium', 'high', 'ultra'].includes(level)) return;
        
        this.quality.level = level;
        
        // Ajustar características según el nivel
        switch (level) {
            case 'low':
                this.quality.shadows = false;
                this.quality.particles = false;
                this.quality.lighting = false;
                this.quality.reflections = false;
                this.quality.postProcessing = false;
                this.quality.glow = false;
                this.quality.spriteDetail = 'low';
                this.quality.textureFiltering = 'low';
                this.quality.oceanEffects = 'low';
                this.quality.waveComplexity = 'low';
                this.quality.particleCount = 'low';
                break;
                
            case 'medium':
                this.quality.shadows = true;
                this.quality.particles = true;
                this.quality.lighting = true;
                this.quality.reflections = false;
                this.quality.postProcessing = false;
                this.quality.glow = true;
                this.quality.spriteDetail = 'medium';
                this.quality.textureFiltering = 'medium';
                this.quality.oceanEffects = 'medium';
                this.quality.waveComplexity = 'medium';
                this.quality.particleCount = 'medium';
                break;
                
            case 'high':
                this.quality.shadows = true;
                this.quality.particles = true;
                this.quality.lighting = true;
                this.quality.reflections = true;
                this.quality.postProcessing = true;
                this.quality.glow = true;
                this.quality.spriteDetail = 'high';
                this.quality.textureFiltering = 'high';
                this.quality.oceanEffects = 'high';
                this.quality.waveComplexity = 'high';
                this.quality.particleCount = 'high';
                break;
                
            case 'ultra':
                this.quality.shadows = true;
                this.quality.particles = true;
                this.quality.lighting = true;
                this.quality.reflections = true;
                this.quality.postProcessing = true;
                this.quality.glow = true;
                this.quality.spriteDetail = 'ultra';
                this.quality.textureFiltering = 'high';
                this.quality.oceanEffects = 'high';
                this.quality.waveComplexity = 'high';
                this.quality.particleCount = 'high';
                this.effects.bloom.enabled = true;
                this.effects.motionBlur.enabled = true;
                this.effects.depthOfField.enabled = true;
                this.effects.ambientOcclusion.enabled = true;
                this.lighting.dynamicShadows.quality = 'high';
                this.water.caustics.enabled = true;
                break;
        }
        
        // Aplicar cambios a los sistemas activos
        this.applyConfiguration();
        
        console.log('Calidad de gráficos ajustada a:', level);
    },
    
    // Aplicar configuración a los sistemas
    applyConfiguration: function() {
        // Aplicar a OptimizedGraphics si está disponible
        if (window.OptimizedGraphics) {
            window.OptimizedGraphics.setQuality(this.quality.level);
        }
        
        // Aplicar a OptimizedSprites si está disponible
        if (window.OptimizedSprites) {
            window.OptimizedSprites.config.enableShadows = this.quality.shadows;
            window.OptimizedSprites.config.enableGlow = this.quality.glow;
            window.OptimizedSprites.config.enableAntiAliasing = this.quality.antiAliasing;
        }
        
        // Aplicar a OceanEffects si está disponible
        if (window.OceanEffects) {
            window.OceanEffects.setQuality(this.quality.oceanEffects);
        }
    },
    
    // Obtener configuración actual
    getCurrentConfig: function() {
        return {
            quality: this.quality,
            performance: this.performance,
            resolution: this.resolution,
            effects: this.effects,
            particles: this.particles,
            lighting: this.lighting,
            water: this.water
        };
    },
    
    // Guardar configuración en localStorage
    saveConfig: function() {
        try {
            localStorage.setItem('cosmicDepthsGraphicsConfig', JSON.stringify(this.getCurrentConfig()));
            console.log('Configuración de gráficos guardada');
        } catch (e) {
            console.error('Error al guardar configuración:', e);
        }
    },
    
    // Cargar configuración desde localStorage
    loadConfig: function() {
        try {
            const saved = localStorage.getItem('cosmicDepthsGraphicsConfig');
            if (saved) {
                const config = JSON.parse(saved);
                Object.assign(this, config);
                this.applyConfiguration();
                console.log('Configuración de gráficos cargada');
            }
        } catch (e) {
            console.error('Error al cargar configuración:', e);
        }
    },
    
    // Restaurar configuración por defecto
    resetToDefault: function() {
        this.quality.level = 'high';
        this.quality.shadows = true;
        this.quality.particles = true;
        this.quality.lighting = true;
        this.quality.reflections = true;
        this.quality.postProcessing = true;
        this.quality.glow = true;
        this.quality.antiAliasing = true;
        this.quality.spriteDetail = 'high';
        this.quality.textureFiltering = 'high';
        this.quality.oceanEffects = 'medium';
        this.quality.waveComplexity = 'medium';
        this.quality.particleCount = 'medium';
        
        this.performance.targetFPS = 60;
        this.performance.autoAdjust = true;
        
        this.resolution.scale = 1.0;
        this.resolution.fullscreen = false;
        
        this.effects.bloom.enabled = true;
        this.effects.motionBlur.enabled = false;
        this.effects.depthOfField.enabled = false;
        this.effects.ambientOcclusion.enabled = false;
        
        this.particles.maxCount = 200;
        this.particles.quality = 'medium';
        
        this.lighting.lightRays.enabled = true;
        this.lighting.dynamicShadows.enabled = true;
        this.lighting.globalIllumination.enabled = false;
        
        this.water.transparency = 0.8;
        this.water.refraction.enabled = true;
        this.water.waves.enabled = true;
        this.water.caustics.enabled = false;
        
        this.applyConfiguration();
        console.log('Configuración restaurada a valores por defecto');
    },
    
    // Inicialización
    init: function() {
        // Cargar configuración guardada
        this.loadConfig();
        
        // Aplicar configuración inicial
        this.applyConfiguration();
        
        console.log('Configuración de gráficos inicializada');
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.GraphicsConfig = GraphicsConfig;
}