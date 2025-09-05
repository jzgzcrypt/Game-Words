// Sistema de Gráficos Robusto y Confiable para Cosmic Depths
const RobustGraphics = {
    // Configuración simple
    config: {
        enableParticles: true,
        enableBubbles: true,
        enableLighting: true,
        maxParticles: 100,
        maxBubbles: 15
    },
    
    // Estado
    state: {
        initialized: false,
        bubbles: [],
        particles: []
    },
    
    // Inicialización
    init: function() {
        console.log('Sistema de gráficos robusto inicializando...');
        this.createBubbles();
        this.state.initialized = true;
        console.log('Sistema de gráficos robusto listo');
    },
    
    // Crear burbujas
    createBubbles: function() {
        this.state.bubbles = [];
        for (let i = 0; i < this.config.maxBubbles; i++) {
            this.state.bubbles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 100,
                size: Math.random() * 12 + 3,
                speed: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.4 + 0.1,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.03 + 0.01
            });
        }
    },
    
    // Renderizar
    render: function(gameState, camera) {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Renderizar fondo
        this.renderBackground(ctx, canvas);
        
        // Renderizar burbujas
        if (this.config.enableBubbles) {
            this.renderBubbles(ctx, canvas);
        }
        
        // Renderizar entidades
        this.renderEntities(ctx, gameState);
        
        // Renderizar UI
        this.renderUI(ctx, gameState);
    },
    
    // Renderizar fondo
    renderBackground: function(ctx, canvas) {
        // Gradiente oceánico simple
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.3, '#4682B4');
        gradient.addColorStop(0.6, '#1E90FF');
        gradient.addColorStop(1, '#000080');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    
    // Renderizar burbujas
    renderBubbles: function(ctx, canvas) {
        this.state.bubbles.forEach(bubble => {
            // Actualizar burbuja
            bubble.y -= bubble.speed;
            bubble.wobble += bubble.wobbleSpeed;
            bubble.x += Math.sin(bubble.wobble) * 0.3;
            
            // Resetear si sale de pantalla
            if (bubble.y < -bubble.size) {
                bubble.x = Math.random() * canvas.width;
                bubble.y = canvas.height + Math.random() * 50;
            }
            
            // Renderizar burbuja
            ctx.save();
            ctx.globalAlpha = bubble.opacity;
            
            // Burbuja principal
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Brillo
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        });
    },
    
    // Renderizar entidades
    renderEntities: function(ctx, gameState) {
        // Renderizar estaciones de comercio
        if (gameState.merchantStations) {
            gameState.merchantStations.forEach(station => {
                if (station && station.draw) {
                    station.draw();
                } else {
                    this.renderMerchant(ctx, station);
                }
            });
        }
        
        // Renderizar gemas
        if (gameState.gems) {
            gameState.gems.forEach(gem => {
                if (gem && gem.draw) {
                    gem.draw();
                } else {
                    this.renderGem(ctx, gem);
                }
            });
        }
        
        // Renderizar enemigos
        if (gameState.enemies) {
            gameState.enemies.forEach(enemy => {
                if (enemy && enemy.draw) {
                    enemy.draw();
                } else {
                    this.renderEnemy(ctx, enemy);
                }
            });
        }
        
        // Renderizar proyectiles
        if (gameState.projectiles) {
            gameState.projectiles.forEach(projectile => {
                if (projectile && projectile.draw) {
                    projectile.draw();
                } else {
                    this.renderProjectile(ctx, projectile);
                }
            });
        }
        
        // Renderizar partículas
        if (gameState.particles) {
            gameState.particles.forEach(particle => {
                if (particle && particle.draw) {
                    particle.draw();
                }
            });
        }
        
        // Renderizar jugador
        if (gameState.player) {
            if (gameState.player.draw) {
                gameState.player.draw();
            } else {
                this.renderPlayer(ctx, gameState.player);
            }
        }
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
            ctx.arc(player.x - player.vx * 3, player.y - player.vy * 3, 8, 0, Math.PI * 2);
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
        ctx.fillStyle = '#FFD700';
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
    
    // Renderizar UI
    renderUI: function(ctx, gameState) {
        // Profundidad
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, canvas.height - 30, 200, 20);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        const depth = Math.floor(Math.sqrt(gameState.player.x * gameState.player.x + gameState.player.y * gameState.player.y) / 10);
        ctx.fillText(`Profundidad: ${depth}m`, 15, canvas.height - 15);
        
        // FPS
        if (gameState.fps && gameState.fps.current) {
            ctx.fillStyle = gameState.fps.current < 30 ? '#FF0000' : gameState.fps.current < 45 ? '#FFFF00' : '#00FF00';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`FPS: ${gameState.fps.current}`, canvas.width - 10, 20);
        }
        
        // Objetivo seleccionado
        if (gameState.selectedTarget) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(10, canvas.height - 60, 200, 20);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Objetivo: ${gameState.selectedTarget.name}`, 15, canvas.height - 45);
        }
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.RobustGraphics = RobustGraphics;
}