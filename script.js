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
const miesiacePL = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];

// Aktualna data i czas
setInterval(() => {
  const now = new Date();
  const dzienTyg = dniPL[now.getDay()];
  const d = now.getDate();
  const m = miesiacePL[now.getMonth()];
  const y = now.getFullYear();
  const godz = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');
  const sek = now.getSeconds().toString().padStart(2, '0');
  document.getElementById("datetime").innerText = `${dzienTyg}, ${d} ${m} ${y}, ${godz}:${min}:${sek}`;
}, 1000);

// Odliczanie do 1 czerwca 2025, 14:00
const countdownTarget = new Date("2025-06-01T14:00:00");
function updateCountdown() {
  const now = new Date();
  const diff = countdownTarget - now;
  if (diff <= 0) {
    document.getElementById("countdown").innerText = "Start nadszedł!";
    return;
  }
  const dni = Math.floor(diff / (1000 * 60 * 60 * 24));
  const godz = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const min = Math.floor((diff / (1000 * 60)) % 60);
  const sek = Math.floor((diff / 1000) % 60);
  document.getElementById("countdown").innerText = `${dni} dni, ${godz} godzin, ${min} minut, ${sek} sekund`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Pobieranie aktualnej pogody i prognozy
fetch('https://api.open-meteo.com/v1/forecast?latitude=52.2184&longitude=6.8958&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_mean,weathercode&timezone=auto&start_date=2025-06-01&end_date=2025-06-07')
  .then(res => res.json())
  .then(data => {
    // Aktualna pogoda
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

    // Prognoza 1–7 czerwca
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

      const li = document.createElement('li');
      li.innerHTML = `<i class="wi ${ikona}"></i> <strong>${day}</strong> (${dateStr}): ${tmin}°C – ${tmax}°C, szansa opadów: ${rain}% — ${opis}`;
      forecastList.appendChild(li);
    }

    // Alert pogodowy (przykład)
    const alertBox = document.getElementById("alertBox");
    if (data.daily.precipitation_probability_mean.some(p => p > 50)) {
      alertBox.innerHTML = `<p><strong>Uwaga!</strong> Przewidywane są opady deszczu w najbliższych dniach.</p>`;
      alertBox.style.color = 'red';
    } else {
      alertBox.innerHTML = `<p>Brak poważnych alertów pogodowych.</p>`;
      alertBox.style.color = 'green';
    }
  })
  .catch(() => {
    document.getElementById("weatherBox").innerText = "Błąd pobierania danych pogodowych.";
    document.getElementById("forecastList").innerText = "";
    document.getElementById("alertBox").innerText = "";
  });

// TODO: Kalkulator kalendarza brań (na ten moment - przykładowy tekst)
document.getElementById("biteCalendar").innerText = "Faza księżyca i intensywność brań będą tu w przyszłości.";

// Przechowywanie i ładowanie dziennika i harmonogramu przynęt lokalnie (localStorage)
function saveTextarea(id) {
  const el = document.getElementById(id);
  if(el) {
    localStorage.setItem(id, el.value);
  }
}

function loadTextarea(id) {
  const el = document.getElementById(id);
  if(el) {
    el.value = localStorage.getItem(id) || "";
  }
}

// Dodanie id i obsługa textarea
window.addEventListener("DOMContentLoaded", () => {
  // Nadajemy id elementom textarea w harmonogramie przynęt i dziennikach
  const harmonogramy = document.querySelectorAll('div.box:nth-child(6) textarea');
  const dzienniki = document.querySelectorAll('div.box:nth-child(7) textarea');

  harmonogramy.forEach((el, i) => {
    const id = `harmonogram${i}`;
    el.id = id;
    el.addEventListener('input', () => saveTextarea(id));
    loadTextarea(id);
  });

  dzienniki.forEach((el, i) => {
    const id = `dziennik${i}`;
    el.id = id;
    el.addEventListener('input', () => saveTextarea(id));
    loadTextarea(id);
  });
});
