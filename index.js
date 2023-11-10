// Variáveis 
let loadedData = [];
let selectedData = [];
let chart;

// Carregamento de Dados CSV
function loadCSV() {
    const fileInput = document.getElementById('fileInput');
    
    Papa.parse(fileInput.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            loadedData = results.data;
            populateDataSelect();
            displayDataPreview();
        },
    });
}

// Preenche a seleção de dados
function populateDataSelect() {
    const dataSelect = document.getElementById('dataSelect');
    dataSelect.innerHTML = "";

    if (loadedData.length > 0) {
        const headers = Object.keys(loadedData[0]);
        headers.forEach(header => {
            const option = document.createElement('option');
            option.value = header;
            option.textContent = header;
            dataSelect.appendChild(option);
        });
    }
}

// Exibe uma prévia dos dados em uma tabela
function displayDataPreview() {
    const dataPreview = document.getElementById('dataPreview');
    dataPreview.innerHTML = "";

    if (loadedData.length > 0) {
        const headers = Object.keys(loadedData[0]);

        // Cabeçalho da tabela
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        dataPreview.appendChild(headerRow);

        // Linhas de dados
        loadedData.slice(0, 5).forEach(rowData => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = rowData[header];
                row.appendChild(td);
            });
            dataPreview.appendChild(row);
        });
    }
}

// Gera o gráfico com base nas opções selecionadas
function generateChart() {
    const dataSelect = document.getElementById('dataSelect');
    const selectedDataKey = dataSelect.value;

    selectedData = loadedData.map(row => row[selectedDataKey]);

    const chartType = document.getElementById('chartType').value;
    const chartOptions = document.getElementById('chartOptions').value;

    try {
        chartOptionsObject = JSON.parse(chartOptions);
    } catch (error) {
        console.error('Erro ao analisar opções de gráfico JSON:', error);
        alert('Erro ao analisar opções de gráfico JSON. Verifique o console para obter detalhes.');
        return;
    }

    // Destruir o gráfico anterior, se existir
    if (chart) {
        chart.destroy();
    }

    // Criar novo gráfico
    const ctx = document.createElement('canvas').getContext('2d');
    document.body.appendChild(ctx.canvas);

    chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: loadedData.map(row => row['label']), // Substitua 'label' pelo nome da coluna que contém rótulos
            datasets: [{
                label: selectedDataKey,
                data: selectedData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo
                borderColor: 'rgba(75, 192, 192, 1)', // Cor da borda
                borderWidth: 1,
            }],
        },
        options: chartOptionsObject,
    });
}

// Exporta o gráfico como imagem PNG
function exportChart() {
    if (chart) {
        const canvas = chart.canvas;
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'chart.png';
        link.click();
    } else {
        alert('Gere um gráfico antes de exportar.');
    }
}
