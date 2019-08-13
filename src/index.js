/* eslint-disable no-undef */
// jQuery is provided by the script link in html
import "./../styles.scss";
import "./jquery.vmap.min.exec";
import "./jquery.vmap.europe.exec";

jQuery(document).ready(function() {
  jQuery("#vmap").vectorMap({ map: "europe_en" });
});
