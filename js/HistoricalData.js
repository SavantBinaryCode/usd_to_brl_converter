class HistoricalData {
    constructor() {
        this.chart = null;
        this.dateUtils = new DateUtils();
        this.setupEvents();
    }

    setupEvents() {
        const historicalForm = document.getElementById('historicalForm'); 
        const downloadPdfButton = document.getElementById('downloadPdf');

        if (historicalForm) {
            historicalForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                await this.displayHistoricalData();
            });
        }

        if (downloadPdfButton) {
            downloadPdfButton.addEventListener('click', async () => {
                await this.generatePDF();
            });
        }
    }

    async displayHistoricalData() {
        const periodSelect = document.getElementById('periodSelect');
        if (!periodSelect) {
            console.error("Campo de selecao de periodo nao encontrado.");
            return;
        }

        const period = parseInt(periodSelect.value, 10);
        const startDate = this.dateUtils.getDateBefore(period);
        const endDate = this.dateUtils.formatDateToMMDDYYYY(new Date());

        const apiService = new ApiService();
        const data = await apiService.fetchHistoricalData(startDate, endDate);

        const dates = data.map(item => this.dateUtils.formatDateToBrazilian(new Date(item.dataHoraCotacao)));
        const rates = data.map(item => item.cotacaoCompra);

        this.renderChart(dates, rates);
        this.renderList(data);

        this.showDownloadButton();
    }


    renderChart(dates, rates) {
        if (this.chart) {
            this.chart.destroy();
        }

        const isDarkMode = document.body.classList.contains('dark-theme');

        const options = {
            series: [{ name: "Taxa de Cambio (USD para BRL)", data: rates }],
            chart: { type: 'line', height: 350 },
            xaxis: { categories: dates, title: { text: 'Data' } },
            yaxis: { title: { text: 'Taxa de Cambio (BRL)' } },
            title: { text: 'Taxas Historicas (USD para BRL)', align: 'center' },
            theme: { mode: isDarkMode ? 'dark' : 'light' }
        };

        this.chart = new ApexCharts(document.querySelector("#chart"), options); // Cria o grafico
        this.chart.render(); // Renderiza o grafico
    }

    renderList(data) {
        const resultDiv = document.getElementById('historicalResult');
        resultDiv.innerHTML = `
            <ul class="list-group">
                ${data.map(item => `
                    <li class="list-group-item">
                        Data: ${this.dateUtils.formatDateToBrazilian(new Date(item.dataHoraCotacao))} - 
                        Taxa: ${item.cotacaoCompra.toFixed(2)} BRL
                    </li>
                `).join('')}
            </ul>`;
    }

    showDownloadButton() {
        const downloadButton = document.getElementById('downloadPdf');
        if (downloadButton) {
            downloadButton.hidden = false; 
        }
    }

    async generatePDF() {
        const { jsPDF } = window.jspdf; 
        const chartElement = document.querySelector("#chart"); 
        const listElement = document.querySelector("#historicalResult");

        try {
            const chartImage = await html2canvas(chartElement).then(canvas => canvas.toDataURL("image/png"));

            const pdf = new jsPDF();

            pdf.addImage(chartImage, "PNG", 10, 10, 190, 100);

            const rows = Array.from(listElement.querySelectorAll(".list-group-item")).map(item => {
                const text = item.textContent.split(" - "); 
                const date = text[0].replace("Data: ", "").trim();
                const rate = text[1].replace("Taxa: ", "").trim();
                return [date, rate];
            });

            pdf.autoTable({
                head: [["Data", "Taxa de Cambio"]],
                body: rows,
                startY: 120,
            });

            pdf.save("TaxasHistoricas.pdf");
        } catch (error) {
            console.error("Erro ao gerar o PDF:", error);
        }
    }
}
