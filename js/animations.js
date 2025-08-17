// js/animations.js - Gestion des animations du portfolio

class AnimationManager {
    constructor() {
        this.observers = [];
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observer tous les éléments avec des classes d'animation
        this.observeElements();
    }

    observeElements() {
        const animatedElements = document.querySelectorAll(
            '.fade-in, .fade-in-up, .fade-in-left, .fade-in-right, .slide-in-left, .slide-in-right'
        );

        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }

    animateElement(element) {
        element.classList.add('visible');

        // Ajouter des délais pour les éléments dans une grille
        if (element.closest('.projects-grid, .skills-grid, .stats-grid')) {
            const siblings = Array.from(element.parentElement.children);
            const index = siblings.indexOf(element);
            element.style.transitionDelay = `${index * 0.1}s`;
        }
    }

    setupScrollAnimations() {
        let ticking = false;

        const updateAnimations = () => {
            this.updateParallax();
            this.updateProgressBars();
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        }, { passive: true });
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateProgressBars() {
        const progressBars = document.querySelectorAll('.skill-progress');
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < windowHeight && rect.bottom > 0;

            if (isVisible && !bar.classList.contains('animated')) {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
                bar.classList.add('animated');
            }
        });
    }

    setupHoverEffects() {
        // Cartes de projet
        this.setupProjectCardEffects();

        // Boutons
        this.setupButtonEffects();

        // Éléments de navigation
        this.setupNavEffects();
    }

    setupProjectCardEffects() {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, 'enter');
            });

            card.addEventListener('mouseleave', () => {
                this.animateCard(card, 'leave');
            });
        });
    }

    animateCard(card, action) {
        const overlay = card.querySelector('.project-overlay');
        const icon = card.querySelector('.project-icon');

        if (action === 'enter') {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';

            if (overlay) {
                overlay.style.opacity = '1';
            }

            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }

            this.createHoverParticles(card);

        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';

            if (overlay) {
                overlay.style.opacity = '0';
            }

            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        }
    }

    createHoverParticles(element) {
        const rect = element.getBoundingClientRect();

        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particleFloat 2s ease-out forwards;
            `;

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 2000);
        }
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn, .control-btn, .project-btn');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    setupNavEffects() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.animateNavLink(link, true);
            });

            link.addEventListener('mouseleave', () => {
                this.animateNavLink(link, false);
            });
        });
    }

    animateNavLink(link, isEnter) {
        if (isEnter) {
            link.style.transform = 'translateY(-2px)';
            this.createNavGlow(link);
        } else {
            link.style.transform = 'translateY(0)';
        }
    }

    createNavGlow(element) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary), transparent);
            animation: navGlow 0.3s ease-out forwards;
        `;

        element.style.position = 'relative';
        element.appendChild(glow);

        setTimeout(() => {
            if (glow.parentNode) {
                glow.remove();
            }
        }, 300);
    }

    setupLoadingAnimations() {
        // Animation du logo au chargement
        this.animateLogoOnLoad();

        // Animation des éléments critiques
        this.animateCriticalElements();
    }

    animateLogoOnLoad() {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'scale(0.8)';

            setTimeout(() => {
                logo.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                logo.style.opacity = '1';
                logo.style.transform = 'scale(1)';
            }, 200);
        }
    }

    animateCriticalElements() {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.opacity = '0';

            setTimeout(() => {
                hero.style.transition = 'opacity 1s ease-out';
                hero.style.opacity = '1';
            }, 100);
        }
    }

    // Méthodes utilitaires pour animations personnalisées
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-out`;

        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = '0';

        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    slideIn(element, direction = 'up', duration = 400) {
        const directions = {
            up: 'translateY(30px)',
            down: 'translateY(-30px)',
            left: 'translateX(30px)',
            right: 'translateX(-30px)'
        };

        element.style.opacity = '0';
        element.style.transform = directions[direction];
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0)';
        }, 10);
    }

    bounce(element, intensity = 10) {
        element.style.animation = `bounce 0.6s ease`;

        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }

    pulse(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;

        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    shake(element, intensity = 10) {
        element.style.animation = `shake 0.5s ease-in-out`;

        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // Animation de typing pour les textes
    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;

        const typing = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        };

        typing();
    }

    // Animation de compteur
    countUp(element, target, duration = 2000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const updateCount = () => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
            } else {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCount);
            }
        };

        updateCount();
    }

    // Nettoyage
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }

        // Supprimer les event listeners si nécessaire
        window.removeEventListener('scroll', this.handleScroll);
    }
}

// Ajouter les keyframes CSS nécessaires
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes navGlow {
        to {
            width: 100%;
        }
    }
    
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
        }
        40%, 43% {
            transform: translate3d(0, -10px, 0);
        }
        70% {
            transform: translate3d(0, -5px, 0);
        }
        90% {
            transform: translate3d(0, -2px, 0);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes shake {
        0%, 100% {
            transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
        }
        20%, 40%, 60%, 80% {
            transform: translateX(5px);
        }
    }
`;

document.head.appendChild(animationStyles);

// Initialiser le gestionnaire d'animations
let animationManager;

document.addEventListener('DOMContentLoaded', () => {
    animationManager = new AnimationManager();

    // Rendre disponible globalement
    window.AnimationManager = animationManager;
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    if (animationManager) {
        // Réinitialiser les animations si nécessaire
        animationManager.observeElements();
    }
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}