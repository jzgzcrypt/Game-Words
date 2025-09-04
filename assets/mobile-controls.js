// Sistema de Controles Móviles para Cosmic Depths
const MobileControls = {
    // Estado del sistema
    state: {
        isMobile: false,
        isPortrait: false,
        touchActive: false,
        virtualJoystick: null,
        touchButtons: {},
        gestureRecognizer: null,
        mobileUI: null,
        orientation: 'landscape'
    },
    
    // Configuración
    config: {
        joystickSize: 120,
        buttonSize: 60,
        buttonSpacing: 20,
        touchSensitivity: 1.0,
        enableHapticFeedback: true,
        autoRotate: true,
        showFPS: true,
        mobileOptimizations: true
    },
    
    // Inicialización
    init: function() {
        console.log('Sistema de controles móviles inicializando...');
        this.detectMobile();
        this.setupMobileOptimizations();
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeMobileComponents();
            });
        } else {
            this.initializeMobileComponents();
        }
    },
    
    // Inicializar componentes móviles
    initializeMobileComponents: function() {
        this.createVirtualJoystick();
        this.createTouchButtons();
        this.setupGestureRecognition();
        this.createMobileUI();
        this.setupEventListeners();
        this.setupOrientationHandling();
        this.optimizeForMobile();
        
        // Ajustar canvas inicial
        this.adjustCanvasForOrientation();
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
    
    // Configurar optimizaciones móviles
    setupMobileOptimizations: function() {
        if (!this.state.isMobile) return;
        
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
    
    // Crear joystick virtual
    createVirtualJoystick: function() {
        if (!this.state.isMobile) return;
        
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
        this.state.virtualJoystick = joystickContainer;
        
        this.setupJoystickEvents();
    },
    
    // Configurar eventos del joystick
    setupJoystickEvents: function() {
        if (!this.state.virtualJoystick) return;
        
        const joystick = this.state.virtualJoystick;
        const stick = joystick.querySelector('.joystick-stick');
        const base = joystick.querySelector('.joystick-base');
        
        let isDragging = false;
        let startX, startY, baseRect;
        
        // Eventos táctiles
        stick.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleJoystickStart(e.touches[0]);
        });
        
        stick.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleJoystickMove(e.touches[0]);
        });
        
        stick.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleJoystickEnd();
        });
        
        // Eventos de mouse (para desarrollo)
        stick.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.handleJoystickStart(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.handleJoystickMove(e);
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                this.handleJoystickEnd();
            }
        });
        
        // Funciones del joystick
        this.handleJoystickStart = (e) => {
            isDragging = true;
            baseRect = base.getBoundingClientRect();
            startX = e.clientX - baseRect.left;
            startY = e.clientY - baseRect.top;
            
            if (this.config.enableHapticFeedback) {
                this.vibrate(50);
            }
        };
        
        this.handleJoystickMove = (e) => {
            if (!isDragging) return;
            
            const currentX = e.clientX - baseRect.left;
            const currentY = e.clientY - baseRect.top;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = this.config.joystickSize / 2 - 20;
            
            if (distance > maxDistance) {
                const angle = Math.atan2(deltaY, deltaX);
                const limitedX = Math.cos(angle) * maxDistance;
                const limitedY = Math.sin(angle) * maxDistance;
                
                stick.style.transform = `translate(calc(-50% + ${limitedX}px), calc(-50% + ${limitedY}px))`;
                
                // Enviar movimiento al juego
                this.sendJoystickInput(limitedX / maxDistance, limitedY / maxDistance);
            } else {
                stick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
                
                // Enviar movimiento al juego
                this.sendJoystickInput(deltaX / maxDistance, deltaY / maxDistance);
            }
        };
        
        this.handleJoystickEnd = () => {
            isDragging = false;
            stick.style.transform = 'translate(-50%, -50%)';
            
            // Detener movimiento del jugador
            this.sendJoystickInput(0, 0);
            
            if (this.config.enableHapticFeedback) {
                this.vibrate(30);
            }
        };
    },
    
    // Enviar input del joystick al juego
    sendJoystickInput: function(x, y) {
        if (!gameState.player) return;
        
        // Aplicar sensibilidad
        const sensitivity = this.config.touchSensitivity;
        const moveX = x * sensitivity;
        const moveY = y * sensitivity;
        
        // Mover jugador
        if (gameState.player.moveTo) {
            gameState.player.moveTo(moveX, moveY);
        }
        
        // Actualizar posición del mouse para compatibilidad
        gameState.mouse.x += moveX * 5;
        gameState.mouse.y += moveY * 5;
    },
    
    // Crear botones táctiles
    createTouchButtons: function() {
        if (!this.state.isMobile) return;
        
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
        
        // Botón de pausa
        const pauseButton = this.createTouchButton('⏸️', 'pause', () => {
            this.togglePause();
        });
        
        buttonContainer.appendChild(attackButton);
        buttonContainer.appendChild(missionButton);
        buttonContainer.appendChild(baseButton);
        buttonContainer.appendChild(videoButton);
        buttonContainer.appendChild(pauseButton);
        
        document.body.appendChild(buttonContainer);
        this.state.touchButtons = {
            attack: attackButton,
            missions: missionButton,
            base: baseButton,
            videos: videoButton,
            pause: pauseButton
        };
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
        if (!gameState.player) return;
        
        // Buscar enemigo más cercano
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        gameState.enemies.forEach(enemy => {
            const dx = enemy.x - gameState.player.x;
            const dy = enemy.y - gameState.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });
        
        if (closestEnemy) {
            gameState.selectedTarget = closestEnemy;
            
            // Efecto visual
            for (let i = 0; i < 5; i++) {
                gameState.particles.push(new Particle(closestEnemy.x, closestEnemy.y, 'selection'));
            }
            
            // Haptic feedback
            if (this.config.enableHapticFeedback) {
                this.vibrate(100);
            }
        }
    },
    
    // Alternar pausa
    togglePause: function() {
        if (gameState.gameRunning) {
            gameState.gameRunning = false;
            this.showPauseMenu();
        } else {
            gameState.gameRunning = true;
            this.hidePauseMenu();
        }
    },
    
    // Mostrar menú de pausa
    showPauseMenu: function() {
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pauseMenu';
        pauseMenu.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        pauseMenu.innerHTML = `
            <h2 style="margin-bottom: 30px; color: #00CED1;">Juego Pausado</h2>
            <button id="resumeBtn" style="
                padding: 15px 30px;
                margin: 10px;
                background: #00CED1;
                border: none;
                color: white;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
            ">▶️ Continuar</button>
            <button id="restartBtn" style="
                padding: 15px 30px;
                margin: 10px;
                background: #FF6B6B;
                border: none;
                color: white;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
            ">🔄 Reiniciar</button>
            <button id="settingsBtn" style="
                padding: 15px 30px;
                margin: 10px;
                background: #4ECDC4;
                border: none;
                color: white;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
            ">⚙️ Configuración</button>
        `;
        
        document.body.appendChild(pauseMenu);
        
        // Event listeners
        pauseMenu.querySelector('#resumeBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        pauseMenu.querySelector('#restartBtn').addEventListener('click', () => {
            location.reload();
        });
        
        pauseMenu.querySelector('#settingsBtn').addEventListener('click', () => {
            this.showMobileSettings();
        });
    },
    
    // Ocultar menú de pausa
    hidePauseMenu: function() {
        const pauseMenu = document.getElementById('pauseMenu');
        if (pauseMenu) {
            pauseMenu.remove();
        }
    },
    
    // Mostrar configuración móvil
    showMobileSettings: function() {
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'mobileSettings';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00CED1;
            border-radius: 15px;
            padding: 20px;
            z-index: 2001;
            color: white;
        `;
        
        settingsPanel.innerHTML = `
            <h3 style="margin-bottom: 20px; color: #00CED1;">Configuración Móvil</h3>
            <div style="margin-bottom: 15px;">
                <label>Sensibilidad del Joystick:</label>
                <input type="range" id="joystickSensitivity" min="0.5" max="2.0" step="0.1" value="${this.config.touchSensitivity}" style="width: 100%;">
                <span id="sensitivityValue">${this.config.touchSensitivity}</span>
            </div>
            <div style="margin-bottom: 15px;">
                <label>
                    <input type="checkbox" id="hapticFeedback" ${this.config.enableHapticFeedback ? 'checked' : ''}>
                    Vibración táctil
                </label>
            </div>
            <div style="margin-bottom: 15px;">
                <label>
                    <input type="checkbox" id="showFPS" ${this.config.showFPS ? 'checked' : ''}>
                    Mostrar FPS
                </label>
            </div>
            <button id="closeSettings" style="
                padding: 10px 20px;
                background: #666;
                border: none;
                color: white;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            ">Cerrar</button>
        `;
        
        document.body.appendChild(settingsPanel);
        
        // Event listeners
        const sensitivitySlider = settingsPanel.querySelector('#joystickSensitivity');
        const sensitivityValue = settingsPanel.querySelector('#sensitivityValue');
        
        sensitivitySlider.addEventListener('input', (e) => {
            this.config.touchSensitivity = parseFloat(e.target.value);
            sensitivityValue.textContent = e.target.value;
        });
        
        settingsPanel.querySelector('#hapticFeedback').addEventListener('change', (e) => {
            this.config.enableHapticFeedback = e.target.checked;
        });
        
        settingsPanel.querySelector('#showFPS').addEventListener('change', (e) => {
            this.config.showFPS = e.target.checked;
        });
        
        settingsPanel.querySelector('#closeSettings').addEventListener('click', () => {
            settingsPanel.remove();
        });
    },
    
    // Configurar reconocimiento de gestos
    setupGestureRecognition: function() {
        if (!this.state.isMobile) return;
        
        let startX, startY, startTime;
        let isGestureActive = false;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
                isGestureActive = true;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isGestureActive || e.touches.length !== 1) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            // Detectar swipe
            if (Math.abs(deltaX) > 100 || Math.abs(deltaY) > 100) {
                this.handleSwipe(deltaX, deltaY);
                isGestureActive = false;
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (!isGestureActive) return;
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // Detectar tap largo
            if (duration > 500) {
                this.handleLongPress(startX, startY);
            }
            
            isGestureActive = false;
        });
    },
    
    // Manejar swipe
    handleSwipe: function(deltaX, deltaY) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Swipe horizontal
            if (deltaX > 0) {
                console.log('Swipe derecha');
                // Abrir panel de misiones
                if (window.MissionPanel) {
                    window.MissionPanel.toggle();
                }
            } else {
                console.log('Swipe izquierda');
                // Abrir panel de base
                if (window.BasePanel) {
                    window.BasePanel.toggle();
                }
            }
        } else {
            // Swipe vertical
            if (deltaY > 0) {
                console.log('Swipe abajo');
                // Abrir panel de videos
                if (window.VideoRewardsSystem) {
                    window.VideoRewardsSystem.showRewardsPanel();
                }
            } else {
                console.log('Swipe arriba');
                // Pausar juego
                this.togglePause();
            }
        }
        
        if (this.config.enableHapticFeedback) {
            this.vibrate(50);
        }
    },
    
    // Manejar presión larga
    handleLongPress: function(x, y) {
        console.log('Presión larga en:', x, y);
        
        // Mostrar menú contextual
        this.showContextMenu(x, y);
        
        if (this.config.enableHapticFeedback) {
            this.vibrate(200);
        }
    },
    
    // Mostrar menú contextual
    showContextMenu: function(x, y) {
        const contextMenu = document.createElement('div');
        contextMenu.id = 'contextMenu';
        contextMenu.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00CED1;
            border-radius: 8px;
            padding: 10px;
            z-index: 2000;
            color: white;
            font-size: 14px;
        `;
        
        contextMenu.innerHTML = `
            <div class="context-item" data-action="missions">📋 Misiones</div>
            <div class="context-item" data-action="base">🏗️ Base</div>
            <div class="context-item" data-action="videos">🎬 Videos</div>
            <div class="context-item" data-action="pause">⏸️ Pausar</div>
        `;
        
        document.body.appendChild(contextMenu);
        
        // Event listeners
        contextMenu.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.executeContextAction(action);
                contextMenu.remove();
            });
        });
        
        // Cerrar al hacer click fuera
        setTimeout(() => {
            document.addEventListener('click', () => {
                contextMenu.remove();
            }, { once: true });
        }, 100);
    },
    
    // Ejecutar acción del menú contextual
    executeContextAction: function(action) {
        switch (action) {
            case 'missions':
                if (window.MissionPanel) window.MissionPanel.toggle();
                break;
            case 'base':
                if (window.BasePanel) window.BasePanel.toggle();
                break;
            case 'videos':
                if (window.VideoRewardsSystem) window.VideoRewardsSystem.showRewardsPanel();
                break;
            case 'pause':
                this.togglePause();
                break;
        }
    },
    
    // Crear UI móvil
    createMobileUI: function() {
        if (!this.state.isMobile) return;
        
        const mobileUI = document.createElement('div');
        mobileUI.id = 'mobileUI';
        mobileUI.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            right: 10px;
            z-index: 999;
            pointer-events: none;
        `;
        
        // Indicador de FPS móvil
        if (this.config.showFPS) {
            const fpsIndicator = document.createElement('div');
            fpsIndicator.id = 'mobileFPS';
            fpsIndicator.style.cssText = `
                background: rgba(0, 0, 0, 0.5);
                color: #00FA9A;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 10px;
            `;
            fpsIndicator.textContent = 'FPS: 60';
            mobileUI.appendChild(fpsIndicator);
        }
        
        // Indicador de profundidad móvil
        const depthIndicator = document.createElement('div');
        depthIndicator.id = 'mobileDepth';
        depthIndicator.style.cssText = `
            background: rgba(0, 0, 0, 0.5);
            color: #00CED1;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
        `;
        depthIndicator.textContent = 'Profundidad: 0m';
        mobileUI.appendChild(depthIndicator);
        
        document.body.appendChild(mobileUI);
        this.state.mobileUI = mobileUI;
        
        // Actualizar indicadores
        this.updateMobileIndicators();
    },
    
    // Actualizar indicadores móviles
    updateMobileIndicators: function() {
        if (!this.state.mobileUI) return;
        
        // FPS
        if (this.config.showFPS) {
            const fpsIndicator = this.state.mobileUI.querySelector('#mobileFPS');
            if (fpsIndicator && gameState.fps) {
                fpsIndicator.textContent = `FPS: ${gameState.fps.current}`;
                
                // Cambiar color según FPS
                if (gameState.fps.current < 30) {
                    fpsIndicator.style.color = '#FF6B6B';
                } else if (gameState.fps.current < 45) {
                    fpsIndicator.style.color = '#FFD93D';
                } else {
                    fpsIndicator.style.color = '#00FA9A';
                }
            }
        }
        
        // Profundidad
        const depthIndicator = this.state.mobileUI.querySelector('#mobileDepth');
        if (depthIndicator && gameState.player) {
            const depth = Math.floor(Math.sqrt(gameState.player.x * gameState.player.x + gameState.player.y * gameState.player.y) / 10);
            depthIndicator.textContent = `Profundidad: ${depth}m`;
        }
        
        // Actualizar cada frame
        requestAnimationFrame(() => this.updateMobileIndicators());
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Prevenir zoom con doble tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevenir scroll en canvas
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
            }, { passive: false });
        }
    },
    
    // Configurar manejo de orientación
    setupOrientationHandling: function() {
        if (!this.state.isMobile) return;
        
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
            
            // Reajustar canvas cuando cambie orientación
            this.adjustCanvasForOrientation();
        }
    },
    
    // Ajustar canvas para la orientación actual
    adjustCanvasForOrientation: function() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        
        if (this.state.isPortrait) {
            // Modo retrato - mostrar mensaje
            this.showLandscapeMessage();
            canvas.style.display = 'none';
        } else {
            // Modo paisaje - mostrar juego
            const landscapeMessage = document.getElementById('landscapeMessage');
            if (landscapeMessage) {
                landscapeMessage.remove();
            }
            
            canvas.style.display = 'block';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            
            // Reajustar resolución
            const devicePixelRatio = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            
            const ctx = canvas.getContext('2d');
            ctx.scale(devicePixelRatio, devicePixelRatio);
        }
    },
    
    // Adaptar a la orientación
    adaptToOrientation: function() {
        if (this.state.isPortrait) {
            // Modo retrato
            document.body.classList.add('portrait-mode');
        } else {
            // Modo paisaje
            document.body.classList.remove('portrait-mode');
        }
    },
    
    // Función placeholder para compatibilidad
    showOrientationWarning: function() {
        // Reemplazada por showLandscapeMessage
    },
    
    hideOrientationWarning: function() {
        // Reemplazada por adjustCanvasForOrientation
    },
    
    // Optimizar para móvil
    optimizeForMobile: function() {
        if (!this.state.isMobile) return;
        
        // Reducir calidad de efectos en móvil
        if (window.OceanEffects) {
            window.OceanEffects.setQuality('low');
        }
        
        // Ajustar canvas para móvil
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            // Forzar tamaño completo en móvil
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            canvas.style.maxWidth = '100vw';
            canvas.style.maxHeight = '100vh';
            canvas.style.objectFit = 'cover';
            
            // Ajustar resolución del canvas para mejor rendimiento
            const devicePixelRatio = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            
            const ctx = canvas.getContext('2d');
            ctx.scale(devicePixelRatio, devicePixelRatio);
        }
        
        // Ajustar paneles para móvil
        this.adaptPanelsForMobile();
        
        // Forzar orientación paisaje en móvil
        this.forceLandscapeOrientation();
    },
    
    // Forzar orientación paisaje en móvil
    forceLandscapeOrientation: function() {
        if (!this.state.isMobile) return;
        
        // Intentar forzar orientación paisaje
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {
                console.log('No se pudo forzar orientación paisaje');
            });
        }
        
        // Mostrar mensaje si está en retrato
        if (this.state.isPortrait) {
            this.showLandscapeMessage();
        }
    },
    
    // Mostrar mensaje para girar a paisaje
    showLandscapeMessage: function() {
        if (document.getElementById('landscapeMessage')) return;
        
        const message = document.createElement('div');
        message.id = 'landscapeMessage';
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
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
            <div style="font-size: 32px; animation: rotate 2s infinite;">🔄</div>
            <p style="margin-top: 20px; font-size: 14px; color: #87CEEB;">
                El juego se iniciará automáticamente
            </p>
        `;
        
        // Añadir animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(message);
        
        // Remover mensaje cuando cambie a paisaje
        const checkOrientation = () => {
            if (!this.state.isPortrait) {
                message.remove();
                clearInterval(orientationCheck);
            }
        };
        
        const orientationCheck = setInterval(checkOrientation, 500);
        
        // Remover después de 10 segundos como máximo
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
                clearInterval(orientationCheck);
            }
        }, 10000);
    },
    
    // Adaptar paneles para móvil
    adaptPanelsForMobile: function() {
        // Adaptar panel de misiones
        if (window.MissionPanel) {
            window.MissionPanel.adaptForMobile();
        }
        
        // Adaptar panel de base
        if (window.BasePanel) {
            window.BasePanel.adaptForMobile();
        }
        
        // Adaptar panel de videos
        if (window.VideoRewardsSystem) {
            window.VideoRewardsSystem.adaptForMobile();
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
            orientation: this.state.orientation,
            touchActive: this.state.touchActive,
            joystickActive: !!this.state.virtualJoystick,
            buttonsActive: Object.keys(this.state.touchButtons).length
        };
    },
    
    // Limpiar recursos
    cleanup: function() {
        // Remover elementos móviles
        if (this.state.virtualJoystick) {
            this.state.virtualJoystick.remove();
        }
        
        if (this.state.mobileUI) {
            this.state.mobileUI.remove();
        }
        
        // Remover botones
        Object.values(this.state.touchButtons).forEach(button => {
            if (button && button.remove) {
                button.remove();
            }
        });
        
        // Remover clases CSS
        document.body.classList.remove('mobile-device', 'portrait-mode');
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.MobileControls = MobileControls;
}