// Contact Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
});

function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const submitButton = event.target.querySelector('.submit-button');
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        showMessage('success', '¡Gracias por tu solicitud! Nos pondremos en contacto contigo dentro de las próximas 24 horas.');
        
        // Reset form
        event.target.reset();
        
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Solicitud';
        
        // Scroll to top of form
        document.querySelector('.contact-form-wrapper').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 2000);
}

function showMessage(type, message) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = type === 'success' ? 'success-message' : 'error-message';
    messageElement.textContent = message;
    
    // Insert message after form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageElement, form.nextSibling);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => messageElement.remove(), 300);
    }, 5000);
}

// Form validation enhancements
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        // Format phone number as user types
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            } else {
                value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
            }
        }
        e.target.value = value;
    });
}

// Add floating label effect for select
const selectElement = document.getElementById('state');
if (selectElement) {
    selectElement.addEventListener('change', function() {
        if (this.value) {
            this.classList.add('has-value');
        } else {
            this.classList.remove('has-value');
        }
    });
}