// Sistema de Sprites Ultra-Realistas para Enemigos
const EnemySprites = {
    // Configuración mixta de criaturas marinas y naves submarinas
    enemies: {
        // Nivel 1-3: Drones de Exploración
        scout: {
            name: 'Dron Explorador',
            levels: [1, 2, 3],
            baseColor: '#4A90E2',
            accentColor: '#63B8FF',
            glowColor: '#00BFFF',
            draw: function(ctx, enemy) {
                const size = enemy.size;
                ctx.save();
                
                // Sombra principal
                ctx.shadowBlur = 20;
                ctx.shadowColor = this.glowColor;
                
                // Cuerpo principal - diseño aerodinámico
                const gradient = ctx.createLinearGradient(-size, 0, size, 0);
                gradient.addColorStop(0, this.baseColor);
                gradient.addColorStop(0.5, this.accentColor);
                gradient.addColorStop(1, this.baseColor);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(0, 0, size * 1.2, size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Detalles metálicos
                ctx.strokeStyle = '#2C5F8B';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Cabina de cristal
                const glassGradient = ctx.createRadialGradient(size * 0.3, 0, 0, size * 0.3, 0, size * 0.4);
                glassGradient.addColorStop(0, 'rgba(200, 230, 255, 0.8)');
                glassGradient.addColorStop(0.5, 'rgba(150, 200, 255, 0.6)');
                glassGradient.addColorStop(1, 'rgba(100, 150, 200, 0.4)');
                
                ctx.fillStyle = glassGradient;
                ctx.beginPath();
                ctx.ellipse(size * 0.3, 0, size * 0.4, size * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Propulsores
                for (let i = -1; i <= 1; i++) {
                    if (i === 0) continue;
                    ctx.fillStyle = '#FF6B6B';
                    ctx.shadowColor = '#FF0000';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.ellipse(-size * 0.8, i * size * 0.3, size * 0.15, size * 0.1, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Estela de propulsión
                    const jetGradient = ctx.createLinearGradient(-size, 0, -size * 1.5, 0);
                    jetGradient.addColorStop(0, 'rgba(255, 100, 100, 0.8)');
                    jetGradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.4)');
                    jetGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
                    
                    ctx.fillStyle = jetGradient;
                    ctx.beginPath();
                    ctx.moveTo(-size * 0.9, i * size * 0.3);
                    ctx.lineTo(-size * 1.5 - Math.random() * 10, i * size * 0.2);
                    ctx.lineTo(-size * 1.5 - Math.random() * 10, i * size * 0.4);
                    ctx.closePath();
                    ctx.fill();
                }
                
                // Luces LED
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#00FF00';
                ctx.fillStyle = '#00FF00';
                ctx.beginPath();
                ctx.arc(size * 0.7, 0, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Antena de comunicación
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, -size * 0.3);
                ctx.lineTo(0, -size * 0.6);
                ctx.stroke();
                
                ctx.fillStyle = '#FF0000';
                ctx.beginPath();
                ctx.arc(0, -size * 0.6, 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        },
        
        // Nivel 4-6: Submarino de Combate
        fighter: {
            name: 'Submarino de Combate',
            levels: [4, 5, 6],
            baseColor: '#2C3E50',
            accentColor: '#34495E',
            glowColor: '#E74C3C',
            draw: function(ctx, enemy) {
                const size = enemy.size;
                ctx.save();
                
                // Sombra amenazante
                ctx.shadowBlur = 25;
                ctx.shadowColor = this.glowColor;
                
                // Casco principal - diseño angular agresivo
                const hullGradient = ctx.createLinearGradient(0, -size, 0, size);
                hullGradient.addColorStop(0, '#34495E');
                hullGradient.addColorStop(0.3, this.baseColor);
                hullGradient.addColorStop(0.7, this.baseColor);
                hullGradient.addColorStop(1, '#1C2833');
                
                ctx.fillStyle = hullGradient;
                ctx.beginPath();
                // Forma de diamante alargado
                ctx.moveTo(size * 1.5, 0);
                ctx.lineTo(size * 0.5, -size * 0.7);
                ctx.lineTo(-size * 0.5, -size * 0.5);
                ctx.lineTo(-size * 1.2, 0);
                ctx.lineTo(-size * 0.5, size * 0.5);
                ctx.lineTo(size * 0.5, size * 0.7);
                ctx.closePath();
                ctx.fill();
                
                // Líneas de detalle
                ctx.strokeStyle = '#1C2833';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Torre de mando
                ctx.fillStyle = '#2C3E50';
                ctx.fillRect(-size * 0.2, -size * 0.8, size * 0.4, size * 0.3);
                
                // Periscopio
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -size * 0.8);
                ctx.lineTo(0, -size * 1.1);
                ctx.stroke();
                
                // Ventanas con luz interior
                const windowGlow = ctx.createRadialGradient(size * 0.3, 0, 0, size * 0.3, 0, size * 0.2);
                windowGlow.addColorStop(0, 'rgba(255, 200, 0, 0.9)');
                windowGlow.addColorStop(1, 'rgba(255, 100, 0, 0.3)');
                
                for (let i = -1; i <= 1; i++) {
                    ctx.fillStyle = windowGlow;
                    ctx.beginPath();
                    ctx.arc(size * 0.3 + i * size * 0.3, 0, size * 0.08, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Torpedos visibles
                ctx.fillStyle = '#C0392B';
                for (let i = -1; i <= 1; i += 2) {
                    ctx.fillRect(size * 0.8, i * size * 0.4, size * 0.3, size * 0.1);
                    // Punta del torpedo
                    ctx.beginPath();
                    ctx.moveTo(size * 1.1, i * size * 0.45);
                    ctx.lineTo(size * 1.3, i * size * 0.45);
                    ctx.lineTo(size * 1.2, i * size * 0.35);
                    ctx.closePath();
                    ctx.fill();
                }
                
                // Hélice trasera animada
                ctx.save();
                ctx.translate(-size * 1.2, 0);
                ctx.rotate(Date.now() * 0.01);
                
                for (let i = 0; i < 3; i++) {
                    ctx.rotate(Math.PI * 2 / 3);
                    ctx.fillStyle = '#666';
                    ctx.fillRect(-2, -size * 0.3, 4, size * 0.6);
                }
                ctx.restore();
                
                // Burbujas de escape
                for (let i = 0; i < 3; i++) {
                    const bubbleX = -size * 1.3 - i * 10;
                    const bubbleY = Math.sin(Date.now() * 0.003 + i) * 10;
                    const bubbleSize = 3 + i;
                    
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.beginPath();
                    ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.restore();
            }
        },
        
        // Nivel 7-9: Crucero de Asalto
        cruiser: {
            name: 'Crucero de Asalto',
            levels: [7, 8, 9],
            baseColor: '#8B0000',
            accentColor: '#DC143C',
            glowColor: '#FF1493',
            draw: function(ctx, enemy) {
                const size = enemy.size;
                ctx.save();
                
                // Efecto de energía pulsante
                const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 1;
                ctx.scale(pulse, pulse);
                
                // Sombra intensa
                ctx.shadowBlur = 30;
                ctx.shadowColor = this.glowColor;
                
                // Casco principal masivo
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
                gradient.addColorStop(0, this.accentColor);
                gradient.addColorStop(0.7, this.baseColor);
                gradient.addColorStop(1, '#4B0000');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                // Forma hexagonal alargada
                const points = 6;
                for (let i = 0; i < points; i++) {
                    const angle = (i / points) * Math.PI * 2;
                    const radius = i % 2 === 0 ? size * 1.5 : size * 1.2;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius * 0.6;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                
                // Armadura segmentada
                ctx.strokeStyle = '#2C0000';
                ctx.lineWidth = 3;
                for (let i = -1; i <= 1; i++) {
                    ctx.beginPath();
                    ctx.moveTo(-size * 1.2, i * size * 0.3);
                    ctx.lineTo(size * 1.2, i * size * 0.3);
                    ctx.stroke();
                }
                
                // Cañones láser
                for (let i = -1; i <= 1; i++) {
                    // Base del cañón
                    ctx.fillStyle = '#666';
                    ctx.fillRect(size * 0.3, i * size * 0.5, size * 0.4, size * 0.15);
                    
                    // Cañón
                    ctx.fillStyle = '#333';
                    ctx.fillRect(size * 0.7, i * size * 0.52, size * 0.5, size * 0.1);
                    
                    // Energía del cañón
                    const laserGradient = ctx.createLinearGradient(size * 1.2, 0, size * 1.5, 0);
                    laserGradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
                    laserGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                    
                    ctx.fillStyle = laserGradient;
                    ctx.fillRect(size * 1.2, i * size * 0.54, size * 0.3, size * 0.06);
                }
                
                // Reactor nuclear central
                const reactorGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.4);
                reactorGradient.addColorStop(0, '#FFFF00');
                reactorGradient.addColorStop(0.3, '#FFA500');
                reactorGradient.addColorStop(0.6, '#FF4500');
                reactorGradient.addColorStop(1, 'rgba(255, 0, 0, 0.3)');
                
                ctx.fillStyle = reactorGradient;
                ctx.beginPath();
                ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                // Símbolo de peligro
                ctx.strokeStyle = '#FFFF00';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let i = 0; i < 3; i++) {
                    const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.cos(angle) * size * 0.25, Math.sin(angle) * size * 0.25);
                }
                ctx.stroke();
                
                // Escudo de energía
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.ellipse(0, 0, size * 1.8, size * 1.2, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                
                ctx.restore();
            }
        },
        
        // Nivel 10-12: Acorazado Pesado
        battleship: {
            name: 'Acorazado Pesado',
            levels: [10, 11, 12],
            baseColor: '#1A1A2E',
            accentColor: '#16213E',
            glowColor: '#9D00FF',
            draw: function(ctx, enemy) {
                const size = enemy.size;
                ctx.save();
                
                // Efecto de distorsión espacial
                ctx.shadowBlur = 40;
                ctx.shadowColor = this.glowColor;
                
                // Casco masivo principal
                const hullGradient = ctx.createLinearGradient(-size * 1.5, 0, size * 1.5, 0);
                hullGradient.addColorStop(0, '#0F0F1E');
                hullGradient.addColorStop(0.2, this.accentColor);
                hullGradient.addColorStop(0.5, this.baseColor);
                hullGradient.addColorStop(0.8, this.accentColor);
                hullGradient.addColorStop(1, '#0F0F1E');
                
                ctx.fillStyle = hullGradient;
                ctx.beginPath();
                // Diseño de fortaleza flotante
                ctx.moveTo(size * 2, 0);
                ctx.lineTo(size * 1.5, -size * 0.8);
                ctx.lineTo(size * 0.5, -size);
                ctx.lineTo(-size * 0.5, -size);
                ctx.lineTo(-size * 1.5, -size * 0.8);
                ctx.lineTo(-size * 1.8, -size * 0.4);
                ctx.lineTo(-size * 1.8, size * 0.4);
                ctx.lineTo(-size * 1.5, size * 0.8);
                ctx.lineTo(-size * 0.5, size);
                ctx.lineTo(size * 0.5, size);
                ctx.lineTo(size * 1.5, size * 0.8);
                ctx.closePath();
                ctx.fill();
                
                // Placas de blindaje
                ctx.fillStyle = '#2C2C3E';
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        ctx.fillRect(i * size * 0.6 - size * 0.15, j * size * 0.4 - size * 0.1, size * 0.3, size * 0.2);
                    }
                }
                
                // Torres de artillería principal
                for (let i = -1; i <= 1; i++) {
                    ctx.save();
                    ctx.translate(i * size * 0.7, i === 0 ? 0 : i * size * 0.5);
                    
                    // Base de la torre
                    ctx.fillStyle = '#444';
                    ctx.beginPath();
                    ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Cañones gemelos
                    ctx.fillStyle = '#222';
                    ctx.fillRect(0, -size * 0.08, size * 0.6, size * 0.05);
                    ctx.fillRect(0, size * 0.03, size * 0.6, size * 0.05);
                    
                    ctx.restore();
                }
                
                // Motor de curvatura
                const warpGradient = ctx.createRadialGradient(-size * 1.5, 0, 0, -size * 1.5, 0, size * 0.5);
                warpGradient.addColorStop(0, '#FFFFFF');
                warpGradient.addColorStop(0.2, '#9D00FF');
                warpGradient.addColorStop(0.5, '#4B0082');
                warpGradient.addColorStop(1, 'rgba(75, 0, 130, 0)');
                
                ctx.fillStyle = warpGradient;
                ctx.beginPath();
                ctx.arc(-size * 1.5, 0, size * 0.4, 0, Math.PI * 2);
                ctx.fill();
                
                // Anillos de energía
                ctx.strokeStyle = 'rgba(157, 0, 255, 0.5)';
                ctx.lineWidth = 2;
                for (let i = 1; i <= 3; i++) {
                    ctx.beginPath();
                    ctx.arc(-size * 1.5, 0, size * 0.2 * i, 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                // Luces de navegación
                const lights = [
                    { x: size * 1.8, y: -size * 0.5, color: '#FF0000' },
                    { x: size * 1.8, y: size * 0.5, color: '#00FF00' },
                    { x: -size * 1.7, y: 0, color: '#FFFFFF' }
                ];
                
                lights.forEach(light => {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = light.color;
                    ctx.fillStyle = light.color;
                    ctx.beginPath();
                    ctx.arc(light.x, light.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                });
                
                ctx.restore();
            }
        },
        
        // Nivel 13+: Destructor Élite
        destroyer: {
            name: 'Destructor Élite',
            levels: [13, 14, 15, 16, 17, 18, 19, 20],
            baseColor: '#FFD700',
            accentColor: '#FFA500',
            glowColor: '#FFFF00',
            draw: function(ctx, enemy) {
                const size = enemy.size;
                ctx.save();
                
                // Aura de poder
                const auraGradient = ctx.createRadialGradient(0, 0, size * 0.5, 0, 0, size * 2);
                auraGradient.addColorStop(0, 'rgba(255, 255, 0, 0.3)');
                auraGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.1)');
                auraGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                
                ctx.fillStyle = auraGradient;
                ctx.beginPath();
                ctx.arc(0, 0, size * 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Casco dorado principal
                const goldGradient = ctx.createLinearGradient(0, -size, 0, size);
                goldGradient.addColorStop(0, '#FFED4E');
                goldGradient.addColorStop(0.3, this.baseColor);
                goldGradient.addColorStop(0.7, this.accentColor);
                goldGradient.addColorStop(1, '#B8860B');
                
                ctx.fillStyle = goldGradient;
                ctx.beginPath();
                // Diseño de águila
                ctx.moveTo(size * 2, 0);
                ctx.quadraticCurveTo(size * 1.5, -size * 0.5, size, -size * 0.8);
                ctx.lineTo(0, -size);
                ctx.lineTo(-size, -size * 0.8);
                ctx.quadraticCurveTo(-size * 1.5, -size * 0.5, -size * 2, 0);
                ctx.quadraticCurveTo(-size * 1.5, size * 0.5, -size, size * 0.8);
                ctx.lineTo(0, size);
                ctx.lineTo(size, size * 0.8);
                ctx.quadraticCurveTo(size * 1.5, size * 0.5, size * 2, 0);
                ctx.closePath();
                ctx.fill();
                
                // Detalles ornamentales
                ctx.strokeStyle = '#B8860B';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                // Gemas de poder
                const gems = [
                    { x: 0, y: 0, size: size * 0.3, color: '#FF0000' },
                    { x: size * 0.5, y: -size * 0.3, size: size * 0.15, color: '#00FF00' },
                    { x: -size * 0.5, y: -size * 0.3, size: size * 0.15, color: '#0000FF' },
                    { x: size * 0.5, y: size * 0.3, size: size * 0.15, color: '#FF00FF' },
                    { x: -size * 0.5, y: size * 0.3, size: size * 0.15, color: '#00FFFF' }
                ];
                
                gems.forEach(gem => {
                    const gemGradient = ctx.createRadialGradient(gem.x, gem.y, 0, gem.x, gem.y, gem.size);
                    gemGradient.addColorStop(0, gem.color);
                    gemGradient.addColorStop(0.5, gem.color + '80');
                    gemGradient.addColorStop(1, gem.color + '20');
                    
                    ctx.fillStyle = gemGradient;
                    ctx.beginPath();
                    ctx.arc(gem.x, gem.y, gem.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Brillo de la gema
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.beginPath();
                    ctx.arc(gem.x - gem.size * 0.3, gem.y - gem.size * 0.3, gem.size * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                });
                
                // Alas de energía
                ctx.save();
                ctx.globalAlpha = 0.7;
                
                for (let side = -1; side <= 1; side += 2) {
                    const wingGradient = ctx.createLinearGradient(0, 0, side * size * 2, 0);
                    wingGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
                    wingGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)');
                    wingGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    
                    ctx.fillStyle = wingGradient;
                    ctx.beginPath();
                    ctx.moveTo(side * size * 0.5, 0);
                    ctx.quadraticCurveTo(side * size * 1.5, -size, side * size * 2.5, -size * 0.5);
                    ctx.quadraticCurveTo(side * size * 2, 0, side * size * 2.5, size * 0.5);
                    ctx.quadraticCurveTo(side * size * 1.5, size, side * size * 0.5, 0);
                    ctx.fill();
                }
                
                ctx.restore();
                
                // Corona de poder
                ctx.strokeStyle = this.baseColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const innerRadius = size * 1.5;
                    const outerRadius = size * 1.8;
                    
                    ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
                    ctx.lineTo(Math.cos(angle + Math.PI / 16) * outerRadius, Math.sin(angle + Math.PI / 16) * outerRadius);
                }
                ctx.stroke();
                
                ctx.restore();
            }
        }
    },
    
    // Criaturas marinas naturales
    creatures: {
        fish: {
            name: 'Pez Tropical',
            draw: function(ctx, enemy) {
                const size = enemy.size;
                ctx.save();
                
                // Cuerpo del pez
                const gradient = ctx.createLinearGradient(-size, 0, size, 0);
                gradient.addColorStop(0, '#FF6B6B');
                gradient.addColorStop(0.5, '#FF8E53');
                gradient.addColorStop(1, '#FF6B6B');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(0, 0, size * 1.2, size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Aletas
                ctx.fillStyle = 'rgba(255, 107, 107, 0.7)';
                ctx.beginPath();
                ctx.moveTo(-size * 0.5, 0);
                ctx.lineTo(-size * 0.8, -size * 0.4);
                ctx.lineTo(-size * 0.3, -size * 0.2);
                ctx.closePath();
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(-size * 0.5, 0);
                ctx.lineTo(-size * 0.8, size * 0.4);
                ctx.lineTo(-size * 0.3, size * 0.2);
                ctx.closePath();
                ctx.fill();
                
                // Cola
                ctx.beginPath();
                ctx.moveTo(-size, 0);
                ctx.lineTo(-size * 1.5, -size * 0.5);
                ctx.lineTo(-size * 1.5, size * 0.5);
                ctx.closePath();
                ctx.fill();
                
                // Ojo
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(size * 0.5, -size * 0.1, size * 0.15, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(size * 0.55, -size * 0.1, size * 0.08, 0, Math.PI * 2);
                ctx.fill();
                
                // Escamas brillantes
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                for (let i = -3; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(i * size * 0.2, 0, size * 0.1, 0, Math.PI);
                    ctx.stroke();
                }
                
                ctx.restore();
            }
        },
        
        jellyfish: {
            name: 'Medusa Bioluminiscente',
            draw: function(ctx, enemy) {
                const size = enemy.size;
                const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 1;
                
                ctx.save();
                ctx.scale(pulse, pulse);
                
                // Glow bioluminiscente
                ctx.shadowBlur = 30;
                ctx.shadowColor = '#FF69B4';
                
                // Campana de la medusa
                const gradient = ctx.createRadialGradient(0, -size * 0.3, 0, 0, 0, size);
                gradient.addColorStop(0, 'rgba(255, 105, 180, 0.8)');
                gradient.addColorStop(0.5, 'rgba(255, 20, 147, 0.6)');
                gradient.addColorStop(1, 'rgba(139, 69, 139, 0.3)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(0, 0, size, size * 0.8, 0, Math.PI, Math.PI * 2);
                ctx.fill();
                
                // Tentáculos ondulantes
                ctx.strokeStyle = 'rgba(255, 105, 180, 0.6)';
                ctx.lineWidth = 2;
                for (let i = -4; i <= 4; i++) {
                    ctx.beginPath();
                    ctx.moveTo(i * size * 0.2, size * 0.5);
                    const wave = Math.sin(Date.now() * 0.005 + i) * 10;
                    ctx.quadraticCurveTo(
                        i * size * 0.2 + wave, 
                        size, 
                        i * size * 0.2 + wave * 0.5, 
                        size * 1.5
                    );
                    ctx.stroke();
                }
                
                // Puntos bioluminiscentes
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                for (let i = 0; i < 5; i++) {
                    const angle = (i / 5) * Math.PI;
                    const x = Math.cos(angle) * size * 0.7;
                    const y = Math.sin(angle) * size * 0.3;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.restore();
            }
        },
        
        shark: {
            name: 'Tiburón',
            draw: function(ctx, enemy) {
                const size = enemy.size;
                ctx.save();
                
                // Cuerpo del tiburón
                ctx.fillStyle = '#708090';
                ctx.beginPath();
                ctx.ellipse(0, 0, size * 1.5, size * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Aleta dorsal
                ctx.fillStyle = '#5F6A7A';
                ctx.beginPath();
                ctx.moveTo(0, -size * 0.7);
                ctx.lineTo(size * 0.3, -size * 0.3);
                ctx.lineTo(-size * 0.3, -size * 0.3);
                ctx.closePath();
                ctx.fill();
                
                // Cola
                ctx.beginPath();
                ctx.moveTo(-size * 1.2, 0);
                ctx.lineTo(-size * 1.8, -size * 0.6);
                ctx.lineTo(-size * 1.5, 0);
                ctx.lineTo(-size * 1.8, size * 0.6);
                ctx.closePath();
                ctx.fill();
                
                // Boca con dientes
                ctx.strokeStyle = '#2C3E50';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(size * 0.8, size * 0.1, size * 0.3, 0.2, Math.PI - 0.2);
                ctx.stroke();
                
                // Dientes
                ctx.fillStyle = 'white';
                for (let i = 0; i < 5; i++) {
                    const angle = 0.3 + i * 0.5;
                    const x = size * 0.8 + Math.cos(angle) * size * 0.25;
                    const y = size * 0.1 + Math.sin(angle) * size * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x - 2, y + 4);
                    ctx.lineTo(x + 2, y + 4);
                    ctx.closePath();
                    ctx.fill();
                }
                
                // Ojo
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(size * 0.6, -size * 0.2, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Branquias
                ctx.strokeStyle = '#2C3E50';
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(size * 0.2 - i * 5, -size * 0.2);
                    ctx.lineTo(size * 0.2 - i * 5, size * 0.2);
                    ctx.stroke();
                }
                
                ctx.restore();
            }
        },
        
        octopus: {
            name: 'Pulpo',
            draw: function(ctx, enemy) {
                const size = enemy.size;
                ctx.save();
                
                // Cabeza del pulpo
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
                gradient.addColorStop(0, '#9C27B0');
                gradient.addColorStop(0.7, '#7B1FA2');
                gradient.addColorStop(1, '#4A148C');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(0, 0, size, size * 1.2, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Tentáculos
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const baseX = Math.cos(angle) * size * 0.7;
                    const baseY = Math.sin(angle) * size * 0.7;
                    
                    ctx.strokeStyle = '#7B1FA2';
                    ctx.lineWidth = size * 0.2;
                    ctx.lineCap = 'round';
                    
                    ctx.beginPath();
                    ctx.moveTo(baseX, baseY);
                    
                    const wave1 = Math.sin(Date.now() * 0.003 + i) * 10;
                    const wave2 = Math.cos(Date.now() * 0.004 + i) * 10;
                    
                    ctx.quadraticCurveTo(
                        baseX * 1.5 + wave1,
                        baseY * 1.5 + wave2,
                        baseX * 2 + wave1 * 0.5,
                        baseY * 2 + wave2 * 0.5
                    );
                    ctx.stroke();
                    
                    // Ventosas
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    for (let j = 0; j < 3; j++) {
                        const t = (j + 1) / 4;
                        const x = baseX * (1 + t);
                        const y = baseY * (1 + t);
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                // Ojos
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.ellipse(-size * 0.3, -size * 0.2, size * 0.2, size * 0.3, 0, 0, Math.PI * 2);
                ctx.ellipse(size * 0.3, -size * 0.2, size * 0.2, size * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(-size * 0.3, -size * 0.2, size * 0.1, 0, Math.PI * 2);
                ctx.arc(size * 0.3, -size * 0.2, size * 0.1, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }
    },
    
    // Método para obtener el sprite correcto según el nivel y tipo
    getEnemySprite: function(level, forceType = null) {
        // Si se especifica un tipo, usarlo
        if (forceType) {
            if (this.creatures[forceType]) return this.creatures[forceType];
        }
        
        // Sistema mixto: 50% criaturas naturales, 50% naves
        const useNaturalCreature = Math.random() < 0.5;
        
        if (useNaturalCreature) {
            // Seleccionar criatura según nivel
            if (level <= 3) return Math.random() < 0.7 ? this.creatures.fish : this.creatures.jellyfish;
            if (level <= 6) return Math.random() < 0.6 ? this.creatures.fish : this.creatures.shark;
            if (level <= 9) return Math.random() < 0.5 ? this.creatures.shark : this.creatures.octopus;
            if (level <= 12) return Math.random() < 0.5 ? this.creatures.octopus : this.creatures.jellyfish;
            return this.creatures.octopus; // Niveles altos
        } else {
            // Seleccionar nave según nivel
            if (level <= 3) return this.enemies.scout;
            if (level <= 6) return this.enemies.fighter;
            if (level <= 9) return this.enemies.cruiser;
            if (level <= 12) return this.enemies.battleship;
            return this.enemies.destroyer;
        }
    },
    
    // Método principal de dibujo
    drawEnemy: function(ctx, enemy) {
        // Usar el sprite guardado en el enemigo o generar uno nuevo
        const sprite = enemy.spriteData || this.getEnemySprite(enemy.level);
        
        ctx.save();
        ctx.translate(enemy.x - gameState.camera.x, enemy.y - gameState.camera.y);
        ctx.rotate(enemy.angle);
        
        // Efecto de daño
        if (enemy.lastHit && Date.now() - enemy.lastHit < 200) {
            ctx.filter = 'brightness(2) contrast(1.2)';
        }
        
        // Si es una nave y hay submarinos profesionales disponibles, usarlos
        if (window.ProfessionalSubmarines && !sprite.name?.includes('Pez') && !sprite.name?.includes('Medusa') && 
            !sprite.name?.includes('Tiburón') && !sprite.name?.includes('Pulpo')) {
            
            // Cargar sprites profesionales si no están cargados
            if (!this.professionalSprites) {
                this.professionalSprites = window.ProfessionalSubmarines.loadSprites();
                this.professionalImages = {};
                
                // Crear imágenes para cada sprite
                for (let key in this.professionalSprites) {
                    const img = new Image();
                    img.src = this.professionalSprites[key];
                    this.professionalImages[key] = img;
                }
            }
            
            // Seleccionar submarino según nivel
            const subType = window.ProfessionalSubmarines.getSubmarineForLevel(enemy.level);
            const img = this.professionalImages[subType];
            
            if (img && img.complete) {
                // Dibujar submarino profesional
                const scale = enemy.size / 25;
                ctx.scale(scale, scale);
                ctx.drawImage(img, -100, -50, 200, 100);
            } else {
                // Fallback al sprite original mientras carga
                sprite.draw(ctx, enemy);
            }
        } else {
            // Dibujar sprite normal (criatura marina o nave básica)
            sprite.draw(ctx, enemy);
        }
        
        // Barra de vida elegante
        this.drawHealthBar(ctx, enemy);
        
        // Indicador de nivel
        this.drawLevelIndicator(ctx, enemy);
        
        ctx.restore();
    },
    
    // Barra de vida estilizada
    drawHealthBar: function(ctx, enemy) {
        const barWidth = enemy.size * 2;
        const barHeight = 6;
        const barY = enemy.size + 15;
        
        // Fondo de la barra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(-barWidth/2, barY, barWidth, barHeight);
        
        // Borde elegante
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-barWidth/2, barY, barWidth, barHeight);
        
        // Barra de vida con gradiente
        const healthPercent = enemy.health / enemy.maxHealth;
        const healthGradient = ctx.createLinearGradient(-barWidth/2, 0, barWidth/2, 0);
        
        if (healthPercent > 0.6) {
            healthGradient.addColorStop(0, '#00FF00');
            healthGradient.addColorStop(1, '#00CC00');
        } else if (healthPercent > 0.3) {
            healthGradient.addColorStop(0, '#FFFF00');
            healthGradient.addColorStop(1, '#FF9900');
        } else {
            healthGradient.addColorStop(0, '#FF0000');
            healthGradient.addColorStop(1, '#CC0000');
        }
        
        ctx.fillStyle = healthGradient;
        ctx.fillRect(-barWidth/2 + 1, barY + 1, (barWidth - 2) * healthPercent, barHeight - 2);
        
        // Brillo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(-barWidth/2 + 1, barY + 1, (barWidth - 2) * healthPercent, 2);
    },
    
    // Indicador de nivel mejorado
    drawLevelIndicator: function(ctx, enemy) {
        ctx.save();
        
        // Posición junto al nombre, más sutil
        const levelX = enemy.size + 15;
        const levelY = -enemy.size - 15;
        
        // Texto de nivel simple y elegante
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        // Sombra para legibilidad
        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        
        // Color según nivel
        let levelColor = '#CCCCCC'; // Gris para niveles bajos
        if (enemy.level >= 15) {
            levelColor = '#FFD700'; // Dorado para niveles muy altos
        } else if (enemy.level >= 10) {
            levelColor = '#FF69B4'; // Rosa para niveles altos
        } else if (enemy.level >= 5) {
            levelColor = '#00CED1'; // Cyan para niveles medios
        }
        
        ctx.fillStyle = levelColor;
        ctx.fillText(`Lv.${enemy.level}`, levelX, levelY);
        
        // Indicador de dificultad con símbolos
        if (enemy.level >= 20) {
            ctx.fillStyle = '#FF0000';
            ctx.font = '10px Arial';
            ctx.fillText(' ☠', levelX + 25, levelY);
        } else if (enemy.level >= 15) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText(' ⚠', levelX + 25, levelY);
        } else if (enemy.level >= 10) {
            ctx.fillStyle = '#FFA500';
            ctx.fillText(' !', levelX + 25, levelY);
        }
        
        ctx.restore();
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.EnemySprites = EnemySprites;
}