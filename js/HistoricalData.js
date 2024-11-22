class HistoricalData {
    constructor() {
      this.chart = null; // Stores the ApexCharts instance
      this.init(); // Initializes event listeners
    }
  
    // Initialize form and button events
    init() {
      // Listener for "Get Data" button
      document.getElementById('historicalForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.displayHistoricalData();
      });
  
      // Listener for "Download as PDF" button
      document.getElementById('downloadPdf').addEventListener('click', async () => {
        await this.downloadPDF();
      });
    }
  
    // Fetch and display historical data
    async displayHistoricalData() {
      const period = parseInt(document.getElementById('periodSelect').value); // Get selected period
      const startDate = DateUtils.getDateBefore(period); // Start date
      const endDate = DateUtils.formatDateToMMDDYYYY(new Date()); // End date (today)
  
      // Fetch historical data from API
      const data = await ApiService.fetchHistoricalData(startDate, endDate);
  
      // Extract dates and rates
      const dates = data.map(item => DateUtils.formatDateToBrazilian(new Date(item.dataHoraCotacao)));
      const rates = data.map(item => item.cotacaoCompra);
  
      // Render the chart and the list
      this.renderChart(dates, rates);
      this.renderList(data);
  
      // Show the "Download as PDF" button
      this.showDownloadButton();
    }
  
    // Render the chart with ApexCharts
    renderChart(dates, rates) {
      if (this.chart) {
        this.chart.destroy(); // Destroy the previous chart instance
      }
  
      const isDarkMode = document.body.classList.contains('dark-theme'); // Detect theme
      const options = {
        series: [{ name: "USD to BRL Rate", data: rates }],
        chart: { type: 'line', height: 350 },
        xaxis: { categories: dates, title: { text: 'Date' } },
        yaxis: { title: { text: 'Exchange Rate (BRL)' } },
        title: { text: 'Historical USD to BRL Exchange Rate', align: 'center' },
        theme: { mode: isDarkMode ? 'dark' : 'light' }
      };
  
      // Initialize ApexCharts
      this.chart = new ApexCharts(document.querySelector("#chart"), options);
      this.chart.render();
    }
  
    // Render the historical data list
    renderList(data) {
      const resultDiv = document.getElementById('historicalResult');
      resultDiv.innerHTML = `
        <ul class="list-group">
          ${data.map(item => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Date: ${DateUtils.formatDateToBrazilian(new Date(item.dataHoraCotacao))} - 
              Rate: ${item.cotacaoCompra.toFixed(2)} BRL
            </li>
          `).join('')}
        </ul>`;
    }
  
    // Show the "Download as PDF" button
    showDownloadButton() {
      const downloadButton = document.getElementById('downloadPdf');
      downloadButton.hidden = false; // Make the button visible
    }
  
    // Generate and download the PDF
    async downloadPDF() {
      try {
        const { jsPDF } = window.jspdf; // Access jsPDF from global scope
        const chartElement = document.querySelector("#chart");
        const listElement = document.querySelector("#historicalResult");
  
        // Convert chart to an image using html2canvas
        const chartImage = await html2canvas(chartElement).then(canvas => canvas.toDataURL("image/png"));
  
        // Initialize jsPDF
        const pdf = new jsPDF("p", "mm", "a4");
  
        // Add chart image to the PDF
        pdf.addImage(chartImage, "PNG", 10, 10, 190, 100);
  
        // Prepare list data for the table
        const listItems = Array.from(listElement.querySelectorAll(".list-group-item")).map(item => {
          const text = item.textContent.split("-");
          return {
            date: text[0].replace("Date: ", "").trim(),
            rate: text[1].replace("Rate: ", "").trim(),
          };
        });
  
        const tableRows = listItems.map(item => [item.date, item.rate]);
  
        // Add the table to the PDF
        pdf.autoTable({
          head: [["Date", "Exchange Rate"]],
          body: tableRows,
          startY: 120,
        });
  
        // Save the PDF file
        pdf.save("HistoricalData.pdf");
        console.log("PDF generated successfully");
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please check console for more details.");
      }
    }
  }
  