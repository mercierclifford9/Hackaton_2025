document.addEventListener('DOMContentLoaded', function() {
    // Animation pulse sur le preview
    const preview = document.querySelector('.chat-preview');
    if (preview) {
        preview.addEventListener('click', () => {
            preview.classList.add('pulse');
            setTimeout(() => preview.classList.remove('pulse'), 700);
        });
    }

    // Modal avec snippet de code
    const showCodeBtn = document.getElementById('showCodeBtn');
    if (showCodeBtn) {
        showCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const snippet = '<!-- NexGen Chatbot widget (démo) -->\n<script async src="https://cdn.nexgen.example/nexgen-widget.js"></script>\n<div id="nexgen-chat-demo"></div>\n<script>\n  window.NexGen && NexGen.init({\n    el: "#nexgen-chat-demo",\n    website: "https://votre-site.com",\n    language: "fr"\n  });\n</script>';

            const modalHtml = '<div class="modal fade show" tabindex="-1" style="display:block; background:rgba(2,6,23,0.6);" id="integrationModal">\n  <div class="modal-dialog modal-lg modal-dialog-centered">\n    <div class="modal-content bg-dark text-light">\n      <div class="modal-header border-secondary">\n        <h5 class="modal-title">Code d\'intégration (démo)</h5>\n        <button type="button" class="btn-close btn-close-white" id="closeModalBtn" aria-label="Fermer"></button>\n      </div>\n      <div class="modal-body">\n        <pre class="bg-secondary bg-opacity-10 p-3 rounded" style="white-space:pre-wrap;">' + snippet + '</pre>\n        <div class="mt-3 text-end">\n          <button class="btn btn-sm btn-primary" id="copySnippet">Copier</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>';
                
            document.getElementById('integrationModalPlaceholder').innerHTML = modalHtml;

            // Gestionnaire de copie
            document.getElementById('copySnippet').addEventListener('click', function() {
                navigator.clipboard.writeText(snippet).then(() => {
                    this.innerText = 'Copié !';
                    this.classList.add('btn-success');
                    this.classList.remove('btn-primary');
                    setTimeout(() => {
                        this.innerText = 'Copier';
                        this.classList.add('btn-primary');
                        this.classList.remove('btn-success');
                    }, 1500);
                }).catch(() => {
                    // Fallback pour navigateurs plus anciens
                    const textArea = document.createElement('textarea');
                    textArea.value = snippet;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    this.innerText = 'Copié !';
                });
            });

            // Fermeture du modal
            function closeModal() {
                const modal = document.getElementById('integrationModal');
                if (modal) {
                    modal.remove();
                }
                document.getElementById('integrationModalPlaceholder').innerHTML = '';
            }

            document.getElementById('closeModalBtn').addEventListener('click', closeModal);
            document.getElementById('integrationModal').addEventListener('click', function(ev) {
                if (ev.target.id === 'integrationModal') {
                    closeModal();
                }
            });

            // Fermeture avec Escape
            document.addEventListener('keydown', function(ev) {
                if (ev.key === 'Escape') {
                    closeModal();
                }
            });
        });
    }
});
