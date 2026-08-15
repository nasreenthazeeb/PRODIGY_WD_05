const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const cityName = document.getElementById("cityName");
const weatherCondition = document.getElementById("weatherCondition");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const message = document.getElementById("message");


/* Search city */

searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    getCityCoordinates(city);

});


/* Press Enter to search */

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});


/* Get city coordinates */

async function getCityCoordinates(city) {

    message.textContent = "Searching...";

    try {

        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const data = await response.json();

        if (!data.results || data.results.length === 0) {

            message.textContent = "City not found.";

            return;
        }

        const location = data.results[0];

        getWeather(
            location.latitude,
            location.longitude,
            location.name,
            location.country
        );

    } catch (error) {

        message.textContent =
            "Unable to get weather data.";

        console.error(error);
    }

}


/* Get weather */

async function getWeather(latitude, longitude, name, country) {

    message.textContent = "Loading weather...";

    try {

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        const data = await response.json();

        const current = data.current;

        cityName.textContent = `${name}, ${country}`;

        temperature.textContent =
            Math.round(current.temperature_2m);

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;

        weatherCondition.textContent =
            getWeatherDescription(current.weather_code);

        message.textContent = "";

    } catch (error) {

        message.textContent =
            "Unable to load weather.";

        console.error(error);
    }

}


/* Weather descriptions */

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear Sky ☀️";
    }

    if (code === 1 || code === 2) {
        return "Partly Cloudy 🌤️";
    }

    if (code === 3) {
        return "Cloudy ☁️";
    }

    if (code >= 45 && code <= 48) {
        return "Foggy 🌫️";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle 🌦️";
    }

    if (code >= 61 && code <= 67) {
        return "Rainy 🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "Snowy ❄️";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers 🌦️";
    }

    if (code >= 95) {
        return "Thunderstorm ⛈️";
    }

    return "Unknown Weather";
}


/* Use current location */

locationBtn.addEventListener("click", function () {

    if (!navigator.geolocation) {

        message.textContent =
            "Geolocation is not supported by your browser.";

        return;
    }

    message.textContent =
        "Getting your location...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            getWeatherByLocation(
                latitude,
                longitude
            );

        },

        function () {

            message.textContent =
                "Unable to access your location.";

        }

    );

});


/* Weather using current location */

async function getWeatherByLocation(latitude, longitude) {

    try {

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        const data = await response.json();

        const current = data.current;

        cityName.textContent = "Your Current Location";

        temperature.textContent =
            Math.round(current.temperature_2m);

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;

        weatherCondition.textContent =
            getWeatherDescription(current.weather_code);

        message.textContent = "";

    } catch (error) {

        message.textContent =
            "Unable to load weather.";

        console.error(error);
    }

}