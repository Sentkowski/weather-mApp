/* eslint-disable no-undef */
// jQuery is provided by the script link in html
import "./styles.scss";
import "./jquery.vmap.min.exec";
import "./jquery.vmap.world.exec";
import countryCodes from "./country-codes.json";
import countryCapitals from "./country-capitals.json";

const key = "0a4e47fd599ce51c32367b1db274e6b6";

jQuery(document).ready(function() {
  jQuery("#vmap").vectorMap({
    map: "world_en",
    backgroundColor: "#fffff",
    borderColor: "#000000",
    borderOpacity: 0.25,
    borderWidth: 1,
    color: "#ffffffaa",
    enableZoom: false,
    hoverColor: "#ffffffdd",
    hoverOpacity: null,
    normalizeFunction: "linear",
    scaleColors: ["#b6d6ff", "#005ace"],
    selectedColor: "#ffffff",
    selectedRegions: null,
    showTooltip: true,
    onRegionSelect: handleRegionSelect
  });
});

async function handleRegionSelect(e, code) {
  try {
    const weather = await getWeatherForCapital(code);
    const extracted = extractData(weather);
    displayWeatherData(extracted);
  } catch (e) {
    console.log(e);
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

function extractData(weatherObj) {
  const city = weatherObj.name;
  const country = codeToCountry(weatherObj.sys.country);
  const temp = Math.round(weatherObj.main.temp) + "°C";
  const desc = weatherObj.weather[0].description;
  const wind = weatherObj.wind.speed + " m/s";
  return { city, country, desc, temp, wind };
}

function displayWeatherData(data) {
  const preselect = document.querySelector(".initial-app-text");
  const weatherContainer = document.querySelector(".weather-information");
  if (preselect.style.display !== "none") {
    preselect.style.opacity = 0;
    setTimeout(() => (preselect.style.display = "none"), 100);
  } else {
    weatherContainer.style.opacity = 0;
  }
  setTimeout(() => {
    putWeatherIntoHTML(data);
    weatherContainer.style.opacity = 1;
  }, 100);
}

function putWeatherIntoHTML(data) {
  document.querySelector(".weather-city").textContent = data.city;
  document.querySelector(".weather-country").textContent = data.country;
  document.querySelector(".weather-desc").textContent = data.desc;
  document.querySelector(".weather-temp").textContent = data.temp;
  document.querySelector(".weather-wind").textContent = data.wind;
}
