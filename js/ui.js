/**
 * js/ui.js
 * Cria um objeto global UI contendo métodos utilitários, manipulação de DOM 
 * e métodos de renderização de templates HTML baseados nos dados calculados.
 * Todos os métodos fazem parte do objeto global UI.
 */

const UI = {
    // ==========================================================================
    // UTILITY METHODS
    // ==========================================================================

    formatNumber: function(number, decimals) {
        // Usa toFixed() para garantir as casas decimais corretas
        // Adiciona separadores de milhar usando toLocaleString('pt-BR')
        return Number(number.toFixed(decimals)).toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    formatCurrency: function(value) {
        // Formata como R$ com a localidade pt-BR
        // Retorna no formato "R$ 1.234,56"
        return Number(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    },

    showElement: function(elementId) {
        // Obtém elemento por ID
        const el = document.getElementById(elementId);
        if (el) {
            // Remove a classe 'hidden'
            el.classList.remove('hidden');
        }
    },

    hideElement: function(elementId) {
        // Obtém elemento por ID
        const el = document.getElementById(elementId);
        if (el) {
            // Adiciona a classe 'hidden'
            el.classList.add('hidden');
        }
    },

    scrollToElement: function(elementId) {
        // Obtém elemento por ID
        const el = document.getElementById(elementId);
        if (el) {
            // Usa scrollIntoView com comportamento suave
            el.scrollIntoView({ behavior: 'smooth' });
        }
    },

    showLoading: function(buttonElement) {
        if (!buttonElement) return;
        // Salva o texto original no atributo data
        buttonElement.dataset.originalText = buttonElement.innerHTML;
        // Desabilita o botão
        buttonElement.disabled = true;
        // Altera o innerHTML para mostrar o spinner e o texto "Calculando..."
        buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
    },

    hideLoading: function(buttonElement) {
        if (!buttonElement) return;
        // Habilita o botão
        buttonElement.disabled = false;
        // Restaura o texto original do atributo data
        if (buttonElement.dataset.originalText) {
            buttonElement.innerHTML = buttonElement.dataset.originalText;
        }
    },

    // ==========================================================================
    // RENDERING METHODS
    // ==========================================================================

    renderResults: function(data) {
        // O objeto data contém: origin, destination, distance, emission, mode, savings
        // Obtém metadados do modo em CONFIG.TRANSPORT_MODES
        const modeMeta = CONFIG.TRANSPORT_MODES[data.mode] || { label: data.mode, icon: '❓', color: 'gray' };

        // Cria a string HTML com template literals usando divs com class="results__card" 
        // e convenção BEM para elementos internos
        let html = `
            <div class="results__grid">
                
                <div class="results__card">
                    <h4 class="results__card-title">Rota</h4>
                    <p class="results__card-value">${data.origin} ➔ ${data.destination}</p>
                </div>

                <div class="results__card">
                    <h4 class="results__card-title">Distância</h4>
                    <p class="results__card-value">${this.formatNumber(data.distance, 1)} km</p>
                </div>

                <div class="results__card results__card--highlight">
                    <h4 class="results__card-title">Emissão de CO₂ 🌿</h4>
                    <p class="results__card-value results__card-value--large">${this.formatNumber(data.emission, 2)} kg</p>
                </div>

                <div class="results__card">
                    <h4 class="results__card-title">Transporte</h4>
                    <p class="results__card-value" style="color: ${modeMeta.color};">
                        ${modeMeta.icon} ${modeMeta.label}
                    </p>
                </div>
        `;

        // Se o modo não for 'car' e houver economia: savings card mostrando kg salvos e porcentagem
        if (data.mode !== 'car' && data.savings && data.savings.savedKg > 0) {
            html += `
                <div class="results__card results__card--savings">
                    <h4 class="results__card-title">Economia vs Carro</h4>
                    <p class="results__card-value">
                        Você economizou ${this.formatNumber(data.savings.savedKg, 2)} kg de CO₂ (${this.formatNumber(data.savings.percentage, 1)}%)
                    </p>
                </div>
            `;
        }

        html += `</div>`;
        return html; // Retorna a string HTML completa
    },

    renderComparison: function(modesArray, selectedMode) {
        // modesArray vem de Calculator.calculateAllModes()
        let html = '<div class="comparison__list">';

        // Usa emissão máxima para referência de 100% na barra de progresso
        const maxEmission = Math.max(...modesArray.map(m => m.emission), 0.01);

        // Cria a string HTML para cada modo:
        modesArray.forEach(item => {
            const modeMeta = CONFIG.TRANSPORT_MODES[item.mode] || { label: item.mode, icon: '', color: 'gray' };
            const isSelected = item.mode === selectedMode;
            
            // Container div com class="comparison__item"
            // Se mode === selectedMode, adiciona class="comparison__item--selected"
            const containerClass = isSelected ? "comparison__item comparison__item--selected" : "comparison__item";
            
            // Largura da barra de progresso baseada na emissão (referência de 100%)
            const barWidth = Math.min((item.emission / maxEmission) * 100, 100);

            // Color-code da barra: verde (0-25%), amarelo (25-75%), laranja (75-100%), vermelho (>100%)
            let barColor = "#10b981"; // Verde
            if (item.percentageVsCar > 25 && item.percentageVsCar <= 75) barColor = "#f59e0b"; // Amarelo
            else if (item.percentageVsCar > 75 && item.percentageVsCar <= 100) barColor = "#f97316"; // Laranja
            else if (item.percentageVsCar > 100) barColor = "#ef4444"; // Vermelho

            html += `
                <div class="${containerClass}">
                    <div class="comparison__header">
                        <span class="comparison__label">
                            <span class="comparison__icon">${modeMeta.icon}</span> 
                            ${modeMeta.label}
                            ${isSelected ? `<span class="comparison__badge" style="background-color: ${modeMeta.color};">Selecionado</span>` : ''}
                        </span>
                        
                        <div class="comparison__stats">
                            <span class="comparison__emission">${this.formatNumber(item.emission, 2)} kg</span>
                            <span class="comparison__percentage">${this.formatNumber(item.percentageVsCar, 0)}% ref. carro</span>
                        </div>
                    </div>

                    <div class="comparison__bar-bg">
                        <div class="comparison__bar-fill" style="width: ${barWidth}%; background-color: ${barColor};"></div>
                    </div>
                </div>
            `;
        });

        // No final, adiciona tip box com mensagem útil
        html += `
            <div class="comparison__tip">
                <p><strong>Dica:</strong> Pequenas mudanças no transporte diário podem gerar grandes reduções na sua pegada de carbono ao longo do ano.</p>
            </div>
        </div>`;

        return html; // Retorna a string HTML completa
    },

    renderCarbonCredits: function(creditsData) {
        // creditsData contém: { credits, price: { min, max, average } }
        // Usa formatNumber e formatCurrency para os valores
        
        // Cria string HTML com Grid contendo 2 cards
        let html = `
            <div class="credits__grid">
                
                <div class="credits__card">
                    <h4 class="credits__card-title">Créditos Necessários</h4>
                    <p class="credits__value-large">${this.formatNumber(creditsData.credits, 4)}</p>
                    <p class="credits__helper-text">1 crédito = 1000 kg CO₂</p>
                </div>

                <div class="credits__card">
                    <h4 class="credits__card-title">Custo Estimado</h4>
                    <p class="credits__value-large">${this.formatCurrency(creditsData.price.average)}</p>
                    <p class="credits__helper-text">Varia de ${this.formatCurrency(creditsData.price.min)} a ${this.formatCurrency(creditsData.price.max)}</p>
                </div>
            </div>
            
            <div class="credits__info-box">
                <p><strong>O que são Créditos de Carbono?</strong> São certificados que representam a não emissão ou remoção de 1 tonelada de carbono da atmosfera. Ao comprá-los, você financia projetos ambientais certificados.</p>
            </div>

            <button class="calculator-form__button credits__button" type="button">🛒 Compensar Emissões</button>
        `;

        return html; // Retorna a string HTML completa
    }
};