// js/ThemeManager.js

class ThemeManager {
    constructor() {
      this.themeToggle = document.getElementById('themeToggle');
      this.bodyClassList = document.body.classList;
      this.initializeTheme();
    }
  
    initializeTheme() {
      // Verifica se o usuário já tem uma preferência salva
      const savedTheme = localStorage.getItem('theme');
  
      // Define o tema com base no sistema, caso não haja uma preferência salva
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      this.applyTheme(initialTheme);
  
      // Configura o botão de alternância de tema para refletir o tema atual
      this.themeToggle.checked = initialTheme === 'dark';
      this.themeToggle.addEventListener('change', () => this.toggleTheme());
    }
  
    toggleTheme() {
      const newTheme = this.themeToggle.checked ? 'dark' : 'light';
      this.applyTheme(newTheme);
    }
  
    applyTheme(theme) {
      // Aplica o tema e alterna as classes de tema
      this.bodyClassList.toggle('dark-theme', theme === 'dark');
      this.bodyClassList.toggle('light-theme', theme === 'light');
  
      // Salva a preferência do usuário no localStorage
      localStorage.setItem('theme', theme);
  
      // Re-renderiza o gráfico se o modal histórico estiver aberto
      if (document.querySelector('#historicalModal').classList.contains('show')) {
        const historicalData = new HistoricalData();
        historicalData.displayHistoricalData();
      }
    }
  }
  