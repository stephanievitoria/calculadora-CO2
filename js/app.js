/**
 * js/app.js
 * Arquivo principal que inicializa a aplicação, gerencia os eventos do DOM
 * e orquestra as chamadas entre a UI, as Configurações e a Calculadora.
 */

// Utiliza o evento DOMContentLoaded para garantir que o HTML foi totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    
    // 1. Preenche o datalist de cidades para o autocomplete
    CONFIG.populateDataList();
    
    // 2. Habilita a funcionalidade de preenchimento automático da distância
    CONFIG.setupDistanceAutofill();
    
    // 3. Obtém o elemento do formulário pelo ID
    const calculatorForm = document.getElementById('calculator-form');
    
    // 4. Adiciona o event listener para o evento de envio (submit) do formulário
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', handleFormSubmit);
    }
    
    // 5. Registra no console que a inicialização foi concluída com sucesso
    console.log("✅ Calculadora inicializada!");

    // ==========================================================================
    // FORM SUBMIT HANDLER
    // ==========================================================================
    
    function handleFormSubmit(e) {
        // 1. Previne o comportamento padrão de recarregar a página ao enviar o formulário
        e.preventDefault();
        
        // 2. Obtém e limpa todos os valores do formulário
        const originInput = document.getElementById('origin').value.trim();
        const destinationInput = document.getElementById('destination').value.trim();
        const distanceInput = parseFloat(document.getElementById('distance').value);
        
        // Obtém o valor do modo de transporte selecionado (radio button checado)
        const transportModeInput = document.querySelector('input[name="transport"]:checked').value;
        
        // 3. Validação dos inputs
        // Verifica se origem, destino e distância estão preenchidos, e se a distância é maior que 0
        if (!originInput || !destinationInput || isNaN(distanceInput) || distanceInput <= 0) {
            alert("Por favor, preencha todos os campos corretamente. A distância deve ser maior que zero.");
            return; // Interrompe a execução se a validação falhar
        }
        
        // 4. Obtém o elemento do botão de submit
        const submitButton = calculatorForm.querySelector('button[type="submit"]');
        
        // 5. Chama o método da UI para mostrar o estado de carregamento
        UI.showLoading(submitButton);
        
        // 6. Oculta as seções de resultados anteriores
        UI.hideElement('results');
        UI.hideElement('comparison');
        UI.hideElement('carbon-credits');
        
        // 7. Usa setTimeout com 1500ms de atraso para simular o processamento
        setTimeout(() => {
            try {
                // --- INÍCIO DOS CÁLCULOS ---
                
                // Calcula a emissão para o modo selecionado
                const emission = Calculator.calculateEmission(distanceInput, transportModeInput);
                
                // Calcula a emissão do carro como linha de base (baseline)
                const carEmission = Calculator.calculateEmission(distanceInput, 'car');
                
                // Calcula a economia em comparação com o carro
                const savings = Calculator.calculateSavings(emission, carEmission);
                
                // Calcula o comparativo entre todos os modos
                const allModesComparison = Calculator.calculateAllModes(distanceInput);
                
                // Calcula os créditos de carbono e a estimativa de preço
                const carbonCredits = Calculator.calculateCarbonCredits(emission);
                const creditPriceEstimate = Calculator.estimateCreditPrice(carbonCredits);
                
                // --- CONSTRUÇÃO DOS OBJETOS DE DADOS PARA RENDERIZAÇÃO ---
                
                const resultsData = {
                    origin: originInput,
                    destination: destinationInput,
                    distance: distanceInput,
                    emission: emission,
                    mode: transportModeInput,
                    savings: savings
                };

                const creditsData = {
                    credits: carbonCredits,
                    price: creditPriceEstimate
                };

                // --- RENDERIZAÇÃO NA UI ---
                
                // Chama renderResults e injeta o HTML no container correspondente
                const resultsContent = document.getElementById('results-content');
                resultsContent.innerHTML = UI.renderResults(resultsData);
                
                // Chama renderComparison e injeta o HTML
                const comparisonContent = document.getElementById('comparison-content');
                comparisonContent.innerHTML = UI.renderComparison(allModesComparison, transportModeInput);
                
                // Chama renderCarbonCredits e injeta o HTML
                const carbonCreditsContent = document.getElementById('carbon-credits-content');
                carbonCreditsContent.innerHTML = UI.renderCarbonCredits(creditsData);
                
                // Mostra todas as três seções
                UI.showElement('results');
                UI.showElement('comparison');
                UI.showElement('carbon-credits');
                
                // Rola a página suavemente até a seção de resultados
                UI.scrollToElement('results');
                
                // Remove o estado de carregamento do botão
                UI.hideLoading(submitButton);
                
            } catch (error) {
                // --- TRATAMENTO DE ERROS ---
                
                // Registra o erro no console para debug
                console.error("Erro durante o processamento dos cálculos:", error);
                
                // Mostra um alerta amigável para o usuário
                alert("Ocorreu um erro inesperado ao calcular as emissões. Por favor, tente novamente.");
                
                // Garante que o botão volte ao estado normal mesmo em caso de erro
                UI.hideLoading(submitButton);
            }
            
        }, 1500); // 1500ms de delay
    }
});