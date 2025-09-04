// Sistema de Sprites Optimizado para Máxima Calidad Visual
const OptimizedSprites = {
    // Configuración
    config: {
        enableAntiAliasing: true,
        enableShadows: true,
        enableGlow: true,
        enableReflections: true,
        spriteScale: 1.0,
        maxSpriteSize: 256
    },
    
    // Cache de sprites renderizados
    spriteCache: new Map(),
    
    // Sprites de alta calidad optimizados
    sprites: {
        // Submarino del jugador ultra-detallado
        playerSubmarine: {
            width: 128,
            height: 96,
            layers: [
                // Sombra base
                {
                    type: 'ellipse',
                    x: 64, y: 52, rx: 45, ry: 20,
                    fill: 'rgba(0, 0, 0, 0.4)',
                    shadow: { blur: 8, offsetX: 2, offsetY: 4, color: 'rgba(0, 0, 0, 0.3)' }
                },
                // Casco principal
                {
                    type: 'path',
                    path: 'M 20 48 Q 20 65 35 68 L 93 68 Q 108 65 108 48 L 108 45 Q 108 28 93 25 L 35 25 Q 20 28 20 45 Z',
                    fill: 'linear-gradient(0deg, #2C4A6A 0%, #3D5A7A 30%, #5A7A9A 70%, #7A9ABA 100%)',
                    stroke: '#1A2A3A',
                    strokeWidth: 2,
                    shadow: { blur: 4, offsetX: 1, offsetY: 2, color: 'rgba(0, 0, 0, 0.4)' }
                },
                // Detalles del casco
                {
                    type: 'lines',
                    lines: [
                        { x1: 30, y1: 35, x2: 30, y2: 58, color: '#2A3A4A', width: 1, opacity: 0.6 },
                        { x1: 40, y1: 30, x2: 40, y2: 63, color: '#2A3A4A', width: 1, opacity: 0.6 },
                        { x1: 50, y1: 28, x2: 50, y2: 65, color: '#2A3A4A', width: 1, opacity: 0.6 },
                        { x1: 60, y1: 27, x2: 60, y2: 66, color: '#2A3A4A', width: 1, opacity: 0.6 },
                        { x1: 70, y1: 28, x2: 70, y2: 65, color: '#2A3A4A', width: 1, opacity: 0.6 },
                        { x1: 80, y1: 30, x2: 80, y2: 63, color: '#2A3A4A', width: 1, opacity: 0.6 },
                        { x1: 90, y1: 32, x2: 90, y2: 61, color: '#2A3A4A', width: 1, opacity: 0.6 },
                        { x1: 98, y1: 35, x2: 98, y2: 58, color: '#2A3A4A', width: 1, opacity: 0.6 }
                    ]
                },
                // Torre de mando
                {
                    type: 'path',
                    path: 'M 45 25 Q 45 15 55 15 L 73 15 Q 83 15 83 25 L 83 35 Q 83 45 73 45 L 55 45 Q 45 45 45 35 Z',
                    fill: 'linear-gradient(0deg, #1A2A3A 0%, #2A3A4A 50%, #3A4A5A 100%)',
                    stroke: '#0A1A2A',
                    strokeWidth: 1,
                    shadow: { blur: 3, offsetX: 0, offsetY: 1, color: 'rgba(0, 0, 0, 0.5)' }
                },
                // Ventana de la torre
                {
                    type: 'ellipse',
                    x: 64, y: 30, rx: 12, ry: 8,
                    fill: 'radial-gradient(circle, #E0F4FF 0%, #A0D4F4 50%, #4090C0 100%)',
                    stroke: '#1A2A3A',
                    strokeWidth: 1,
                    glow: { color: '#00FFFF', intensity: 0.3, radius: 15 }
                },
                // Propulsores
                {
                    type: 'group',
                    elements: [
                        {
                            type: 'ellipse',
                            x: 25, y: 60, rx: 8, ry: 4,
                            fill: 'radial-gradient(ellipse, #FF4400 0%, #CC2200 50%, #880000 100%)',
                            glow: { color: '#FF4400', intensity: 0.5, radius: 20 }
                        },
                        {
                            type: 'ellipse',
                            x: 103, y: 60, rx: 8, ry: 4,
                            fill: 'radial-gradient(ellipse, #FF4400 0%, #CC2200 50%, #880000 100%)',
                            glow: { color: '#FF4400', intensity: 0.5, radius: 20 }
                        }
                    ]
                },
                // Detalles metálicos
                {
                    type: 'group',
                    elements: [
                        { type: 'circle', x: 35, y: 40, r: 1.5, fill: '#1A2A3A', opacity: 0.8 },
                        { type: 'circle', x: 45, y: 38, r: 1.5, fill: '#1A2A3A', opacity: 0.8 },
                        { type: 'circle', x: 55, y: 37, r: 1.5, fill: '#1A2A3A', opacity: 0.8 },
                        { type: 'circle', x: 65, y: 37, r: 1.5, fill: '#1A2A3A', opacity: 0.8 },
                        { type: 'circle', x: 75, y: 38, r: 1.5, fill: '#1A2A3A', opacity: 0.8 },
                        { type: 'circle', x: 85, y: 39, r: 1.5, fill: '#1A2A3A', opacity: 0.8 },
                        { type: 'circle', x: 93, y: 41, r: 1.5, fill: '#1A2A3A', opacity: 0.8 }
                    ]
                }
            ]
        },
        
        // Enemigo tipo tiburón
        sharkEnemy: {
            width: 120,
            height: 80,
            layers: [
                // Sombra
                {
                    type: 'ellipse',
                    x: 60, y: 45, rx: 40, ry: 15,
                    fill: 'rgba(0, 0, 0, 0.3)',
                    shadow: { blur: 6, offsetX: 2, offsetY: 3, color: 'rgba(0, 0, 0, 0.2)' }
                },
                // Cuerpo principal
                {
                    type: 'path',
                    path: 'M 15 40 Q 15 50 25 55 L 95 55 Q 105 50 105 40 L 105 35 Q 105 25 95 20 L 25 20 Q 15 25 15 35 Z',
                    fill: 'linear-gradient(0deg, #2A2A2A 0%, #4A4A4A 30%, #6A6A6A 70%, #8A8A8A 100%)',
                    stroke: '#1A1A1A',
                    strokeWidth: 2
                },
                // Aleta dorsal
                {
                    type: 'path',
                    path: 'M 60 15 Q 60 5 70 5 L 75 5 Q 85 5 85 15',
                    fill: '#2A2A2A',
                    stroke: '#1A1A1A',
                    strokeWidth: 1
                },
                // Ojo
                {
                    type: 'ellipse',
                    x: 85, y: 35, rx: 6, ry: 8,
                    fill: 'radial-gradient(circle, #FF0000 0%, #CC0000 50%, #880000 100%)',
                    glow: { color: '#FF0000', intensity: 0.4, radius: 12 }
                },
                // Dientes
                {
                    type: 'group',
                    elements: [
                        { type: 'path', path: 'M 20 45 L 25 50 L 30 45 Z', fill: '#FFFFFF', stroke: '#CCCCCC' },
                        { type: 'path', path: 'M 30 45 L 35 50 L 40 45 Z', fill: '#FFFFFF', stroke: '#CCCCCC' },
                        { type: 'path', path: 'M 40 45 L 45 50 L 50 45 Z', fill: '#FFFFFF', stroke: '#CCCCCC' },
                        { type: 'path', path: 'M 50 45 L 55 50 L 60 45 Z', fill: '#FFFFFF', stroke: '#CCCCCC' },
                        { type: 'path', path: 'M 60 45 L 65 50 L 70 45 Z', fill: '#FFFFFF', stroke: '#CCCCCC' },
                        { type: 'path', path: 'M 70 45 L 75 50 L 80 45 Z', fill: '#FFFFFF', stroke: '#CCCCCC' },
                        { type: 'path', path: 'M 80 45 L 85 50 L 90 45 Z', fill: '#FFFFFF', stroke: '#CCCCCC' }
                    ]
                }
            ]
        },
        
        // Gema brillante
        gem: {
            width: 32,
            height: 32,
            layers: [
                // Sombra
                {
                    type: 'ellipse',
                    x: 16, y: 18, rx: 12, ry: 4,
                    fill: 'rgba(0, 0, 0, 0.3)',
                    shadow: { blur: 4, offsetX: 1, offsetY: 2, color: 'rgba(0, 0, 0, 0.2)' }
                },
                // Gema base
                {
                    type: 'path',
                    path: 'M 16 4 L 24 12 L 16 28 L 8 12 Z',
                    fill: 'radial-gradient(circle, #00FFFF 0%, #0099CC 50%, #006699 100%)',
                    stroke: '#FFFFFF',
                    strokeWidth: 1,
                    glow: { color: '#00FFFF', intensity: 0.6, radius: 20 }
                },
                // Brillo interno
                {
                    type: 'path',
                    path: 'M 16 8 L 20 12 L 16 24 L 12 12 Z',
                    fill: 'radial-gradient(circle, #FFFFFF 0%, #E0F4FF 50%, #C0E8FF 100%)',
                    opacity: 0.8
                }
            ]
        }
    },
    
    // Inicialización
    init: function() {
        this.preloadSprites();
        console.log('Sistema de sprites optimizado inicializado');
    },
    
    // Precargar sprites
    preloadSprites: function() {
        Object.keys(this.sprites).forEach(spriteName => {
            this.renderSpriteToCache(spriteName);
        });
    },
    
    // Renderizar sprite a cache
    renderSpriteToCache: function(spriteName) {
        const sprite = this.sprites[spriteName];
        if (!sprite) return;
        
        // Crear canvas temporal para el sprite
        const canvas = document.createElement('canvas');
        canvas.width = sprite.width;
        canvas.height = sprite.height;
        const ctx = canvas.getContext('2d');
        
        // Configurar contexto para alta calidad
        ctx.imageSmoothingEnabled = this.config.enableAntiAliasing;
        ctx.imageSmoothingQuality = 'high';
        
        // Renderizar capas
        sprite.layers.forEach(layer => {
            this.renderLayer(ctx, layer);
        });
        
        // Guardar en cache
        this.spriteCache.set(spriteName, canvas);
    },
    
    // Renderizar una capa del sprite
    renderLayer: function(ctx, layer) {
        ctx.save();
        
        // Aplicar sombra si está configurada
        if (layer.shadow && this.config.enableShadows) {
            ctx.shadowColor = layer.shadow.color;
            ctx.shadowBlur = layer.shadow.blur;
            ctx.shadowOffsetX = layer.shadow.offsetX;
            ctx.shadowOffsetY = layer.shadow.offsetY;
        }
        
        // Aplicar glow si está configurado
        if (layer.glow && this.config.enableGlow) {
            ctx.shadowColor = layer.glow.color;
            ctx.shadowBlur = layer.glow.radius;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        
        // Renderizar según el tipo
        switch (layer.type) {
            case 'ellipse':
                this.renderEllipse(ctx, layer);
                break;
            case 'path':
                this.renderPath(ctx, layer);
                break;
            case 'lines':
                this.renderLines(ctx, layer);
                break;
            case 'group':
                this.renderGroup(ctx, layer);
                break;
            case 'circle':
                this.renderCircle(ctx, layer);
                break;
        }
        
        ctx.restore();
    },
    
    // Renderizar elipse
    renderEllipse: function(ctx, layer) {
        ctx.beginPath();
        ctx.ellipse(layer.x, layer.y, layer.rx, layer.ry, 0, 0, Math.PI * 2);
        
        if (layer.fill) {
            if (typeof layer.fill === 'string' && layer.fill.includes('gradient')) {
                ctx.fillStyle = this.createGradient(ctx, layer.fill, layer);
            } else {
                ctx.fillStyle = layer.fill;
            }
            ctx.fill();
        }
        
        if (layer.stroke) {
            ctx.strokeStyle = layer.stroke;
            ctx.lineWidth = layer.strokeWidth || 1;
            ctx.stroke();
        }
    },
    
    // Renderizar path
    renderPath: function(ctx, layer) {
        ctx.beginPath();
        ctx.path = new Path2D(layer.path);
        
        if (layer.fill) {
            if (typeof layer.fill === 'string' && layer.fill.includes('gradient')) {
                ctx.fillStyle = this.createGradient(ctx, layer.fill, layer);
            } else {
                ctx.fillStyle = layer.fill;
            }
            ctx.fill();
        }
        
        if (layer.stroke) {
            ctx.strokeStyle = layer.stroke;
            ctx.lineWidth = layer.strokeWidth || 1;
            ctx.stroke();
        }
    },
    
    // Renderizar líneas
    renderLines: function(ctx, layer) {
        layer.lines.forEach(line => {
            ctx.save();
            ctx.globalAlpha = line.opacity || 1;
            ctx.strokeStyle = line.color;
            ctx.lineWidth = line.width || 1;
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
            ctx.restore();
        });
    },
    
    // Renderizar grupo
    renderGroup: function(ctx, layer) {
        layer.elements.forEach(element => {
            this.renderLayer(ctx, element);
        });
    },
    
    // Renderizar círculo
    renderCircle: function(ctx, layer) {
        ctx.beginPath();
        ctx.arc(layer.x, layer.y, layer.r, 0, Math.PI * 2);
        
        if (layer.fill) {
            ctx.globalAlpha = layer.opacity || 1;
            ctx.fillStyle = layer.fill;
            ctx.fill();
        }
    },
    
    // Crear gradiente
    createGradient: function(ctx, gradientType, layer) {
        if (gradientType.includes('linear')) {
            const gradient = ctx.createLinearGradient(0, 0, 0, layer.height || 100);
            if (gradientType.includes('0deg')) {
                gradient.addColorStop(0, '#2C4A6A');
                gradient.addColorStop(0.3, '#3D5A7A');
                gradient.addColorStop(0.7, '#5A7A9A');
                gradient.addColorStop(1, '#7A9ABA');
            }
            return gradient;
        } else if (gradientType.includes('radial')) {
            const gradient = ctx.createRadialGradient(
                layer.x || 0, layer.y || 0, 0,
                layer.x || 0, layer.y || 0, layer.r || 50
            );
            if (gradientType.includes('#00FFFF')) {
                gradient.addColorStop(0, '#00FFFF');
                gradient.addColorStop(0.5, '#0099CC');
                gradient.addColorStop(1, '#006699');
            }
            return gradient;
        }
        return '#000000';
    },
    
    // Dibujar sprite optimizado
    drawSprite: function(ctx, spriteName, x, y, scale = 1, rotation = 0, alpha = 1) {
        const spriteCanvas = this.spriteCache.get(spriteName);
        if (!spriteCanvas) return;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        
        // Dibujar desde el centro
        const sprite = this.sprites[spriteName];
        ctx.drawImage(
            spriteCanvas,
            -sprite.width / 2,
            -sprite.height / 2,
            sprite.width,
            sprite.height
        );
        
        ctx.restore();
    },
    
    // Dibujar sprite con animación
    drawAnimatedSprite: function(ctx, spriteName, x, y, animation, time) {
        const sprite = this.sprites[spriteName];
        if (!sprite) return;
        
        // Aplicar animación si existe
        let scale = 1;
        let rotation = 0;
        let alpha = 1;
        
        if (animation) {
            if (animation.scale) {
                scale = 1 + Math.sin(time * animation.scale.speed) * animation.scale.amount;
            }
            if (animation.rotation) {
                rotation = time * animation.rotation.speed;
            }
            if (animation.alpha) {
                alpha = 0.5 + Math.sin(time * animation.alpha.speed) * 0.5;
            }
        }
        
        this.drawSprite(ctx, spriteName, x, y, scale, rotation, alpha);
    },
    
    // Obtener sprite del cache
    getSprite: function(spriteName) {
        return this.spriteCache.get(spriteName);
    },
    
    // Limpiar cache
    cleanup: function() {
        this.spriteCache.clear();
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.OptimizedSprites = OptimizedSprites;
}