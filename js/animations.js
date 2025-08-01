// Scroll Animation System
(function() {
    'use strict';
    
    // Configuration
    const config = {
        rootMargin: '-50px 0px -100px 0px', // Ajustado para mejor detección
        threshold: [0, 0.1, 0.5, 1], // Múltiples umbrales para mejor precisión
        mobileReducedMotion: window.matchMedia('(max-width: 768px)').matches
    };
    
    // Track scroll direction
    let lastScrollTop = 0;
    let scrollDirection = 'down';
    
    // Initialize animations
    function initScrollAnimations() {
        // Add animation classes to elements
        addAnimationClasses();
        
        // Check initial viewport elements
        checkInitialViewport();
        
        // Create intersection observer
        const animationObserver = new IntersectionObserver(handleIntersection, {
            rootMargin: config.rootMargin,
            threshold: config.threshold
        });
        
        // Observe all animatable elements
        const animatableElements = document.querySelectorAll('.animate-on-scroll, .stagger-animation, .counter, .line-animation, .slide-from-right, .text-reveal, .glow-on-scroll');
        animatableElements.forEach(el => {
            el.observer = animationObserver;
            animationObserver.observe(el);
        });
        
        // Initialize parallax scrolling
        initParallax();
        
        // Initialize number counters
        initCounters();
        
        // Initialize floating animations
        initFloatingAnimations();
        
        // Track scroll direction
        window.addEventListener('scroll', throttle(function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, 50));
    }
    
    // Check and animate elements in initial viewport
    function checkInitialViewport() {
        // Small delay to ensure proper page load
        setTimeout(() => {
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Get all animatable elements
            const animatableElements = document.querySelectorAll('.animate-on-scroll, .stagger-animation, .counter, .slide-from-right');
            
            animatableElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollTop;
                const elementBottom = elementTop + rect.height;
                
                // Check if element is in current viewport or above it
                if (elementTop <= scrollTop + viewportHeight) {
                    // Element is visible or above current scroll position
                    element.classList.add('animated');
                    
                    // Handle counters specially - ensure they show final value
                    if (element.classList.contains('counter')) {
                        const targetText = element.getAttribute('data-target');
                        if (targetText) {
                            // For stats counters that are already visible on page load,
                            // show the final value immediately
                            if (element.closest('.stats')) {
                                element.innerText = targetText;
                            } else {
                                animateCounter(element);
                            }
                        }
                    }
                }
            });
        }, 100);
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
        
        // Stats - mark as animate-once
        document.querySelectorAll('.stat-item').forEach(stat => {
            stat.classList.add('animate-once');
            stat.querySelector('h3')?.classList.add('counter', 'animate-once');
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
            // Check if element should animate only once
            const isAnimateOnce = entry.target.classList.contains('animate-once') || entry.target.closest('.stats');
            
            if (isAnimateOnce) {
                // Animate only once behavior
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    
                    // Animate counter if it's a counter element
                    if (entry.target.classList.contains('counter')) {
                        animateCounter(entry.target);
                    }
                }
            } else {
                // Normal repeating animation behavior
                if (entry.isIntersecting) {
                    // Always animate when entering viewport, regardless of scroll direction
                    // unless it's already animated and we're scrolling up
                    if (!entry.target.classList.contains('animated') || scrollDirection === 'down') {
                        entry.target.classList.add('animated');
                        
                        // Special handling for counters
                        if (entry.target.classList.contains('counter')) {
                            animateCounter(entry.target);
                        }
                    }
                } else if (!entry.isIntersecting && scrollDirection === 'up') {
                    // Only reset when scrolling up and element leaves viewport
                    entry.target.classList.remove('animated');
                    
                    // Reset counters
                    if (entry.target.classList.contains('counter')) {
                        resetCounter(entry.target);
                    }
                }
            }
        });
    }
    
    // Animate number counters
    function animateCounter(element) {
        // Don't animate if already animating
        if (element.dataset.animating === 'true') return;
        
        element.dataset.animating = 'true';
        
        const text = element.getAttribute('data-target') || element.innerText;
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
                element.animationFrame = requestAnimationFrame(updateCounter);
            } else {
                let finalValue = target;
                if (hasPercentage) finalValue += '%';
                if (hasPlus) finalValue += '+';
                element.innerText = finalValue;
                element.dataset.animating = 'false';
                delete element.animationFrame;
            }
        };
        
        updateCounter();
    }
    
    // Reset counter to initial state
    function resetCounter(element) {
        // Cancel any ongoing animation
        if (element.animationFrame) {
            cancelAnimationFrame(element.animationFrame);
            delete element.animationFrame;
        }
        element.dataset.animating = 'false';
        
        const targetText = element.getAttribute('data-target');
        if (targetText) {
            if (targetText.includes('%')) {
                element.innerText = '0%';
            } else if (targetText.includes('+')) {
                element.innerText = '0+';
            } else {
                element.innerText = '0';
            }
        }
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
    
    // Ensure all counters reach their final value
    function ensureCountersComplete() {
        document.querySelectorAll('.counter.animated').forEach(counter => {
            const targetText = counter.getAttribute('data-target');
            if (targetText && counter.innerText !== targetText) {
                // Force counter to show final value
                counter.innerText = targetText;
                counter.dataset.animating = 'false';
                if (counter.animationFrame) {
                    cancelAnimationFrame(counter.animationFrame);
                    delete counter.animationFrame;
                }
            }
        });
    }
    
    // Add visibility change handler to ensure counters complete
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            ensureCountersComplete();
        }
    });
    
    // Also check on window blur/focus
    window.addEventListener('blur', ensureCountersComplete);
    window.addEventListener('focus', ensureCountersComplete);
    
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