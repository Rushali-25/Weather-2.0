const API_KEY = "your_api_key_here"; // Replace with OpenWeatherMap API Key

// Fetch current weather
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        updateWeatherDisplay(data);
        fetchForecast(city);
    } catch (error) {
        alert(error.message);
    }
}

// Fetch 5-day forecast
async function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateForecastDisplay(data);
    } catch (error) {
        alert("Unable to fetch forecast.");
    }
}

// Update current weather display
function updateWeatherDisplay(data) {
    const cityName = document.getElementById("city-name");
    const temperature = document.getElementById("temperature");
    const wind = document.getElementById("wind");
    const humidity = document.getElementById("humidity");
    const weatherIcon = document.getElementById("weather-icon");
    const weatherDescription = document.getElementById("weather-description");

    cityName.textContent = `${data.name} (${new Date().toLocaleDateString()})`;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    wind.textContent = `Wind: ${data.wind.speed} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDescription.textContent = data.weather[0].description;
}

// Update 5-day forecast display
function updateForecastDisplay(data) {
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = ""; // Clear previous forecast

    const forecastList = data.list.filter((item) => item.dt_txt.includes("12:00:00"));
    forecastList.forEach((item) => {
        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card", "col");

        forecastCard.innerHTML = `
            <h5>${new Date(item.dt_txt).toLocaleDateString()}</h5>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather Icon" class="forecast-icon" />
            <p>Temp: ${item.main.temp}°C</p>
            <p>Wind: ${item.wind.speed} m/s</p>
            <p>Humidity: ${item.main.humidity}%</p>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}

// Event Listeners
document.getElementById("search-button").addEventListener("click", () => {
    const city = document.getElementById("city-input").value;
    if (city) fetchWeather(city);
});

document.getElementById("location-button").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            updateWeatherDisplay(data);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
