setInterval(() => {
  const now = new Date();
  document.getElementById('datetime').innerText = now.toLocaleString('pl-PL');
}, 1000);

const targetDate = new Date('2025-06-01T14:00:00');
setInterval(() => {
  const now = new Date();
  const diff = targetDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  document.getElementById('countdown').innerText = `${days} dni ${hours} godz. ${minutes} min ${seconds} sek`;
}, 1000);

const hour = new Date().getHours();
document.getElementById('alertBox').innerText = hour >= 20 || hour < 6
  ? "Uwaga: noc – obniżenie temperatury i wzrost wilgotności."
  : "Dobre warunki do łowienia.";

fetch('https://api.openweathermap.org/data/2.5/onecall?lat=52.2184&lon=6.8958&units=metric&lang=pl&exclude=hourly,minutely&appid=fd3ff3668ce17f7d6ffe3073a1fb8a68')
  .then(res => res.json())
  .then(data => {
    const current = data.current;
    document.getElementById("weatherBox").innerHTML = `
      <img class="icon" src="https://openweathermap.org/img/wn/${current.weather[0].icon}.png" alt="pogoda"> 
      Temp: ${current.temp.toFixed(1)}°C, ${current.weather[0].description}<br>
      Wiatr: ${current.wind_speed} m/s, Ciśnienie: ${current.pressure} hPa, Wilgotność: ${current.humidity}%
    `;

    const forecastList = document.getElementById("forecastList");
    forecastList.innerHTML = "";
    const days = ['Niedz.', 'Pon.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sob.'];
    for (let i = 0; i < 7; i++) {
      const day = data.daily[i];
      const date = new Date(day.dt * 1000);
      const line = `${days[date.getDay()]} ${date.toLocaleDateString('pl-PL')}: ${day.temp.day.toFixed(1)}°C, ${day.weather[0].description}, Wiatr: ${day.wind_speed} m/s, Ciśnienie: ${day.pressure} hPa`;
      const li = document.createElement("li");
      const icon = document.createElement("img");
      icon.src = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
      icon.className = "icon";
      li.appendChild(icon);
      li.append(" " + line);
      forecastList.appendChild(li);
    }

    const pressure = current.pressure;
    const moonPhase = data.daily[0].moon_phase;
    let activity = "Średnia aktywność ryb";
    if ((moonPhase > 0.45 && moonPhase < 0.55) && pressure > 1012 && pressure < 1018) {
      activity = "Wysoka aktywność – pełnia i dobre ciśnienie!";
    } else if (pressure < 1005 || pressure > 1025) {
      activity = "Słaba aktywność – niekorzystne ciśnienie";
    }
    document.getElementById("biteCalendar").innerText = activity;
  });
