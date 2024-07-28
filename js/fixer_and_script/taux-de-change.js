//Page Taux_d'echange

        // Fonction pour afficher l'heure actuelle avec date complète
        function updateClock() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const seconds = now.getSeconds().toString().padStart(2, "0");
            const day = now.getDate().toString().padStart(2, "0");
            const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
            const year = now.getFullYear();

            const dateString = `${day}/${month}/${year}`;
            const timeString = `${hours}:${minutes}:${seconds}`;

            document.getElementById(
            "current-time"
            ).textContent = `Date : ${dateString} | Heure : ${timeString}`;
        }

        // Mettre à jour l'heure toutes les secondes
        setInterval(updateClock, 1000);

        // Appel initial pour afficher l'heure dès le chargement de la page
        updateClock();

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

      async function getHistoricalRates() {
          const now = new Date();
          const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          const formattedDate = pastDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
          const historicalEndpoint = `https://data.fixer.io/api/${formattedDate}?access_key=${apiKey}&symbols=CDF,USD,EUR,XAF,GBP,JPY,ZAR,SAR,AED,CHF,CAD`;

          try {
              const response = await fetch(historicalEndpoint);
              const data = await response.json();

              if (data.success) {
                  return data.rates;
              } else {
                  throw new Error('Erreur lors de la récupération des données historiques');
              }
          } catch (error) {
              console.error('Erreur:', error);
          }
      }

      function updateDateTime() {
          const now = new Date();
          const optionsDate = {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          };
          const optionsTime = {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
          };
          const dateString = now.toLocaleDateString('fr-FR', optionsDate).toUpperCase();
          const timeString = now.toLocaleTimeString('fr-FR', optionsTime);
          document.getElementById('date-time').textContent = `${dateString} | ${timeString}`;
      }

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

      function calculateVariation(currentRate, historicalRate) {
          return currentRate - historicalRate;
      }

      async function updateExchangeRatesTable() {
          const rates = await getExchangeRates();
          if (rates) {
              const cdfRate = rates.CDF; // Taux de base CDF
              const tbody = document.querySelector('#exchange-rates tbody');

              const historicalRates = await getHistoricalRates();
              if (historicalRates) {
                  Object.keys(rates).forEach(currency => {
                      if (currency !== 'CDF') { // Ne pas inclure le taux CDF/CDF
                          const tr = document.createElement('tr');
                          const tdCurrency = document.createElement('td');
                          const tdRate = document.createElement('td');
                          const tdVariation = document.createElement('td');

                          // Calculer le taux en termes de la devise de contrepartie
                          const rateInBaseCurrency = (1 / rates[currency]).toFixed(4); // Taux de la devise par rapport à CDF
                          const rateInTargetCurrency = (rateInBaseCurrency * rates['CDF']).toFixed(4); // Taux en CDF

                          tdCurrency.textContent = `${currencyNames[currency]} (${currency})`;
                          tdRate.textContent = `${rateInTargetCurrency.replace('.', ',')} CDF `;

                          const historicalRate = 1 / historicalRates[currency];
                          const historicalRateInTargetCurrency = (historicalRate * rates['CDF']).toFixed(4);
                          const variation = calculateVariation(rateInTargetCurrency, historicalRateInTargetCurrency); // Calculer la variation
                          const indicator = document.createElement('span');
                          indicator.classList.add('indicator');
                          if (variation >= 0) {
                              indicator.classList.add('arrow-up');
                              tdVariation.textContent = '';
                              indicator.classList.add('variation-up');
                          } else {
                              indicator.classList.add('arrow-down');
                              tdVariation.textContent = '';
                              indicator.classList.add('variation-down');
                          }
                          tdVariation.appendChild(indicator);

                          tr.appendChild(tdCurrency);
                          tr.appendChild(tdRate);
                          tr.appendChild(tdVariation);
                          tbody.appendChild(tr);
                      }
                  });

                  // Mettre à jour le taux USD en bas du tableau
                  document.getElementById('usd-rate').textContent = `1 USD = ${(rates.CDF / rates.USD).toFixed(0).replace('.', ',')} ${currencyNames['CDF']}`;
              }
          }
      }

      async function setup() {
          updateDateTime();
          await updateExchangeRatesTable();
          populateCurrencySelects();
      }

      async function populateCurrencySelects() {
          const rates = await getExchangeRates();
          const currencies = Object.keys(rates).filter(currency => currency !== 'CDF');
          const baseCurrencySelect = document.getElementById('base-currency');
          const targetCurrencySelect = document.getElementById('target-currency');

          currencies.forEach(currency => {
              const option = document.createElement('option');
              option.value = currency;
              option.textContent = `${currencyNames[currency]} (${currency})`;
              baseCurrencySelect.appendChild(option.cloneNode(true));
              targetCurrencySelect.appendChild(option);
          });

          // Ajouter l'option pour CDF
          const cdfOption = document.createElement('option');
          cdfOption.value = 'CDF';
          cdfOption.textContent = `${currencyNames['CDF']} (CDF)`;
          baseCurrencySelect.appendChild(cdfOption.cloneNode(true));
          targetCurrencySelect.appendChild(cdfOption);
      }

      document.getElementById('conversion-form').addEventListener('submit', async function (event) {
          event.preventDefault();

          const amount = parseFloat(document.getElementById('amount').value);
          const baseCurrency = document.getElementById('base-currency').value;
          const targetCurrency = document.getElementById('target-currency').value;

          const rates = await getExchangeRates();

          if (rates && baseCurrency && targetCurrency) {
              const baseRate = rates[baseCurrency];
              const targetRate = rates[targetCurrency];
              
              if (baseRate && targetRate) {
                  // Convertir le montant de la devise de base en CDF
                  const amountInCDF = amount * (1 / baseRate);
                  // Convertir le montant en CDF à la devise de contrepartie
                  const convertedAmount = amountInCDF * targetRate;

                  document.getElementById('conversion-result').textContent = `${amount} ${currencyNames[baseCurrency]} = ${convertedAmount.toFixed(1).replace('.', ',')} ${currencyNames[targetCurrency]}`;
              } else {
                  document.getElementById('conversion-result').textContent = 'Erreur lors de la récupération des taux de change.';
              }
          }
      });

      setup();

