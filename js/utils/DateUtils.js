class DateUtils {
    constructor() {}

    formatDateToMMDDYYYY(date) {
        const day = String(date.getDate()).padStart(2, '0'); 
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear(); 
        return `${month}-${day}-${year}`;
    }

    getDateBefore(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return this.formatDateToMMDDYYYY(date);
    }

    formatDateToBrazilian(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
