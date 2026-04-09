/**
 * calculator.js
 * Define o objeto global Calculator contendo os métodos matemáticos 
 * para cálculo de emissões, comparações e estimativas de créditos de carbono.
 */

const Calculator = {
    /**
     * Calcula a emissão de CO2 para uma distância e modo de transporte específicos.
     * @param {number} distanceKm - Distância em quilômetros.
     * @param {string} transportMode - Chave do modo de transporte (ex: 'car', 'bus').
     * @returns {number} Emissão total em kg de CO2, arredondada para 2 casas decimais.
     */
    calculateEmission: function(distanceKm, transportMode) {
        // Obtém o fator de emissão do CONFIG usando o modo de transporte como chave
        const factor = CONFIG.EMISSION_FACTORS[transportMode];
        
        // Calcula: distância * fator
        const emission = distanceKm * factor;
        
        // Retorna o resultado arredondado para 2 casas decimais
        return Number(emission.toFixed(2));
    },

    /**
     * Calcula as emissões para todos os modos de transporte disponíveis 
     * e os compara com o carro (baseline).
     * @param {number} distanceKm - Distância em quilômetros.
     * @returns {Array} Array de objetos ordenado da menor para a maior emissão.
     */
    calculateAllModes: function(distanceKm) {
        // Cria array para armazenar os resultados
        const results = [];
        
        // Calcula a emissão do carro como linha de base (baseline)
        const carEmission = this.calculateEmission(distanceKm, 'car');

        // Para cada modo de transporte em CONFIG.EMISSION_FACTORS:
        for (const mode in CONFIG.EMISSION_FACTORS) {
            // Calcula a emissão para aquele modo
            const emission = this.calculateEmission(distanceKm, mode);
            
            // Calcula a porcentagem em relação ao carro: (emissão / emissão do carro) * 100
            let percentageVsCar = 0;
            if (carEmission > 0) {
                percentageVsCar = (emission / carEmission) * 100;
            }

            // Adiciona o objeto ao array
            results.push({
                mode: mode,
                emission: emission,
                percentageVsCar: Number(percentageVsCar.toFixed(2))
            });
        }

        // Ordena o array pela emissão (do menor para o maior)
        results.sort((a, b) => a.emission - b.emission);

        // Retorna o array
        return results;
    },

    /**
     * Calcula a economia de emissão de um modo em relação à linha de base.
     * @param {number} emission - Emissão do modo escolhido (kg CO2).
     * @param {number} baselineEmission - Emissão da linha de base (kg CO2).
     * @returns {Object} Objeto com kg economizados e a porcentagem de economia.
     */
    calculateSavings: function(emission, baselineEmission) {
        // Calcula os kg salvos: baseline - emissão
        const savedKg = baselineEmission - emission;
        
        // Calcula a porcentagem: (salvo / baseline) * 100
        let percentage = 0;
        if (baselineEmission > 0) {
            percentage = (savedKg / baselineEmission) * 100;
        }

        // Retorna o objeto com os números arredondados para 2 casas decimais
        return {
            savedKg: Number(savedKg.toFixed(2)),
            percentage: Number(percentage.toFixed(2))
        };
    },

    /**
     * Converte a emissão de CO2 em frações de Créditos de Carbono.
     * @param {number} emissionKg - Emissão total em kg de CO2.
     * @returns {number} Quantidade de créditos, arredondada para 4 casas decimais.
     */
    calculateCarbonCredits: function(emissionKg) {
        // Divide a emissão por CONFIG.CARBON_CREDIT.KG_PER_CREDIT (ex: 1000 kg por tonelada)
        const credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;
        
        // Retorna arredondado para 4 casas decimais
        return Number(credits.toFixed(4));
    },

    /**
     * Estima o custo financeiro para compensar os créditos de carbono calculados.
     * @param {number} credits - Quantidade de créditos de carbono.
     * @returns {Object} Objeto com valores mínimo, máximo e médio em Reais (BRL).
     */
    estimateCreditPrice: function(credits) {
        // Calcula o mínimo: créditos * PRICE_MIN_BRL
        const min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
        
        // Calcula o máximo: créditos * PRICE_MAX_BRL
        const max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;
        
        // Calcula a média: (mínimo + máximo) / 2
        const average = (min + max) / 2;

        // Retorna o objeto com os valores arredondados para 2 casas decimais
        return {
            min: Number(min.toFixed(2)),
            max: Number(max.toFixed(2)),
            average: Number(average.toFixed(2))
        };
    }
};