## **Visão Geral do Projeto**

Este projeto é uma aplicação web modular que realiza a conversão de **USD para BRL** e apresenta o **histórico de taxas de câmbio**. Ele utiliza **Programação Orientada a Objetos (OOP)** e elementos de **Design Orientado ao Domínio (DDD)** para organizar o código de forma limpa, escalável e de fácil manutenção.

---

## **Estrutura do Projeto**

### **Diretório Raiz**

- **`index.html`**:
    - Interface principal, com botões e modais para interação do usuário.
    - Conecta as dependências externas (Bootstrap, ApexCharts, jsPDF).

### **Diretório `css/`**

- **`style.css`**:
    - Gerencia os estilos visuais da aplicação.
    - Define temas claro e escuro, estilos responsivos e elementos como botões e modais.

### **Diretório `js/`**

#### **Classes e Responsabilidades**

1. **`ApiService.js`**:
    
    - Encapsula as chamadas à API para buscar dados de câmbio.
    - Métodos:
        - `fetchCurrentExchangeRate(date)`: Retorna a taxa de câmbio para uma data específica.
        - `fetchHistoricalData(startDate, endDate)`: Retorna o histórico de taxas para um intervalo de datas.
2. **`Converter.js`**:
    
    - Gerencia a lógica de conversão de moeda.
    - Atributos:
        - `IOF`: Alíquota fixa (4,38%).
        - `exchangeRate`: Armazena a taxa de câmbio atual.
    - Métodos:
        - `validateInputs()`: Valida as entradas do formulário.
        - `convertCurrency()`: Calcula o valor convertido com IOF e spread.
        - `displayResult(iofAmount, spreadAmount, finalValue)`: Exibe os resultados no modal.
3. **`HistoricalData.js`**:
    
    - Manipula o histórico de taxas e gera gráficos e listas.
    - Atributos:
        - `chart`: Instância do ApexCharts.
    - Métodos:
        - `displayHistoricalData()`: Busca e exibe os dados históricos.
        - `renderChart(dates, rates)`: Configura o gráfico.
        - `renderList(data)`: Exibe os dados em formato de lista.
        - `downloadPDF()`: Gera e baixa um PDF com os dados.
4. **`ThemeManager.js`**:
    
    - Gerencia a alternância entre os temas claro e escuro.
    - Métodos:
        - `applyTheme(theme)`: Aplica o tema selecionado.
        - `toggleTheme()`: Alterna entre os temas e salva no `localStorage`.
5. **`ModalManager.js`**:
    
    - Gerencia a abertura e fechamento de modais usando Bootstrap.
    - Métodos:
        - `initializeModals()`: Configura modais no carregamento da página.
        - `openModal(selector)`: Abre o modal solicitado.
6. **`main.js`**:
    
    - Ponto de entrada do sistema.
    - Inicializa as classes `Converter`, `HistoricalData`, `ThemeManager` e `ModalManager`.

#### **Diretório `utils/`**

- **`DateUtils.js`**:
    - Fornece utilitários para manipulação de datas.
    - Métodos:
        - `formatDateToMMDDYYYY(date)`: Formata a data no padrão `MM-DD-YYYY`.
        - `getDateBefore(days)`: Retorna a data de N dias atrás.
        - `formatDateToBrazilian(date)`: Converte datas para o formato brasileiro `DD/MM/YYYY`.

---

## **Uso de Programação Orientada a Objetos (OOP)**

### **Princípios Aplicados**

1. **Encapsulamento**:
    
    - Cada classe encapsula sua lógica específica, isolando-a do restante do código.
    - Exemplo:
        - A lógica de conversão é totalmente gerenciada pela classe `Converter`.
        - A classe `ApiService` isola a lógica de comunicação com a API.
2. **Modularidade**:
    
    - Classes são organizadas por responsabilidade, facilitando manutenção e extensão.
    - Exemplo:
        - A lógica de temas está isolada em `ThemeManager`.
        - A manipulação de modais está separada em `ModalManager`.
3. **Reutilização**:
    
    - Funções utilitárias em `DateUtils` podem ser usadas por várias partes do sistema sem duplicação de código.
    - Exemplo:
        - `formatDateToMMDDYYYY` é utilizada tanto em `ApiService` quanto em `HistoricalData`.
4. **Herança e Polimorfismo**:
    
    - Este projeto não aplica explicitamente herança, mas a modularidade permite fácil expansão com herança se necessário (por exemplo, diferentes conversores de moeda).
5. **Coesão Alta e Acoplamento Baixo**:
    
    - Cada classe tem alta coesão, com um propósito bem definido.
    - O baixo acoplamento é evidente, pois classes interagem entre si por métodos públicos e dependem de abstrações (como o uso de `ApiService` em `Converter`).

---

## **Uso de Design Orientado ao Domínio (DDD)**

### **Elementos DDD no Projeto**

1. **Camada de Domínio**:
    
    - A lógica de negócio (como conversão de moeda e cálculo de IOF) está encapsulada nas classes principais:
        - `Converter` (para conversão de moeda).
        - `HistoricalData` (para visualização de histórico).
2. **Entidade e Serviço**:
    
    - **Serviços**:
        - `ApiService` é um serviço que abstrai a comunicação com APIs externas.
    - **Entidades do Domínio**:
        - O domínio principal é representado pela conversão de moedas e histórico de taxas, encapsulado nas classes `Converter` e `HistoricalData`.
3. **Regras de Negócio no Domínio**:
    
    - As regras específicas do negócio (ex.: aplicação de IOF e spread bancário) estão encapsuladas na classe `Converter`, em vez de serem espalhadas pela interface.
4. **Abstração e Camadas**:
    
    - A lógica de manipulação de dados (como datas em `DateUtils`) está separada das classes de domínio.
    - A interface do usuário (`index.html`, modais) e o domínio (como `Converter` e `HistoricalData`) estão desacoplados.
5. **Linguagem Ubíqua**:
    
    - O uso de nomes de métodos e atributos reflete diretamente os conceitos do domínio, como:
        - `convertCurrency`, `fetchHistoricalData`, `IOF`, `spread`.