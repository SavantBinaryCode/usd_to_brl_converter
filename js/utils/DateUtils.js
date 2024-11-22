class DateUtils {
  static formatDateToMMDDYYYY(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}-${day}-${year}`;
  }

  static getDateBefore(days) {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return this.formatDateToMMDDYYYY(date);
  }

  // New method to format date as DD/MM/YYYY for Brazilian format
  static formatDateToBrazilian(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
  }
}
