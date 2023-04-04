let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesdsay",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function formatDate(date) {
  let weekDay = date.getDay();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let mins = date.getMinutes();
  if (mins < 10) {
    mins = `0${mins}`;
  }
  weekDay = days[weekDay];
  month = months[month];
  return `${weekDay}, ${month} ${day}, ${year}, ${hour}:${mins} `;
}
let currentDate = document.querySelector("#current-time");
currentDate.innerHTML = formatDate(new Date());

function replaceCity(event) {
  event.preventDefault();

  let cityElement = document.querySelector("#citySubmited");
  let city = cityElement.value;
  cityElement.value = "";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${city}&units=${unit}`;
  axios.get(apiUrl).then(updateTemp);
}
let searchedCity = document.querySelector("#searched-city-form");
searchedCity.addEventListener("submit", replaceCity);

function convert(event) {
  let inactiveEle = event.target;
  let activeEle = document.querySelector("#active-unit");
  let tempEle = document.querySelector("#temperature");
  let currentTemp = parseInt(tempEle.innerHTML);
  let isFht = activeEle.innerHTML === "°F";

  let newVal;
  if (isFht) {
    newVal = (currentTemp - 32) * (5 / 9);
  } else {
    newVal = currentTemp * 1.8 + 32;
  }
  newVal = Math.round(newVal);
  tempEle.innerHTML = newVal;
  activeEle.innerHTML = isFht ? "°C" : "°F";
  inactiveEle.innerHTML = isFht ? "°F" : "°C";
}

let inactive = document.querySelector("#inactive-unit");
inactive.addEventListener("click", convert);

let unit = "imperial";
let apiKey = "8161b4309ee03faae957729ba7104797";

function buildWeatherFromRes(res) {
  let weatherInfo = {
    name: res.data.name,
    temp: Math.round(res.data.main.temp),
    humidity: res.data.main.humidity,
    pressure: res.data.main.pressure,
    feelsLike: Math.round(res.data.main.feels_like),
    description: res.data.weather[0].description,
    icon: res.data.weather[0].icon,
  };
  return weatherInfo;
}

function updateWeatherInfo(weather) {
  let nameElement = document.querySelector("#city");
  let activeTempElement = document.querySelector("#temperature");
  let humidityElement = document.querySelector("#humidity");
  let pressureElement = document.querySelector("#pressure");
  let feelsLikeElement = document.querySelector("#feels-like");
  let descriptionElement = document.querySelector("#description");
  let mainIconElement = document.querySelector("#icon");

  nameElement.innerHTML = weather.name;
  activeTempElement.innerHTML = weather.temp;
  humidityElement.innerHTML = weather.humidity;
  pressureElement.innerHTML = weather.pressure;
  feelsLikeElement.innerHTML = weather.feelsLike;
  descriptionElement.innerHTML = weather.description;
  mainIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weather.icon}@2x.png`
  );
}

function updateTemp(res) {
  if (res.data.cod !== 200) return;
  let weather = buildWeatherFromRes(res);
  updateWeatherInfo(weather);
}
function setCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=${unit}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateTemp);
}

navigator.geolocation.getCurrentPosition(setCurrentPosition);

let currentButton = document.querySelector("#currentButton");
currentButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(setCurrentPosition);
});
