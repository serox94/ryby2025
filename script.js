<script>
  const warunkiPL = {
    0: 'Bezchmurnie', 1: 'Głównie bezchmurnie', 2: 'Częściowo pochmurno', 3: 'Zachmurzenie całkowite',
    45: 'Mgła', 48: 'Osadzająca się mgła',
    51: 'Lekka mżawka', 53: 'Umiarkowana mżawka', 55: 'Gęsta mżawka',
    61: 'Lekki deszcz', 63: 'Umiarkowany deszcz', 65: 'Ulewne opady',
    71: 'Śnieg lekki', 73: 'Śnieg umiarkowany', 75: 'Obfite opady śniegu',
    80: 'Przelotne opady', 81: 'Umiarkowane przelotne', 82: 'Silne przelotne',
    95: 'Burza', 96: 'Burza z gradem', 99: 'Silna burza z gradem'
  };
  const dniPL = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

  fetch('https://api.open-meteo.com/v1/forecast?latitude=52.2184&longitude=6.8958&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean,weathercode&timezone=auto&start_date=2025-06-01&end_date=2025-06-07')
    .then(res => res.json())
    .then(data => {
      const forecastList = document.getElementById("forecastList");
      forecastList.innerHTML = "";
      for (let i = 0; i < data.daily.time.length; i++) {
        const dateStr = data.daily.time[i];
        const date = new Date(dateStr);
        const day = dniPL[date.getDay()];
        const tmin = data.daily.temperature_2m_min[i];
        const tmax = data.daily.temperature_2m_max[i];
        const rain = data.daily.precipitation_probability_mean[i];
        const code = data.daily.weathercode[i];
        const opis = warunkiPL[code] || 'Pogoda';
        let ikona = 'wi-day-sunny';
        if (code >= 3 && code < 61) ikona = 'wi-cloudy';
        if (code >= 61 && code < 80) ikona = 'wi-rain';
        if (code >= 80 && code < 90) ikona = 'wi-showers';
        if (code >= 95) ikona = 'wi-thunderstorm';

        forecastList.innerHTML += `<li><i class="wi ${ikona}"></i> ${day}, ${date.getDate()} czerwca: ${tmin}–${tmax}°C, Opady: ${rain}%, ${opis}</li>`;
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("forecastList").innerText = "Nie udało się załadować prognozy.";
    });
</script>
