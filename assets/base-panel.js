// Panel de Base Construible para Cosmic Depths
const BasePanel = {
    // Estado del panel
    isVisible: false,
    panel: null,
    currentTab: 'build', // 'build', 'manage', 'resources'
    selectedModule: null,
    buildMode: false,
    gridCanvas: null,
    gridCtx: null,
    
    // Configuración del grid
    gridConfig: {
        cellSize: 30,
        gridWidth: 20,
        gridHeight: 15,
        offsetX: 50,
        offsetY: 100
    },
    
    // Inicialización
    init: function() {
        this.createPanel();
        this.setupEventListeners();
        this.createGridCanvas();
        console.log('Panel de base construible inicializado');
    },
    
    // Crear el panel visual
    createPanel: function() {
        // Crear contenedor principal
        this.panel = document.createElement('div');
        this.panel.id = 'basePanel';
        this.panel.className = 'base-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 1000px;
            max-height: 90vh;
            background: linear-gradient(135deg, #0a0e27 0%, #151b3d 50%, #1a1840 100%);
            border: 2px solid #00CED1;
            border-radius: 15px;
            padding: 20px;
            color: #00FA9A;
            font-family: 'Arial', sans-serif;
            z-index: 1000;
            display: none;
            overflow-y: auto;
            box-shadow: 0 0 30px rgba(0, 206, 209, 0.6);
        `;
        
        // Crear contenido del panel
        this.panel.innerHTML = `
            <div class="panel-header" style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #00FFFF; text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);">
                    🏗️ Base Submarina
                </h2>
                <p style="margin: 5px 0; color: #87CEEB; font-size: 14px;">
                    Construye y gestiona tu base submarina
                </p>
            </div>
            
            <!-- Pestañas de navegación -->
            <div class="base-tabs" style="display: flex; gap: 5px; margin-bottom: 20px;">
                <button class="tab-btn active" data-tab="build" style="flex: 1; padding: 10px; background: #00CED1; border: none; color: #000; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    🏗️ Construir
                </button>
                <button class="tab-btn" data-tab="manage" style="flex: 1; padding: 10px; background: #2a2a2a; border: none; color: #ccc; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    ⚙️ Gestionar
                </button>
                <button class="tab-btn" data-tab="resources" style="flex: 1; padding: 10px; background: #2a2a2a; border: none; color: #ccc; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    💎 Recursos
                </button>
            </div>
            
            <!-- Contenido de las pestañas -->
            <div class="tab-content">
                <!-- Pestaña de Construcción -->
                <div id="build-tab" class="tab-pane active">
                    <div class="build-section" style="display: flex; gap: 20px;">
                        <!-- Lista de módulos disponibles -->
                        <div class="modules-list" style="flex: 1; max-height: 400px; overflow-y: auto;">
                            <h4 style="color: #00FFFF; margin-bottom: 15px;">📋 Módulos Disponibles</h4>
                            <div id="available-modules-list">
                                <!-- Se llena dinámicamente -->
                            </div>
                        </div>
                        
                        <!-- Vista previa del módulo -->
                        <div class="module-preview" style="flex: 1;">
                            <h4 style="color: #00FFFF; margin-bottom: 15px;">👁️ Vista Previa</h4>
                            <div id="module-preview-content" style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 8px; min-height: 200px;">
                                <p style="text-align: center; color: #666;">Selecciona un módulo para ver su información</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Grid de construcción -->
                    <div class="construction-grid" style="margin-top: 20px;">
                        <h4 style="color: #00FFFF; margin-bottom: 15px;">🏗️ Grid de Construcción</h4>
                        <div style="text-align: center;">
                            <canvas id="baseGridCanvas" width="600" height="450" style="border: 2px solid #00CED1; border-radius: 8px; cursor: crosshair;"></canvas>
                        </div>
                        <div style="text-align: center; margin-top: 10px; color: #87CEEB;">
                            <p>💡 Haz clic en el grid para colocar el módulo seleccionado</p>
                            <p>🔄 Usa la rueda del ratón para hacer zoom</p>
                        </div>
                    </div>
                </div>
                
                <!-- Pestaña de Gestión -->
                <div id="manage-tab" class="tab-pane" style="display: none;">
                    <div class="manage-section">
                        <h4 style="color: #00FFFF; margin-bottom: 15px;">🏠 Módulos Construidos</h4>
                        <div id="built-modules-list">
                            <!-- Se llena dinámicamente -->
                        </div>
                        
                        <h4 style="color: #00FFFF; margin-bottom: 15px; margin-top: 30px;">🏗️ Módulos en Construcción</h4>
                        <div id="building-modules-list">
                            <!-- Se llena dinámicamente -->
                        </div>
                    </div>
                </div>
                
                <!-- Pestaña de Recursos -->
                <div id="resources-tab" class="tab-pane" style="display: none;">
                    <div class="resources-section">
                        <h4 style="color: #00FFFF; margin-bottom: 15px;">💎 Recursos Disponibles</h4>
                        <div id="resources-display" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                            <!-- Se llena dinámicamente -->
                        </div>
                        
                        <h4 style="color: #00FFFF; margin-bottom: 15px; margin-top: 30px;">📊 Estadísticas de la Base</h4>
                        <div id="base-stats-display" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                            <!-- Se llena dinámicamente -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Botón de cerrar -->
            <div class="panel-actions" style="text-align: center; margin-top: 20px;">
                <button id="closeBasePanel" style="padding: 12px 30px; background: #666; border: none; color: #fff; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    ❌ Cerrar
                </button>
            </div>
        `;
        
        // Añadir estilos CSS
        this.addStyles();
        
        // Añadir al DOM
        document.body.appendChild(this.panel);
    },
    
    // Crear canvas del grid
    createGridCanvas: function() {
        this.gridCanvas = document.getElementById('baseGridCanvas');
        this.gridCtx = this.gridCanvas.getContext('2d');
        this.setupGridEvents();
        this.drawGrid();
    },
    
    // Configurar eventos del grid
    setupGridEvents: function() {
        this.gridCanvas.addEventListener('click', (e) => {
            if (this.buildMode && this.selectedModule) {
                const rect = this.gridCanvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const gridX = Math.floor((x - this.gridConfig.offsetX) / this.gridConfig.cellSize);
                const gridY = Math.floor((y - this.gridConfig.offsetY) / this.gridConfig.cellSize);
                
                if (gridX >= 0 && gridX < this.gridConfig.gridWidth && 
                    gridY >= 0 && gridY < this.gridConfig.gridHeight) {
                    this.buildModuleAt(gridX, gridY);
                }
            }
        });
        
        // Zoom con rueda del ratón
        this.gridCanvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoom = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoomGrid(zoom);
        });
    },
    
    // Dibujar grid
    drawGrid: function() {
        const ctx = this.gridCtx;
        const canvas = this.gridCanvas;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar fondo
        ctx.fillStyle = '#0a0e27';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar grid
        ctx.strokeStyle = '#00CED1';
        ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.gridConfig.gridWidth; x++) {
            const xPos = x * this.gridConfig.cellSize + this.gridConfig.offsetX;
            ctx.beginPath();
            ctx.moveTo(xPos, this.gridConfig.offsetY);
            ctx.lineTo(xPos, this.gridConfig.offsetY + this.gridConfig.gridHeight * this.gridConfig.cellSize);
            ctx.stroke();
        }
        
        for (let y = 0; y <= this.gridConfig.gridHeight; y++) {
            const yPos = y * this.gridConfig.cellSize + this.gridConfig.offsetY;
            ctx.beginPath();
            ctx.moveTo(this.gridConfig.offsetX, yPos);
            ctx.lineTo(this.gridConfig.offsetX + this.gridConfig.gridWidth * this.gridConfig.cellSize, yPos);
            ctx.stroke();
        }
        
        // Dibujar módulos existentes
        this.drawExistingModules();
    },
    
    // Dibujar módulos existentes
    drawExistingModules: function() {
        const modules = window.BaseBuildingSystem.playerBase.modules;
        const ctx = this.gridCtx;
        
        modules.forEach(module => {
            const x = module.position.x * this.gridConfig.cellSize + this.gridConfig.offsetX;
            const y = module.position.y * this.gridConfig.cellSize + this.gridConfig.offsetY;
            const width = module.size.width * this.gridConfig.cellSize;
            const height = module.size.height * this.gridConfig.cellSize;
            
            // Color según el estado
            if (module.isBuilt) {
                ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                ctx.strokeStyle = '#00FF00';
            } else {
                ctx.fillStyle = 'rgba(255, 165, 0, 0.3)';
                ctx.strokeStyle = '#FFA500';
            }
            
            ctx.fillRect(x, y, width, height);
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            
            // Texto del módulo
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(module.name.substring(0, 8), x + width/2, y + height/2);
            
            // Barra de progreso para módulos en construcción
            if (!module.isBuilt) {
                const progressBarWidth = width * 0.8;
                const progressBarHeight = 4;
                const progressBarX = x + (width - progressBarWidth) / 2;
                const progressBarY = y + height - 8;
                
                ctx.fillStyle = '#333';
                ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
                
                ctx.fillStyle = '#00FF00';
                ctx.fillRect(progressBarX, progressBarY, progressBarWidth * (module.buildProgress / 100), progressBarHeight);
            }
        });
    },
    
    // Zoom del grid
    zoomGrid: function(zoom) {
        this.gridConfig.cellSize = Math.max(15, Math.min(60, this.gridConfig.cellSize * zoom));
        this.drawGrid();
    },
    
    // Añadir estilos CSS
    addStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .base-panel .tab-btn {
                transition: all 0.3s ease;
            }
            
            .base-panel .tab-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .base-panel .tab-btn.active {
                background: #00CED1 !important;
                color: #000 !important;
            }
            
            .base-panel .module-item {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid #00CED1;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .base-panel .module-item:hover {
                border-color: #00FFFF;
                box-shadow: 0 0 15px rgba(0, 206, 209, 0.3);
                transform: translateY(-2px);
            }
            
            .base-panel .module-item.selected {
                border-color: #00FFFF;
                background: rgba(0, 255, 255, 0.1);
            }
            
            .base-panel .module-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .base-panel .module-name {
                font-size: 16px;
                font-weight: bold;
                color: #00FFFF;
            }
            
            .base-panel .module-category {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: bold;
            }
            
            .base-panel .module-category.core { background: #FF6B6B; color: white; }
            .base-panel .module-category.power { background: #4ECDC4; color: white; }
            .base-panel .module-category.production { background: #45B7D1; color: white; }
            .base-panel .module-category.defense { background: #FFA500; color: white; }
            .base-panel .module-category.research { background: #9B59B6; color: white; }
            .base-panel .module-category.luxury { background: #E74C3C; color: white; }
            
            .base-panel .module-cost {
                display: flex;
                gap: 10px;
                margin: 10px 0;
                flex-wrap: wrap;
            }
            
            .base-panel .cost-item {
                background: rgba(255, 215, 0, 0.2);
                border: 1px solid #FFD700;
                border-radius: 5px;
                padding: 5px 10px;
                color: #FFD700;
                font-size: 12px;
            }
            
            .base-panel .module-actions {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }
            
            .base-panel .action-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                font-size: 12px;
            }
            
            .base-panel .action-btn:hover {
                transform: translateY(-2px);
            }
            
            .base-panel .btn-build {
                background: #4CAF50;
                color: white;
            }
            
            .base-panel .btn-upgrade {
                background: #FF9800;
                color: white;
            }
            
            .base-panel .btn-demolish {
                background: #F44336;
                color: white;
            }
            
            .base-panel .resource-item {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid #00CED1;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
            }
            
            .base-panel .resource-icon {
                font-size: 24px;
                margin-bottom: 10px;
            }
            
            .base-panel .resource-amount {
                font-size: 18px;
                font-weight: bold;
                color: #00FFFF;
            }
            
            .base-panel .resource-name {
                color: #87CEEB;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        // Pestañas
        const tabBtns = this.panel.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Botón de cerrar
        this.panel.querySelector('#closeBasePanel').addEventListener('click', () => {
            this.hide();
        });
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
        
        // Cerrar al hacer clic fuera del panel
        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.panel.contains(e.target) && !e.target.classList.contains('base-toggle')) {
                this.hide();
            }
        });
    },
    
    // Cambiar pestaña
    switchTab: function(tabName) {
        // Actualizar botones
        const tabBtns = this.panel.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Actualizar contenido
        const tabPanes = this.panel.querySelectorAll('.tab-pane');
        tabPanes.forEach(pane => {
            pane.style.display = 'none';
        });
        
        const activePane = this.panel.querySelector(`#${tabName}-tab`);
        if (activePane) {
            activePane.style.display = 'block';
        }
        
        this.currentTab = tabName;
        this.updateTabContent(tabName);
    },
    
    // Actualizar contenido de la pestaña
    updateTabContent: function(tabName) {
        switch (tabName) {
            case 'build':
                this.displayAvailableModules();
                break;
            case 'manage':
                this.displayBuiltModules();
                this.displayBuildingModules();
                break;
            case 'resources':
                this.displayResources();
                this.displayBaseStats();
                break;
        }
    },
    
    // Mostrar módulos disponibles
    displayAvailableModules: function() {
        const container = this.panel.querySelector('#available-modules-list');
        const modules = window.BaseBuildingSystem.availableModules;
        
        container.innerHTML = Object.entries(modules).map(([id, module]) => {
            const canBuild = window.BaseBuildingSystem.canBuildModule(id, { x: 0, y: 0 }).success;
            const levelRequired = module.requiredLevel;
            const playerLevel = gameState.player.level;
            
            return `
                <div class="module-item ${this.selectedModule === id ? 'selected' : ''}" data-module-id="${id}">
                    <div class="module-header">
                        <h4 class="module-name">${module.name}</h4>
                        <span class="module-category ${module.category}">${module.category}</span>
                    </div>
                    
                    <p style="color: #87CEEB; font-size: 12px; margin: 10px 0;">${module.description}</p>
                    
                    <div class="module-cost">
                        ${Object.entries(module.cost).map(([resource, amount]) => 
                            `<span class="cost-item">${this.getResourceIcon(resource)} ${amount} ${resource}</span>`
                        ).join('')}
                    </div>
                    
                    <div style="color: #CCC; font-size: 11px; margin: 10px 0;">
                        <span>📏 Tamaño: ${module.size.width}x${module.size.height}</span> |
                        <span>⏱️ Tiempo: ${module.buildTime}s</span> |
                        <span>📊 Nivel: ${levelRequired}</span>
                    </div>
                    
                    <div class="module-actions">
                        <button class="action-btn btn-build" data-module-id="${id}" ${!canBuild || playerLevel < levelRequired ? 'disabled' : ''}>
                            ${playerLevel < levelRequired ? `🔒 Nivel ${levelRequired}` : '🏗️ Construir'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Event listeners para selección de módulos
        container.querySelectorAll('.module-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectModule(item.dataset.moduleId);
            });
        });
        
        // Event listeners para botones de construir
        container.querySelectorAll('.btn-build').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const moduleId = e.target.dataset.moduleId;
                this.enterBuildMode(moduleId);
            });
        });
    },
    
    // Seleccionar módulo
    selectModule: function(moduleId) {
        this.selectedModule = moduleId;
        
        // Actualizar selección visual
        this.panel.querySelectorAll('.module-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedItem = this.panel.querySelector(`[data-module-id="${moduleId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
        
        // Mostrar vista previa
        this.showModulePreview(moduleId);
    },
    
    // Mostrar vista previa del módulo
    showModulePreview: function(moduleId) {
        const module = window.BaseBuildingSystem.availableModules[moduleId];
        const container = this.panel.querySelector('#module-preview-content');
        
        container.innerHTML = `
            <h5 style="color: #00FFFF; margin-bottom: 15px;">${module.name}</h5>
            <p style="color: #87CEEB; margin-bottom: 15px;">${module.description}</p>
            
            <div style="margin-bottom: 15px;">
                <h6 style="color: #00FFFF; margin-bottom: 8px;">📊 Efectos:</h6>
                ${Object.entries(module.effects).map(([effect, value]) => 
                    `<div style="color: #CCC; font-size: 12px; margin: 2px 0;">• ${effect}: ${value}</div>`
                ).join('')}
            </div>
            
            <div style="margin-bottom: 15px;">
                <h6 style="color: #00FFFF; margin-bottom: 8px;">🔧 Mantenimiento:</h6>
                ${Object.entries(module.maintenance).map(([resource, amount]) => 
                    `<div style="color: #CCC; font-size: 12px; margin: 2px 0;">• ${resource}: ${amount}/min</div>`
                ).join('')}
            </div>
            
            <div style="background: rgba(255, 215, 0, 0.1); border: 1px solid #FFD700; border-radius: 5px; padding: 10px;">
                <div style="color: #FFD700; font-weight: bold; margin-bottom: 5px;">💎 Costo:</div>
                ${Object.entries(module.cost).map(([resource, amount]) => 
                    `<div style="color: #FFD700; font-size: 12px; margin: 2px 0;">${this.getResourceIcon(resource)} ${amount} ${resource}</div>`
                ).join('')}
            </div>
        `;
    },
    
    // Entrar en modo construcción
    enterBuildMode: function(moduleId) {
        this.buildMode = true;
        this.selectedModule = moduleId;
        
        // Cambiar cursor del grid
        this.gridCanvas.style.cursor = 'crosshair';
        
        // Mostrar mensaje
        this.showMessage(`🏗️ Modo construcción activado para ${window.BaseBuildingSystem.availableModules[moduleId].name}`, 'info');
    },
    
    // Construir módulo en posición
    buildModuleAt: function(gridX, gridY) {
        if (!this.buildMode || !this.selectedModule) return;
        
        const result = window.BaseBuildingSystem.buildModule(this.selectedModule, { x: gridX, y: gridY });
        
        if (result) {
            // Salir del modo construcción
            this.buildMode = false;
            this.selectedModule = null;
            this.gridCanvas.style.cursor = 'default';
            
            // Redibujar grid
            this.drawGrid();
            
            // Actualizar pestaña de gestión
            this.updateTabContent('manage');
        }
    },
    
    // Mostrar módulos construidos
    displayBuiltModules: function() {
        const container = this.panel.querySelector('#built-modules-list');
        const builtModules = window.BaseBuildingSystem.getBuiltModules();
        
        if (builtModules.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <h3>🏠 No tienes módulos construidos</h3>
                    <p>Construye tu primer módulo desde la pestaña "Construir"</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = builtModules.map(module => {
            const moduleData = window.BaseBuildingSystem.availableModules[module.id];
            
            return `
                <div class="module-item">
                    <div class="module-header">
                        <h4 class="module-name">${module.name}</h4>
                        <span class="module-category ${moduleData.category}">${moduleData.category}</span>
                    </div>
                    
                    <div style="color: #CCC; font-size: 12px; margin: 10px 0;">
                        <span>📍 Posición: (${module.position.x}, ${module.position.y})</span> |
                        <span>📏 Tamaño: ${module.size.width}x${module.size.height}</span> |
                        <span>⬆️ Nivel: ${module.level}</span> |
                        <span>❤️ Salud: ${module.health}/${module.maxHealth}</span>
                    </div>
                    
                    <div class="module-actions">
                        <button class="action-btn btn-upgrade" data-module-id="${module.id}">
                            ⬆️ Mejorar (Nivel ${module.level + 1})
                        </button>
                        <button class="action-btn btn-demolish" data-module-id="${module.id}">
                            🗑️ Demoler
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Event listeners para acciones
        container.querySelectorAll('.btn-upgrade').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const moduleId = e.target.dataset.moduleId;
                window.BaseBuildingSystem.upgradeModule(moduleId);
                this.updateTabContent('manage');
            });
        });
        
        container.querySelectorAll('.btn-demolish').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const moduleId = e.target.dataset.moduleId;
                if (confirm('¿Estás seguro de que quieres demoler este módulo?')) {
                    window.BaseBuildingSystem.demolishModule(moduleId);
                    this.updateTabContent('manage');
                    this.drawGrid();
                }
            });
        });
    },
    
    // Mostrar módulos en construcción
    displayBuildingModules: function() {
        const container = this.panel.querySelector('#building-modules-list');
        const buildingModules = window.BaseBuildingSystem.getBuildingModules();
        
        if (buildingModules.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <h3>🏗️ No hay módulos en construcción</h3>
                    <p>Todos tus módulos están completados</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = buildingModules.map(module => {
            const moduleData = window.BaseBuildingSystem.availableModules[module.id];
            const timeRemaining = Math.max(0, Math.ceil((moduleData.buildTime * 1000 - (Date.now() - module.buildTime)) / 1000));
            
            return `
                <div class="module-item">
                    <div class="module-header">
                        <h4 class="module-name">${module.name}</h4>
                        <span style="background: #FFA500; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px;">🏗️ Construyendo</span>
                    </div>
                    
                    <div style="color: #CCC; font-size: 12px; margin: 10px 0;">
                        <span>📍 Posición: (${module.position.x}, ${module.position.y})</span> |
                        <span>📏 Tamaño: ${module.size.width}x${module.size.height}</span> |
                        <span>⏱️ Tiempo restante: ${timeRemaining}s</span>
                    </div>
                    
                    <div style="background: #333; border-radius: 5px; height: 20px; margin: 10px 0; overflow: hidden;">
                        <div style="background: #00FF00; height: 100%; width: ${module.buildProgress}%; transition: width 0.3s ease;"></div>
                    </div>
                    
                    <div style="color: #00FF00; text-align: center; font-weight: bold;">
                        ${Math.round(module.buildProgress)}% Completado
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Mostrar recursos
    displayResources: function() {
        const container = this.panel.querySelector('#resources-display');
        const resources = window.BaseBuildingSystem.playerBase.resources;
        
        container.innerHTML = Object.entries(resources).map(([resource, amount]) => `
            <div class="resource-item">
                <div class="resource-icon">${this.getResourceIcon(resource)}</div>
                <div class="resource-amount">${amount}</div>
                <div class="resource-name">${this.getResourceName(resource)}</div>
            </div>
        `).join('');
    },
    
    // Mostrar estadísticas de la base
    displayBaseStats: function() {
        const container = this.panel.querySelector('#base-stats-display');
        const stats = window.BaseBuildingSystem.getBaseStats();
        
        container.innerHTML = `
            <div class="resource-item">
                <div class="resource-icon">🏗️</div>
                <div class="resource-amount">${stats.modules}/${stats.maxModules}</div>
                <div class="resource-name">Módulos</div>
            </div>
            <div class="resource-item">
                <div class="resource-icon">🛡️</div>
                <div class="resource-amount">${stats.defense}</div>
                <div class="resource-name">Defensa</div>
            </div>
            <div class="resource-item">
                <div class="resource-icon">⚡</div>
                <div class="resource-amount">${stats.energy}</div>
                <div class="resource-name">Energía</div>
            </div>
            <div class="resource-item">
                <div class="resource-icon">🔬</div>
                <div class="resource-amount">${stats.research}</div>
                <div class="resource-name">Investigación</div>
            </div>
            <div class="resource-item">
                <div class="resource-icon">👥</div>
                <div class="resource-amount">${stats.population}/${stats.maxPopulation}</div>
                <div class="resource-name">Población</div>
            </div>
            <div class="resource-item">
                <div class="resource-icon">⬆️</div>
                <div class="resource-amount">${stats.level}</div>
                <div class="resource-name">Nivel Base</div>
            </div>
        `;
    },
    
    // Obtener icono de recurso
    getResourceIcon: function(resource) {
        const icons = {
            'metal': '🔩',
            'crystal': '💎',
            'energy': '⚡',
            'titanium': '🛡️',
            'gold': '🥇'
        };
        return icons[resource] || '📦';
    },
    
    // Obtener nombre de recurso
    getResourceName: function(resource) {
        const names = {
            'metal': 'Metal',
            'crystal': 'Cristal',
            'energy': 'Energía',
            'titanium': 'Titanio',
            'gold': 'Oro'
        };
        return names[resource] || resource;
    },
    
    // Mostrar mensaje
    showMessage: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 1001;
            animation: slideDown 0.3s ease;
        `;
        notification.textContent = message;
        
        // Añadir animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    // Mostrar panel
    show: function() {
        this.panel.style.display = 'block';
        this.isVisible = true;
        this.updateTabContent(this.currentTab);
        this.drawGrid();
    },
    
    // Ocultar panel
    hide: function() {
        this.panel.style.display = 'none';
        this.isVisible = false;
        this.buildMode = false;
        this.selectedModule = null;
    },
    
    // Alternar visibilidad
    toggle: function() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.BasePanel = BasePanel;
}