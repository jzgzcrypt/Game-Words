// Sistema de Gráficos Optimizado para Cosmic Depths
const OptimizedGraphicsSystem = {
    // Configuración del sistema
    config: {
        targetFPS: 60,
        maxParticles: 150,
        maxEnemies: 50,
        enableObjectPooling: true,
        enableCulling: true,
        enableBatching: true,
        enableLighting: true,
        enableShadows: true,
        enableParticles: true,
        quality: 'high' // 'low', 'medium', 'high'
    },
    
    // Estado del sistema
    state: {
        fps: 60,
        frameTime: 16.67,
        lastFrameTime: 0,
        frameCount: 0,
        renderCalls: 0,
        objectsRendered: 0,
        culledObjects: 0
    },
    
    // Object pools para optimización
    pools: {
        particles: [],
        enemies: [],
        projectiles: [],
        effects: []
    },
    
    // Caché de renderizado
    cache: {
        backgrounds: new Map(),
        sprites: new Map(),
        gradients: new Map()
    },
    
    // Inicialización
    init: function() {
        console.log('Sistema de gráficos optimizado inicializando...');
        this.setupPerformanceMonitoring();
        this.initializeObjectPools();
        this.setupRenderingOptimizations();
        this.createVisualEffects();
        console.log('Sistema de gráficos optimizado listo');
    },
    
    // Monitoreo de rendimiento avanzado
    setupPerformanceMonitoring: function() {
        let lastTime = performance.now();
        let frameCount = 0;
        let lastFpsUpdate = 0;
        
        const measurePerformance = () => {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            frameCount++;
            
            // Actualizar FPS cada segundo
            if (currentTime - lastFpsUpdate >= 1000) {
                this.state.fps = frameCount;
                this.state.frameTime = 1000 / frameCount;
                frameCount = 0;
                lastFpsUpdate = currentTime;
                
                // Auto-ajustar calidad según rendimiento
                this.autoAdjustQuality();
                
                // Log de rendimiento
                if (this.state.fps < 45) {
                    console.log(`Rendimiento bajo: ${this.state.fps} FPS, ${this.state.renderCalls} render calls`);
                }
            }
            
            lastTime = currentTime;
            requestAnimationFrame(measurePerformance);
        };
        
        requestAnimationFrame(measurePerformance);
    },
    
    // Auto-ajustar calidad según rendimiento
    autoAdjustQuality: function() {
        if (this.state.fps < 30) {
            this.config.quality = 'low';
            this.config.maxParticles = 50;
            this.config.enableShadows = false;
            this.config.enableLighting = false;
        } else if (this.state.fps < 45) {
            this.config.quality = 'medium';
            this.config.maxParticles = 100;
            this.config.enableShadows = false;
            this.config.enableLighting = true;
        } else {
            this.config.quality = 'high';
            this.config.maxParticles = 150;
            this.config.enableShadows = true;
            this.config.enableLighting = true;
        }
    },
    
    // Inicializar object pools
    initializeObjectPools: function() {
        // Pool de partículas
        for (let i = 0; i < this.config.maxParticles; i++) {
            this.pools.particles.push({
                x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, color: '#ffffff', size: 1, active: false
            });
        }
        
        // Pool de efectos
        for (let i = 0; i < 50; i++) {
            this.pools.effects.push({
                x: 0, y: 0, type: '', life: 0, maxLife: 0, active: false
            });
        }
        
        console.log('Object pools inicializados');
    },
    
    // Configurar optimizaciones de renderizado
    setupRenderingOptimizations: function() {
        // Pre-cargar gradientes comunes
        this.preloadGradients();
        
        // Configurar canvas para mejor rendimiento
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            // Configurar contexto para mejor rendimiento
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = this.config.quality === 'high';
            ctx.imageSmoothingQuality = this.config.quality === 'high' ? 'high' : 'low';
        }
    },
    
    // Pre-cargar gradientes
    preloadGradients: function() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Gradiente de fondo oceánico
        const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        oceanGradient.addColorStop(0, '#87CEEB');
        oceanGradient.addColorStop(0.3, '#4682B4');
        oceanGradient.addColorStop(0.6, '#1E90FF');
        oceanGradient.addColorStop(1, '#000080');
        this.cache.gradients.set('ocean', oceanGradient);
        
        // Gradiente de iluminación
        const lightGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
        lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        lightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.cache.gradients.set('light', lightGradient);
        
        // Gradiente de sombra
        const shadowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.cache.gradients.set('shadow', shadowGradient);
    },
    
    // Crear efectos visuales
    createVisualEffects: function() {
        // Efectos de burbujas
        this.createBubbleEffect();
        
        // Efectos de iluminación
        if (this.config.enableLighting) {
            this.createLightingEffect();
        }
        
        // Efectos de partículas
        if (this.config.enableParticles) {
            this.createParticleEffect();
        }
    },
    
    // Efecto de burbujas
    createBubbleEffect: function() {
        this.bubbles = [];
        for (let i = 0; i < 20; i++) {
            this.bubbles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 100,
                size: Math.random() * 15 + 5,
                speed: (20 - this.size) * 0.1 + 0.5,
                opacity: Math.random() * 0.3 + 0.1,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.05 + 0.02
            });
        }
    },
    
    // Efecto de iluminación
    createLightingEffect: function() {
        this.lights = [];
        // Luz principal del jugador
        this.lights.push({
            x: 0, y: 0, radius: 150, intensity: 0.8, color: '#ffffff'
        });
    },
    
    // Efecto de partículas
    createParticleEffect: function() {
        this.particleSystem = {
            particles: [],
            maxParticles: this.config.maxParticles,
            spawnRate: 0.1
        };
    },
    
    // Renderizado optimizado
    render: function(gameState, camera) {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Resetear contadores
        this.state.renderCalls = 0;
        this.state.objectsRendered = 0;
        this.state.culledObjects = 0;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Renderizar en capas optimizadas
        this.renderBackground(ctx, canvas);
        this.renderBubbles(ctx, canvas);
        this.renderEntities(ctx, gameState, camera);
        this.renderParticles(ctx);
        this.renderLighting(ctx, gameState);
        this.renderUI(ctx, gameState);
        
        // Actualizar estadísticas
        this.updateRenderStats();
    },
    
    // Renderizar fondo
    renderBackground: function(ctx, canvas) {
        this.state.renderCalls++;
        
        // Usar gradiente cacheado
        const gradient = this.cache.gradients.get('ocean');
        if (gradient) {
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            // Fallback
            ctx.fillStyle = '#006994';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    },
    
    // Renderizar burbujas
    renderBubbles: function(ctx, canvas) {
        if (!this.bubbles) return;
        
        this.state.renderCalls++;
        
        this.bubbles.forEach(bubble => {
            // Actualizar burbuja
            bubble.y -= bubble.speed;
            bubble.wobble += bubble.wobbleSpeed;
            bubble.x += Math.sin(bubble.wobble) * 0.5;
            
            // Resetear si sale de pantalla
            if (bubble.y < -bubble.size) {
                bubble.x = Math.random() * canvas.width;
                bubble.y = canvas.height + Math.random() * 100;
            }
            
            // Renderizar burbuja
            ctx.save();
            ctx.globalAlpha = bubble.opacity;
            
            // Burbuja principal
            const gradient = ctx.createRadialGradient(
                bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, 0,
                bubble.x, bubble.y, bubble.size
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(173, 216, 230, 0.4)');
            gradient.addColorStop(1, 'rgba(135, 206, 235, 0.1)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Brillo
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    },
    
    // Renderizar entidades con culling
    renderEntities: function(ctx, gameState, camera) {
        // Renderizar estaciones de comercio
        if (gameState.merchantStations) {
            gameState.merchantStations.forEach(station => {
                if (this.isInViewport(station, camera)) {
                    this.renderEntity(ctx, station, 'merchant');
                    this.state.objectsRendered++;
                } else {
                    this.state.culledObjects++;
                }
            });
        }
        
        // Renderizar gemas
        if (gameState.gems) {
            gameState.gems.forEach(gem => {
                if (this.isInViewport(gem, camera)) {
                    this.renderEntity(ctx, gem, 'gem');
                    this.state.objectsRendered++;
                } else {
                    this.state.culledObjects++;
                }
            });
        }
        
        // Renderizar enemigos
        if (gameState.enemies) {
            gameState.enemies.forEach(enemy => {
                if (this.isInViewport(enemy, camera)) {
                    this.renderEntity(ctx, enemy, 'enemy');
                    this.state.objectsRendered++;
                } else {
                    this.state.culledObjects++;
                }
            });
        }
        
        // Renderizar proyectiles
        if (gameState.projectiles) {
            gameState.projectiles.forEach(projectile => {
                if (this.isInViewport(projectile, camera)) {
                    this.renderEntity(ctx, projectile, 'projectile');
                    this.state.objectsRendered++;
                } else {
                    this.state.culledObjects++;
                }
            });
        }
        
        // Renderizar jugador
        if (gameState.player) {
            this.renderEntity(ctx, gameState.player, 'player');
            this.state.objectsRendered++;
        }
    },
    
    // Verificar si entidad está en viewport
    isInViewport: function(entity, camera) {
        if (!this.config.enableCulling) return true;
        
        const margin = 100; // Margen para pre-renderizar
        return entity.x >= -margin && 
               entity.x <= canvas.width + margin &&
               entity.y >= -margin && 
               entity.y <= canvas.height + margin;
    },
    
    // Renderizar entidad individual
    renderEntity: function(ctx, entity, type) {
        this.state.renderCalls++;
        
        // Usar método draw del entity si existe
        if (entity.draw && typeof entity.draw === 'function') {
            entity.draw();
            return;
        }
        
        // Renderizado básico por tipo
        ctx.save();
        
        switch (type) {
            case 'player':
                this.renderPlayer(ctx, entity);
                break;
            case 'enemy':
                this.renderEnemy(ctx, entity);
                break;
            case 'gem':
                this.renderGem(ctx, entity);
                break;
            case 'projectile':
                this.renderProjectile(ctx, entity);
                break;
            case 'merchant':
                this.renderMerchant(ctx, entity);
                break;
        }
        
        ctx.restore();
    },
    
    // Renderizar jugador
    renderPlayer: function(ctx, player) {
        // Cuerpo del jugador
        ctx.fillStyle = '#00CED1';
        ctx.beginPath();
        ctx.arc(player.x, player.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Efecto de movimiento
        if (player.vx || player.vy) {
            ctx.fillStyle = 'rgba(0, 206, 209, 0.3)';
            ctx.beginPath();
            ctx.arc(player.x - player.vx * 5, player.y - player.vy * 5, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    // Renderizar enemigo
    renderEnemy: function(ctx, enemy) {
        // Cuerpo del enemigo
        ctx.fillStyle = enemy.color || '#FF6B6B';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size || 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Nombre
        if (enemy.name) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(enemy.name, enemy.x, enemy.y - 20);
        }
    },
    
    // Renderizar gema
    renderGem: function(ctx, gem) {
        // Gema brillante
        const gradient = ctx.createRadialGradient(gem.x, gem.y, 0, gem.x, gem.y, 8);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#FF8C00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(gem.x, gem.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Brillo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(gem.x - 3, gem.y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Renderizar proyectil
    renderProjectile: function(ctx, projectile) {
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Estela
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(projectile.x - projectile.vx * 2, projectile.y - projectile.vy * 2, 2, 0, Math.PI * 2);
        ctx.fill();
    },
    
    // Renderizar mercader
    renderMerchant: function(ctx, merchant) {
        // Cuerpo del mercader
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(merchant.x, merchant.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Símbolo
        ctx.fillStyle = '#FFD700';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💰', merchant.x, merchant.y + 5);
    },
    
    // Renderizar partículas
    renderParticles: function(ctx) {
        if (!this.config.enableParticles || !gameState.particles) return;
        
        this.state.renderCalls++;
        
        gameState.particles.forEach(particle => {
            if (particle && particle.draw) {
                particle.draw();
                this.state.objectsRendered++;
            }
        });
    },
    
    // Renderizar iluminación
    renderLighting: function(ctx, gameState) {
        if (!this.config.enableLighting || !gameState.player) return;
        
        this.state.renderCalls++;
        
        // Actualizar posición de la luz principal
        if (this.lights && this.lights[0]) {
            this.lights[0].x = gameState.player.x;
            this.lights[0].y = gameState.player.y;
        }
        
        // Renderizar luces
        if (this.lights) {
            this.lights.forEach(light => {
                ctx.save();
                ctx.globalAlpha = light.intensity * 0.3;
                
                const gradient = this.cache.gradients.get('light');
                if (gradient) {
                    ctx.fillStyle = gradient;
                    ctx.fillRect(light.x - light.radius, light.y - light.radius, light.radius * 2, light.radius * 2);
                }
                
                ctx.restore();
            });
        }
    },
    
    // Renderizar UI
    renderUI: function(ctx, gameState) {
        this.state.renderCalls++;
        
        // Profundidad
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, canvas.height - 30, 200, 20);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        const depth = Math.floor(Math.sqrt(gameState.player.x * gameState.player.x + gameState.player.y * gameState.player.y) / 10);
        ctx.fillText(`Profundidad: ${depth}m`, 15, canvas.height - 15);
        
        // FPS
        ctx.fillStyle = this.state.fps < 30 ? '#FF0000' : this.state.fps < 45 ? '#FFFF00' : '#00FF00';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`FPS: ${this.state.fps}`, canvas.width - 10, 20);
        
        // Estadísticas de renderizado (solo en desarrollo)
        if (this.state.fps < 30) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`Render: ${this.state.renderCalls} | Obj: ${this.state.objectsRendered} | Culled: ${this.state.culledObjects}`, canvas.width - 10, 35);
        }
    },
    
    // Actualizar estadísticas de renderizado
    updateRenderStats: function() {
        // Las estadísticas se actualizan durante el renderizado
    },
    
    // Obtener estadísticas de rendimiento
    getPerformanceStats: function() {
        return {
            fps: this.state.fps,
            frameTime: this.state.frameTime,
            renderCalls: this.state.renderCalls,
            objectsRendered: this.state.objectsRendered,
            culledObjects: this.state.culledObjects,
            quality: this.config.quality
        };
    },
    
    // Configurar calidad
    setQuality: function(quality) {
        this.config.quality = quality;
        
        switch (quality) {
            case 'low':
                this.config.maxParticles = 50;
                this.config.enableShadows = false;
                this.config.enableLighting = false;
                break;
            case 'medium':
                this.config.maxParticles = 100;
                this.config.enableShadows = false;
                this.config.enableLighting = true;
                break;
            case 'high':
                this.config.maxParticles = 150;
                this.config.enableShadows = true;
                this.config.enableLighting = true;
                break;
        }
        
        console.log(`Calidad de gráficos cambiada a: ${quality}`);
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.OptimizedGraphicsSystem = OptimizedGraphicsSystem;
}