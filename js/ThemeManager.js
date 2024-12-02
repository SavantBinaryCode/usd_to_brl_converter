class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.bodyClassList = document.body.classList;
        this.initializeTheme();
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');

        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.applyTheme(initialTheme);

        this.themeToggle.checked = initialTheme === 'dark';
        this.themeToggle.addEventListener('change', () => this.toggleTheme());
    }

    toggleTheme() {
        const newTheme = this.themeToggle.checked ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        this.bodyClassList.toggle('dark-theme', theme === 'dark');
        this.bodyClassList.toggle('light-theme', theme === 'light');

        localStorage.setItem('theme', theme);

        if (document.querySelector('#historicalModal').classList.contains('show')) {
            const historicalData = new HistoricalData();
            historicalData.displayHistoricalData();
        }
    }
}
