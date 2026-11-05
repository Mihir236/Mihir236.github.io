// ==========================================================================
// Portfolio Interactivity Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 2. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            // Form data
            const formData = new FormData(contactForm);
            const formAction = contactForm.getAttribute('action');

            // Check if user has replaced YOUR_FORM_ID with their Formspree ID
            if (formAction.includes('YOUR_FORM_ID')) {
                // Friendly instruction fallback
                const name = formData.get('name');
                const message = formData.get('message');
                const mailtoUrl = `mailto:your-email@example.com?subject=Project Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`;
                
                formStatus.style.color = '#38bdf8';
                formStatus.innerHTML = `Form backend not set yet. Opening your email app to send...`;
                
                setTimeout(() => {
                    window.location.href = mailtoUrl;
                }, 800);
                return;
            }

            // If Formspree ID is set, submit via fetch
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.style.color = '#4ade80';
                    formStatus.textContent = "Thank you! Your message has been sent successfully.";
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data && data.errors) {
                        formStatus.style.color = '#f87171';
                        formStatus.textContent = data.errors.map(error => error.message).join(', ');
                    } else {
                        formStatus.style.color = '#f87171';
                        formStatus.textContent = "Oops! There was a problem submitting your form.";
                    }
                }
            } catch (err) {
                formStatus.style.color = '#f87171';
                formStatus.textContent = "Network error. Please try emailing directly.";
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
