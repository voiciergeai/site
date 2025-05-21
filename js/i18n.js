// Implementazione multilingua avanzata per Voicierge
// Questo script gestisce il caricamento dinamico delle traduzioni e il cambio lingua

document.addEventListener('DOMContentLoaded', function() {
    // Configurazione iniziale
    const defaultLanguage = 'it';
    let currentLanguage = localStorage.getItem('voicierge-language') || defaultLanguage;
    
    // Carica le traduzioni per la lingua corrente
    loadTranslations(currentLanguage);
    
    // Imposta la lingua corrente nell'interfaccia
    updateLanguageUI(currentLanguage);
    
    // Gestione del selettore lingua
    const languageCurrent = document.querySelector('.language-current');
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const mobileLanguageOptions = document.querySelectorAll('.mobile-language-option');
    
    // Mostra/nascondi dropdown al click
    if (languageCurrent) {
        languageCurrent.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
        });
    }
    
    // Gestione click fuori dal dropdown per chiuderlo
    document.addEventListener('click', function() {
        if (languageDropdown) {
            languageDropdown.classList.remove('active');
        }
    });
    
    // Gestione cambio lingua - desktop
    if (languageOptions.length) {
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const lang = this.getAttribute('data-lang') || this.href.split('/')[1] || 'it';
                switchLanguage(lang);
            });
        });
    }
    
    // Gestione cambio lingua - mobile
    if (mobileLanguageOptions.length) {
        mobileLanguageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const lang = this.getAttribute('data-lang') || this.href.split('/')[1] || 'it';
                switchLanguage(lang);
            });
        });
    }
    
// Funzione per cambiare lingua
    function switchLanguage(lang) {
        if (lang !== currentLanguage) {
            // Salva la preferenza dell'utente
            localStorage.setItem('voicierge-language', lang);
            
            // Determina il percorso della pagina nella nuova lingua
            const currentPath = window.location.pathname;
            let newPath;
            
            // Estrai il nome del file dalla URL corrente
            const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
            const currentFile = pathSegments[pathSegments.length - 1] || 'index.html';
            const isHomePage = currentFile === 'index.html' || currentPath.endsWith('/');
            
            // Determina se siamo in una pagina di lingua
            const isInLanguageFolder = ['en'].some(langCode => 
                currentPath.includes(`/${langCode}/`) || currentPath === `/${langCode}`
            );
            
            // Determina se siamo nella cartella pages
            const isInPagesFolder = currentPath.includes('/pages/');
            
            // Costruisci il nuovo percorso in base alla lingua selezionata
            if (lang === 'it') {
                // Se stiamo passando all'italiano
                if (isHomePage) {
                    newPath = '/index.html';
                } else if (isInLanguageFolder) {
                    // Se siamo in una cartella di lingua, torna alla cartella pages
                    const fileName = currentFile === 'index.html' ? 'features.html' : currentFile;
                    newPath = `/pages/${fileName}`;
                } else {
                    // Mantieni il percorso attuale se già in italiano
                    newPath = currentPath;
                }
            } else {
                // Se stiamo passando a inglese
                if (isHomePage || currentPath === '/') {
                    newPath = `/${lang}/index.html`;
                } else if (isInLanguageFolder) {
                    // Se siamo già in una cartella di lingua, cambia solo la lingua
                    newPath = `/${lang}/${currentFile}`;
                } else if (isInPagesFolder) {
                    // Se siamo nella cartella pages, vai alla cartella della lingua
                    const fileName = currentFile === 'features.html' ? 'index.html' : currentFile;
                    newPath = `/${lang}/${fileName}`;
                } else {
                    // Fallback
                    newPath = `/${lang}/index.html`;
                }
            }
            
            // Reindirizza alla pagina nella nuova lingua
            window.location.href = newPath;
        }
    }
});

// Funzione per caricare le traduzioni
function loadTranslations(lang) {
    fetch(`/locales/${lang}.json`)
        .then(response => {
            if (!response.ok) {
                console.error(`Failed to load translations for ${lang}`);
                // Fallback to default language if translation file not found
                if (lang !== 'it') {
                    console.log('Falling back to default language (it)');
                    loadTranslations('it');
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Applica le traduzioni agli elementi con attributo data-i18n
            applyTranslations(data);
        })
        .catch(error => {
            console.error('Error loading translations:', error);
        });
}

// Funzione per applicare le traduzioni
function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        
        // Naviga nell'oggetto traduzioni per trovare il valore
        let value = translations;
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                value = null;
                break;
            }
        }
        
        // Applica la traduzione se trovata
        if (value) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.setAttribute('placeholder', value);
                } else {
                    element.value = value;
                }
            } else {
                element.innerHTML = value;
            }
        }
    });
}

// Funzione per aggiornare l'interfaccia del selettore lingua
function updateLanguageUI(lang) {
    // Aggiorna l'icona e il testo del selettore lingua
    const languageCurrent = document.querySelector('.language-current');
    if (languageCurrent) {
        const img = languageCurrent.querySelector('img');
        const span = languageCurrent.querySelector('span');
        
        if (img) {
            img.src = `/images/flags/${lang}.svg`;
            img.alt = getLangName(lang);
        }
        
        if (span) {
            span.textContent = getLangName(lang);
        }
    }
    
    // Evidenzia l'opzione della lingua corrente nel dropdown
    const languageOptions = document.querySelectorAll('.language-option');
    if (languageOptions.length) {
        languageOptions.forEach(option => {
            const optionLang = option.getAttribute('data-lang');
            if (optionLang === lang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    // Aggiorna l'attributo lang dell'html
    document.documentElement.lang = lang;
}

// Funzione per ottenere il nome della lingua
function getLangName(lang) {
    const langNames = {
        'it': 'Italiano',
        'en': 'English'
    };
    
    return langNames[lang] || langNames['it'];
}

// Funzione per gestire il responsive design
function handleResponsive() {
    const breakpoints = {
        mobile: 576,
        tablet: 768,
        desktop: 992,
        large: 1200
    };
    
    const width = window.innerWidth;
    
    // Aggiungi classi al body in base alla dimensione dello schermo
    document.body.classList.remove('mobile', 'tablet', 'desktop', 'large');
    
    if (width < breakpoints.mobile) {
        document.body.classList.add('mobile');
    } else if (width < breakpoints.tablet) {
        document.body.classList.add('tablet');
    } else if (width < breakpoints.desktop) {
        document.body.classList.add('desktop');
    } else {
        document.body.classList.add('large');
    }
}

// Esegui la funzione al caricamento e al ridimensionamento della finestra
window.addEventListener('DOMContentLoaded', handleResponsive);
window.addEventListener('resize', handleResponsive);
