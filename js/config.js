/**
 * config.js
 * Define configurações globais, fatores de emissão, créditos de carbono
 * e métodos de UI relacionados a preenchimento automático.
 */

const CONFIG = {
    // Fatores de emissão em kg CO2 por km rodado
    EMISSION_FACTORS: {
        bicycle: 0,
        car: 0.12,
        bus: 0.089,
        truck: 0.96
    },

    // Metadados para os modos de transporte (usado na UI)
    TRANSPORT_MODES: {
        bicycle: { label: "Bicicleta", icon: "🚲", color: "#10b981" }, // Verde
        car:     { label: "Carro",     icon: "🚗", color: "#3b82f6" }, // Azul
        bus:     { label: "Ônibus",    icon: "🚌", color: "#f59e0b" }, // Laranja/Amarelo
        truck:   { label: "Caminhão",  icon: "🚛", color: "#8b5cf6" }  // Roxo
    },

    // Configurações para o cálculo financeiro de créditos de carbono
    CARBON_CREDIT: {
        KG_PER_CREDIT: 1000, // 1 tonelada
        PRICE_MIN_BRL: 50,
        PRICE_MAX_BRL: 150
    },

    // Preenche o datalist do HTML com as cidades disponíveis no RoutesDB
    populateDataList: function() {
        const cities = RoutesDB.getAllCities();
        const datalist = document.getElementById('cities-list');
        
        if (!datalist) return;

        // Limpa opções existentes (se houver) e cria novas
        datalist.innerHTML = '';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            datalist.appendChild(option);
        });
    },

    // Configura os event listeners para o preenchimento automático da distância
    setupDistanceAutofill: function() {
        const originInput = document.getElementById('origin');
        const destInput = document.getElementById('destination');
        const distanceInput = document.getElementById('distance');
        const manualCheckbox = document.getElementById('manual-distance');
        const helperText = document.querySelector('.calculator-form__helper-text');

        if (!originInput || !destInput || !distanceInput || !manualCheckbox || !helperText) return;

        // Função interna para checar e preencher a distância
        const checkAndFillDistance = () => {
            // Se estiver em modo manual, não tentar preencher automaticamente
            if (manualCheckbox.checked) return;

            const originVal = originInput.value.trim();
            const destVal = destInput.value.trim();

            if (originVal && destVal) {
                const distance = RoutesDB.findDistance(originVal, destVal);

                if (distance !== null) {
                    // Distância encontrada
                    distanceInput.value = distance;
                    distanceInput.readOnly = true;
                    helperText.textContent = "Distância calculada automaticamente com sucesso!";
                    helperText.style.color = "var(--primary)"; // Cor verde do CSS
                } else {
                    // Distância não encontrada
                    distanceInput.value = '';
                    helperText.textContent = "Rota não encontrada. Por favor, insira a distância manualmente marcando a caixa abaixo.";
                    helperText.style.color = "var(--danger)"; // Cor vermelha do CSS
                }
            } else {
                // Inputs incompletos, reseta visual
                distanceInput.value = '';
                helperText.textContent = "A distância será preenchida automaticamente";
                helperText.style.color = "var(--text-light)"; // Cor cinza do CSS
            }
        };

        // Adiciona eventos 'change' nos inputs de origem e destino
        originInput.addEventListener('change', checkAndFillDistance);
        destInput.addEventListener('change', checkAndFillDistance);

        // Adiciona evento 'change' no checkbox manual
        manualCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Modo manual ativado
                distanceInput.readOnly = false;
                helperText.textContent = "Modo manual ativado. Insira a distância em km.";
                helperText.style.color = "var(--warning)"; // Cor amarela do CSS
                // Foca no input para facilitar a digitação
                distanceInput.focus(); 
            } else {
                // Modo manual desativado
                distanceInput.readOnly = true;
                // Tenta encontrar a rota novamente ao desmarcar
                checkAndFillDistance(); 
            }
        });
    }
};