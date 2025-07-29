// Main JavaScript file for Team Diamond Website

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle navigation from other pages
window.addEventListener('DOMContentLoaded', function() {
    // Check if there's a hash in the URL
    if (window.location.hash) {
        // Wait a bit for the page to load
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }
    
    // Update active navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === '#inicio')) {
            link.classList.add('active');
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    this.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe feature cards and benefit items
document.querySelectorAll('.feature-card, .benefit-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Form submission (if you add a contact form later)
function handleFormSubmit(event) {
    event.preventDefault();
    // Add form submission logic here
    alert('Gracias por tu interés. Nos pondremos en contacto contigo pronto.');
}

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-item h3');
    
    stats.forEach(stat => {
        const target = parseInt(stat.innerText);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.innerText = Math.ceil(current) + (stat.innerText.includes('+') ? '+' : '');
                setTimeout(updateCounter, 20);
            } else {
                stat.innerText = target + (stat.innerText.includes('+') ? '+' : '');
            }
        };
        
        // Start animation when in viewport
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    updateCounter();
                    entry.target.classList.add('counted');
                }
            });
        });
        
        statObserver.observe(stat.parentElement);
    });
}

// Initialize stats animation
animateStats();

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Remove parallax effect to prevent overlap issues

// Handle join form submission
const joinForm = document.getElementById('joinForm');
if (joinForm) {
    joinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const submitButton = e.target.querySelector('.submit-button');
        
        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            showJoinFormMessage('success', '¡Excelente! Hemos recibido tu solicitud. Un líder de Team Diamond te contactará en las próximas 24-48 horas para iniciar tu proceso.');
            
            // Reset form
            e.target.reset();
            
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Solicitud';
            
            // Scroll to form
            document.querySelector('.join-form-section').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 2000);
    });
}

function showJoinFormMessage(type, message) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}-message`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 1rem;
        border-radius: 10px;
        text-align: center;
        margin-top: 1rem;
        animation: fadeInUp 0.5s ease;
    `;
    
    // Insert message after form
    const form = document.getElementById('joinForm');
    form.parentNode.insertBefore(messageElement, form.nextSibling);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => messageElement.remove(), 300);
    }, 5000);
}