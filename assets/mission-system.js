// Sistema de Misiones y Narrativa para Cosmic Depths
const MissionSystem = {
    // Estado del sistema
    state: {
        activeQuests: new Map(),
        completedQuests: new Set(),
        availableQuests: new Set(),
        questProgress: {},
        storyProgress: 0,
        totalQuestsCompleted: 0
    },
    
    // Configuración
    config: {
        maxActiveQuests: 5,
        maxDailyQuests: 3,
        questCheckInterval: 1000 // ms
    },
    
    // Base de datos de misiones
    questDatabase: {
        // MISIONES PRINCIPALES (Historia)
        mainQuests: [
            {
                id: 'quest_001',
                title: 'El Misterio de las Profundidades',
                description: 'Descubre qué se esconde en las fosas abisales del océano',
                type: 'main',
                status: 'available',
                objectives: [
                    { 
                        id: 'obj_001', 
                        description: 'Llega a 1000m de profundidad', 
                        type: 'depth',
                        target: 1000,
                        current: 0,
                        completed: false 
                    },
                    { 
                        id: 'obj_002', 
                        description: 'Encuentra la primera señal antigua', 
                        type: 'discovery',
                        target: 'ancient_signal',
                        current: 0,
                        completed: false 
                    }
                ],
                rewards: { 
                    exp: 500, 
                    gems: 100, 
                    items: ['ancient_artifact'],
                    unlocks: ['abyss_zone']
                },
                prerequisites: [],
                location: { x: 0, y: -1000, biome: 'abyss' },
                storyOrder: 1
            },
            {
                id: 'quest_002',
                title: 'La Ciudad Perdida',
                description: 'Explora las ruinas de una civilización submarina antigua',
                type: 'main',
                status: 'locked',
                objectives: [
                    { 
                        id: 'obj_001', 
                        description: 'Encuentra 3 fragmentos de la ciudad', 
                        type: 'collect',
                        target: 3,
                        current: 0,
                        completed: false 
                    },
                    { 
                        id: 'obj_002', 
                        description: 'Derrota al guardián de las ruinas', 
                        type: 'boss',
                        target: 'ruins_guardian',
                        current: 0,
                        completed: false 
                    }
                ],
                rewards: { 
                    exp: 800, 
                    gems: 150, 
                    items: ['city_map'],
                    unlocks: ['ancient_ruins']
                },
                prerequisites: ['quest_001'],
                location: { x: 500, y: -800, biome: 'ruins' },
                storyOrder: 2
            },
            {
                id: 'quest_003',
                title: 'El Guardián del Abismo',
                description: 'Enfréntate al ser más poderoso de las profundidades',
                type: 'main',
                status: 'locked',
                objectives: [
                    { 
                        id: 'obj_001', 
                        description: 'Llega a 2000m de profundidad', 
                        type: 'depth',
                        target: 2000,
                        current: 0,
                        completed: false 
                    },
                    { 
                        id: 'obj_002', 
                        description: 'Derrota al Rey Abisal', 
                        type: 'boss',
                        target: 'abyss_king',
                        current: 0,
                        completed: false 
                    }
                ],
                rewards: { 
                    exp: 1500, 
                    gems: 300, 
                    items: ['abyss_crown'],
                    unlocks: ['final_zone']
                },
                prerequisites: ['quest_002'],
                location: { x: 0, y: -2000, biome: 'abyss' },
                storyOrder: 3
            }
        ],
        
        // MISIONES SECUNDARIAS (Opcionales)
        sideQuests: [
            {
                id: 'side_001',
                title: 'Coleccionista de Gemas',
                description: 'Recoge gemas de diferentes colores para el mercader',
                type: 'side',
                status: 'available',
                objectives: [
                    { 
                        id: 'obj_001', 
                        description: 'Recoge 50 gemas azules', 
                        type: 'collect_gems',
                        target: 50,
                        current: 0,
                        completed: false,
                        gemType: 'blue'
                    }
                ],
                rewards: { exp: 200, gems: 50, items: ['gem_collector_badge'] },
                timeLimit: null,
                repeatable: true
            },
            {
                id: 'side_002',
                title: 'Cazador de Criaturas',
                description: 'Derrota diferentes tipos de enemigos marinos',
                type: 'side',
                status: 'available',
                objectives: [
                    { 
                        id: 'obj_001', 
                        description: 'Derrota 100 enemigos', 
                        type: 'kill_enemies',
                        target: 100,
                        current: 0,
                        completed: false
                    }
                ],
                rewards: { exp: 300, gems: 75, items: ['hunter_medal'] },
                timeLimit: null,
                repeatable: true
            },
            {
                id: 'side_003',
                title: 'Explorador de Biomas',
                description: 'Visita todos los biomas submarinos disponibles',
                type: 'side',
                status: 'available',
                objectives: [
                    { 
                        id: 'obj_001', 
                        description: 'Visita 5 biomas diferentes', 
                        type: 'visit_biomes',
                        target: 5,
                        current: 0,
                        completed: false,
                        biomes: ['shallows', 'reef', 'kelp', 'abyss', 'volcanic']
                    }
                ],
                rewards: { exp: 400, gems: 100, items: ['explorer_compass'] },
                timeLimit: null,
                repeatable: false
            }
        ],
        
        // MISIONES DIARIAS (Repetibles cada 24h)
        dailyQuests: [
            {
                id: 'daily_001',
                title: 'Cazador del Día',
                description: 'Derrota enemigos para ganar recompensas diarias',
                type: 'daily',
                status: 'available',
                objectives: [
                    { 
                        id: 'obj_001', 
                        description: 'Derrota 20 enemigos en 24 horas', 
                        type: 'kill_enemies',
                        target: 20,
                        current: 0,
                        completed: false
                    }
                ],
                rewards: { exp: 100, gems: 25, items: ['daily_reward_chest'] },
                expiresAt: null, // Se establece al activar
                repeatable: true
            },
            {
                id: 'daily_002',
                title: 'Recolector del Día',
                description: 'Recoge recursos para ganar recompensas diarias',
                type: 'daily',
                status: 'available',
                objectives: [
                    { 
                        id: 'obj_001', 
                        description: 'Recoge 30 gemas en 24 horas', 
                        type: 'collect_gems',
                        target: 30,
                        current: 0,
                        completed: false
                    }
                ],
                rewards: { exp: 80, gems: 20, items: ['resource_boost'] },
                expiresAt: null,
                repeatable: true
            }
        ]
    },
    
    // Inicialización
    init: function() {
        console.log('Sistema de misiones inicializado');
        this.loadQuestProgress();
        this.checkAvailableQuests();
        this.startQuestMonitoring();
        this.generateDailyQuests();
    },
    
    // Cargar progreso guardado
    loadQuestProgress: function() {
        try {
            const saved = localStorage.getItem('cosmicDepths_questProgress');
            if (saved) {
                const data = JSON.parse(saved);
                this.state.completedQuests = new Set(data.completedQuests || []);
                this.state.questProgress = data.questProgress || {};
                this.state.storyProgress = data.storyProgress || 0;
                this.state.totalQuestsCompleted = data.totalQuestsCompleted || 0;
                console.log('Progreso de misiones cargado');
            }
        } catch (e) {
            console.error('Error al cargar progreso de misiones:', e);
        }
    },
    
    // Guardar progreso
    saveQuestProgress: function() {
        try {
            const data = {
                completedQuests: Array.from(this.state.completedQuests),
                questProgress: this.state.questProgress,
                storyProgress: this.state.storyProgress,
                totalQuestsCompleted: this.state.totalQuestsCompleted
            };
            localStorage.setItem('cosmicDepths_questProgress', JSON.stringify(data));
        } catch (e) {
            console.error('Error al guardar progreso de misiones:', e);
        }
    },
    
    // Verificar misiones disponibles
    checkAvailableQuests: function() {
        // Verificar misiones principales
        this.questDatabase.mainQuests.forEach(quest => {
            if (quest.status === 'locked' && this.canUnlockQuest(quest)) {
                quest.status = 'available';
                this.state.availableQuests.add(quest.id);
                this.showQuestNotification(quest, 'discovered');
            }
        });
        
        // Verificar misiones secundarias
        this.questDatabase.sideQuests.forEach(quest => {
            if (quest.status === 'available' && !this.state.activeQuests.has(quest.id)) {
                this.state.availableQuests.add(quest.id);
            }
        });
    },
    
    // Verificar si se puede desbloquear una misión
    canUnlockQuest: function(quest) {
        if (!quest.prerequisites || quest.prerequisites.length === 0) {
            return true;
        }
        
        return quest.prerequisites.every(prereqId => 
            this.state.completedQuests.has(prereqId)
        );
    },
    
    // Activar una misión
    activateQuest: function(questId) {
        const quest = this.findQuest(questId);
        if (!quest || quest.status !== 'available') {
            return { success: false, reason: 'Misión no disponible' };
        }
        
        if (this.state.activeQuests.size >= this.config.maxActiveQuests) {
            return { success: false, reason: 'Demasiadas misiones activas' };
        }
        
        // Activar la misión
        quest.status = 'active';
        this.state.activeQuests.set(questId, {
            ...quest,
            startTime: Date.now(),
            objectives: quest.objectives.map(obj => ({ ...obj }))
        });
        
        // Establecer tiempo de expiración para misiones diarias
        if (quest.type === 'daily') {
            const dailyQuest = this.state.activeQuests.get(questId);
            dailyQuest.expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
        }
        
        this.state.availableQuests.delete(questId);
        this.showQuestNotification(quest, 'activated');
        
        return { success: true };
    },
    
    // Encontrar misión por ID
    findQuest: function(questId) {
        return this.questDatabase.mainQuests.find(q => q.id === questId) ||
               this.questDatabase.sideQuests.find(q => q.id === questId) ||
               this.questDatabase.dailyQuests.find(q => q.id === questId);
    },
    
    // Verificar progreso de objetivos
    checkQuestProgress: function(action, data) {
        this.state.activeQuests.forEach((quest, questId) => {
            quest.objectives.forEach(objective => {
                if (this.checkObjective(objective, action, data)) {
                    objective.current = Math.min(objective.current + 1, objective.target);
                    
                    if (objective.current >= objective.target && !objective.completed) {
                        objective.completed = true;
                        this.showObjectiveNotification(objective, 'completed');
                    }
                }
            });
            
            // Verificar si la misión está completa
            if (this.isQuestComplete(quest)) {
                this.completeQuest(questId);
            }
        });
    },
    
    // Verificar si un objetivo se cumple
    checkObjective: function(objective, action, data) {
        switch (objective.type) {
            case 'depth':
                return action === 'move' && data.depth >= objective.target;
            case 'collect':
                return action === 'collect' && data.itemType === objective.target;
            case 'collect_gems':
                return action === 'collect_gem' && data.gemType === objective.gemType;
            case 'kill_enemies':
                return action === 'kill_enemy';
            case 'boss':
                return action === 'kill_boss' && data.bossId === objective.target;
            case 'discovery':
                return action === 'discover' && data.discoveryId === objective.target;
            case 'visit_biomes':
                return action === 'visit_biome' && objective.biomes.includes(data.biomeId);
            default:
                return false;
        }
    },
    
    // Verificar si una misión está completa
    isQuestComplete: function(quest) {
        return quest.objectives.every(obj => obj.completed);
    },
    
    // Completar misión
    completeQuest: function(questId) {
        const quest = this.state.activeQuests.get(questId);
        if (!quest) return;
        
        // Marcar como completada
        quest.status = 'completed';
        this.state.completedQuests.add(questId);
        this.state.activeQuests.delete(questId);
        this.state.totalQuestsCompleted++;
        
        // Dar recompensas
        this.giveQuestRewards(quest);
        
        // Actualizar progreso de la historia
        if (quest.type === 'main') {
            this.state.storyProgress = Math.max(this.state.storyProgress, quest.storyOrder);
        }
        
        // Mostrar notificación
        this.showQuestNotification(quest, 'completed');
        
        // Verificar nuevas misiones disponibles
        this.checkAvailableQuests();
        
        // Guardar progreso
        this.saveQuestProgress();
    },
    
    // Dar recompensas de misión
    giveQuestRewards: function(quest) {
        const player = gameState.player;
        if (!player) return;
        
        // Experiencia
        if (quest.rewards.exp) {
            player.gainExperience(quest.rewards.exp);
        }
        
        // Gemas
        if (quest.rewards.gems) {
            player.gems += quest.rewards.gems;
        }
        
        // Items
        if (quest.rewards.items) {
            quest.rewards.items.forEach(itemId => {
                this.giveItem(player, itemId);
            });
        }
        
        // Desbloqueos
        if (quest.rewards.unlocks) {
            quest.rewards.unlocks.forEach(unlockId => {
                this.unlockContent(unlockId);
            });
        }
    },
    
    // Dar item al jugador
    giveItem: function(player, itemId) {
        // Implementar sistema de inventario aquí
        console.log(`Item ${itemId} dado al jugador`);
    },
    
    // Desbloquear contenido
    unlockContent: function(unlockId) {
        // Implementar sistema de desbloqueos aquí
        console.log(`Contenido ${unlockId} desbloqueado`);
    },
    
    // Generar misiones diarias
    generateDailyQuests: function() {
        const now = Date.now();
        const lastDailyReset = localStorage.getItem('cosmicDepths_lastDailyReset') || 0;
        const dayInMs = 24 * 60 * 60 * 1000;
        
        // Verificar si es un nuevo día
        if (now - lastDailyReset >= dayInMs) {
            // Resetear misiones diarias
            this.questDatabase.dailyQuests.forEach(quest => {
                quest.status = 'available';
                quest.objectives.forEach(obj => {
                    obj.current = 0;
                    obj.completed = false;
                });
            });
            
            localStorage.setItem('cosmicDepths_lastDailyReset', now);
            console.log('Misiones diarias regeneradas');
        }
    },
    
    // Monitoreo continuo de misiones
    startQuestMonitoring: function() {
        setInterval(() => {
            this.checkQuestExpiration();
        }, this.config.questCheckInterval);
    },
    
    // Verificar expiración de misiones
    checkQuestExpiration: function() {
        const now = Date.now();
        
        this.state.activeQuests.forEach((quest, questId) => {
            if (quest.expiresAt && now >= quest.expiresAt) {
                // Misión expirada
                this.failQuest(questId, 'expired');
            }
        });
    },
    
    // Fallar misión
    failQuest: function(questId, reason) {
        const quest = this.state.activeQuests.get(questId);
        if (!quest) return;
        
        quest.status = 'failed';
        this.state.activeQuests.delete(questId);
        
        this.showQuestNotification(quest, 'failed');
        console.log(`Misión ${quest.title} falló: ${reason}`);
    },
    
    // Mostrar notificaciones
    showQuestNotification: function(quest, type) {
        const messages = {
            'discovered': `🎯 Nueva misión disponible: ${quest.title}`,
            'activated': `🚀 Misión activada: ${quest.title}`,
            'completed': `🏆 Misión completada: ${quest.title}`,
            'failed': `❌ Misión fallida: ${quest.title}`
        };
        
        const message = messages[type];
        if (message) {
            this.showMessage(message, type);
        }
    },
    
    showObjectiveNotification: function(objective, type) {
        if (type === 'completed') {
            this.showMessage(`✅ Objetivo completado: ${objective.description}`, 'success');
        }
    },
    
    // Mostrar mensaje en pantalla
    showMessage: function(message, type = 'info') {
        // Crear notificación visual
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
            z-index: 1000;
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
    
    // Obtener estadísticas
    getStats: function() {
        return {
            activeQuests: this.state.activeQuests.size,
            completedQuests: this.state.completedQuests.size,
            availableQuests: this.state.availableQuests.size,
            storyProgress: this.state.storyProgress,
            totalQuestsCompleted: this.state.totalQuestsCompleted
        };
    },
    
    // Obtener misiones activas
    getActiveQuests: function() {
        return Array.from(this.state.activeQuests.values());
    },
    
    // Obtener misiones disponibles
    getAvailableQuests: function() {
        return Array.from(this.state.availableQuests).map(id => this.findQuest(id));
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.MissionSystem = MissionSystem;
}