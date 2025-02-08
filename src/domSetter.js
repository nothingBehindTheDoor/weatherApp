import chevronUp from "./chevron-up.svg";
import chevronDown from "./chevron-down.svg";

const displayWeather = function (processedDataObj, e) {
  const location = document.querySelector("#location");
  const mainInner = document.querySelector("#main-inner");

  if (
    e.target.getAttribute("id") === "search-btn" ||
    e.target.getAttribute("id") === "location-search"
  ) {
    mainInner.innerHTML = `
        <h2 id="location">${processedDataObj.address}</h2>
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
  } else if (e.target.getAttribute("id") === "current") {
    mainInner.innerHTML = `
        <h2 id="location">${processedDataObj.address}</h2>
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
        <tr class="hour">
            <th scope="row" class="hour-time">${hour.dateTime
              .split("")
              .slice(0, 5)
              .join("")}</th>
            <td class="hour-temp">${hour.temp}</td>
            <td class="hour-conditions">${hour.conditions}</td>
            <td class="hour-precip-type">${
              hour.precipType ? `${hour.precipType} - ${hour.precip}mm` : "None"
            }</td>
        </tr>
        `;
    }

    mainInner.innerHTML = `
        <h2 id="location">${processedDataObj.address}</h2>
            <div id="period-btns">
            <button id="current" class="period-btn">Current</button>
            <button id="hourly" class="period-btn active">Hourly</button>
            <button id="daily" class="period-btn">Daily</button>
            </div>
        <div id="hour-info">
        <table id="hourly-table">
            <caption id="caption">Hourly</caption>
            <thead>
                <th scope="col">Hour</th>
                <th scope="col">Temp</th>
                <th scope="col">Conditions</th>
                <th scope="col">Precipitation</th>
            </thead>
            ${hours}
        </table>
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
        <div class="day-temp">${day.temp}</div>
        <div class="day-condition">${day.conditions}</div>
        <div class="day-feels-like">${day.feelsLike}</div>
        <div class="day-precip-type">${
          day.precipType ? `${day.precipType} - ${day.precip}mm` : "None"
        }</div>
        <img class="expand-hide-symbol" src="${chevronDown}"/>
      </div>
      `;
    }

    mainInner.innerHTML = `
      <h2 id="location">${processedDataObj.address}</h2>
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
            if (!document.querySelector("#hourly-table")) createDayHours(dayEl);
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
      dayEl.children[5].src = chevronUp;
      let hours = ``;
      for (const hour of processedDataObj.days[dayEl.classList[2]].hours) {
        hours += `
            <tr class="hour">
                <th scope="row" class="hour-time">${hour.dateTime
                  .split("")
                  .slice(0, 5)
                  .join("")}</th>
                <td class="hour-temp">${hour.temp}</td>
                <td class="hour-conditions">${hour.conditions}</td>
                <td class="hour-precip-type">${
                  hour.precipType
                    ? `${hour.precipType} - ${hour.precip}mm`
                    : "None"
                }</td>
            </tr>
            `;
      }
      dayEl.innerHTML += `
        <table id="hourly-table">
            <thead>
                <th scope="col">Hour</th>
                <th scope="col">Temp</th>
                <th scope="col">Conditions</th>
                <th scope="col">Precipitation</th>
            </thead>
            ${hours}
        </table>
      `;
    };

    // the second is used to hide the hours of the day once the user clicks on it again, also removing the event listener used to hide the hours

    const removeHourTableFromDay = function (ev) {
      ev.currentTarget.children[5].src = chevronDown;
      ev.currentTarget.removeChild(ev.currentTarget.children[6]);
      addListenersToDays();
    };
  }
  document.querySelectorAll(".period-btn").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      displayWeather(processedDataObj, ev);
    });
  });
};

export { displayWeather };

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
