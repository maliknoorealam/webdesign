// Services Page JavaScript with Animations

// Counter Animation for Stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Animate stat bars
function animateStatBars() {
    const statBars = document.querySelectorAll('.stat-bar-fill-pro');
    statBars.forEach(bar => {
        bar.style.width = '100%';
    });
}

// Intersection Observer for animations
const servicesObserverOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const servicesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate counters when stats section is visible
            if (entry.target.classList.contains('stat-value-pro')) {
                if (!entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                    // Animate stat bars
                    setTimeout(() => {
                        animateStatBars();
                    }, 500);
                }
            }
        }
    });
}, servicesObserverOptions);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Observe stat numbers
    const statValues = document.querySelectorAll('.stat-value-pro');
    statValues.forEach(stat => {
        servicesObserver.observe(stat);
    });
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card-pro');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        servicesObserver.observe(card);
    });
    
    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card-pro');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease-out ${index * 0.15}s, transform 0.6s ease-out ${index * 0.15}s`;
        servicesObserver.observe(card);
    });
    
    // Process steps animations
    const processSection = document.querySelector('.process-section-pro');
    if (processSection) {
        const processSteps = document.querySelectorAll('.process-step-pro');
        
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    processSteps.forEach((step, index) => {
                        setTimeout(() => {
                            step.style.opacity = '1';
                            step.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.2
        });
        
        processObserver.observe(processSection);
        
        // Add hover effects to steps
        processSteps.forEach(step => {
            step.addEventListener('mouseenter', function() {
                const number = this.querySelector('.step-number-pro');
                if (number) {
                    number.style.transform = 'scale(1.15) rotate(360deg)';
                }
            });
            
            step.addEventListener('mouseleave', function() {
                const number = this.querySelector('.step-number-pro');
                if (number && !this.classList.contains('active')) {
                    number.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Button click animations
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple effect styles
    const style = document.createElement('style');
    style.textContent = `
        button {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Parallax effect for hero image
    const heroImageWrapper = document.querySelector('.hero-pro-image-wrapper');
    if (heroImageWrapper) {
        window.addEventListener('scroll', throttle(() => {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const heroSection = document.querySelector('.services-hero-pro');
                if (heroSection) {
                    const rect = heroSection.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const rate = (scrolled - rect.top) * 0.2;
                        heroImageWrapper.style.transform = `translate3d(0, ${rate}px, 0)`;
                    }
                }
            });
        }, 16), { passive: true });
    }
    
    // Animate stats image from top to middle when section is in view
    const statsImage = document.querySelector('.stats-visual-image');
    const statsSection = document.querySelector('.stats-section-pro');
    
    if (statsImage && statsSection) {
        const statsImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statsImage.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px'
        });
        
        statsImageObserver.observe(statsSection);
    }
    
    // Add tilt effect to service cards
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            if (this.classList.contains('large')) {
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.01)`;
            } else {
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.01)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('large')) {
                this.style.transform = 'translateY(0) scale(1)';
            } else {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Feature cards hover animations
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon-pro');
            if (icon) {
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 10);
            }
        });
    });
    
    // Service link animations
    const serviceLinks = document.querySelectorAll('.service-link-pro');
    serviceLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const svg = this.querySelector('svg');
            if (svg) {
                svg.style.transform = 'translateX(5px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const svg = this.querySelector('svg');
            if (svg) {
                svg.style.transform = 'translateX(0)';
            }
        });
    });
});

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}