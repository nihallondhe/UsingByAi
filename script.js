document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearErrors();

            let isValid = true;

            // Name validation
            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            }

            // Email validation
            const emailInput = document.getElementById('email');
            const emailValue = emailInput.value.trim();
            if (!emailValue) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailValue)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            // Message validation
            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Message is required');
                isValid = false;
            }

            if (isValid) {
                // Form is valid - you can submit via AJAX or allow default submission
                // For now, we'll just show a success message
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Simulate form submission
                setTimeout(() => {
                    alert('Thank you! Your message has been sent.');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            }
        });

        // Real-time validation on blur
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            // Clear error on input
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }

    // Helper functions
    function showError(input, message) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        
        if (!errorElement.classList.contains('error-message')) {
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('error');
    }

    function clearFieldError(input) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.classList.remove('error');
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    }

    function validateField(input) {
        const value = input.value.trim();
        
        if (input.id === 'name') {
            if (!value) {
                showError(input, 'Name is required');
                return false;
            }
        } else if (input.id === 'email') {
            if (!value) {
                showError(input, 'Email is required');
                return false;
            } else if (!isValidEmail(value)) {
                showError(input, 'Please enter a valid email address');
                return false;
            }
        } else if (input.id === 'message') {
            if (!value) {
                showError(input, 'Message is required');
                return false;
            }
        }
        
        clearFieldError(input);
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});