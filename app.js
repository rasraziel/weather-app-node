const fs = require('fs');
// const favicon = require('serve-favicon');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const fetch = require("node-fetch");
let jsFlag = true;
app.use(express.json());
app.use(cors());

//Navigation

app.get("/", async (req, res) => {

    const city = req.query.city ? req.query.city : "Copenhagen";

    jsFlag = setJSFlag(req.query.javascript);

    const weatherData = await fetchCityWeatherData(city);

    if (!jsFlag)
        res.send(preparePage(weatherData));
    else
        res.send(weatherData);
});

fetchCityWeatherData = async city => {
    const weatherData = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},dk&appid=1b272266e337e917edc3c2053e6100b7`)
        .then(data => data.json())
        .then(prepareObject)
        .catch(err => { console.log(err); return "Unable to fetch data" });
    return weatherData;

}

prepareObject = data => {
    if (data.cod === 200)
        return {
            city: data.name,
            temperature: convertKelvinToCelcius(data.main.temp) + "°C",
            humidity: data.main.humidity,
            wind: data.wind.speed + " m/s " + convertDegreesToDirection(data.wind.deg)
        }
    else
        return "City not found";
}

setJSFlag = query => {
    if (query === "disabled")
        return false;
    else if (query === "enabled")
        return true;
}


convertKelvinToCelcius = temp => { return Math.floor(temp - 273.15) }

convertDegreesToDirection = degrees => {
    if (degrees < 11.25 || degrees >= 348.75)
        return "Nord";
    else if (degrees < 33.75)
        return "Nord-Nordøst";
    else if (degrees < 56.25)
        return "Nordøst";
    else if (degrees < 78.75)
        return "Øst-nordøst";
    else if (degrees < 101.25)
        return "Øst";
    else if (degrees < 123.75)
        return "Øst-Sydøst";
    else if (degrees < 146.25)
        return "Sydøst";
    else if (degrees < 168.75)
        return "Syd-Sydøst";
    else if (degrees < 191.25)
        return "Syd";
    else if (degrees < 213.75)
        return "Syd-Sydvest";
    else if (degrees < 236.25)
        return "Sydvest";
    else if (degrees < 258.75)
        return "Vest-Sydvest";
    else if (degrees < 281.25)
        return "Vest";
    else if (degrees < 303.75)
        return "Vest-Nordvest";
    else if (degrees < 326.25)
        return "Nordvest";
    else
        return "Nord-Nordvest";
}

preparePage = (weatherData) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title>Weather widget</title>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
<div class="info" style="margin: auto; text-align: center;">
            <h2>Velkommen til din lokale vejrudsigt!</h2>
			<p>Her finder du temperatur i din by, fugtighed og vindmåleren i meter per sekund (m/s).</p>
   </div>
  <div class="widget" style="margin-top: 10px; margin-left: auto; margin-right: auto; width: 300px;">
    <div class="panel panel-info">
      <div class="panel-heading">Weather in <b>${weatherData.city ? weatherData.city : "N/A"}</b></div>
      <ul class="list-group">
        <li class="list-group-item">Temperature: <b>${weatherData.temperature ? weatherData.temperature : "N/A"}</b></li>
        <li class="list-group-item">Humidity: <b>${weatherData.humidity ? weatherData.humidity : "N/A"}</b></li>
        <li class="list-group-item">Wind: <b>${weatherData.wind ? weatherData.wind : "N/A"}</b></li>
        <li class="list-group-item"><b>${weatherData.city ? "" : weatherData}</b></li>
        <li class="list-group-item">
            <form class="form-inline" action="/?city=city" method="GET">
              <div class="form-group">
                <input type="text" class="form-control" name="city" id="city" placeholder="City">
              </div>
              <button type="submit" class="btn btn-default">Search</button>
            </form>
        </li>
      </ul>
    </div>
  </div>
</body>
</html>`;
}



module.exports = { app, convertKelvinToCelcius, convertDegreesToDirection, preparePage, prepareObject, setJSFlag, fetchCityWeatherData };