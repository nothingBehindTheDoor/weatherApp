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
            <p id="temp">${processedDataObj.curTemp}°</p>
            <p id="description">${processedDataObj.curConditions}</p>
            <p id="precipitation-type">${
              processedDataObj.curPrecipType
                ? `${processedDataObj.curPrecipType} - ${processedDataObj.curPrecip}mm`
                : "None"
            }</p>
            <p id="feels-like">Feels like ${processedDataObj.curFeelsLike}°</p>
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
            <p id="temp">${processedDataObj.curTemp}°</p>
            <p id="description">${processedDataObj.curConditions}</p>
            <p id="precipitation-type">${
              processedDataObj.curPrecipType
                ? `${processedDataObj.curPrecipType} - ${processedDataObj.curPrecip}mm`
                : "None"
            }</p>
            <p id="feels-like">Feels like ${processedDataObj.curFeelsLike}°</p>
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
            <th scope="row" class="hour-time">${hour.dateTime}</th>
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
      days += `
      <div class="day not-legend ${processedDataObj.days.indexOf(day)}">
        <div class="day-date">${day.dateTime}</div>
        <div class="day-temp">${day.temp}</div>
        <div class="day-condition">${day.conditions}</div>
        <div class="day-feels-like">${day.feelsLike}</div>
        <div class="day-precip-type">${
          day.precipType ? `${day.precipType} - ${day.precip}mm` : "None"
        }</div>
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
