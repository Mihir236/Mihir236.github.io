// ==========================================================================
// Interactive features inspired by brittanychiang.com
// 1. Mouse pointer radial glow tracking
// 2. Scrollspy active nav link indicator
// 3. Contact form handling
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mouse Spotlight Glow tracking
    const pointerGlow = document.getElementById('pointerGlow');
    if (pointerGlow) {
        window.addEventListener('pointermove', (e) => {
            const { clientX, clientY } = e;
            pointerGlow.style.setProperty('--x', `${clientX}px`);
            pointerGlow.style.setProperty('--y', `${clientY}px`);
        });
    }

    // 2. Active Section Spy (Highlights Nav indicators as you scroll)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav(); // Trigger initially

    // 3. Contact Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            const formData = new FormData(contactForm);
            const formAction = contactForm.getAttribute('action');

            // If Formspree ID is still the placeholder, fallback gracefully
            if (formAction.includes('YOUR_FORM_ID')) {
                const name = formData.get('name');
                const message = formData.get('message');
                const mailtoUrl = `mailto:your-email@example.com?subject=Project Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`;
                
                formStatus.style.color = '#5eead4';
                formStatus.innerHTML = `Form backend not configured yet. Opening your email app...`;
                
                setTimeout(() => {
                    window.location.href = mailtoUrl;
                }, 700);
                return;
            }

            // Real submission via Formspree API
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.style.color = '#5eead4';
                    formStatus.textContent = "Thank you! Message received. I will reply soon.";
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    formStatus.style.color = '#f87171';
                    formStatus.textContent = data.errors ? data.errors.map(err => err.message).join(', ') : "Submission failed.";
                }
            } catch (err) {
                formStatus.style.color = '#f87171';
                formStatus.textContent = "Network error. Please email directly.";
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
