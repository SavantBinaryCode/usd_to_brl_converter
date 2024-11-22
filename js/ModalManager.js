// js/ModalManager.js

class ModalManager {
    constructor() {
      this.modals = {}; // Armazena as instâncias do Bootstrap Modal para cada modal
      this.initializeModals();
    }
  
    initializeModals() {
      // Inicializa modais no carregamento da página para cada botão de abertura
      document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
        const targetSelector = button.getAttribute('data-bs-target');
        const modalElement = document.querySelector(targetSelector);
  
        if (modalElement) {
          // Cria uma instância do modal Bootstrap e armazena no dicionário
          this.modals[targetSelector] = new bootstrap.Modal(modalElement);
  
          // Adiciona evento de clique para abrir o modal
          button.addEventListener('click', () => this.openModal(targetSelector));
        }
      });
  
      // Configura o botão de fechamento para fechar o modal ativo
      document.querySelectorAll('.btn-close').forEach(button => {
        button.addEventListener('click', () => this.closeAllModals());
      });
    }
  
    openModal(selector) {
      const modal = this.modals[selector];
      if (modal) {
        modal.show(); // Mostra o modal usando o Bootstrap Modal API
      }
    }
  
    closeAllModals() {
      // Fecha todos os modais ativos
      Object.values(this.modals).forEach(modal => {
        modal.hide(); // Oculta o modal corretamente usando o Bootstrap Modal API
      });
    }
  }
  