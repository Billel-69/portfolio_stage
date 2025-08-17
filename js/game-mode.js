// js/game-mode.js - Gestionnaire du mode jeu 3D complet et sécurisé

class GameModeManager {
    constructor() {
        // État du jeu
        this.isGameMode = false;
        this.isGameLoaded = false;
        this.isGamePaused = false;

        // Éléments DOM
        this.gameFrame = null;
        this.gameContainer = null;
        this.loadingElement = null;

        // Configuration sécurité
        this.allowedOrigins = [window.location.origin];
        this.allowedMessageTypes = [
            'GAME_PROJECT_OPEN',
            'GAME_SCORE_UPDATE',
            'GAME_READY',
            'GAME_ERROR',
            'GAME_ACHIEVEMENT'
        ];

        // Gestionnaires d'événements
        this.messageHandler = this.handleSecureMessage.bind(this);
        this.visibilityHandler = this.handleVisibilityChange.bind(this);
        this.resizeHandler = this.handleResize.bind(this);

        // Statistiques de jeu
        this.gameStats = {
            score: 0,
            coins: 0,
            timeStarted: null,
            projectsVisited: new Set()
        };

        this.init();
    }

    init() {
        try {
            this.setupModeToggle();
            this.setupGameContainer();
            this.setupEventListeners();
            this.initializeGameStats();

            // Intégration avec AnimationManager si disponible
            if (window.AnimationManager) {
                this.animationManager = window.AnimationManager;
            }

            console.log('🎮 GameModeManager initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing GameModeManager:', error);
            this.showErrorNotification('Erreur d\'initialisation du mode jeu');
        }
    }

    setupModeToggle() {
        const modeButtons = document.querySelectorAll('.mode-btn');

        modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const mode = btn.getAttribute('data-mode');
                this.switchMode(mode, btn);
            });

            // Amélioration accessibilité
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', btn.classList.contains('active'));
        });
    }

    setupGameContainer() {
        this.gameContainer = document.getElementById('gameMode');

        if (!this.gameContainer) {
            console.warn('⚠️ Game container not found');
            return;
        }

        // Préparer le conteneur
        this.gameContainer.style.position = 'relative';
        this.gameContainer.style.overflow = 'hidden';
        this.gameContainer.setAttribute('role', 'application');
        this.gameContainer.setAttribute('aria-label', 'Jeu interactif du portfolio');

        // Ajouter le bouton plein écran
        this.createFullscreenButton();
    }

    setupEventListeners() {
        // Gestion des messages sécurisés
        window.addEventListener('message', this.messageHandler);

        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', this.visibilityHandler);

        // Gestion du redimensionnement
        window.addEventListener('resize', this.resizeHandler);

        // Gestion du beforeunload
        window.addEventListener('beforeunload', this.destroy.bind(this));

        // Gestion des erreurs
        window.addEventListener('error', this.handleGlobalError.bind(this));
    }

    createFullscreenButton() {
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-toggle';
        fullscreenBtn.innerHTML = `
            <span class="fullscreen-icon">⛶</span>
        `;
        fullscreenBtn.setAttribute('aria-label', 'Basculer en plein écran');
        fullscreenBtn.addEventListener('click', this.toggleFullscreen.bind(this));

        this.gameContainer.appendChild(fullscreenBtn);
    }

    switchMode(mode, activeButton) {
        try {
            // Mettre à jour les boutons actifs
            this.updateModeButtons(activeButton);

            // Gérer l'affichage des modes
            const cardsMode = document.getElementById('cardsMode');
            const gameMode = document.getElementById('gameMode');

            if (!cardsMode || !gameMode) {
                throw new Error('Mode containers not found');
            }

            if (mode === 'cards') {
                this.showCardsMode(cardsMode, gameMode);
            } else if (mode === 'game') {
                this.showGameMode(cardsMode, gameMode);
            }

            // Analytics
            this.trackModeSwitch(mode);

        } catch (error) {
            console.error('❌ Error switching mode:', error);
            this.showErrorNotification('Erreur lors du changement de mode');
        }
    }

    updateModeButtons(activeButton) {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        activeButton.classList.add('active');
        activeButton.setAttribute('aria-selected', 'true');

        // Animation du bouton
        if (this.animationManager) {
            this.animationManager.pulse(activeButton);
        }
    }

    showCardsMode(cardsMode, gameMode) {
        // Pause le jeu
        this.pauseGame();

        // Animation de sortie du mode jeu
        gameMode.style.animation = 'gameSlideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

        setTimeout(() => {
            gameMode.classList.remove('active');
            this.isGameMode = false;

            // Animation d'entrée des cards
            cardsMode.style.animation = 'fadeIn 0.5s ease-out';
            cardsMode.classList.add('active');

        }, 400);
    }

    showGameMode(cardsMode, gameMode) {
        // Animation de sortie des cards
        cardsMode.style.animation = 'fadeOut 0.3s ease-out';

        setTimeout(() => {
            cardsMode.classList.remove('active');

            // Animation d'entrée du jeu
            gameMode.style.animation = 'gameSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            gameMode.classList.add('active');
            this.isGameMode = true;

            // Charger le jeu
            this.loadGame();

        }, 300);
    }

    async loadGame() {
        if (this.gameFrame && this.isGameLoaded) {
            this.resumeGame();
            return;
        }

        try {
            await this.createGameFrame();
            this.showGameLoading();

        } catch (error) {
            console.error('❌ Error loading game:', error);
            this.showErrorNotification('Erreur lors du chargement du jeu 3D');
        }
    }

    async createGameFrame() {
        // Vérifier que le fichier mario3d.html existe lorsque le protocole
        // n'est pas file://. Sous file://, une requête HEAD est bloquée par la
        // politique CORS des navigateurs ; nous ignorons donc cette étape et
        // tentons de charger directement l'iframe.
        if (window.location.protocol !== 'file:') {
            try {
                const response = await fetch('mario3d.html', { method: 'HEAD' });
                if (!response.ok) {
                    throw new Error('Game file not found');
                }
            } catch (error) {
                console.warn('Impossible de vérifier l\'existence de mario3d.html:', error);
                // On ne lève pas l\'erreur ici afin de permettre le chargement de l\'iframe.
            }
        }

        // Créer l'iframe sécurisé
        this.gameFrame = document.createElement('iframe');
        this.gameFrame.src = 'mario3d.html';

        // Attributs de sécurité
        this.gameFrame.setAttribute('sandbox',
            'allow-scripts allow-same-origin allow-pointer-lock allow-fullscreen'
        );
        this.gameFrame.setAttribute('allow',
            'accelerometer; gyroscope; fullscreen'
        );
        this.gameFrame.setAttribute('loading', 'lazy');
        this.gameFrame.setAttribute('title', 'Jeu Mario Portfolio 3D');

        // Styles
        this.gameFrame.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            border-radius: var(--border-radius-xl);
            background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
            transition: all 0.3s ease;
        `;

        // Gestionnaires d'événements
        this.gameFrame.onload = () => {
            this.onGameLoaded();
        };

        this.gameFrame.onerror = () => {
            this.onGameError('Erreur de chargement du jeu');
        };

        // Ajouter au conteneur
        this.gameContainer.innerHTML = '';
        this.gameContainer.appendChild(this.gameFrame);

        // Ajouter le bouton plein écran
        this.createFullscreenButton();
    }

    showGameLoading() {
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'game-loading';
        this.loadingElement.innerHTML = `
            <div class="loading-title-game">🎮 Mario Portfolio 3D</div>
            <div class="loading-progress-game">
                <div class="loading-bar-game" id="gameLoadingBar"></div>
            </div>
            <div class="loading-text-game" id="gameLoadingText">Initialisation du monde 3D...</div>
            <div class="loading-tips">
                <small>💡 Utilisez WASD pour vous déplacer et E pour interagir</small>
            </div>
        `;

        this.gameContainer.appendChild(this.loadingElement);

        // Animation de la barre de progression
        this.animateLoadingProgress();
    }

    animateLoadingProgress() {
        const loadingSteps = [
            { progress: 20, text: 'Chargement des textures...' },
            { progress: 40, text: 'Initialisation de Three.js...' },
            { progress: 60, text: 'Création du monde 3D...' },
            { progress: 80, text: 'Chargement des projets...' },
            { progress: 100, text: 'Finalisation...' }
        ];

        let currentStep = 0;
        const progressBar = document.getElementById('gameLoadingBar');
        const progressText = document.getElementById('gameLoadingText');

        const updateProgress = () => {
            if (currentStep < loadingSteps.length) {
                const step = loadingSteps[currentStep];

                if (progressBar) {
                    progressBar.style.width = `${step.progress}%`;
                }

                if (progressText) {
                    progressText.textContent = step.text;
                }

                currentStep++;
                setTimeout(updateProgress, 800);
            }
        };

        updateProgress();
    }

    onGameLoaded() {
        console.log('🎮 Game loaded successfully');
        this.isGameLoaded = true;

        setTimeout(() => {
            this.hideGameLoading();
            this.setupGameCommunication();
            this.gameStats.timeStarted = Date.now();

            // Notification de succès
            this.showGameNotification('🎮 Jeu chargé avec succès ! Explorez les projets !', 'success');

        }, 2000);
    }

    onGameError(message) {
        console.error('❌ Game error:', message);
        this.hideGameLoading();
        this.showErrorNotification(message);
    }

    hideGameLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.animation = 'fadeOut 0.5s ease-out';

            setTimeout(() => {
                if (this.loadingElement && this.loadingElement.parentNode) {
                    this.loadingElement.remove();
                    this.loadingElement = null;
                }
            }, 500);
        }
    }

    setupGameCommunication() {
        // Envoyer les données du portfolio au jeu
        this.sendMessageToGame({
            type: 'PORTFOLIO_INIT',
            data: {
                projects: this.getProjectsList(),
                theme: this.getCurrentTheme(),
                timestamp: Date.now()
            }
        });
    }

    handleSecureMessage(event) {
        try {
            // Vérification de sécurité
            if (!this.isValidMessage(event)) {
                return;
            }

            const { type, data } = event.data;

            switch (type) {
                case 'GAME_PROJECT_OPEN':
                    this.handleProjectOpen(data.projectId);
                    break;

                case 'GAME_SCORE_UPDATE':
                    this.updateGameScore(data.score, data.coins);
                    break;

                case 'GAME_READY':
                    this.onGameReady();
                    break;

                case 'GAME_ERROR':
                    this.onGameError(data.message || 'Erreur inconnue du jeu');
                    break;

                case 'GAME_ACHIEVEMENT':
                    this.showAchievementEffect(data.message, data.type);
                    break;

                default:
                    console.warn('🎮 Unknown message type:', type);
            }

        } catch (error) {
            console.error('❌ Error handling game message:', error);
        }
    }

    isValidMessage(event) {
        // Vérifier l'origine
        if (!this.allowedOrigins.includes(event.origin)) {
            console.warn('⚠️ Message from unauthorized origin:', event.origin);
            return false;
        }

        // Vérifier la structure du message
        if (!event.data || typeof event.data !== 'object') {
            return false;
        }

        // Vérifier le type de message
        if (!this.allowedMessageTypes.includes(event.data.type)) {
            console.warn('⚠️ Invalid message type:', event.data.type);
            return false;
        }

        // Validation spécifique selon le type
        return this.validateMessageData(event.data);
    }

    validateMessageData(data) {
        switch (data.type) {
            case 'GAME_PROJECT_OPEN':
                return this.isValidProjectId(data.data?.projectId);

            case 'GAME_SCORE_UPDATE':
                return this.isValidScore(data.data?.score) &&
                    this.isValidScore(data.data?.coins);

            case 'GAME_ACHIEVEMENT':
                return typeof data.data?.message === 'string' &&
                    data.data.message.length > 0 &&
                    data.data.message.length < 200;

            default:
                return true;
        }
    }

    isValidProjectId(projectId) {
        return typeof projectId === 'string' &&
            projectId.length > 0 &&
            projectId.length < 50 &&
            /^[a-z-]+$/.test(projectId);
    }

    isValidScore(value) {
        return typeof value === 'number' &&
            value >= 0 &&
            value < 1000000;
    }

    handleProjectOpen(projectId) {
        try {
            // Ajouter aux statistiques
            this.gameStats.projectsVisited.add(projectId);

            // Ouvrir le modal de projet
            if (window.ProjectsManager) {
                window.ProjectsManager.openProjectModal(projectId);
                this.showGameNotification(`📂 Ouverture du projet: ${projectId}`, 'info');
            } else {
                this.showProjectFallback(projectId);
            }

            // Analytics
            this.trackProjectOpenFromGame(projectId);

        } catch (error) {
            console.error('❌ Error opening project:', error);
            this.showErrorNotification('Erreur lors de l\'ouverture du projet');
        }
    }

    showProjectFallback(projectId) {
        const notification = document.createElement('div');
        notification.className = 'game-notification game-project-fallback';
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-icon">📂</span>
                <h4>Projet: ${projectId}</h4>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <p>Système de modal des projets non disponible</p>
            <button class="notification-btn" onclick="window.location.href='#projects'">
                Voir les projets
            </button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    updateGameScore(score, coins) {
        // Mettre à jour les statistiques
        this.gameStats.score = Math.max(this.gameStats.score, score);
        this.gameStats.coins = Math.max(this.gameStats.coins, coins);

        // Affichage des achievements
        if (coins > 0 && coins % 10 === 0) {
            this.showAchievementEffect(`🏆 ${coins} pièces collectées !`, 'coins');
        }

        if (score > 0 && score % 1000 === 0) {
            this.showAchievementEffect(`🎯 Score de ${score} atteint !`, 'score');
        }

        console.log(`🎮 Score: ${score}, Coins: ${coins}`);
    }

    showAchievementEffect(message, type = 'default') {
        const achievement = document.createElement('div');
        achievement.className = `game-achievement achievement-${type}`;

        const icons = {
            coins: '🪙',
            score: '🎯',
            project: '📂',
            default: '🏆'
        };

        achievement.innerHTML = `
            <div class="achievement-icon">${icons[type] || icons.default}</div>
            <div class="achievement-text">${message}</div>
        `;

        document.body.appendChild(achievement);

        // Animation d'entrée
        setTimeout(() => {
            achievement.style.animation = 'achievementPop 3s ease-out forwards';
        }, 100);

        // Suppression automatique
        setTimeout(() => {
            if (achievement.parentNode) {
                achievement.remove();
            }
        }, 3000);

        // Son d'achievement (si disponible)
        this.playAchievementSound();
    }

    showGameNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `game-notification notification-${type}`;

        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type]}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-suppression
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationSlideOut 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }

    showErrorNotification(message) {
        if (window.ProjectsManager) {
            window.ProjectsManager.showNotification(message, 'error');
        } else {
            this.showGameNotification(message, 'error');
        }
    }

    sendMessageToGame(message) {
        if (this.gameFrame && this.gameFrame.contentWindow && this.isGameLoaded) {
            try {
                this.gameFrame.contentWindow.postMessage(message, window.location.origin);
            } catch (error) {
                console.error('❌ Error sending message to game:', error);
            }
        }
    }

    pauseGame() {
        if (this.isGameLoaded && !this.isGamePaused) {
            this.sendMessageToGame({ type: 'GAME_PAUSE' });
            this.isGamePaused = true;
        }
    }

    resumeGame() {
        if (this.isGameLoaded && this.isGamePaused) {
            this.sendMessageToGame({ type: 'GAME_RESUME' });
            this.isGamePaused = false;
        }
    }

    toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                this.gameContainer.requestFullscreen?.() ||
                this.gameContainer.webkitRequestFullscreen?.() ||
                this.gameContainer.mozRequestFullScreen?.();

                this.gameContainer.classList.add('fullscreen');
            } else {
                document.exitFullscreen?.() ||
                document.webkitExitFullscreen?.() ||
                document.mozCancelFullScreen?.();

                this.gameContainer.classList.remove('fullscreen');
            }
        } catch (error) {
            console.error('❌ Fullscreen error:', error);
            this.showErrorNotification('Erreur lors du passage en plein écran');
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseGame();
        } else if (this.isGameMode) {
            this.resumeGame();
        }
    }

    handleResize() {
        if (this.isGameMode && this.isGameLoaded) {
            this.sendMessageToGame({
                type: 'WINDOW_RESIZE',
                data: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            });
        }
    }

    handleGlobalError(event) {
        if (this.isGameMode) {
            console.error('🎮 Global error in game mode:', event.error);
            this.showErrorNotification('Une erreur est survenue dans le jeu');
        }
    }

    onGameReady() {
        console.log('🎮 Game is ready');
        this.showGameNotification('🎮 Jeu prêt ! Explorez le monde 3D !', 'success');
    }

    playAchievementSound() {
        // Son d'achievement simple (si les sons sont activés)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);

        } catch (error) {
            // Son non disponible, pas grave
        }
    }

    getProjectsList() {
        // Intégration avec le système de projets existant
        const projects = [
            {
                id: 'gestion-vols',
                name: 'Gestion des vols - GESTION\'AIR',
                description: 'Application C pour gestion des vols commerciaux',
                technologies: ['C', 'Algorithmique', 'Structures de données'],
                position: { x: 20, z: 20 },
                color: 0xFF6B6B,
                icon: '💻'
            },
            {
                id: 'transport-propre',
                name: 'Université & Transports Propres',
                description: 'Site web responsive pour mobilité durable',
                technologies: ['HTML5', 'CSS3', 'Responsive Design'],
                position: { x: -20, z: 20 },
                color: 0x4ECDC4,
                icon: '🌱'
            },
            {
                id: 'planification-aerien',
                name: 'Planification Transport Aérien',
                description: 'Système Java de gestion d\'espace aérien',
                technologies: ['Java', 'Graphstream', 'Algorithmes'],
                position: { x: 20, z: -20 },
                color: 0x45B7D1,
                icon: '✈️'
            },
            {
                id: 'street-fighter',
                name: 'Jeu de Combat Street Fighter',
                description: 'Jeu de combat en Python avec Pygame',
                technologies: ['Python', 'Pygame', 'Game Design'],
                position: { x: -20, z: -20 },
                color: 0xF093FB,
                icon: '🥊'
            },
            {
                id: 'app-communicante',
                name: 'Application Communicante',
                description: 'Plateforme collaborative PHP',
                technologies: ['PHP', 'JavaScript', 'SQL'],
                position: { x: 0, z: 30 },
                color: 0xA8EDEA,
                icon: '💬'
            }
        ];

        return projects;
    }

    getCurrentTheme() {
        return {
            primary: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
            accent: getComputedStyle(document.documentElement).getPropertyValue('--accent'),
            isDarkMode: document.body.classList.contains('dark-mode')
        };
    }

    initializeGameStats() {
        this.gameStats = {
            score: 0,
            coins: 0,
            timeStarted: null,
            projectsVisited: new Set(),
            achievements: []
        };
    }

    getGameStats() {
        return {
            ...this.gameStats,
            timeSpent: this.gameStats.timeStarted ?
                Date.now() - this.gameStats.timeStarted : 0,
            projectsVisitedCount: this.gameStats.projectsVisited.size
        };
    }

    trackModeSwitch(mode) {
        console.log(`📊 Mode switched to: ${mode}`);

        if (typeof gtag !== 'undefined') {
            gtag('event', 'mode_switch', {
                'mode': mode,
                'section': 'projects',
                'timestamp': Date.now()
            });
        }
    }

    trackProjectOpenFromGame(projectId) {
        console.log(`📊 Project opened from game: ${projectId}`);

        if (typeof gtag !== 'undefined') {
            gtag('event', 'project_open_game', {
                'project_id': projectId,
                'source': 'mario_3d_game',
                'game_stats': this.getGameStats()
            });
        }
    }

    destroy() {
        try {
            // Nettoyer les event listeners
            window.removeEventListener('message', this.messageHandler);
            document.removeEventListener('visibilitychange', this.visibilityHandler);
            window.removeEventListener('resize', this.resizeHandler);

            // Arrêter le jeu
            if (this.isGameLoaded) {
                this.sendMessageToGame({ type: 'GAME_DESTROY' });
            }

            // Nettoyer les éléments DOM
            if (this.gameFrame && this.gameFrame.parentNode) {
                this.gameFrame.remove();
            }

            if (this.loadingElement && this.loadingElement.parentNode) {
                this.loadingElement.remove();
            }

            // Nettoyer les notifications
            document.querySelectorAll('.game-notification, .game-achievement').forEach(el => {
                el.remove();
            });

            console.log('🎮 GameModeManager destroyed');

        } catch (error) {
            console.error('❌ Error destroying GameModeManager:', error);
        }
    }
}

// Styles CSS nécessaires (ajoutés dynamiquement)
const gameAnimationStyles = document.createElement('style');
gameAnimationStyles.textContent = `
    @keyframes gameSlideIn {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    @keyframes gameSlideOut {
        from {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        to {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
        }
    }
    
    @keyframes notificationSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes notificationSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes achievementPop {
        0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
        }
        80% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }
    
    .game-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #0a0a0a, #1a1a2e);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        border-radius: var(--border-radius-xl);
        color: white;
    }
    
    .loading-title-game {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 30px;
        background: linear-gradient(45deg, #FFD700, #FFA500);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: glowTitle 2s ease-in-out infinite;
    }
    
    .loading-progress-game {
        width: 300px;
        height: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 20px;
    }
    
    .loading-bar-game {
        height: 100%;
        background: linear-gradient(90deg, #FFD700, #FFA500);
        border-radius: 10px;
        width: 0%;
        transition: width 0.3s ease;
        animation: progressShine 2s infinite;
    }
    
    .loading-text-game {
        font-size: 18px;
        color: #FFD700;
        text-align: center;
        margin-bottom: 20px;
    }
    
    .loading-tips {
        color: #ccc;
        font-size: 14px;
        text-align: center;
        opacity: 0.8;
    }
    
    .fullscreen-toggle {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid #FFD700;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 20;
        color: #FFD700;
        font-size: 20px;
    }
    
    .fullscreen-toggle:hover {
        background: rgba(255, 215, 0, 0.2);
        transform: scale(1.1);
    }
    
    .game-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        border: 2px solid #FFD700;
        z-index: 10000;
        max-width: 350px;
        animation: notificationSlideIn 0.3s ease-out;
    }
    
    .game-achievement {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #FFD700, #FFA500);
        color: #000;
        padding: 20px 30px;
        border-radius: 15px;
        font-weight: bold;
        font-size: 18px;
        z-index: 10001;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        text-align: center;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    @keyframes glowTitle {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.3); }
    }
    
    @keyframes progressShine {
        0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
        50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
        100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
    }
`;

document.head.appendChild(gameAnimationStyles);

// Initialisation automatique
let gameModeManager;

document.addEventListener('DOMContentLoaded', () => {
    try {
        gameModeManager = new GameModeManager();

        // Rendre disponible globalement pour l'intégration
        window.GameModeManager = gameModeManager;

        console.log('🎮 Game Mode initialized successfully');

    } catch (error) {
        console.error('❌ Failed to initialize Game Mode:', error);
    }
});

// Gestion de la fermeture de la page
window.addEventListener('beforeunload', () => {
    if (gameModeManager) {
        gameModeManager.destroy();
    }
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameModeManager;
}