// js/ApiService.js

class ApiService {
    static async fetchCurrentExchangeRate(date) {
      const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${date}'&$top=100&$format=json`;
      const response = await fetch(url);
      const data = await response.json();
    
      // Return null if the data is empty, otherwise return the exchange rate
      return data.value.length > 0 ? data.value[0].cotacaoVenda : null;
  }
  
    static async fetchHistoricalData(startDate, endDate) {
      const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${startDate}'&@dataFinalCotacao='${endDate}'&$top=100&$skip=0&$format=json&$select=cotacaoCompra,dataHoraCotacao`;
      const response = await fetch(url);
      const data = await response.json();
      return data.value;
    }
  }
  