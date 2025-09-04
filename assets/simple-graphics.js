// Sistema de Gráficos Simplificado y Confiable
const SimpleGraphics = {
    // Configuración básica
    config: {
        quality: 'medium', // 'low', 'medium', 'high'
        enableShadows: true,
        enableParticles: true,
        enableLighting: true
    },
    
    // Estado del sistema
    state: {
        fps: 60,
        frameTime: 16.67,
        lastFrameTime: 0,
        frameCount: 0
    },
    
    // Inicialización
    init: function() {
        console.log('Sistema de gráficos simplificado inicializado');
        this.setupPerformanceMonitoring();
    },
    
    // Monitoreo de rendimiento básico
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
                
                // Auto-ajustar calidad si es necesario
                this.autoAdjustQuality();
            }
            
            requestAnimationFrame(measurePerformance);
        };
        
        requestAnimationFrame(measurePerformance);
    },
    
    // Auto-ajustar calidad
    autoAdjustQuality: function() {
        if (this.state.fps < 30 && this.config.quality !== 'low') {
            this.setQuality('low');
            console.log('Rendimiento bajo detectado, reduciendo calidad a LOW');
        } else if (this.state.fps >= 55 && this.config.quality === 'low') {
            this.setQuality('medium');
            console.log('Rendimiento mejorado, aumentando calidad a MEDIUM');
        }
    },
    
    // Establecer calidad
    setQuality: function(quality) {
        if (!['low', 'medium', 'high'].includes(quality)) return;
        
        this.config.quality = quality;
        
        switch (quality) {
            case 'low':
                this.config.enableShadows = false;
                this.config.enableParticles = false;
                this.config.enableLighting = false;
                break;
            case 'medium':
                this.config.enableShadows = true;
                this.config.enableParticles = true;
                this.config.enableLighting = true;
                break;
            case 'high':
                this.config.enableShadows = true;
                this.config.enableParticles = true;
                this.config.enableLighting = true;
                break;
        }
        
        console.log('Calidad ajustada a:', quality);
    },
    
    // Renderizado simplificado
    render: function(gameState, camera) {
        const startTime = performance.now();
        
        // Limpiar canvas
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Renderizar fondo básico
        this.renderBackground(ctx, gameState);
        
        // Renderizar entidades
        this.renderEntities(ctx, gameState, camera);
        
        // Renderizar UI
        this.renderUI(ctx, gameState);
        
        // Mostrar FPS si es bajo
        if (this.state.fps < 45) {
            ctx.fillStyle = this.state.fps < 30 ? '#FF0000' : '#FFFF00';
            ctx.font = '16px Arial';
            ctx.fillText(`FPS: ${this.state.fps}`, 10, 30);
        }
        
        this.state.renderTime = performance.now() - startTime;
    },
    
    // Renderizado de fondo
    renderBackground: function(ctx, gameState) {
        // Fondo base con gradiente simple
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0, '#006994');
        gradient.addColorStop(0.5, '#0099CC');
        gradient.addColorStop(1, '#00BFFF');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Efectos de luz básicos si están habilitados
        if (this.config.enableLighting && this.config.quality !== 'low') {
            this.renderBasicLighting(ctx);
        }
    },
    
    // Iluminación básica
    renderBasicLighting: function(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        
        // Rayos de luz simples
        for (let i = 0; i < 2; i++) {
            const x = (i * 400) % ctx.canvas.width;
            const gradient = ctx.createLinearGradient(x, 0, x + 100, 0);
            gradient.addColorStop(0, 'rgba(255, 255, 200, 0)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 150, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, 0, 100, ctx.canvas.height);
        }
        
        ctx.restore();
    },
    
    // Renderizado de entidades
    renderEntities: function(ctx, gameState, camera) {
        // Renderizar en orden de profundidad
        const entities = [
            ...gameState.merchantStations || [],
            ...gameState.gems || [],
            ...gameState.enemies || [],
            ...gameState.pets || [],
            ...gameState.projectiles || [],
            gameState.player
        ].filter(entity => entity && entity.draw);
        
        // Ordenar por profundidad
        entities.sort((a, b) => (a.y || 0) - (b.y || 0));
        
        // Renderizar cada entidad
        entities.forEach(entity => {
            if (entity.draw) {
                ctx.save();
                entity.draw(ctx, camera);
                ctx.restore();
            }
        });
    },
    
    // Renderizado de UI
    renderUI: function(ctx, gameState) {
        if (!gameState.player) return;
        
        // Barra de salud
        this.renderHealthBar(ctx, gameState.player);
        
        // Barra de experiencia
        this.renderExperienceBar(ctx, gameState.player);
        
        // Controles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('WASD: Mover | ESPACIO: Seleccionar objetivo | Click: Selección manual | 🐚 Busca mercaderes | ⚙️ G: Panel de Gráficos', ctx.canvas.width - 10, ctx.canvas.height - 10);
    },
    
    // Barra de salud
    renderHealthBar: function(ctx, player) {
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
    
    // Barra de experiencia
    renderExperienceBar: function(ctx, player) {
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
    
    // Obtener estadísticas
    getPerformanceStats: function() {
        return {
            fps: this.state.fps,
            frameTime: this.state.frameTime,
            quality: this.config.quality
        };
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.SimpleGraphics = SimpleGraphics;
}