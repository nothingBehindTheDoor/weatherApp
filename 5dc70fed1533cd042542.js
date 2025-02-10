import "./styles.css";
import { fetchData } from "./fetcher";
import { displayWeather } from "./domSetter";

window.fetchData = fetchData;
let dataStore;
const searchInput = document.querySelector("#location-search");

document.querySelector("#search-btn").addEventListener("click", (e) => {
  searchInput.setCustomValidity("");
  if (searchInput.reportValidity()) {
    fetchData(
      searchInput.value,
      document.querySelector("#unit-select").value
    ).then((result) => {
      if (result) {
        displayWeather(result, e);
        dataStore = result;
      } else {
        searchInput.setCustomValidity("Bad search term. Try again!");
        searchInput.reportValidity();
      }
    });
  }
});

document.querySelector('#location-search').addEventListener('keydown', (e) => {
  searchInput.setCustomValidity("");
  if (e.key === 'Enter') {
    if (searchInput.reportValidity()) {
      fetchData(
        searchInput.value,
        document.querySelector("#unit-select").value
      ).then((result) => {
        if (result) {
          displayWeather(result, e);
          dataStore = result;
        } else {
          searchInput.setCustomValidity("Bad search term. Try again!");
          searchInput.reportValidity();
        }
      });
    }
  }
})