// Funzionalità JavaScript per Voicierge
// Gestisce preloader, menu mobile, popup, animazioni e altre interazioni

document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(function() {
            preloader.classList.add('fade-out');
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    // Menu Mobile Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            
            // Cambia l'icona del menu
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                this.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                this.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // Popup
    const popupTriggers = document.querySelectorAll('[data-popup]');
    const popupOverlay = document.querySelector('.popup-overlay');
    const popupClose = document.querySelector('.popup-close');
    
    if (popupTriggers.length && popupOverlay) {
        popupTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                popupOverlay.classList.add('active');
                document.body.classList.add('popup-open');
            });
        });
        
        if (popupClose) {
            popupClose.addEventListener('click', function() {
                popupOverlay.classList.remove('active');
                document.body.classList.remove('popup-open');
            });
        }
        
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('active');
                document.body.classList.remove('popup-open');
            }
        });
    }
    
    // Form Submission
    const forms = document.querySelectorAll('form');
    
    if (forms.length) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simulazione invio form
                const submitButton = this.querySelector('button[type="submit"]');
                if (submitButton) {
                    const originalText = submitButton.textContent;
                    submitButton.textContent = 'Invio in corso...';
                    submitButton.disabled = true;
                    
                    setTimeout(function() {
                        submitButton.textContent = 'Inviato con successo!';
                        
                        setTimeout(function() {
                            form.reset();
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                            
                            if (popupOverlay && popupOverlay.classList.contains('active')) {
                                popupOverlay.classList.remove('active');
                                document.body.classList.remove('popup-open');
                            }
                        }, 2000);
                    }, 1500);
                }
            });
        });
    }
    
    // Cookie Banner
    const cookieBanner = document.querySelector('.cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');
    
    if (cookieBanner && acceptCookies && declineCookies) {
        // Controlla se l'utente ha già fatto una scelta
        const cookieChoice = localStorage.getItem('voicierge-cookie-choice');
        
        if (!cookieChoice) {
            // Mostra il banner dopo un breve ritardo
            setTimeout(function() {
                cookieBanner.classList.add('active');
            }, 2000);
        }
        
        acceptCookies.addEventListener('click', function() {
            localStorage.setItem('voicierge-cookie-choice', 'accepted');
            cookieBanner.classList.remove('active');
        });
        
        declineCookies.addEventListener('click', function() {
            localStorage.setItem('voicierge-cookie-choice', 'declined');
            cookieBanner.classList.remove('active');
        });
    }
    
    // Animazioni al scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.9 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    }
    
    // Esegui al caricamento e allo scroll
    if (fadeElements.length) {
        window.addEventListener('scroll', checkFade);
        checkFade(); // Esegui al caricamento
    }
    
    // Smooth Scroll per ancore
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    if (anchorLinks.length) {
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Chiudi il menu mobile se aperto
                    if (mobileNav && mobileNav.classList.contains('active')) {
                        mobileNav.classList.remove('active');
                        if (mobileMenuToggle) {
                            const icon = mobileMenuToggle.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-times');
                                icon.classList.add('fa-bars');
                            }
                            mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                }
            });
        });
    }
});
