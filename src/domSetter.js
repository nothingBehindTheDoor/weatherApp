import chevronUp from "./chevron-up.svg";
import chevronDown from "./chevron-down.svg";
import starOutlineSvg from "./star-outline.svg";
import starSvg from "./star.svg";

import { fetchData } from "./fetcher";

if (!localStorage.getItem("favourites"))
  localStorage.setItem("favourites", JSON.stringify({}));

const displayWeather = function (processedDataObj, e) {
  const location = document.querySelector("#location");
  const mainInner = document.querySelector("#main-inner");

  if (
    e.selectEvent === true ||
    e.target.getAttribute("id") === "search-btn" ||
    e.target.getAttribute("id") === "location-search" ||
    e.target.getAttribute("id") === "current" ||
    e.target.classList.contains("favourite-div") ||
    e.target.classList.contains("favourite-div-text")
  ) {
    mainInner.innerHTML = `
        <div id="location-header">
          <h2 id="location">${processedDataObj.address}</h2>
          <img id="star-btn" src=""/>
        </div>
            <div id="period-btns">
                <button id="current" class="period-btn active">Current</button>
                <button id="hourly" class="period-btn">Hourly</button>
                <button id="daily" class="period-btn">Daily</button>
            </div>
        <div id="info-table">
            <h3 id="title">Current conditions</h3>
            <div id="temp-container">
              <p id="temp">${processedDataObj.curTemp}°</p>
              <p id="feels-like">Feels like ${
                processedDataObj.curFeelsLike
              }°</p>
            </div>
            <p id="description">${processedDataObj.curConditions}</p>
            <div id="precip-container">
              <p id="precip-container-title">Precipitation:</p>
              <p id="precipitation-type">${
                processedDataObj.curPrecipType
                  ? `${processedDataObj.curPrecipType} - ${processedDataObj.curPrecip}mm`
                  : "None"
              }</p>
            </div>
            <p id="wind-speed">Windspeed: ${
              processedDataObj.curWindSpeed
            }m/s</p>
        </div>
        `;
  } else if (e.target.getAttribute("id") === "hourly") {
    let hours = ``;

    for (const hour of processedDataObj.days[0].hours) {
      hours += `
      <div class="hour">
        <div class="hour-date">${hour.dateTime
          .split("")
          .slice(0, 5)
          .join("")}</div>
        <div class="hour-temp">${hour.temp}°</div>
        <div class="hour-condition">${hour.conditions}</div>
        <div class="hour-feels-like">${hour.feelsLike}°</div>
        <div class="hour-precip-type">${
          hour.precipType ? `${hour.precipType} - ${hour.precip}mm` : "None"
        }</div>
        <div class="hour-wind-speed">${hour.wind} m/s</div>
      </div>
      `;
    }

    mainInner.innerHTML = `
      <div id="location-header">
        <h2 id="location">${processedDataObj.address}</h2>
        <img id="star-btn" src=""/>
      </div>
      <div id="period-btns">
        <button id="current" class="period-btn">Current</button>
        <button id="hourly" class="period-btn active">Hourly</button>
        <button id="daily" class="period-btn">Daily</button>
      </div>
      <div id="hour-info">
        <div id="hour-info-inner">
          <div class="hour-legend">
            <div class="hour-time"></div>
            <div class="hour-temp">Temp</div>
            <div class="hour-condition">Condition</div>
            <div class="hour-feels-like">Feels like</div>
            <div class="hour-precip-type">Precipitation</div>
            <div class="hour-wind-speed-header">Windspeed</div>
          </div>
          ${hours}
        </div>
      </div>
    `;
  } else if (e.target.getAttribute("id") === "daily") {
    let days = ``;

    for (const day of processedDataObj.days) {
      let dayTemporary = day.dateTime.split("").slice(5);
      dayTemporary[2] = ".";
      dayTemporary = dayTemporary.join("");

      days += `
      <div class="day not-legend ${processedDataObj.days.indexOf(day)}">
        <div class="day-date">${dayTemporary}</div>
        <div class="day-temp">${day.temp}°</div>
        <div class="day-condition">${day.conditions}</div>
        <div class="day-feels-like">${day.feelsLike}°</div>
        <div class="day-precip-type">${
          day.precipType ? `${day.precipType} - ${day.precip}mm` : "None"
        }</div>
        <div class="day-wind-speed">${day.wind} m/s</div>
        <img class="expand-hide-symbol" src="${chevronDown}"/>
      </div>
      `;
    }

    mainInner.innerHTML = `
      <div id="location-header">
        <h2 id="location">${processedDataObj.address}</h2>
        <img id="star-btn" src=""/>
      </div>
      <div id="period-btns">
        <button id="current" class="period-btn">Current</button>
        <button id="hourly" class="period-btn">Hourly</button>
        <button id="daily" class="period-btn active">Daily</button>
      </div>
      <div id="day-info">
        <div class="day legend">
          <div class="date"></div>
          <div class="day-temp">Temp</div>
          <div class="day-condition">Condition</div>
          <div class="day-feels-like">Feels like</div>
          <div class="day-precip-type">Precipitation</div>
          <div class="day-wind-speed-header">Windspeed</div>
        </div>
        ${days}
      </div>
    `;

    // and here i just add the event listeners necessary to bring the following two functions together.

    const addListenersToDays = function () {
      document.querySelectorAll(".not-legend").forEach((dayEl) => {
        dayEl.addEventListener(
          "click",
          (e) => {
            if (!document.querySelector("#hour-info-inner"))
              createDayHours(dayEl);
            dayEl.addEventListener("click", removeHourTableFromDay, {
              once: true,
            });
          },
          { once: true }
        );
      });
    };

    addListenersToDays();

    // the following two functions are used to make each day in the daily view display the conditions for each hour of the day on demand
    // the first creates the html for the hours of the day that was clicked on by the user

    const createDayHours = function (dayEl) {
      dayEl.children[6].src = chevronUp;
      let hours = ``;
      for (const hour of processedDataObj.days[dayEl.classList[2]].hours) {
        hours += `
      <div class="hour">
        <div class="hour-date">${hour.dateTime
          .split("")
          .slice(0, 5)
          .join("")}</div>
        <div class="hour-temp">${hour.temp}°</div>
        <div class="hour-condition">${hour.conditions}</div>
        <div class="hour-feels-like">${hour.feelsLike}°</div>
        <div class="hour-precip-type">${
          hour.precipType ? `${hour.precipType} - ${hour.precip}mm` : "None"
        }</div>
        <div class="hour-wind-speed">${hour.wind} m/s</div>
      </div>
      `;
      }
      dayEl.innerHTML += `
        <div id="hour-info-inner">
          ${hours}
        </div>
      `;
    };

    // the second is used to hide the hours of the day once the user clicks on it again, also removing the event listener used to hide the hours

    const removeHourTableFromDay = function (ev) {
      ev.currentTarget.children[6].src = chevronDown;
      ev.currentTarget.removeChild(ev.currentTarget.children[7]);
      addListenersToDays();
    };
  } else {
    return;
  }

  document.querySelectorAll(".period-btn").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      if (
        !document.querySelector("#hour-info-inner") ||
        ev.currentTarget.classList.contains("period-btn")
      ) {
        displayWeather(processedDataObj, ev);
      }
    });
  });

  const starBtn = document.querySelector("#star-btn");
  starBtn.addEventListener("click", (ev) => {
    favouriteLocationLogic(processedDataObj, ev);
    starBtn.src = Object.hasOwn(
      JSON.parse(localStorage.getItem("favourites")),
      processedDataObj.address
    )
      ? starSvg
      : starOutlineSvg;
  });
  // this adds the source to the #star-btn img element so it displays an outline or filled star depending on if the location is favourited
  starBtn.src = Object.hasOwn(
    JSON.parse(localStorage.getItem("favourites")),
    processedDataObj.address
  )
    ? starSvg
    : starOutlineSvg;
};

// here begins the section dedicated to allowing the user to set favourite locations which shall be displayed on the bottom of the header.

// this first function processes a click event on the star symbol next to a displayed location.
// it adds the location to localStorage (if it isn't yet there) and calls the next function, which displays needed changes to the DOM.
const favouriteLocationLogic = function (processedDataObj, ev) {
  let currentFavourites = JSON.parse(localStorage.getItem("favourites"));
  if (Object.keys(currentFavourites).length > 5) {
    alert("You can only set five favourites!");
  } else if (currentFavourites[processedDataObj.address]) {
    delete currentFavourites[processedDataObj.address];
  } else {
    currentFavourites[processedDataObj.address] = true;
  }
  localStorage.setItem("favourites", JSON.stringify(currentFavourites));
  favouriteLocationDomLogic(currentFavourites);
};

// this one receives the favourite locations object retrieved from localStorage as an argument and then creates elements in the header for each one.
// each location will have three event listeners, one for displaying said location, one for setting it as a default when visiting the page and one for removing it from favourites.
const favouriteLocationDomLogic = function (favourites) {
  document.querySelector("#previous-searches-bar").innerHTML = "";
  const defaultViewSelectWrapper = document.createElement("div");
  defaultViewSelectWrapper.classList.add("default-view-select-wrapper");
  const defaultViewSelect = document.createElement("select");
  defaultViewSelect.classList.add("default-view-select");
  defaultViewSelect.name = "Default location";
  defaultViewSelect.value = localStorage.getItem("default-location");
  defaultViewSelectWrapper.appendChild(defaultViewSelect);
  const defaultViewSelectDefaultOption = document.createElement('option');
  defaultViewSelectDefaultOption.value = '';
  if (Object.keys(favourites).length !== 0) defaultViewSelect.appendChild(defaultViewSelectDefaultOption);
  const gapDivider = document.createElement("div");
  gapDivider.classList.add("gap-divider");
  document
    .querySelector("#previous-searches-bar")
    .append(defaultViewSelectWrapper, gapDivider);

  for (const favourite in favourites) {
    const favouriteDiv = document.createElement("div");
    const favouriteDivText = document.createElement("div");
    const favouriteDivDelBtn = document.createElement("div");
    favouriteDiv.classList.add("favourite-div");
    favouriteDivText.textContent = favourite;
    favouriteDivText.classList.add("favourite-div-text");
    favouriteDivDelBtn.textContent = "x";
    favouriteDivDelBtn.classList.add("favourite-div-del-btn");
    favouriteDiv.append(favouriteDivText, favouriteDivDelBtn);
    document.querySelector("#previous-searches-bar").appendChild(favouriteDiv);

    const option = document.createElement("option");
    option.textContent = favourite;
    option.value = favourite;
    defaultViewSelect.appendChild(option);

    favouriteDiv.addEventListener("click", (ev) => {
      if (ev.currentTarget.classList.contains("favourite-div")) {
        fetchData(
          document.querySelector(".favourite-div-text").textContent,
          document.querySelector("#unit-select").value
        ).then((result) => {
          displayWeather(result, ev);
        });
      }
    });
  }

  defaultViewSelect.addEventListener("change", (ev) => {
      localStorage.setItem("default-location", ev.target.value);
    });
};

export { displayWeather, favouriteLocationDomLogic };

/*
                <h3 id="title">Hourly</h3>
              <div class="hour">
                <div class="hour-time">00:00</div>
                <div class="hour-temp">58</div>
                <div class="hour-conditions">Cloudy</div>
                <div class="hour-precip">Rain</div>
              </div>
              <div class="hour">
                <div class="hour-time">00:00</div>
                <div class="hour-temp">58</div>
                <div class="hour-conditions">Cloudy</div>
                <div class="hour-precip">Rain</div>
              </div>
              <div class="hour">
                <div class="hour-time">00:00</div>
                <div class="hour-temp">58</div>
                <div class="hour-conditions">Cloudy</div>
                <div class="hour-precip">Rain</div>
              </div>
              <div class="hour">
                <div class="hour-time">00:00</div>
                <div class="hour-temp">58</div>
                <div class="hour-conditions">Cloudy</div>
                <div class="hour-precip">Rain</div>




                <h2 id="location">Tallinn, Estonia</h2>
              <div id="period-btns">
                <button id="current" class="period-btn active">Current</button>
                <button id="hourly" class="period-btn">Hourly</button>
                <button id="daily" class="period-btn">Daily</button>
              </div>
              <div id="info-table">
                <h3 id="title">Current conditions</h3>
                <p id="temp">58</p>
                <p id="description">Cloudy</p>
                <p id="feels-like">Feels like 42</p>
              </div>

              document.querySelectorAll(".not-legend").forEach((element) => {
      element.addEventListener("click", (e) => {
        let hours = ``;

        for (const hour of processedDataObj.days[e.target.classList.length[]]) {
          hours += `
          <tr class="hour">
              <th scope="row" class="hour-time">${hour.dateTime}</th>
              <td class="hour-temp">${hour.temp}</td>
              <td class="hour-conditions">${hour.conditions}</td>
              <td class="hour-precip-type">${
                hour.precipType ? `${hour.precipType} - ${hour.precip}mm` : "None"
              }</td>
          </tr>
        `;
        }
      });
    });
*/
