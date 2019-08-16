/* eslint-disable no-undef */
// jQuery is provided by the script link in html
import "./styles.scss";
import "./jquery.vmap.min.exec";
import "./jquery.vmap.europe.exec";

jQuery(document).ready(function() {
  jQuery("#vmap").vectorMap({
    map: "europe_en",
    backgroundColor: "#fffff",
    borderColor: "#818181",
    borderOpacity: 0.25,
    borderWidth: 1,
    color: "#aaaaaa",
    enableZoom: false,
    hoverColor: "#bbbbbb",
    hoverOpacity: null,
    normalizeFunction: "linear",
    scaleColors: ["#b6d6ff", "#005ace"],
    selectedColor: "red",
    selectedRegions: null,
    showTooltip: true
  });
});
