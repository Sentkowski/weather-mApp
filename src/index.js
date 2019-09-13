/* eslint-disable no-undef */
// jQuery is provided by the script link in html
import "./styles.scss";
import "./jquery.vmap.min.exec";
import "./jquery.vmap.world.exec";
import countryCodes from "./country-codes.json";
import countryCapitals from "./country-capitals.json";

const key = "0a4e47fd599ce51c32367b1db274e6b6";
let lastMapClick = {
  x: null,
  y: null
};

const spamCheck = spamProtector();

jQuery(document).ready(function() {
  jQuery("#vmap").vectorMap({
    map: "world_en",
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "#F6CE94",
    borderOpacity: 0.25,
    borderWidth: 1,
    color: "#F6CE94",
    enableZoom: false,
    hoverColor: "#F0865F",
    hoverOpacity: null,
    normalizeFunction: "linear",
    scaleColors: ["#b6d6ff", "#005ace"],
    selectedColor: "#F25552",
    selectedRegions: null,
    showTooltip: true,
    onRegionSelect: handleRegionSelect,
    onResize: hideWeatherData
  });

  intialZoom();
});

function intialZoom() {
  if (window.innerWidth < 1000) {
    jQuery("#vmap").vectorMap("zoomIn");
  }
  if (window.innerWidth < 750) {
    jQuery("#vmap").vectorMap("zoomIn");
  }
  if (window.innerWidth < 500) {
    jQuery("#vmap").vectorMap("zoomIn");
  }
}

async function handleRegionSelect(e, code) {
  try {
    spamCheck();
    const weather = await getWeatherForCapital(code);
    const extracted = extractData(weather, code);
    displayWeatherData(extracted);
  } catch (e) {
    displayError();
  }
}

async function getWeatherForCapital(countryCode) {
  const capital = codeToCapital(countryCode);
  const weatherReq = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&APPID=${key}`
  );
  if (!weatherReq.ok) throw new Error(response.statusText);
  return await weatherReq.json();
}

function displayError() {
  hideWeatherData();
  const err = document.querySelector(".error-message");
  err.style.display = "block";
  placeOnClick(document.querySelector(".error-message"));
  setTimeout(() => {
    err.style.opacity = 0;
    setTimeout(() => {
      err.style.display = "none";
      err.style.opacity = 1;
    }, 300);
  }, 2000);
}

function codeToCapital(code) {
  const country = codeToCountry(code);
  return countryCapitals.find(countryData => countryData.country === country)
    .city;
}

function codeToCountry(code) {
  return countryCodes.find(
    countryData => countryData.abbreviation === code.toUpperCase()
  ).country;
}

function extractData(weatherObj, code) {
  const city = weatherObj.name;
  const country = codeToCountry(code);
  const temp = Math.round(weatherObj.main.temp);
  const desc = weatherObj.weather[0].description;
  const wind = "wind: " + weatherObj.wind.speed;
  const timeObj = new Date(Date.now() + weatherObj.timezone * 1000);
  const time =
    timeObj.getUTCHours() +
    ":" +
    (timeObj.getUTCMinutes() < 10 ? "0" : "") +
    timeObj.getUTCMinutes();
  return { city, country, desc, temp, wind, time };
}

function displayWeatherData(data) {
  const weatherContainer = document.querySelector(".weather-information");
  if (weatherContainer.style.opacity == 0) {
    putWeatherIntoHTML(data);
    placeOnClick(weatherContainer);
    showWeatherData();
  } else {
    hideWeatherData();
    setTimeout(() => {
      putWeatherIntoHTML(data);
      placeOnClick(weatherContainer);
      showWeatherData();
    }, 100);
  }
}

function hideWeatherData() {
  const weatherContainer = document.querySelector(".weather-information");
  weatherContainer.style.opacity = 0;
  setTimeout(() => {
    weatherContainer.style.display = "none";
  }, 100);
}

function showWeatherData() {
  const weatherContainer = document.querySelector(".weather-information");
  weatherContainer.style.display = "block";
  weatherContainer.style.opacity = 1;
}

function putWeatherIntoHTML(data) {
  document.querySelector(".weather-city").textContent = data.city;
  document.querySelector(".weather-country").textContent = data.country;
  document.querySelector(".weather-desc").textContent = data.desc;
  document.querySelector(".weather-temp-wrapper").textContent =
    data.temp + "°C";
  document.querySelector(".weather-wind").textContent = data.wind + " m/s";
  document.querySelector(".weather-time").textContent = data.time;
  setTempColor(data.temp);
}

function placeOnClick(elem) {
  setTimeout(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let targetX = lastMapClick.x;
    let targetY = lastMapClick.y;
    if (targetX + elem.offsetWidth > vw) {
      targetX -= elem.offsetWidth;
    }
    if (targetY + elem.offsetHeight > vh) {
      targetY -= elem.offsetHeight;
    }
    elem.style.left = targetX + "px";
    elem.style.top = targetY + "px";
  }, 0);
}

document.querySelector("#vmap").addEventListener("click", e => {
  if (e.target.classList.contains("jqvmap-region")) {
    lastMapClick = {
      x: e.pageX,
      y: e.pageY
    };
  } else {
    hideWeatherData();
  }
});

function setTempColor(temp) {
  const hotColor = "hsl(1, 84%, X%)";
  const coldColor = "hsl(214, 36%, X%)";
  let tempColor = temp > 10 ? hotColor : coldColor;
  tempColor = tempColor.replace("X", 100 - Math.abs(10 - temp));
  document.querySelector(
    ".weather-temp-decoration"
  ).style.backgroundColor = tempColor;
}

function spamProtector() {
  let calls = 0;
  setInterval(() => {
    calls = 0;
  }, 60000);
  return () => {
    if (calls++ > 19) throw new Error();
  };
}
