fetch('https://api.open-meteo.com/v1/forecast?latitude=52.2184&longitude=6.8958&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=auto')
  .then(res => {
    if (!res.ok) throw new Error('Błąd w odpowiedzi API');
    return res.json();
  })
  .then(data => {
    const current = data.current_weather;
    if(current) {
      const weatherBox = document.getElementById("weatherBox");
      const opis = warunkiPL[current.weathercode] || 'Pogoda';
      let ikona = 'wi-day-sunny';
      if (current.weathercode >= 3 && current.weathercode < 61) ikona = 'wi-cloudy';
      if (current.weathercode >= 61 && current.weathercode < 80) ikona = 'wi-rain';
      if (current.weathercode >= 80 && current.weathercode < 90) ikona = 'wi-showers';
      if (current.weathercode >= 95) ikona = 'wi-thunderstorm';

      weatherBox.innerHTML = `
        <p><i class="wi ${ikona}"></i> Temperatura: ${current.temperature}°C</p>
        <p><i class="wi wi-barometer"></i> Prędkość wiatru: ${current.windspeed} km/h</p>
        <p>${opis}</p>
      `;
    }

    const forecastList = document.getElementById("forecastList");
    forecastList.innerHTML = "";
    for (let i = 0; i < data.daily.time.length; i++) {
      const dateStr = data.daily.time[i];
      const date = new Date(dateStr);
      const day = dniPL[date.getDay()];
      const tmin = data.daily.temperature_2m_min[i];
      const tmax = data.daily.temperature_2m_max[i];
      const rain = data.daily.precipitation_probability_max[i];
      const code = data.daily.weathercode[i];
      const opis = warunkiPL[code] || 'Pogoda';
      let ikona = 'wi-day-sunny';
      if (code >= 3 && code < 61) ikona = 'wi-cloudy';
      if (code >= 61 && code < 80) ikona = 'wi-rain';
      if (code >= 80 && code < 90) ikona = 'wi-showers';
      if (code >= 95) ikona = 'wi-thunderstorm';

      const li = document.createElement('li');
      li.innerHTML = `<i class="wi ${ikona}"></i> <strong>${day}</strong> (${dateStr}): ${tmin}°C – ${tmax}°C, szansa opadów: ${rain}% — ${opis}`;
      forecastList.appendChild(li);
    }

    const alertBox = document.getElementById("alertBox");
    if (data.daily.precipitation_probability_max.some(p => p > 50)) {
      alertBox.innerHTML = `<p><strong>Uwaga!</strong> Przewidywane są opady deszczu w najbliższych dniach.</p>`;
      alertBox.style.color = 'red';
    } else {
      alertBox.innerHTML = `<p>Brak poważnych alertów pogodowych.</p>`;
      alertBox.style.color = 'green';
    }
  })
  .catch(err => {
    document.getElementById("weatherBox").innerText = "Błąd pobierania danych pogodowych.";
    document.getElementById("forecastList").innerText = "";
    document.getElementById("alertBox").innerText = "";
    console.error(err);
  });
