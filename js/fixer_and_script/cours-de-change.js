const apiKey = '43eb3d226e9e92dc18d75758d24add02';
    const currentEndpoint = `https://data.fixer.io/api/latest?access_key=${apiKey}&symbols=CDF,USD,EUR,XAF,GBP,CNY,ZAR,SAR,AED,CHF,CAD`;
  
    const currencyNames = {
        'USD': 'Dollar des États-Unis',
        'EUR': 'Euro',
        'XAF': 'Franc CFA (BEAC)',
        'GBP': 'Livre Sterling',
        'CNY': 'Yen Chinois - renminbi',
        'ZAR': 'Rand Sud-Africain',
        'SAR': 'Riyal Saoudien',
        'AED': 'Dirham des Émirats Arabes Unis',
        'CHF': 'Franc Suisse',
        'CAD': 'Dollar Canadien',
        'CDF': 'Franc Congolais'
    };
  
    async function getExchangeRates() {
        try {
            const response = await fetch(currentEndpoint);
            const data = await response.json();
  
            if (data.success) {
                return data.rates;
            } else {
                throw new Error('Erreur lors de la récupération des données');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
  
    async function updateExchangeRatesList() {
        const rates = await getExchangeRates();
        if (rates) {
            const exchangeRatesList = document.querySelector('#exchange-rates');
  
            exchangeRatesList.innerHTML = ''; // Effacer les anciennes données
  
            Object.keys(rates).forEach(currency => {
                if (currency !== 'CDF') { // Ne pas inclure le taux CDF en termes de CDF
                    const listItem = document.createElement('li');
                    listItem.classList.add('newsticker__item');
  
                    // Calculer le taux en termes de la devise de contrepartie
                    const rateInBaseCurrency = (1 / rates[currency]).toFixed(4); // Taux de la devise par rapport à CDF
                    const rateInTargetCurrency = (rateInBaseCurrency * rates['CDF']).toFixed(2); // Taux en CDF
  
                    listItem.textContent = `1 ${currency} : ${rateInTargetCurrency.replace('.', ',')} CDF`;
                    exchangeRatesList.appendChild(listItem);
                }
            });
          document.getElementById('usd-rate').textContent = `1 USD = ${(rates.CDF / rates.USD).toFixed(0).replace('.', ',')} ${currencyNames['CDF']}`;
  
        }
    }
  
    async function setup() {
        await updateExchangeRatesList();
    }
  
    setup();