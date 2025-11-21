// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Throttle function for scroll
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

// Counter Animation for Stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate counters when stats section is visible
            if (entry.target.classList.contains('stat-number')) {
                if (!entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            }
        }
    });
}, observerOptions);

// Observe stat numbers
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    // Parallax effect for floating shapes (optimized with throttle)
    const floatingShapes = document.querySelectorAll('.floating-shape');
    const illustrations = document.querySelectorAll('.illustration');
    
    const handleParallax = throttle(() => {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            floatingShapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.3;
                shape.style.transform = `translate3d(0, ${rate * speed}px, 0)`;
            });
            
            illustrations.forEach((ill, index) => {
                const speed = (index + 1) * 0.2;
                ill.style.transform = `translate3d(0, ${rate * speed}px, 0)`;
            });
        });
    }, 16);
    
    window.addEventListener('scroll', handleParallax, { passive: true });
    
    // Mouse move parallax effect (optimized)
    const hero = document.querySelector('.hero');
    if (hero) {
        let mouseX = 0;
        let mouseY = 0;
        let rafId = null;
        
        const updateParallax = () => {
            floatingShapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                shape.style.transform = `translate3d(${mouseX * speed}px, ${mouseY * speed}px, 0)`;
            });
            
            illustrations.forEach((ill, index) => {
                const speed = (index + 1) * 0.3;
                ill.style.transform = `translate3d(${mouseX * speed}px, ${mouseY * speed}px, 0)`;
            });
            
            rafId = null;
        };
        
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { width, height } = hero.getBoundingClientRect();
            mouseX = (clientX / width - 0.5) * 20;
            mouseY = (clientY / height - 0.5) * 20;
            
            if (!rafId) {
                rafId = requestAnimationFrame(updateParallax);
            }
        }, { passive: true });
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
    
    // Add ripple effect styles dynamically
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
    
    // Text reveal animation on scroll
    const textElements = document.querySelectorAll('.hero-title, .hero-description');
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.2 });
    
    textElements.forEach(el => textObserver.observe(el));
    
    // Logo hover effect
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('mouseenter', () => {
            const arcs = document.querySelectorAll('.arc');
            arcs.forEach(arc => {
                arc.style.animationDuration = '0.5s';
            });
        });
        
        logoContainer.addEventListener('mouseleave', () => {
            const arcs = document.querySelectorAll('.arc');
            arcs.forEach((arc, index) => {
                const durations = ['3s', '4s', '2.5s'];
                arc.style.animationDuration = durations[index];
            });
        });
    }
    
    // Optimized cursor trail effect
    let cursorTrail = [];
    const maxTrailLength = 5; // Reduced from 10 for better performance
    let lastMouseX = 0;
    let lastMouseY = 0;
    let animationFrame = null;
    
    const updateCursorTrail = () => {
        // Clean up old trails
        cursorTrail.forEach((trail, index) => {
            if (trail && trail.parentNode) {
                const opacity = parseFloat(trail.style.opacity) || 1;
                if (opacity <= 0) {
                    trail.parentNode.removeChild(trail);
                    cursorTrail.splice(index, 1);
                }
            }
        });
        
        if (cursorTrail.length > 0) {
            animationFrame = requestAnimationFrame(updateCursorTrail);
        } else {
            animationFrame = null;
        }
    };
    
    document.addEventListener('mousemove', (e) => {
        // Throttle mouse events
        const now = Date.now();
        if (Math.abs(e.clientX - lastMouseX) < 3 && Math.abs(e.clientY - lastMouseY) < 3) {
            return;
        }
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        if (cursorTrail.length >= maxTrailLength) {
            const oldTrail = cursorTrail.shift();
            if (oldTrail && oldTrail.parentNode) {
                oldTrail.style.opacity = '0';
                setTimeout(() => {
                    if (oldTrail.parentNode) {
                        oldTrail.parentNode.removeChild(oldTrail);
                    }
                }, 200);
            }
        }
        
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 68, 68, 0.6), rgba(74, 144, 226, 0.3));
            pointer-events: none;
            left: ${e.clientX - 3}px;
            top: ${e.clientY - 3}px;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.4s ease-out;
            will-change: opacity, transform;
        `;
        document.body.appendChild(trail);
        
        cursorTrail.push(trail);
        
        // Start animation loop if not running
        if (!animationFrame) {
            animationFrame = requestAnimationFrame(updateCursorTrail);
        }
        
        // Fade out after delay
        setTimeout(() => {
            if (trail.parentNode) {
                trail.style.opacity = '0';
                setTimeout(() => {
                    if (trail.parentNode) {
                        trail.parentNode.removeChild(trail);
                    }
                }, 400);
            }
        }, 150);
    }, { passive: true });
    
    // Services Section Scroll Animations
    const servicesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Animate services elements on scroll
    const servicesElements = document.querySelectorAll('.feature-box, .service-card, .services-heading-wrapper, .services-intro');
    servicesElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        servicesObserver.observe(el);
    });
    
    // Add hover animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animate feature boxes on hover
    const featureBoxes = document.querySelectorAll('.feature-box');
    featureBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon-circle');
            if (icon) {
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.animation = 'iconPulse 2s ease-in-out infinite';
                }, 10);
            }
        });
    });
    
    // Parallax effect for background shapes
    const bgShapes = document.querySelectorAll('.bg-shape');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const servicesSection = document.querySelector('.services');
        if (servicesSection) {
            const rect = servicesSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                    bgShapes.forEach((shape, index) => {
                        const speed = (index + 1) * 0.2;
                        const offset = (scrolled - rect.top) * speed;
                        shape.style.transform = `translate3d(0, ${offset}px, 0)`;
                    });
            }
        }
    });
    
    // Animate floating elements on card hover
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const floatElements = this.querySelectorAll('.float-element');
            floatElements.forEach((el, index) => {
                el.style.animation = 'none';
                setTimeout(() => {
                    el.style.animation = `floatAround 4s ease-in-out infinite ${index * 0.5}s`;
                }, 10);
            });
        });
    });
    
    // Add tilt effect to service cards
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
    
    // Animate badges on scroll
    const badges = document.querySelectorAll('.service-badge');
    badges.forEach((badge, index) => {
        badge.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add ripple effect to feature boxes
    featureBoxes.forEach(box => {
        box.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add style for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .feature-box {
            position: relative;
            overflow: hidden;
        }
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(74, 144, 226, 0.3);
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
    document.head.appendChild(rippleStyle);
    
    // Process Section Timeline Animations
    const processSection = document.querySelector('.process');
    if (processSection) {
        const processSteps = document.querySelectorAll('.process-step');
        const timelineProgress = document.querySelector('.timeline-progress');
        
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate timeline progress
                    let activeStep = 0;
                    const stepObserver = new IntersectionObserver((stepEntries) => {
                        stepEntries.forEach(stepEntry => {
                            if (stepEntry.isIntersecting) {
                                const step = stepEntry.target;
                                const stepNumber = parseInt(step.getAttribute('data-step'));
                                
                                // Remove active class from all steps
                                processSteps.forEach(s => s.classList.remove('active'));
                                
                                // Add active class to current and previous steps
                                for (let i = 1; i <= stepNumber; i++) {
                                    const currentStep = document.querySelector(`[data-step="${i}"]`);
                                    if (currentStep) {
                                        currentStep.classList.add('active');
                                    }
                                }
                                
                                // Update timeline progress
                                const progress = (stepNumber / processSteps.length) * 100;
                                if (timelineProgress) {
                                    timelineProgress.style.height = progress + '%';
                                }
                                
                                activeStep = Math.max(activeStep, stepNumber);
                            }
                        });
                    }, {
                        threshold: 0.5,
                        rootMargin: '-100px 0px -100px 0px'
                    });
                    
                    // Observe each step
                    processSteps.forEach(step => {
                        stepObserver.observe(step);
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
                const dot = this.querySelector('.step-dot');
                if (dot) {
                    dot.style.transform = 'scale(1.2)';
                }
            });
            
            step.addEventListener('mouseleave', function() {
                const dot = this.querySelector('.step-dot');
                if (dot && !this.classList.contains('active')) {
                    dot.style.transform = 'scale(1)';
                }
            });
        });
        
        // Parallax effect for visual image (optimized)
        const visualImage = document.querySelector('.visual-image');
        if (visualImage) {
            const handleVisualParallax = throttle(() => {
                requestAnimationFrame(() => {
                    const rect = processSection.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const scrolled = window.pageYOffset;
                        const rate = (scrolled - rect.top) * 0.3;
                        visualImage.style.transform = `translate3d(0, ${rate}px, 0)`;
                    }
                });
            }, 16);
            
            window.addEventListener('scroll', handleVisualParallax, { passive: true });
        }
        
        // Animate floating dots on scroll (optimized)
        const dots = document.querySelectorAll('.dot');
        const handleDotsParallax = throttle(() => {
            requestAnimationFrame(() => {
                const rect = processSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const scrolled = window.pageYOffset;
                    dots.forEach((dot, index) => {
                        const speed = (index + 1) * 0.1;
                        const offset = (scrolled - rect.top) * speed;
                        dot.style.transform = `translate3d(0, ${offset}px, 0)`;
                    });
                }
            });
        }, 16);
        
        window.addEventListener('scroll', handleDotsParallax, { passive: true });
    }
    
    // Pricing Section Animations
    const pricingSection = document.querySelector('.pricing');
    if (pricingSection) {
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        const pricingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate cards on scroll
                    pricingCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    
                    // Animate features
                    const allFeatures = document.querySelectorAll('.plan-features li');
                    allFeatures.forEach((feature, index) => {
                        setTimeout(() => {
                            feature.style.opacity = '1';
                            feature.style.transform = 'translateX(0)';
                        }, 500 + (index * 50));
                    });
                }
            });
        }, {
            threshold: 0.2
        });
        
        // Initialize cards as hidden
        pricingCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });
        
        pricingObserver.observe(pricingSection);
        
        // Add click animation to buttons
        const planButtons = document.querySelectorAll('.plan-button');
        planButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('button-ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add tilt effect to pricing cards
        pricingCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;
                
                if (!this.classList.contains('featured')) {
                    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
                } else {
                    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.07)`;
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (this.classList.contains('featured')) {
                    this.style.transform = 'scale(1.05)';
                } else {
                    this.style.transform = 'translateY(0) scale(1)';
                }
            });
        });
        
        // Add button ripple style
        const buttonRippleStyle = document.createElement('style');
        buttonRippleStyle.textContent = `
            .plan-button {
                position: relative;
                overflow: hidden;
            }
            .button-ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: button-ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes button-ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(buttonRippleStyle);
    }
    
    // Clients Slider Enhancements
    const clientsSlider = document.querySelector('.clients-slider');
    if (clientsSlider) {
        const sliderTrack = document.querySelector('.slider-track');
        const sliderItems = document.querySelectorAll('.slider-item');
        
        // Add scroll animation observer
        const sliderObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Ensure animation is running
                    if (sliderTrack) {
                        sliderTrack.style.animationPlayState = 'running';
                    }
                }
            });
        }, {
            threshold: 0.1
        });
        
        sliderObserver.observe(clientsSlider);
        
        // Add hover effects to individual logos
        const companyLogos = document.querySelectorAll('.company-logo');
        companyLogos.forEach(logo => {
            logo.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.05)';
            });
            
            logo.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Optional: Add click interaction
        companyLogos.forEach(logo => {
            logo.addEventListener('click', function() {
                // Add a pulse effect
                this.style.animation = 'logoPulse 0.5s ease-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
            });
        });
        
        // Add logo pulse animation style
        const logoPulseStyle = document.createElement('style');
        logoPulseStyle.textContent = `
            @keyframes logoPulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(logoPulseStyle);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
