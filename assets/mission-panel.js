// Panel de Misiones para Cosmic Depths
const MissionPanel = {
    // Estado del panel
    isVisible: false,
    panel: null,
    currentTab: 'active', // 'active', 'available', 'completed'
    
    // Inicialización
    init: function() {
        this.createPanel();
        this.setupEventListeners();
        console.log('Panel de misiones inicializado');
    },
    
    // Crear el panel visual
    createPanel: function() {
        // Crear contenedor principal
        this.panel = document.createElement('div');
        this.panel.id = 'missionPanel';
        this.panel.className = 'mission-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            max-height: 80vh;
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
                    🎯 Panel de Misiones
                </h2>
                <p style="margin: 5px 0; color: #87CEEB; font-size: 14px;">
                    Gestiona tus misiones y sigue tu progreso
                </p>
            </div>
            
            <!-- Pestañas de navegación -->
            <div class="mission-tabs" style="display: flex; gap: 5px; margin-bottom: 20px;">
                <button class="tab-btn active" data-tab="active" style="flex: 1; padding: 10px; background: #00CED1; border: none; color: #000; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    🚀 Activas (0)
                </button>
                <button class="tab-btn" data-tab="available" style="flex: 1; padding: 10px; background: #2a2a2a; border: none; color: #ccc; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    📋 Disponibles (0)
                </button>
                <button class="tab-btn" data-tab="completed" style="flex: 1; padding: 10px; background: #2a2a2a; border: none; color: #ccc; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    ✅ Completadas (0)
                </button>
            </div>
            
            <!-- Contenido de las pestañas -->
            <div class="tab-content">
                <!-- Pestaña de Misiones Activas -->
                <div id="active-tab" class="tab-pane active">
                    <div class="quest-list" id="active-quests">
                        <div class="no-quests" style="text-align: center; padding: 40px; color: #666;">
                            <h3>🎯 No tienes misiones activas</h3>
                            <p>Activa misiones desde la pestaña "Disponibles" para comenzar tu aventura</p>
                        </div>
                    </div>
                </div>
                
                <!-- Pestaña de Misiones Disponibles -->
                <div id="available-tab" class="tab-pane" style="display: none;">
                    <div class="quest-list" id="available-quests">
                        <div class="no-quests" style="text-align: center; padding: 40px; color: #666;">
                            <h3>📋 No hay misiones disponibles</h3>
                            <p>Completa misiones anteriores para desbloquear nuevas</p>
                        </div>
                    </div>
                </div>
                
                <!-- Pestaña de Misiones Completadas -->
                <div id="completed-tab" class="tab-pane" style="display: none;">
                    <div class="quest-list" id="completed-quests">
                        <div class="no-quests" style="text-align: center; padding: 40px; color: #666;">
                            <h3>✅ No has completado misiones aún</h3>
                            <p>¡Completa tu primera misión para verla aquí!</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Estadísticas del jugador -->
            <div class="player-stats" style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #00FFFF;">📊 Estadísticas de Misiones</h4>
                <div class="stats-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="stat-item">
                        <span>Misiones Completadas:</span>
                        <span id="total-completed" style="color: #00FF00;">0</span>
                    </div>
                    <div class="stat-item">
                        <span>Progreso de Historia:</span>
                        <span id="story-progress" style="color: #00FF00;">0%</span>
                    </div>
                    <div class="stat-item">
                        <span>Misiones Activas:</span>
                        <span id="total-active" style="color: #00FF00;">0</span>
                    </div>
                    <div class="stat-item">
                        <span>Misiones Disponibles:</span>
                        <span id="total-available" style="color: #00FF00;">0</span>
                    </div>
                </div>
            </div>
            
            <!-- Botón de cerrar -->
            <div class="panel-actions" style="text-align: center; margin-top: 20px;">
                <button id="closeMissionPanel" style="padding: 12px 30px; background: #666; border: none; color: #fff; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    ❌ Cerrar
                </button>
            </div>
        `;
        
        // Añadir estilos CSS
        this.addStyles();
        
        // Añadir al DOM
        document.body.appendChild(this.panel);
    },
    
    // Añadir estilos CSS
    addStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .mission-panel .tab-btn {
                transition: all 0.3s ease;
            }
            
            .mission-panel .tab-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .mission-panel .tab-btn.active {
                background: #00CED1 !important;
                color: #000 !important;
            }
            
            .mission-panel .quest-item {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid #00CED1;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
                transition: all 0.3s ease;
            }
            
            .mission-panel .quest-item:hover {
                border-color: #00FFFF;
                box-shadow: 0 0 15px rgba(0, 206, 209, 0.3);
            }
            
            .mission-panel .quest-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .mission-panel .quest-title {
                font-size: 18px;
                    font-weight: bold;
                color: #00FFFF;
            }
            
            .mission-panel .quest-type {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
            }
            
            .mission-panel .quest-type.main {
                background: #FF6B6B;
                color: white;
            }
            
            .mission-panel .quest-type.side {
                background: #4ECDC4;
                color: white;
            }
            
            .mission-panel .quest-type.daily {
                background: #45B7D1;
                color: white;
            }
            
            .mission-panel .quest-description {
                color: #87CEEB;
                margin-bottom: 15px;
                line-height: 1.4;
            }
            
            .mission-panel .quest-objectives {
                margin-bottom: 15px;
            }
            
            .mission-panel .objective-item {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
                padding: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 5px;
            }
            
            .mission-panel .objective-checkbox {
                width: 18px;
                height: 18px;
                accent-color: #00CED1;
            }
            
            .mission-panel .objective-text {
                flex: 1;
                color: #CCC;
            }
            
            .mission-panel .objective-progress {
                color: #00FF00;
                font-weight: bold;
            }
            
            .mission-panel .quest-rewards {
                background: rgba(255, 215, 0, 0.1);
                border: 1px solid #FFD700;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 15px;
            }
            
            .mission-panel .rewards-title {
                color: #FFD700;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .mission-panel .reward-item {
                color: #FFD700;
                margin-left: 15px;
            }
            
            .mission-panel .quest-actions {
                display: flex;
                gap: 10px;
            }
            
            .mission-panel .action-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            
            .mission-panel .action-btn:hover {
                transform: translateY(-2px);
            }
            
            .mission-panel .btn-activate {
                background: #4CAF50;
                color: white;
            }
            
            .mission-panel .btn-upgrade {
                background: #FF9800;
                color: white;
            }
            
            .mission-panel .btn-demolish {
                background: #F44336;
                color: white;
            }
            
            .mission-panel .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            
            .mission-panel .stat-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
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
        this.panel.querySelector('#closeMissionPanel').addEventListener('click', () => {
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
            if (this.isVisible && !this.panel.contains(e.target) && !e.target.classList.contains('mission-toggle')) {
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
            case 'active':
                this.displayActiveQuests();
                break;
            case 'available':
                this.displayAvailableQuests();
                break;
            case 'completed':
                this.displayCompletedQuests();
                break;
        }
        
        this.updateStats();
    },
    
    // Mostrar misiones activas
    displayActiveQuests: function() {
        const container = this.panel.querySelector('#active-quests');
        const activeQuests = window.MissionSystem.getActiveQuests();
        
        if (activeQuests.length === 0) {
            container.innerHTML = `
                <div class="no-quests" style="text-align: center; padding: 40px; color: #666;">
                    <h3>🎯 No tienes misiones activas</h3>
                    <p>Activa misiones desde la pestaña "Disponibles" para comenzar tu aventura</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = activeQuests.map(quest => this.createQuestHTML(quest, 'active')).join('');
    },
    
    // Mostrar misiones disponibles
    displayAvailableQuests: function() {
        const container = this.panel.querySelector('#available-quests');
        const availableQuests = window.MissionSystem.getAvailableQuests();
        
        if (availableQuests.length === 0) {
            container.innerHTML = `
                <div class="no-quests" style="text-align: center; padding: 40px; color: #666;">
                    <h3>📋 No hay misiones disponibles</h3>
                    <p>Completa misiones anteriores para desbloquear nuevas</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = availableQuests.map(quest => this.createQuestHTML(quest, 'available')).join('');
        
        // Añadir event listeners para botones de activar
        container.querySelectorAll('.btn-activate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questId = e.target.dataset.questId;
                this.activateQuest(questId);
            });
        });
    },
    
    // Mostrar misiones completadas
    displayCompletedQuests: function() {
        const container = this.panel.querySelector('#completed-quests');
        const completedQuests = Array.from(window.MissionSystem.state.completedQuests);
        
        if (completedQuests.length === 0) {
            container.innerHTML = `
                <div class="no-quests" style="text-align: center; padding: 40px; color: #666;">
                    <h3>✅ No has completado misiones aún</h3>
                    <p>¡Completa tu primera misión para verla aquí!</p>
                </div>
            `;
            return;
        }
        
        const quests = completedQuests.map(questId => {
            const quest = window.MissionSystem.findQuest(questId);
            return quest ? this.createQuestHTML(quest, 'completed') : '';
        }).filter(html => html !== '');
        
        container.innerHTML = quests.join('');
    },
    
    // Crear HTML de misión
    createQuestHTML: function(quest, status) {
        const typeClass = quest.type;
        const typeText = {
            'main': '📖 Principal',
            'side': '🎯 Secundaria',
            'daily': '⏰ Diaria'
        }[quest.type];
        
        const objectivesHTML = quest.objectives.map(objective => {
            const progress = objective.current || 0;
            const target = objective.target;
            const completed = objective.completed || false;
            
            return `
                <div class="objective-item">
                    <input type="checkbox" class="objective-checkbox" ${completed ? 'checked' : ''} disabled>
                    <span class="objective-text">${objective.description}</span>
                    <span class="objective-progress">${progress}/${target}</span>
                </div>
            `;
        }).join('');
        
        const rewardsHTML = this.createRewardsHTML(quest.rewards);
        const actionsHTML = this.createActionsHTML(quest, status);
        
        return `
            <div class="quest-item" data-quest-id="${quest.id}">
                <div class="quest-header">
                    <h3 class="quest-title">${quest.title}</h3>
                    <span class="quest-type ${typeClass}">${typeText}</span>
                </div>
                
                <p class="quest-description">${quest.description}</p>
                
                <div class="quest-objectives">
                    <h4 style="color: #00FFFF; margin-bottom: 10px;">🎯 Objetivos:</h4>
                    ${objectivesHTML}
                </div>
                
                ${rewardsHTML}
                ${actionsHTML}
            </div>
        `;
    },
    
    // Crear HTML de recompensas
    createRewardsHTML: function(rewards) {
        if (!rewards) return '';
        
        const rewardItems = [];
        if (rewards.exp) rewardItems.push(`<div class="reward-item">⭐ ${rewards.exp} Experiencia</div>`);
        if (rewards.gems) rewardItems.push(`<div class="reward-item">💎 ${rewards.gems} Gemas</div>`);
        if (rewards.items) {
            rewards.items.forEach(item => {
                rewardItems.push(`<div class="reward-item">🎁 ${item}</div>`);
            });
        }
        if (rewards.unlocks) {
            rewards.unlocks.forEach(unlock => {
                rewardItems.push(`<div class="reward-item">🔓 ${unlock}</div>`);
            });
        }
        
        if (rewardItems.length === 0) return '';
        
        return `
            <div class="quest-rewards">
                <div class="rewards-title">🏆 Recompensas:</div>
                ${rewardItems.join('')}
            </div>
        `;
    },
    
    // Crear HTML de acciones
    createActionsHTML: function(quest, status) {
        switch (status) {
            case 'available':
                return `
                    <div class="quest-actions">
                        <button class="action-btn btn-activate" data-quest-id="${quest.id}">
                            🚀 Activar Misión
                        </button>
                    </div>
                `;
            case 'active':
                return `
                    <div class="quest-actions">
                        <span style="color: #00FF00; font-weight: bold;">✅ Misión en progreso...</span>
                    </div>
                `;
            case 'completed':
                return `
                    <div class="quest-actions">
                        <span style="color: #00FF00; font-weight: bold;">🏆 Misión Completada</span>
                    </div>
                `;
            default:
                return '';
        }
    },
    
    // Activar misión
    activateQuest: function(questId) {
        const result = window.MissionSystem.activateQuest(questId);
        if (result.success) {
            this.showMessage('🚀 Misión activada exitosamente!', 'success');
            this.updateTabContent(this.currentTab);
        } else {
            this.showMessage(`❌ Error: ${result.reason}`, 'error');
        }
    },
    
    // Actualizar estadísticas
    updateStats: function() {
        const stats = window.MissionSystem.getStats();
        
        // Actualizar contadores de pestañas
        this.panel.querySelector('[data-tab="active"]').textContent = `🚀 Activas (${stats.activeQuests})`;
        this.panel.querySelector('[data-tab="available"]').textContent = `📋 Disponibles (${stats.availableQuests})`;
        this.panel.querySelector('[data-tab="completed"]').textContent = `✅ Completadas (${stats.completedQuests})`;
        
        // Actualizar estadísticas generales
        this.panel.querySelector('#total-completed').textContent = stats.totalQuestsCompleted;
        this.panel.querySelector('#story-progress').textContent = `${Math.round((stats.storyProgress / 3) * 100)}%`;
        this.panel.querySelector('#total-active').textContent = stats.activeQuests;
        this.panel.querySelector('#total-available').textContent = stats.availableQuests;
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
    },
    
    // Ocultar panel
    hide: function() {
        this.panel.style.display = 'none';
        this.isVisible = false;
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
    window.MissionPanel = MissionPanel;
}