// projects.js - Gestion des projets et modals

// Données des projets
const projectsData = {
    'gestion-vols': {
        title: 'Gestion des vols - GESTION\'AIR',
        icon: '💻',
        technologies: ['C', 'Algorithmique', 'Structures de données', 'Gestion mémoire'],
        description: 'Application complète développée en langage C pour la gestion des vols commerciaux à l\'aéroport Grenoble Alpes Isère. Le système permet un suivi en temps réel des informations de vol et optimise l\'utilisation des infrastructures aéroportuaires.',
        features: [
            'Affichage dynamique des horaires de vol en temps réel',
            'Système de recherche avancée par compagnie, destination ou heure',
            'Gestion automatisée des retards et annulations',
            'Optimisation de l\'utilisation des pistes de décollage',
            'Affichage des listes de passagers par salle d\'embarquement',
            'Interface utilisateur intuitive avec tableaux dédiés'
        ],
        status: 'completed',
        // Chemin vers l’archive du projet (à placer dans le dossier "file")
        downloadLink: 'file/projet c.zip',
        // Document associé (à placer également dans le dossier "file")
        documentLink: 'file/C.pdf',
        year: '2023-2024'
        ,
        // Compétences mobilisées pour ce projet
        competences: [
            'Réaliser un développement d’application',
            'Optimiser des applications informatiques',
            'Administrer des systèmes informatiques communicants complexes',
            'Conduire un projet'
        ]
    },
    'transport-propre': {
        title: 'Université & Transports Propres',
        icon: '🌱',
        technologies: ['HTML5', 'CSS3', 'Responsive Design', 'UI/UX'],
        description: 'Site web responsive développé pour promouvoir les initiatives universitaires en faveur des transports durables et de la mobilité écologique. Le projet met l\'accent sur la sensibilisation environnementale.',
        features: [
            'Design responsive optimisé pour tous les appareils',
            'Galeries d\'images interactives présentant les initiatives',
            'Navigation intuitive et expérience utilisateur fluide',
            'Sections dédiées aux différents moyens de transport écologiques',
            'Optimisation des performances et temps de chargement',
            'Interface moderne respectant les standards d\'accessibilité'
        ],
        status: 'completed',
        // Archive du site à télécharger (dossier "file")
        downloadLink: 'file/projet site.zip',
        year: '2023'
        ,
        // Compétences mobilisées pour ce projet
        competences: [
            'Réaliser un développement d’application',
            'Gérer des données de l’information',
            'Conduire un projet'
        ]
    },
    'planification-aerien': {
        title: 'Planification Transport Aérien',
        icon: '✈️',
        technologies: ['Java', 'Graphstream', 'Algorithmes de graphe', 'Interface graphique'],
        description: 'Système sophistiqué de gestion de l\'espace aérien français utilisant la théorie des graphes et les algorithmes de coloration pour minimiser les conflits entre trajectoires de vol.',
        features: [
            'Modélisation avancée par graphe d\'intersection des trajectoires',
            'Implémentation d\'algorithmes de coloration optimisés',
            'Visualisation interactive des graphes avec Graphstream',
            'Interface graphique complète pour la configuration',
            'Système de statistiques et d\'évaluation des performances',
            'Gestion des fichiers CSV pour les données d\'entrée',
            'Export des résultats pour analyse approfondie'
        ],
        status: 'completed',
        // Archive du projet Java (dossier "file")
        downloadLink: 'file/projet java.zip',
        // Sujet officiel du projet (PDF à placer dans "file")
        documentLink: 'file/Sujet2024-_5_-_1_.pdf',
        year: '2024'
        ,
        // Compétences mobilisées pour ce projet
        competences: [
            'Réaliser un développement d’application',
            'Optimiser des applications informatiques',
            'Conduire un projet',
            'Gérer des données de l’information'
        ]
    },
    'street-fighter': {
        title: 'Jeu de Combat Street Fighter',
        icon: '🥊',
        technologies: ['Python', 'Pygame', 'Game Design', 'Animations'],
        description: 'Jeu de combat complet inspiré de l\'univers Street Fighter, développé en Python avec Pygame. Le projet intègre des mécaniques de jeu avancées et une expérience utilisateur immersive.',
        features: [
            'Système de combat fluide avec détection de collisions précise',
            'Animations de personnages et effets visuels dynamiques',
            'Implémentation de coups spéciaux et combos',
            'Plusieurs environnements de combat interactifs',
            'Interface de configuration complète des contrôles',
            'Système de barres de vie et indicateurs de statut',
            'Menu principal et écrans de sélection'
        ],
        status: 'completed',
        // Archive du jeu Python à télécharger (dossier "file")
        downloadLink: 'file/street-fighter.zip',
        playableDemo: false,
        year: '2023-2024'
        ,
        // Compétences mobilisées pour ce projet
        competences: [
            'Réaliser un développement d’application',
            'Optimiser des applications informatiques',
            'Conduire un projet'
        ]
    },
    'app-communicante': {
        title: 'Application Communicante',
        icon: '💬',
        technologies: ['PHP', 'JavaScript', 'SQL', 'Gestion de projet'],
        description: 'Plateforme collaborative complète permettant aux utilisateurs de gérer leurs contenus multimédias (films, séries, livres) et d\'interagir au sein d\'une communauté active.',
        features: [
            'Système d\'authentification sécurisé et gestion des comptes',
            'Catalogue complet de contenus multimédias',
            'Fonctionnalités communautaires et système d\'avis',
            'Interface responsive et intuitive',
            'Base de données relationnelle optimisée',
            'Architecture MVC avec framework moderne',
            'API RESTful pour les interactions'
        ],
        status: 'in-progress',
        // Archive du projet web (dossier "file")
        downloadLink: 'file/app-communicante.zip',
        // Cahier des charges du projet (PDF à placer dans "file")
        documentLink: 'file/cahier des charge.pdf',
        year: '2024-2025'
        ,
        // Compétences mobilisées pour ce projet
        competences: [
            'Réaliser un développement d’application',
            'Optimiser des applications informatiques',
            'Administrer des systèmes informatiques communicants complexes',
            'Gérer des données de l’information',
            'Conduire un projet'
        ]
    }
};

// Initialisation des projets
document.addEventListener('DOMContentLoaded', function() {
    initializeProjects();
});

function initializeProjects() {
    initModeToggle();
    initProjectCards();
    initProjectModal();
}

// Gestion du toggle entre modes
function initModeToggle() {
    const modeButtons = document.querySelectorAll('.mode-btn');
    const cardsMode = document.getElementById('cardsMode');
    const gameMode = document.getElementById('gameMode');

    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-mode');

            // Update button states
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch modes
            if (mode === 'cards') {
                cardsMode.classList.add('active');
                gameMode.classList.remove('active');
            } else {
                gameMode.classList.add('active');
                cardsMode.classList.remove('active');
            }

            // Analytics
            trackModeSwitch(mode);
        });
    });
}

// Gestion des cartes de projet
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const projectId = card.getAttribute('data-project');
        const projectBtn = card.querySelector('.project-btn');

        if (projectBtn) {
            projectBtn.addEventListener('click', () => {
                openProjectModal(projectId);
            });
        }

        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Gestion de la modal des projets
function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = modal.querySelector('.modal-overlay');

    // Close modal events
    modalClose.addEventListener('click', closeProjectModal);
    modalOverlay.addEventListener('click', closeProjectModal);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
}

// Ouvrir la modal d'un projet
function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const projectData = projectsData[projectId];

    if (!projectData) {
        console.error('Project data not found for:', projectId);
        return;
    }

    // Generate modal content
    modalBody.innerHTML = generateModalContent(projectData);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Initialize modal interactions
    initModalInteractions(projectData);

    // Analytics
    trackProjectView(projectId);
}

// Fermer la modal
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Générer le contenu de la modal
function generateModalContent(project) {
    const statusBadge = project.status === 'completed'
        ? '<span class="status-badge completed">✓ Terminé</span>'
        : '<span class="status-badge in-progress">🔄 En développement</span>';

    const techTags = project.technologies.map(tech =>
        `<span class="tech-tag">${tech}</span>`
    ).join('');

    const featuresList = project.features.map(feature =>
        `<li>${feature}</li>`
    ).join('');

    // Générer la section des compétences si disponible
    let competencesSection = '';
    if (project.competences && Array.isArray(project.competences) && project.competences.length > 0) {
        const competencesList = project.competences.map(comp => `<li>${comp}</li>`).join('');
        competencesSection = `
        <div class="modal-competences">
            <h3>🧠 Compétences mobilisées</h3>
            <ul>
                ${competencesList}
            </ul>
        </div>
        `;
    }

    const actions = generateModalActions(project);

    return `
        <div class="modal-header">
            <h2 class="modal-title">
                ${project.icon} ${project.title}
                ${statusBadge}
            </h2>
            <div class="modal-tech">
                ${techTags}
            </div>
            <p class="modal-description">${project.description}</p>
            <div class="project-year">
                <strong>Période:</strong> ${project.year}
            </div>
        </div>
        
        <div class="modal-features">
            <h3>🎯 Fonctionnalités principales</h3>
            <ul>
                ${featuresList}
            </ul>
        </div>
        ${competencesSection}
        
        <div class="modal-actions">
            ${actions}
        </div>
    `;
}

// Générer les actions de la modal
function generateModalActions(project) {
    let actions = [];

    if (project.downloadLink && project.status === 'completed') {
        actions.push(`
            <a class="modal-btn modal-btn-primary download-btn" href="${project.downloadLink}">
                📥 Télécharger le projet
            </a>
        `);
    }

    if (project.documentLink) {
        actions.push(`
            <button class="modal-btn modal-btn-secondary doc-btn" data-file="${project.documentLink}">
                📄 Voir la documentation
            </button>
        `);
    }

    if (project.demoLink) {
        actions.push(`
            <button class="modal-btn modal-btn-secondary demo-btn" data-url="${project.demoLink}">
                🌐 Voir la démo
            </button>
        `);
    }

    if (project.playableDemo) {
        actions.push(`
            <button class="modal-btn modal-btn-secondary play-btn">
                🎮 Jouer au jeu
            </button>
        `);
    }

    if (project.status === 'in-progress') {
        actions.push(`
            <button class="modal-btn modal-btn-primary" disabled>
                🔄 Projet en cours de développement
            </button>
        `);
    }

    return actions.join('');
}

// Initialiser les interactions de la modal
function initModalInteractions(project) {
    // Download buttons
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const file = btn.getAttribute('data-file');
            handleDownload(file, project.title);
        });
    });

    // Document buttons
    const docBtns = document.querySelectorAll('.doc-btn');
    docBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const file = btn.getAttribute('data-file');
            handleDocumentView(file);
        });
    });

    // Demo buttons
    const demoBtns = document.querySelectorAll('.demo-btn');
    demoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-url');
            window.open(url, '_blank');
        });
    });

    // Play buttons
    const playBtns = document.querySelectorAll('.play-btn');
    playBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleGameLaunch(project.title);
        });
    });
}

// Gestion des téléchargements
function handleDownload(file, projectTitle) {
    // Simulate download (replace with actual download logic)
    showNotification(`Téléchargement de "${projectTitle}" en cours...`, 'info');

    // In a real implementation, you would:
    // window.location.href = file;
    // or use fetch to download the file

    setTimeout(() => {
        showNotification(`"${projectTitle}" téléchargé avec succès!`, 'success');
    }, 2000);

    trackDownload(file, projectTitle);
}

// Gestion de l'affichage des documents
function handleDocumentView(file) {
    // Open document in new tab
    window.open(file, '_blank');
    trackDocumentView(file);
}

// Gestion du lancement de jeu
function handleGameLaunch(gameTitle) {
    showNotification(`Lancement de "${gameTitle}"...`, 'info');

    // In a real implementation, you might:
    // - Open game in new window
    // - Load game iframe
    // - Launch WebGL game

    setTimeout(() => {
        showNotification('Jeu non disponible en démo web. Téléchargez le projet complet.', 'warning');
    }, 1500);
}

// Système de notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1rem 1.5rem;
        background: ${getNotificationColor(type)};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            removeNotification(notification);
        }
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    return colors[type] || colors.info;
}

// Analytics and tracking
function trackModeSwitch(mode) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'mode_switch', {
            'mode': mode,
            'section': 'projects'
        });
    }
}

function trackProjectView(projectId) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'project_view', {
            'project_id': projectId,
            'engagement_type': 'modal_open'
        });
    }
}

function trackDownload(file, projectTitle) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'file_download', {
            'file_name': file,
            'project_title': projectTitle
        });
    }
}

function trackDocumentView(file) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'document_view', {
            'file_name': file
        });
    }
}

// Export functions for use in other modules
window.ProjectsManager = {
    openProjectModal,
    closeProjectModal,
    showNotification
};