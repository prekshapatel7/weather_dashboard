// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityElem = document.getElementById('cityName');
const descElem = document.getElementById('desc');
const tempElem = document.getElementById('temp');
const humidityElem = document.getElementById('humidity');
const windElem = document.getElementById('wind');
const weatherBox = document.getElementById('weather');
const themeBtn = document.getElementById('themeBtn');
const body = document.body;

// Theme Toggle
themeBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  themeBtn.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
});

// Initialize Chart.js
const ctx = document.getElementById('tempChart').getContext('2d');
const tempChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature (°C)',
      data: [],
      borderColor: 'orange',
      backgroundColor: 'rgba(255,165,0,0.2)',
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: true, position: 'top' } },
    scales: { y: { beginAtZero: false } }
  }
});

// Update Chart
function updateTempChart(hourlyData) {
  const labels = hourlyData.map(hour => hour.time);
  const temps = hourlyData.map(hour => hour.temp);
  tempChart.data.labels = labels;
  tempChart.data.datasets[0].data = temps;
  tempChart.update();
}

// Fetch Weather Function
async function fetchWeather(city) {
  const API_KEY = '25a5c8cab98ca574e99f54f6054037ac';
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  const data = await res.json();

  if (data.cod !== "200") {
    document.getElementById('error').textContent = 'City not found!';
    weatherBox.classList.add('hidden');
    return;
  }

  document.getElementById('error').textContent = '';

  // Show weather box
  weatherBox.classList.remove('hidden');
  const homeBackground = document.getElementById('homeBackground');

// Hide full-page background when data is displayed
homeBackground.classList.add('hidden');


  // Update main weather info
  cityElem.textContent = data.city.name;
  descElem.textContent = data.list[0].weather[0].description;
  tempElem.textContent = `🌡️ Temp: ${data.list[0].main.temp} °C`;
  humidityElem.textContent = `💧 Humidity: ${data.list[0].main.humidity}%`;
  windElem.textContent = `💨 Wind: ${data.list[0].wind.speed} m/s`;

  // Prepare hourly data (first 8 intervals ~ 24h)
  const hourlyData = data.list.slice(0, 8).map(item => {
    const date = new Date(item.dt * 1000);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return { time: `${hours} ${ampm}`, temp: item.main.temp };
  });

  updateTempChart(hourlyData);
}

// Search Event
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});


