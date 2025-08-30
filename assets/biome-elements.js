// Sistema de Elementos Visuales por Bioma
const BiomeElements = {
    // Cache de imágenes para evitar recrearlas
    cache: {},
    currentBiome: null,
    transitionProgress: 0,
    
    // Definición de elementos por bioma
    biomes: {
        shallows: {
            name: 'Aguas Poco Profundas',
            baseColor: '#40E0D0',
            fogColor: 'rgba(64, 224, 208, 0.1)',
            visibility: 1.0,
            elements: {
                // Elementos de fondo
                coral: {
                    count: 5,
                    colors: ['#FF6B9D', '#FFC75F', '#FF6F61'],
                    draw: function(ctx, x, y, size) {
                        ctx.fillStyle = this.colors[Math.floor(Math.random() * 3)];
                        // Coral simple y rápido
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x - size/2, y - size);
                        ctx.lineTo(x + size/2, y - size);
                        ctx.closePath();
                        ctx.fill();
                    }
                },
                seaweed: {
                    count: 8,
                    color: '#2E8B57',
                    draw: function(ctx, x, y, height, time) {
                        const sway = Math.sin(time + x * 0.01) * 10;
                        ctx.strokeStyle = this.color;
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.quadraticCurveTo(x + sway, y - height/2, x + sway/2, y - height);
                        ctx.stroke();
                    }
                },
                fish: {
                    count: 10,
                    colors: ['#FFD700', '#FF69B4', '#00CED1'],
                    draw: function(ctx, x, y, size, angle) {
                        ctx.save();
                        ctx.translate(x, y);
                        ctx.rotate(angle);
                        ctx.fillStyle = this.colors[Math.floor(Math.random() * 3)];
                        // Pez simple
                        ctx.beginPath();
                        ctx.ellipse(0, 0, size, size/2, 0, 0, Math.PI * 2);
                        ctx.fill();
                        // Cola
                        ctx.beginPath();
                        ctx.moveTo(-size, 0);
                        ctx.lineTo(-size * 1.5, -size/3);
                        ctx.lineTo(-size * 1.5, size/3);
                        ctx.closePath();
                        ctx.fill();
                        ctx.restore();
                    }
                }
            }
        },
        
        reef: {
            name: 'Arrecife de Coral',
            baseColor: '#FF7F50',
            fogColor: 'rgba(255, 127, 80, 0.15)',
            visibility: 0.9,
            elements: {
                bigCoral: {
                    count: 8,
                    colors: ['#FF1493', '#FF69B4', '#FFB6C1'],
                    draw: function(ctx, x, y, size) {
                        const gradient = ctx.createRadialGradient(x, y - size/2, 0, x, y - size/2, size);
                        gradient.addColorStop(0, this.colors[0]);
                        gradient.addColorStop(1, this.colors[1]);
                        ctx.fillStyle = gradient;
                        // Coral ramificado
                        for (let i = 0; i < 5; i++) {
                            const angle = (i / 5) * Math.PI - Math.PI/2;
                            ctx.beginPath();
                            ctx.arc(x + Math.cos(angle) * size/2, y - size/2 + Math.sin(angle) * size/2, size/4, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                },
                anemone: {
                    count: 6,
                    color: '#FF00FF',
                    draw: function(ctx, x, y, size, time) {
                        ctx.strokeStyle = this.color;
                        ctx.lineWidth = 2;
                        for (let i = 0; i < 8; i++) {
                            const angle = (i / 8) * Math.PI * 2;
                            const wave = Math.sin(time * 2 + i) * 5;
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(
                                x + Math.cos(angle) * (size + wave),
                                y + Math.sin(angle) * (size + wave)
                            );
                            ctx.stroke();
                        }
                    }
                },
                clownfish: {
                    count: 12,
                    draw: function(ctx, x, y, size) {
                        // Pez payaso
                        ctx.fillStyle = '#FF8C00';
                        ctx.fillRect(x - size, y - size/3, size * 2, size * 0.6);
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(x - size/2, y - size/3, 3, size * 0.6);
                        ctx.fillRect(x + size/2 - 3, y - size/3, 3, size * 0.6);
                    }
                }
            }
        },
        
        kelp: {
            name: 'Bosque de Kelp',
            baseColor: '#2F4F4F',
            fogColor: 'rgba(47, 79, 79, 0.3)',
            visibility: 0.7,
            elements: {
                giantKelp: {
                    count: 15,
                    color: '#006400',
                    draw: function(ctx, x, y, height, time) {
                        const sway = Math.sin(time * 0.5 + x * 0.01) * 20;
                        ctx.fillStyle = this.color;
                        ctx.globalAlpha = 0.7;
                        // Kelp grueso
                        ctx.beginPath();
                        ctx.moveTo(x - 10, y);
                        ctx.quadraticCurveTo(x + sway/2, y - height/2, x + sway, y - height);
                        ctx.lineTo(x + sway + 10, y - height);
                        ctx.quadraticCurveTo(x + sway/2 + 10, y - height/2, x + 10, y);
                        ctx.closePath();
                        ctx.fill();
                        ctx.globalAlpha = 1;
                    }
                },
                seaOtter: {
                    count: 3,
                    draw: function(ctx, x, y, size) {
                        // Nutria marina simplificada
                        ctx.fillStyle = '#8B4513';
                        ctx.beginPath();
                        ctx.ellipse(x, y, size * 1.5, size, 0, 0, Math.PI * 2);
                        ctx.fill();
                        // Cabeza
                        ctx.beginPath();
                        ctx.arc(x + size, y, size * 0.7, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        },
        
        abyss: {
            name: 'Fosa Abisal',
            baseColor: '#000033',
            fogColor: 'rgba(0, 0, 51, 0.5)',
            visibility: 0.5,
            elements: {
                bioluminescent: {
                    count: 20,
                    colors: ['#00FFFF', '#00FF00', '#FFFF00'],
                    draw: function(ctx, x, y, size, time) {
                        const pulse = Math.sin(time * 3 + x) * 0.5 + 0.5;
                        ctx.fillStyle = this.colors[Math.floor(Math.random() * 3)];
                        ctx.globalAlpha = pulse;
                        ctx.beginPath();
                        ctx.arc(x, y, size * pulse, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.globalAlpha = 1;
                    }
                },
                anglerfish: {
                    count: 4,
                    draw: function(ctx, x, y, size) {
                        // Pez abisal con luz
                        ctx.fillStyle = '#1C1C1C';
                        ctx.beginPath();
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        ctx.fill();
                        // Luz bioluminiscente
                        ctx.fillStyle = '#00FF00';
                        ctx.beginPath();
                        ctx.arc(x + size, y - size/2, size/3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        },
        
        volcanic: {
            name: 'Zona Volcánica',
            baseColor: '#8B0000',
            fogColor: 'rgba(139, 0, 0, 0.4)',
            visibility: 0.6,
            elements: {
                lavaVent: {
                    count: 5,
                    draw: function(ctx, x, y, size, time) {
                        // Géiser de lava
                        const height = Math.sin(time * 2) * 30 + 50;
                        const gradient = ctx.createLinearGradient(x, y, x, y - height);
                        gradient.addColorStop(0, '#FF0000');
                        gradient.addColorStop(0.5, '#FF6600');
                        gradient.addColorStop(1, '#FFFF00');
                        ctx.fillStyle = gradient;
                        ctx.fillRect(x - size/2, y - height, size, height);
                    }
                },
                volcanicRock: {
                    count: 10,
                    draw: function(ctx, x, y, size) {
                        ctx.fillStyle = '#2F2F2F';
                        ctx.beginPath();
                        ctx.moveTo(x, y - size);
                        ctx.lineTo(x - size, y);
                        ctx.lineTo(x + size, y);
                        ctx.closePath();
                        ctx.fill();
                    }
                },
                lavaBubble: {
                    count: 15,
                    draw: function(ctx, x, y, size, time) {
                        y = y - (time * 50) % 600;
                        ctx.fillStyle = 'rgba(255, 100, 0, 0.7)';
                        ctx.beginPath();
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        },
        
        trench: {
            name: 'Fosa de las Marianas',
            baseColor: '#000000',
            fogColor: 'rgba(0, 0, 0, 0.7)',
            visibility: 0.3,
            elements: {
                voidCreature: {
                    count: 2,
                    draw: function(ctx, x, y, size, time) {
                        // Criatura del vacío
                        ctx.fillStyle = 'rgba(75, 0, 130, 0.5)';
                        const pulse = Math.sin(time) * 10;
                        ctx.beginPath();
                        ctx.ellipse(x, y, size + pulse, size/2 + pulse, 0, 0, Math.PI * 2);
                        ctx.fill();
                        // Ojos brillantes
                        ctx.fillStyle = '#FF0000';
                        ctx.beginPath();
                        ctx.arc(x - size/3, y, 3, 0, Math.PI * 2);
                        ctx.arc(x + size/3, y, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                },
                deepGlow: {
                    count: 8,
                    draw: function(ctx, x, y, size, time) {
                        const flicker = Math.random() > 0.5 ? 1 : 0.3;
                        ctx.fillStyle = `rgba(138, 43, 226, ${flicker * 0.5})`;
                        ctx.beginPath();
                        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }
    },
    
    // Elementos del bioma actual
    activeElements: [],
    
    // Inicializar elementos del bioma
    initBiome: function(biomeName) {
        const biome = this.biomes[biomeName] || this.biomes.shallows;
        this.currentBiome = biome;
        this.activeElements = [];
        
        // Crear elementos estáticos
        for (let elementType in biome.elements) {
            const element = biome.elements[elementType];
            for (let i = 0; i < element.count; i++) {
                this.activeElements.push({
                    type: elementType,
                    x: Math.random() * 1920,
                    y: Math.random() * 1080,
                    size: 10 + Math.random() * 30,
                    angle: Math.random() * Math.PI * 2,
                    speed: 0.5 + Math.random() * 2,
                    element: element
                });
            }
        }
    },
    
    // Dibujar elementos del bioma
    drawBiomeElements: function(ctx, camera, time) {
        if (!this.currentBiome) return;
        
        ctx.save();
        
        // Dibujar cada elemento
        this.activeElements.forEach(item => {
            const screenX = item.x - camera.x * 0.3; // Parallax
            const screenY = item.y - camera.y * 0.3;
            
            // Solo dibujar si está en pantalla
            if (screenX > -100 && screenX < ctx.canvas.width + 100 &&
                screenY > -100 && screenY < ctx.canvas.height + 100) {
                
                if (item.element.draw) {
                    item.element.draw(ctx, screenX, screenY, item.size, item.angle || time);
                }
            }
            
            // Mover elementos dinámicos
            if (item.type === 'fish' || item.type === 'clownfish') {
                item.x += Math.cos(item.angle) * item.speed;
                item.y += Math.sin(item.angle) * item.speed * 0.3;
                
                // Wrap around
                if (item.x < -100) item.x = 2020;
                if (item.x > 2020) item.x = -100;
                if (item.y < -100) item.y = 1180;
                if (item.y > 1180) item.y = -100;
            }
        });
        
        ctx.restore();
    },
    
    // Cambiar bioma con transición
    changeBiome: function(newBiomeName) {
        if (this.currentBiome?.name !== newBiomeName) {
            this.initBiome(newBiomeName);
            this.transitionProgress = 0;
        }
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.BiomeElements = BiomeElements;
}