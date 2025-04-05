const apiKey = "a48a000822e7bdff60203c602214b15b";

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function displayWeather(data) {
  const weatherDiv = document.getElementById("weather");
  if (data.cod !== 200) {
    weatherDiv.innerHTML = `<p>Error: ${data.message}</p>`;
    return;
  }

  const { name, main, weather, wind } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const description = weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1);

  weatherDiv.innerHTML = `
    <h2>📍 ${name}</h2>
    <img src="${iconUrl}" class="icon" alt="${description}">
    <p><strong>${weather[0].main}</strong>: ${description}</p>
    <p>🌡 Temperature: ${main.temp}°C</p>
    <p>💧 Humidity: ${main.humidity}%</p>
    <p>🌬 Wind: ${wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "<h3>5-Day Forecast</h3>";

  const daily = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date]) {
      daily[date] = item;
    }
  });

  Object.keys(daily).slice(0, 5).forEach(date => {
    const item = daily[date];
    const icon = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const temp = item.main.temp;
    const desc = item.weather[0].description;

    forecastDiv.innerHTML += `
      <div class="forecast-day">
        <p><strong>${date}</strong></p>
        <img src="${iconUrl}" class="icon" alt="${desc}">
        <p>${temp}°C</p>
        <p>${desc}</p>
      </div>
    `;
  });
}

function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city name.");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      displayWeather(data);
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    })
    .then(res => res.json())
    .then(displayForecast)
    .catch(err => console.error(err));
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          displayWeather(data);
          return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
        })
        .then(res => res.json())
        .then(displayForecast)
        .catch(err => console.error(err));
    }, () => {
      alert("Location access denied.");
    });
  } else {
    alert("Geolocation not supported.");
  }
}
