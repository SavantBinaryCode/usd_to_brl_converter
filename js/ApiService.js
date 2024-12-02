class ApiService {
    constructor(baseURL) {
        this.baseURL = baseURL || 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/';
    }

    async fetchCurrentExchangeRate(date) {
        const url = `${this.baseURL}CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${date}'&$top=100&$format=json`;

        try {
            const response = await fetch(url); 
            const data = await response.json(); 
            return data.value.length > 0 ? data.value[0].cotacaoVenda : null;
        } catch (error) {
            console.error("Erro ao buscar taxa de cambio atual:", error);
            return null; 
        }
    }

    async fetchHistoricalData(startDate, endDate) {
        const url = `${this.baseURL}CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${startDate}'&@dataFinalCotacao='${endDate}'&$top=100&$skip=0&$format=json&$select=cotacaoCompra,dataHoraCotacao`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.value;
        } catch (error) {
            console.error("Erro ao buscar dados historicos:", error);
            throw error;
        }
    }
}
