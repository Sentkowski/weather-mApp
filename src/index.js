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
    borderColor: "#ffffff",
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
  } catch (e) {
    console.log("BOOOM");
  }
}

async function getWeatherForCapital(countryCode) {
  const capital = codeToCapital(countryCode);
  const weatherReq = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${key}`
  );
  if (!weatherReq.ok) throw new Error(response.statusText);
  return await weatherReq.json();
}

function codeToCapital(code) {
  const country = countryCodes.find(
    countryData => countryData.abbreviation.toLowerCase() === code
  ).country;
  return countryCapitals.find(countryData => countryData.country === country)
    .city;
}
