// Scroll Animation System
(function() {
    'use strict';
    
    // Configuration
    const config = {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1,
        mobileReducedMotion: window.matchMedia('(max-width: 768px)').matches
    };
    
    // Initialize animations
    function initScrollAnimations() {
        // Add animation classes to elements
        addAnimationClasses();
        
        // Create intersection observer
        const animationObserver = new IntersectionObserver(handleIntersection, {
            rootMargin: config.rootMargin,
            threshold: config.threshold
        });
        
        // Observe all animatable elements
        const animatableElements = document.querySelectorAll('.animate-on-scroll, .stagger-animation, .counter, .line-animation, .blur-reveal, .text-reveal, .glow-on-scroll');
        animatableElements.forEach(el => animationObserver.observe(el));
        
        // Initialize parallax scrolling
        initParallax();
        
        // Initialize number counters
        initCounters();
        
        // Initialize floating animations
        initFloatingAnimations();
    }
    
    // Add animation classes to elements
    function addAnimationClasses() {
        // Hero elements
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.querySelector('h1')?.classList.add('animate-on-scroll', 'fade-up');
            heroContent.querySelector('p')?.classList.add('animate-on-scroll', 'fade-up', 'delay-1');
            heroContent.querySelector('.hero-buttons')?.classList.add('animate-on-scroll', 'fade-up', 'delay-2');
        }
        
        // Section headers
        document.querySelectorAll('.section-header').forEach((header, index) => {
            header.querySelector('h2')?.classList.add('animate-on-scroll', 'fade-down');
            header.querySelector('p')?.classList.add('animate-on-scroll', 'fade-up', 'delay-1');
        });
        
        // Cards with stagger effect
        document.querySelectorAll('.why-card, .product-card, .feature-card').forEach((card, index) => {
            card.classList.add('stagger-animation', `delay-${(index % 4) + 1}`, 'hover-lift');
        });
        
        // Process steps
        document.querySelectorAll('.process-step').forEach((step, index) => {
            step.classList.add('stagger-animation', `delay-${index + 1}`);
            step.querySelector('.step-number')?.classList.add('scale-up');
        });
        
        // Benefit items
        document.querySelectorAll('.benefit-item, .join-benefit').forEach((item, index) => {
            item.classList.add('animate-on-scroll', 'fade-left', `delay-${(index % 3) + 1}`);
        });
        
        // Images with blur effect
        document.querySelectorAll('.benefits-image, .join-image').forEach(img => {
            if (img.classList.contains('join-image')) {
                // Already has blur-reveal class added in HTML
            } else {
                img.classList.add('reveal-animation');
            }
        });
        
        // Stats
        document.querySelectorAll('.stat-item h3').forEach(stat => {
            stat.classList.add('counter');
        });
        
        // CTA sections
        document.querySelectorAll('.cta-button').forEach(button => {
            if (button.classList.contains('cta-white')) {
                button.classList.add('pulse-animation');
            }
        });
        
        // Icons
        document.querySelectorAll('.feature-icon, .product-icon, .why-icon').forEach(icon => {
            icon.classList.add('float-animation');
        });
    }
    
    // Handle intersection observer callback
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Special handling for counters
                if (entry.target.classList.contains('counter')) {
                    animateCounter(entry.target);
                }
                
                // Stop observing after animation
                if (!entry.target.classList.contains('parallax-element')) {
                    entry.target.observer?.unobserve(entry.target);
                }
            }
        });
    }
    
    // Animate number counters
    function animateCounter(element) {
        const text = element.innerText;
        const hasPercentage = text.includes('%');
        const hasPlus = text.includes('+');
        const target = parseInt(text.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                let displayValue = Math.floor(current);
                if (hasPercentage) displayValue += '%';
                if (hasPlus) displayValue += '+';
                element.innerText = displayValue;
                requestAnimationFrame(updateCounter);
            } else {
                let finalValue = target;
                if (hasPercentage) finalValue += '%';
                if (hasPlus) finalValue += '+';
                element.innerText = finalValue;
            }
        };
        
        updateCounter();
    }
    
    // Initialize counters
    function initCounters() {
        document.querySelectorAll('.stat-item h3').forEach(stat => {
            stat.setAttribute('data-target', stat.innerText);
            const text = stat.innerText;
            if (text.includes('%')) {
                stat.innerText = '0%';
            } else if (text.includes('+')) {
                stat.innerText = '0+';
            } else {
                stat.innerText = '0';
            }
        });
    }
    
    // Initialize parallax scrolling
    function initParallax() {
        if (config.mobileReducedMotion) return;
        
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // Initialize floating animations with random delays
    function initFloatingAnimations() {
        document.querySelectorAll('.float-animation').forEach((element, index) => {
            element.style.animationDelay = `${Math.random() * 2}s`;
        });
    }
    
    // Add smooth reveal for text
    function initTextReveal() {
        document.querySelectorAll('.text-reveal').forEach(element => {
            const text = element.innerText;
            element.innerHTML = text.split(' ').map((word, index) => 
                `<span style="transition-delay: ${index * 0.1}s">${word}</span>`
            ).join(' ');
        });
    }
    
    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Check for reduced motion preference
    function checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
        }
    }
    
    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }
    
    // Also check for reduced motion
    checkReducedMotion();
    
})();