// yeah so here i have functions to fetch the weather data and format it!!!

const fetchData = async function (location, units) {
  try {
    const rawData = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${units}&key=PXBASUKZCP8DBUWQC9YCAVE9F&contentType=json`
    );
    if (rawData.status === 200) {
      const rawJSON = await rawData.json();
      return formatData(rawJSON);
    } else {
      throw new Error(rawData.status);
    }
  } catch (error) {
    console.error(error);
  }
};

const formatData = function (rawJSON) {
  let days = [...rawJSON.days].splice(0, 7);
  days = days.map((day) => {
    const hours = [...day.hours].map((hour) => {
      return {
        dateTime: hour.datetime,
        conditions: hour.conditions,
        temp: hour.temp,
        feelsLike: hour.feelslike,
        wind: hour.windspeed,
        windDir: hour.winddir,
        precipType: hour.preciptype,
        precip: hour.precip,
      };
    });

    return {
      dateTime: day.datetime,
      conditions: day.description,
      temp: day.temp,
      feelsLike: day.feelslike,
      wind: day.windspeed,
      windDir: day.winddir,
      precipType: day.preciptype,
      precip: day.precip,
      hours: hours,
    };
  });
  return {
    address: rawJSON.resolvedAddress,
    curTemp: rawJSON.currentConditions.temp,
    curFeelsLike: rawJSON.currentConditions.feelslike,
    curWindSpeed: rawJSON.currentConditions.windspeed,
    curConditions: rawJSON.currentConditions.conditions,
    curPrecipType: rawJSON.currentConditions.preciptype,
    curPrecip: rawJSON.currentConditions.precip,
    days: days,
  };
};

export { fetchData };
