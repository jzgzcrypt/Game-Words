// Sistema de Efectos Oceánicos Avanzados
const OceanEffects = {
    // Inicialización
    init: function() {
        this.time = 0;
        this.waveOffset = 0;
        this.currentStrength = 0.5;
        this.lightRays = [];
        this.particles = [];
        this.fogDensity = 0.1;
        
        // Crear rayos de luz
        for (let i = 0; i < 5; i++) {
            this.lightRays.push({
                x: Math.random() * 1000,
                width: 50 + Math.random() * 100,
                opacity: 0.1 + Math.random() * 0.2,
                speed: 0.5 + Math.random() * 0.5,
                angle: -0.3 + Math.random() * 0.6
            });
        }
        
        // Crear partículas ambientales
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * 1920,
                y: Math.random() * 1080,
                size: 1 + Math.random() * 3,
                speedX: -0.5 + Math.random(),
                speedY: -0.2 - Math.random() * 0.5,
                opacity: 0.3 + Math.random() * 0.4,
                type: Math.random() > 0.7 ? 'plankton' : 'debris'
            });
        }
    },
    
    // Actualizar efectos
    update: function() {
        this.time += 0.016; // ~60fps
        this.waveOffset += this.currentStrength;
        
        // Actualizar rayos de luz
        this.lightRays.forEach(ray => {
            ray.x += ray.speed;
            if (ray.x > 1920) ray.x = -ray.width;
        });
        
        // Actualizar partículas
        this.particles.forEach(particle => {
            particle.x += particle.speedX + Math.sin(this.time + particle.y * 0.01) * 0.3;
            particle.y += particle.speedY;
            
            // Reiniciar partículas que salen de pantalla
            if (particle.y < -10) {
                particle.y = 1090;
                particle.x = Math.random() * 1920;
            }
            if (particle.x < -10) particle.x = 1930;
            if (particle.x > 1930) particle.x = -10;
        });
    },
    
    // Dibujar fondo oceánico según bioma
    drawOceanBackground: function(ctx, biome, camera) {
        const canvas = ctx.canvas;
        
        // Limpiar con color base del bioma
        ctx.fillStyle = biome.color || '#006994';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Gradiente de profundidad mejorado
        const gradient = ctx.createRadialGradient(
            canvas.width/2, -200, 100,
            canvas.width/2, canvas.height, canvas.width
        );
        
        switch(biome.name) {
            case 'Aguas Poco Profundas':
                gradient.addColorStop(0, 'rgba(135, 206, 235, 0.3)'); // Luz solar
                gradient.addColorStop(0.4, 'rgba(95, 158, 160, 0.4)');
                gradient.addColorStop(1, 'rgba(70, 130, 180, 0.6)');
                this.fogDensity = 0.05;
                break;
                
            case 'Arrecife de Coral':
                gradient.addColorStop(0, 'rgba(255, 127, 80, 0.2)');
                gradient.addColorStop(0.4, 'rgba(255, 99, 71, 0.3)');
                gradient.addColorStop(1, 'rgba(205, 92, 92, 0.4)');
                this.fogDensity = 0.08;
                break;
                
            case 'Bosque de Kelp':
                gradient.addColorStop(0, 'rgba(34, 139, 34, 0.3)');
                gradient.addColorStop(0.4, 'rgba(0, 100, 0, 0.5)');
                gradient.addColorStop(1, 'rgba(0, 66, 37, 0.7)');
                this.fogDensity = 0.15;
                break;
                
            case 'Fosa Abisal':
                gradient.addColorStop(0, 'rgba(25, 25, 112, 0.4)');
                gradient.addColorStop(0.4, 'rgba(0, 0, 128, 0.6)');
                gradient.addColorStop(1, 'rgba(0, 0, 51, 0.9)');
                this.fogDensity = 0.25;
                break;
                
            case 'Zona Volcánica':
                gradient.addColorStop(0, 'rgba(139, 0, 0, 0.3)');
                gradient.addColorStop(0.4, 'rgba(178, 34, 34, 0.5)');
                gradient.addColorStop(1, 'rgba(139, 0, 0, 0.7)');
                this.fogDensity = 0.2;
                // Añadir resplandor de lava
                this.drawLavaGlow(ctx, camera);
                break;
                
            case 'Fosa de las Marianas':
                gradient.addColorStop(0, 'rgba(0, 0, 51, 0.7)');
                gradient.addColorStop(0.4, 'rgba(0, 0, 33, 0.85)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
                this.fogDensity = 0.4;
                break;
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Efectos específicos por bioma
        if (biome.name === 'Aguas Poco Profundas' || biome.name === 'Arrecife de Coral') {
            this.drawLightRays(ctx, biome);
        }
        
        if (biome.name === 'Bosque de Kelp') {
            this.drawKelpShadows(ctx, camera);
        }
        
        if (biome.name === 'Zona Volcánica') {
            this.drawVolcanicBubbles(ctx, camera);
        }
        
        // Partículas ambientales
        this.drawAmbientParticles(ctx, biome);
        
        // Corrientes de agua
        this.drawWaterCurrents(ctx, camera);
        
        // Niebla de profundidad
        this.drawDepthFog(ctx, biome);
    },
    
    // Rayos de luz solar
    drawLightRays: function(ctx, biome) {
        ctx.save();
        
        this.lightRays.forEach(ray => {
            const gradient = ctx.createLinearGradient(
                ray.x, 0,
                ray.x + ray.width * Math.cos(ray.angle), ctx.canvas.height
            );
            
            gradient.addColorStop(0, `rgba(255, 255, 200, ${ray.opacity})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 150, ${ray.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(ray.x, 0);
            ctx.lineTo(ray.x + ray.width, 0);
            ctx.lineTo(ray.x + ray.width + Math.cos(ray.angle) * ctx.canvas.height, ctx.canvas.height);
            ctx.lineTo(ray.x + Math.cos(ray.angle) * ctx.canvas.height, ctx.canvas.height);
            ctx.closePath();
            ctx.fill();
        });
        
        ctx.restore();
    },
    
    // Sombras del kelp
    drawKelpShadows: function(ctx, camera) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < 10; i++) {
            const x = (i * 200 - camera.x * 0.3) % ctx.canvas.width;
            const swayX = Math.sin(this.time + i * 0.5) * 20;
            
            ctx.fillStyle = 'rgba(0, 50, 0, 0.5)';
            ctx.beginPath();
            ctx.moveTo(x + swayX, 0);
            ctx.quadraticCurveTo(
                x + swayX + 30, ctx.canvas.height * 0.3,
                x + swayX + 50, ctx.canvas.height
            );
            ctx.lineTo(x + swayX + 30, ctx.canvas.height);
            ctx.quadraticCurveTo(
                x + swayX + 20, ctx.canvas.height * 0.3,
                x + swayX, 0
            );
            ctx.fill();
        }
        
        ctx.restore();
    },
    
    // Resplandor de lava
    drawLavaGlow: function(ctx, camera) {
        ctx.save();
        
        for (let i = 0; i < 5; i++) {
            const x = (i * 400 - camera.x * 0.2) % ctx.canvas.width;
            const y = ctx.canvas.height - 100 + Math.sin(this.time * 2 + i) * 20;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 150);
            gradient.addColorStop(0, 'rgba(255, 100, 0, 0.6)');
            gradient.addColorStop(0.5, 'rgba(255, 50, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x - 150, y - 150, 300, 300);
        }
        
        ctx.restore();
    },
    
    // Burbujas volcánicas
    drawVolcanicBubbles: function(ctx, camera) {
        ctx.save();
        
        for (let i = 0; i < 20; i++) {
            const bubble = {
                x: (i * 100 - camera.x * 0.5) % ctx.canvas.width,
                y: ctx.canvas.height - (this.time * 50 + i * 30) % ctx.canvas.height,
                size: 5 + Math.sin(i) * 3
            };
            
            ctx.fillStyle = 'rgba(255, 100, 0, 0.4)';
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(255, 150, 0, 0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        ctx.restore();
    },
    
    // Partículas ambientales
    drawAmbientParticles: function(ctx, biome) {
        ctx.save();
        
        this.particles.forEach(particle => {
            if (particle.type === 'plankton') {
                ctx.fillStyle = `rgba(200, 255, 200, ${particle.opacity})`;
            } else {
                ctx.fillStyle = `rgba(150, 150, 150, ${particle.opacity})`;
            }
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    },
    
    // Corrientes de agua
    drawWaterCurrents: function(ctx, camera) {
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 5; i++) {
            const y = ctx.canvas.height * (0.2 + i * 0.2);
            const offset = Math.sin(this.time + i) * 30;
            
            ctx.beginPath();
            ctx.moveTo(0, y + offset);
            
            for (let x = 0; x <= ctx.canvas.width; x += 50) {
                const wave = Math.sin(x * 0.01 + this.time * 2) * 15;
                ctx.lineTo(x, y + offset + wave);
            }
            
            ctx.stroke();
        }
        
        ctx.restore();
    },
    
    // Niebla de profundidad
    drawDepthFog: function(ctx, biome) {
        if (this.fogDensity > 0) {
            ctx.save();
            
            const gradient = ctx.createRadialGradient(
                ctx.canvas.width/2, ctx.canvas.height/2, 0,
                ctx.canvas.width/2, ctx.canvas.height/2, ctx.canvas.width
            );
            
            gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
            gradient.addColorStop(0.5, `rgba(0, 0, 0, ${this.fogDensity * 0.5})`);
            gradient.addColorStop(1, `rgba(0, 0, 0, ${this.fogDensity})`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            ctx.restore();
        }
    },
    
    // Efecto de distorsión del agua
    drawWaterDistortion: function(ctx) {
        // Este efecto se aplicaría con un shader en WebGL, 
        // aquí simulamos con transparencias
        ctx.save();
        ctx.globalAlpha = 0.02;
        
        for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
            ctx.scale(
                1 + Math.sin(this.time * 2 + i) * 0.01,
                1 + Math.cos(this.time * 2 + i) * 0.01
            );
            ctx.translate(-ctx.canvas.width/2, -ctx.canvas.height/2);
            
            // Aquí se redibujaría el contenido con distorsión
            ctx.restore();
        }
        
        ctx.restore();
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.OceanEffects = OceanEffects;
}