document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new ModalManager();
    new Converter(new ApiService(), new DateUtils());
    new HistoricalData();
});
