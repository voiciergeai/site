// Script per gestire le FAQ espandibili
document.addEventListener('DOMContentLoaded', function() {
    // Seleziona tutte le domande FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Aggiungi event listener a ciascuna domanda
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Trova l'elemento faq-item genitore
            const faqItem = this.parentElement;
            
            // Verifica se l'elemento è già attivo
            const isActive = faqItem.classList.contains('active');
            
            // Chiudi tutte le FAQ aperte (opzionale, rimuovi se vuoi permettere più FAQ aperte contemporaneamente)
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
            
            // Attiva o disattiva l'elemento corrente
            if (isActive) {
                faqItem.classList.remove('active');
            } else {
                faqItem.classList.add('active');
            }
        });
    });
});
