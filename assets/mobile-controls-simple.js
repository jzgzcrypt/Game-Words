// Sistema de Controles Móviles Simplificado para Cosmic Depths
const MobileControlsSimple = {
    // Estado del sistema
    state: {
        isMobile: false,
        isPortrait: false,
        initialized: false,
        joystickActive: false,
        joystickX: 0,
        joystickY: 0
    },
    
    // Configuración
    config: {
        joystickSize: 120,
        buttonSize: 60,
        buttonSpacing: 20,
        touchSensitivity: 2.0, // Aumentar sensibilidad
        enableHapticFeedback: true,
        movementSpeed: 5.0 // Velocidad de movimiento
    },
    
    // Inicialización
    init: function() {
        if (this.state.initialized) return;
        
        console.log('Sistema de controles móviles simplificado inicializando...');
        this.detectMobile();
        
        if (this.state.isMobile) {
            this.setupMobileOptimizations();
            this.createBasicControls();
            this.setupOrientationHandling();
            this.state.initialized = true;
            console.log('Controles móviles simplificados inicializados');
        }
    },
    
    // Detectar dispositivo móvil
    detectMobile: function() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        
        this.state.isMobile = mobileRegex.test(userAgent.toLowerCase());
        this.state.isPortrait = window.innerHeight > window.innerWidth;
        
        if (this.state.isMobile) {
            console.log('Dispositivo móvil detectado');
            document.body.classList.add('mobile-device');
        }
    },
    
    // Configurar optimizaciones móviles básicas
    setupMobileOptimizations: function() {
        // Prevenir zoom en inputs
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
        
        // Prevenir selección de texto
        document.body.style.webkitUserSelect = 'none';
        document.body.style.userSelect = 'none';
        
        // Prevenir scroll en canvas
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.touchAction = 'none';
        }
    },
    
    // Crear controles básicos
    createBasicControls: function() {
        this.createVirtualJoystick();
        this.createTouchButtons();
    },
    
    // Crear joystick virtual
    createVirtualJoystick: function() {
        const joystickContainer = document.createElement('div');
        joystickContainer.id = 'virtualJoystick';
        joystickContainer.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: ${this.config.joystickSize}px;
            height: ${this.config.joystickSize}px;
            z-index: 1000;
            pointer-events: auto;
        `;
        
        joystickContainer.innerHTML = `
            <div class="joystick-base" style="
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                border: 2px solid rgba(0, 206, 209, 0.8);
                border-radius: 50%;
                position: relative;
                backdrop-filter: blur(10px);
            "></div>
            <div class="joystick-stick" style="
                width: 40px;
                height: 40px;
                background: linear-gradient(45deg, #00CED1, #00FA9A);
                border: 2px solid rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            "></div>
        `;
        
        document.body.appendChild(joystickContainer);
        this.setupJoystickEvents(joystickContainer);
    },
    
    // Configurar eventos del joystick
    setupJoystickEvents: function(joystick) {
        const stick = joystick.querySelector('.joystick-stick');
        const base = joystick.querySelector('.joystick-base');
        
        let isDragging = false;
        let startX, startY, baseRect;
        
        // Eventos táctiles
        stick.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleJoystickStart(e.touches[0], base, stick);
        });
        
        stick.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (isDragging) {
                this.handleJoystickMove(e.touches[0], base, stick, startX, startY, baseRect);
            }
        });
        
        stick.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleJoystickEnd(stick);
            isDragging = false;
        });
        
        // Eventos de mouse (para desarrollo)
        stick.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleJoystickStart(e, base, stick);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.handleJoystickMove(e, base, stick, startX, startY, baseRect);
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                this.handleJoystickEnd(stick);
                isDragging = false;
            }
        });
        
        // Funciones del joystick
        this.handleJoystickStart = (e, base, stick) => {
            isDragging = true;
            this.state.joystickActive = true;
            baseRect = base.getBoundingClientRect();
            startX = e.clientX - baseRect.left;
            startY = e.clientY - baseRect.top;
            
            if (this.config.enableHapticFeedback) {
                this.vibrate(50);
            }
        };
        
        this.handleJoystickMove = (e, base, stick, startX, startY, baseRect) => {
            const currentX = e.clientX - baseRect.left;
            const currentY = e.clientY - baseRect.top;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = this.config.joystickSize / 2 - 20;
            
            // Normalizar valores para enviar al juego
            let normalizedX = 0;
            let normalizedY = 0;
            
            if (distance > maxDistance) {
                const angle = Math.atan2(deltaY, deltaX);
                const limitedX = Math.cos(angle) * maxDistance;
                const limitedY = Math.sin(angle) * maxDistance;
                
                stick.style.transform = `translate(calc(-50% + ${limitedX}px), calc(-50% + ${limitedY}px))`;
                normalizedX = limitedX / maxDistance;
                normalizedY = limitedY / maxDistance;
            } else {
                stick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
                normalizedX = deltaX / maxDistance;
                normalizedY = deltaY / maxDistance;
            }
            
            // Guardar estado del joystick
            this.state.joystickX = normalizedX;
            this.state.joystickY = normalizedY;
            
            // Enviar input continuo al juego
            this.sendJoystickInput(normalizedX, normalizedY);
        };
        
        this.handleJoystickEnd = (stick) => {
            stick.style.transform = 'translate(-50%, -50%)';
            this.state.joystickActive = false;
            this.state.joystickX = 0;
            this.state.joystickY = 0;
            this.sendJoystickInput(0, 0);
            
            if (this.config.enableHapticFeedback) {
                this.vibrate(30);
            }
        };
    },
    
    // Enviar input del joystick al juego
    sendJoystickInput: function(x, y) {
        if (!gameState || !gameState.player) return;
        
        // Aplicar sensibilidad y velocidad
        const sensitivity = this.config.touchSensitivity;
        const speed = this.config.movementSpeed;
        
        // Calcular movimiento
        const moveX = x * sensitivity * speed;
        const moveY = y * sensitivity * speed;
        
        // Mover el jugador directamente
        if (gameState.player) {
            // Calcular nueva posición
            const newX = gameState.player.x + moveX;
            const newY = gameState.player.y + moveY;
            
            // Limitar a los bordes del canvas
            const canvas = document.getElementById('gameCanvas');
            if (canvas) {
                gameState.player.x = Math.max(0, Math.min(canvas.width, newX));
                gameState.player.y = Math.max(0, Math.min(canvas.height, newY));
            } else {
                gameState.player.x = newX;
                gameState.player.y = newY;
            }
        }
        
        // Actualizar posición del mouse para compatibilidad
        if (gameState.mouse) {
            gameState.mouse.x = gameState.player.x;
            gameState.mouse.y = gameState.player.y;
        }
        
        // También actualizar las teclas para compatibilidad con el sistema de movimiento
        if (gameState.keys) {
            // Simular teclas de movimiento
            gameState.keys['ArrowLeft'] = x < -0.1;
            gameState.keys['ArrowRight'] = x > 0.1;
            gameState.keys['ArrowUp'] = y < -0.1;
            gameState.keys['ArrowDown'] = y > 0.1;
        }
    },
    
    // Crear botones táctiles
    createTouchButtons: function() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'touchButtons';
        buttonContainer.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: flex;
            flex-direction: column;
            gap: ${this.config.buttonSpacing}px;
            z-index: 1000;
            pointer-events: auto;
        `;
        
        // Botón de ataque
        const attackButton = this.createTouchButton('⚔️', 'attack', () => {
            this.handleAttack();
        });
        
        // Botón de panel de misiones
        const missionButton = this.createTouchButton('📋', 'missions', () => {
            if (window.MissionPanel) {
                window.MissionPanel.toggle();
            }
        });
        
        // Botón de panel de base
        const baseButton = this.createTouchButton('🏗️', 'base', () => {
            if (window.BasePanel) {
                window.BasePanel.toggle();
            }
        });
        
        // Botón de videos
        const videoButton = this.createTouchButton('🎬', 'videos', () => {
            if (window.VideoRewardsSystem) {
                window.VideoRewardsSystem.showRewardsPanel();
            }
        });
        
        buttonContainer.appendChild(attackButton);
        buttonContainer.appendChild(missionButton);
        buttonContainer.appendChild(baseButton);
        buttonContainer.appendChild(videoButton);
        
        document.body.appendChild(buttonContainer);
    },
    
    // Crear botón táctil individual
    createTouchButton: function(icon, action, callback) {
        const button = document.createElement('div');
        button.className = 'touch-button';
        button.dataset.action = action;
        button.style.cssText = `
            width: ${this.config.buttonSize}px;
            height: ${this.config.buttonSize}px;
            background: linear-gradient(45deg, #00CED1, #00FA9A);
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            user-select: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        `;
        
        button.innerHTML = icon;
        
        // Eventos táctiles
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleButtonPress(button, callback);
        });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleButtonRelease(button);
        });
        
        // Eventos de mouse (para desarrollo)
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleButtonPress(button, callback);
        });
        
        button.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.handleButtonRelease(button);
        });
        
        return button;
    },
    
    // Manejar presión de botón
    handleButtonPress: function(button, callback) {
        button.style.transform = 'scale(0.9)';
        button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.4)';
        
        if (this.config.enableHapticFeedback) {
            this.vibrate(30);
        }
        
        if (callback && typeof callback === 'function') {
            callback();
        }
    },
    
    // Manejar liberación de botón
    handleButtonRelease: function(button) {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    },
    
    // Manejar ataque táctil
    handleAttack: function() {
        if (!gameState || !gameState.player || !gameState.enemies) return;
        
        // Buscar enemigo más cercano
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        gameState.enemies.forEach(enemy => {
            if (enemy && enemy.x && enemy.y) {
                const dx = enemy.x - gameState.player.x;
                const dy = enemy.y - gameState.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
        });
        
        if (closestEnemy) {
            gameState.selectedTarget = closestEnemy;
            
            // Efecto visual simple
            if (gameState.particles && typeof Particle !== 'undefined') {
                for (let i = 0; i < 3; i++) {
                    gameState.particles.push(new Particle(closestEnemy.x, closestEnemy.y, 'selection'));
                }
            }
            
            // Haptic feedback
            if (this.config.enableHapticFeedback) {
                this.vibrate(100);
            }
        }
    },
    
    // Configurar manejo de orientación
    setupOrientationHandling: function() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        window.addEventListener('resize', () => {
            this.handleOrientationChange();
        });
    },
    
    // Manejar cambio de orientación
    handleOrientationChange: function() {
        const isPortrait = window.innerHeight > window.innerWidth;
        
        if (isPortrait !== this.state.isPortrait) {
            this.state.isPortrait = isPortrait;
            this.adaptToOrientation();
        }
    },
    
    // Adaptar a la orientación
    adaptToOrientation: function() {
        if (this.state.isPortrait) {
            // Modo retrato - mostrar mensaje simple
            this.showSimpleLandscapeMessage();
        } else {
            // Modo paisaje - ocultar mensaje
            this.hideLandscapeMessage();
        }
    },
    
    // Mostrar mensaje simple para girar a paisaje
    showSimpleLandscapeMessage: function() {
        if (document.getElementById('simpleLandscapeMessage')) return;
        
        const message = document.createElement('div');
        message.id = 'simpleLandscapeMessage';
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        
        message.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">📱</div>
            <h2 style="color: #00CED1; margin-bottom: 15px; font-size: 24px;">
                Gira tu dispositivo
            </h2>
            <p style="margin-bottom: 20px; font-size: 18px; line-height: 1.5;">
                Para la mejor experiencia de juego,<br>
                gira tu dispositivo a modo paisaje
            </p>
            <div style="font-size: 32px;">🔄</div>
        `;
        
        document.body.appendChild(message);
    },
    
    // Ocultar mensaje de orientación
    hideLandscapeMessage: function() {
        const message = document.getElementById('simpleLandscapeMessage');
        if (message) {
            message.remove();
        }
    },
    
    // Vibración táctil
    vibrate: function(duration) {
        if (!this.config.enableHapticFeedback) return;
        
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    },
    
    // Obtener estadísticas móviles
    getMobileStats: function() {
        return {
            isMobile: this.state.isMobile,
            isPortrait: this.state.isPortrait,
            initialized: this.state.initialized
        };
    },
    
    // Actualizar controles móviles (llamar desde gameLoop)
    update: function() {
        if (!this.state.isMobile || !this.state.initialized) return;
        
        // Si el joystick está activo, continuar enviando input
        if (this.state.joystickActive) {
            this.sendJoystickInput(this.state.joystickX, this.state.joystickY);
        }
    },
    
    // Limpiar recursos
    cleanup: function() {
        // Remover elementos móviles
        const joystick = document.getElementById('virtualJoystick');
        if (joystick) joystick.remove();
        
        const buttons = document.getElementById('touchButtons');
        if (buttons) buttons.remove();
        
        const message = document.getElementById('simpleLandscapeMessage');
        if (message) message.remove();
        
        // Remover clases CSS
        document.body.classList.remove('mobile-device');
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.MobileControlsSimple = MobileControlsSimple;
}