/**
 * routes-data.js
 * Define um objeto global RoutesDB contendo uma base de dados simulada de rotas 
 * e métodos para extrair cidades e calcular distâncias.
 */

const RoutesDB = {
    // Array de objetos de rota com origem, destino e distância em km
    routes: [
        // Conexões entre capitais do Sudeste/Sul/Centro-Oeste
        { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
        { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKm: 586 },
        { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKm: 408 },
        { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
        { origin: "Rio de Janeiro, RJ", destination: "Belo Horizonte, MG", distanceKm: 444 },
        { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },
        { origin: "Rio de Janeiro, RJ", destination: "Vitória, ES", distanceKm: 521 },
        { origin: "Curitiba, PR", destination: "Florianópolis, SC", distanceKm: 300 },
        { origin: "Florianópolis, SC", destination: "Porto Alegre, RS", distanceKm: 476 },
        { origin: "Curitiba, PR", destination: "Porto Alegre, RS", distanceKm: 711 },
        { origin: "Goiânia, GO", destination: "Brasília, DF", distanceKm: 209 },

        // Conexões Nordeste
        { origin: "Salvador, BA", destination: "Aracaju, SE", distanceKm: 318 },
        { origin: "Aracaju, SE", destination: "Maceió, AL", distanceKm: 275 },
        { origin: "Maceió, AL", destination: "Recife, PE", distanceKm: 259 },
        { origin: "Recife, PE", destination: "João Pessoa, PB", distanceKm: 120 },
        { origin: "João Pessoa, PB", destination: "Natal, RN", distanceKm: 185 },
        { origin: "Natal, RN", destination: "Fortaleza, CE", distanceKm: 537 },
        { origin: "Salvador, BA", destination: "Recife, PE", distanceKm: 839 },
        { origin: "Fortaleza, CE", destination: "Teresina, PI", distanceKm: 604 },
        { origin: "Teresina, PI", destination: "São Luís, MA", distanceKm: 446 },

        // Conexões Norte
        { origin: "Belém, PA", destination: "Manaus, AM", distanceKm: 2833 },
        { origin: "Manaus, AM", destination: "Boa Vista, RR", distanceKm: 785 },
        { origin: "Porto Velho, RO", destination: "Rio Branco, AC", distanceKm: 511 },
        { origin: "Belém, PA", destination: "Macapá, AP", distanceKm: 329 }, // Via fluvial/aérea principal, mas listada como rota
        { origin: "Palmas, TO", destination: "Brasília, DF", distanceKm: 820 },

        // Rotas longas inter-regionais
        { origin: "São Paulo, SP", destination: "Salvador, BA", distanceKm: 1962 },
        { origin: "Rio de Janeiro, RJ", destination: "Recife, PE", distanceKm: 2338 },
        { origin: "Porto Alegre, RS", destination: "São Paulo, SP", distanceKm: 1109 },
        { origin: "Belo Horizonte, MG", destination: "Salvador, BA", distanceKm: 1372 },
        { origin: "Brasília, DF", destination: "Fortaleza, CE", distanceKm: 2120 },

        // Rotas regionais importantes
        { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
        { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 72 },
        { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
        { origin: "Rio de Janeiro, RJ", destination: "Petrópolis, RJ", distanceKm: 68 },
        { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 }
    ],

    // Retorna um array único e ordenado de todas as cidades nas rotas
    getAllCities: function() {
        const citiesSet = new Set();
        
        // Extrai da origem e destino
        this.routes.forEach(route => {
            citiesSet.add(route.origin);
            citiesSet.add(route.destination);
        });
        
        // Remove duplicatas (Set já faz isso) e ordena alfabeticamente
        return Array.from(citiesSet).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    },

    // Encontra a distância entre duas cidades, verificando em ambas as direções
    findDistance: function(origin, destination) {
        if (!origin || !destination) return null;

        // Normaliza as entradas: remove espaços e converte para minúsculas
        const normOrigin = origin.trim().toLowerCase();
        const normDest = destination.trim().toLowerCase();

        // Busca a rota
        const route = this.routes.find(r => {
            const rOrg = r.origin.toLowerCase();
            const rDst = r.destination.toLowerCase();
            
            // Verifica ida ou volta
            return (rOrg === normOrigin && rDst === normDest) || 
                   (rOrg === normDest && rDst === normOrigin);
        });

        // Retorna a distância em km se encontrada, null caso contrário
        return route ? route.distanceKm : null;
    }
};