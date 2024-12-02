class ModalManager {
    constructor() {
        this.modals = {};
        this.initializeModals();
    }

    initializeModals() {
        document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
            const targetSelector = button.getAttribute('data-bs-target');
            const modalElement = document.querySelector(targetSelector);

            if (modalElement) {
                this.modals[targetSelector] = new bootstrap.Modal(modalElement);

                button.addEventListener('click', () => this.openModal(targetSelector));
            }
        });

        document.querySelectorAll('.btn-close').forEach(button => {
            button.addEventListener('click', () => this.closeAllModals());
        });
    }

    openModal(selector) {
        const modal = this.modals[selector];
        if (modal) {
            modal.show();
        }
    }

    closeAllModals() {
        Object.values(this.modals).forEach(modal => {
            modal.hide();
        });
    }
}
