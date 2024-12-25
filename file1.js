
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const countryName = document.getElementById('countryInput').value.trim();
    if (!countryName) return alert('Please enter a country name');

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(err => console.error('Error fetching country data:', err));
});

function displayResults(data) {
    const results = document.getElementById('results');
    results.innerHTML = '';

    data.forEach(country => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
            <div class="card">
                <img src="${country.flags.svg}" class="card-img-top" alt="${country.name.common} Flag">
                <div class="card-body">
                    <h5 class="card-title">${country.name.common}</h5>
                    <p class="card-text">Population: ${country.population.toLocaleString()}</p>
                    <p class="card-text">Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
                    <button class="btn btn-primary" onclick="getWeather('${country.capital ? country.capital[0] : ''}', '${country.name.common}')">More Details</button>
                </div>
            </div>
        `;
        results.appendChild(card);
    });
}

function getWeather(capital, countryName) {
    var key = "4ceb410ca92e40fcb1385745240312";
    var url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${capital}&days=3&aqi=no&alerts=no`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var current = data.current;
            var condition = current.condition;
            var temperature = current.temp_c;
            var city = data.location.name;
            var country = data.location.country;
            var forecastDays = data.forecast.forecastday;
            let currentData = `
                <div class="currentDay">   
                    City: ${city} 
                    | Country: ${country} 
                    | Present Temperature: ${temperature} 
                    | Present weather condition: ${condition.text} 
                    <img src="${condition.icon}">
                </div>`;
            document.getElementById('displayArea').innerHTML += currentData;
         
            for (let dailyForecast of forecastDays) {
                currentData += `
                <tc> 
                    <td>Date: ${dailyForecast.date}</td> 
                    <td>| Average Temperature: ${dailyForecast.day.avgtemp_c}</td>
                    <td><img src="${dailyForecast.day.condition.icon}"></td>
                </tc>
                `;
            }
            currentData += `</table>`;
            document.getElementById('displayArea').innerHTML = currentData;
        })
        .catch(err => console.error('Error fetching weather data:', err));
}


