//const weather_KEY  = '';
const weatherLocation = [52.467582, 13.489501]; //Baume
const apiURL = 'https://api.openweathermap.org/data/2.5/';
const apiQuery = '?lat=' + weatherLocation[0] + '&lon=' + weatherLocation[1] + '&units=metric&lang=de&appid=' + weather_KEY;
//console.log(apiURL + 'weather' + apiQuery)

const weatherCurrentDiv = document.getElementById('weatherCurrent');
const forcastDiv = document.getElementById('forcast');

loadWeather = (type) => {
	var url = apiURL + type + apiQuery;

	//limit amount of timestamps if forcast in query
	if (type == 'forecast') {
		url += '&cnt=6';
	}

	//to avoid API block during dev times I use local example data ( using getQueryParam() in config.js )
	if (getQueryParam('dev')) {
		if (type == 'weather') {
			var url = './assets//weather_example_current.json';
			console.log('loading local curretWeather JSON for dev');
		} else if (type == 'forecast') {
			var url = './assets/weather_example_forecast.json';
			console.log('loading local forecast JSON for dev');
		}
	}

	fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			//
			//
			//currentweather
			if (type == 'weather') {
				//console.log(data);
				weatherCurrentDiv.innerHTML = ''; //empty current Weather div before refilling it

				const img = new Image();
				img.src = './assets/weather/' + data.weather[0].icon + '.svg';
				weatherCurrentDiv.appendChild(img);

				const a = document.createElement('span');
				a.id = 'temp_now';
				a.innerHTML = Math.round(data.main.temp) + '°';
				weatherCurrentDiv.appendChild(a);

				const b = document.createElement('span');
				b.id = 'weatherDescription';
				b.innerHTML = data.weather[0].description;
				weatherCurrentDiv.appendChild(b);

				const c = document.createElement('span');
				c.id = 'location';
				c.innerHTML = data.name;
				weatherCurrentDiv.appendChild(c);

				//
				//
				// forcast weather
			} else if (type == 'forecast') {
				forcastDiv.innerHTML = ''; //empty forcast div before refilling it

				const forcast = data.list;
				//create the upcomming three forecast datablocks in #forcast
				for (i = 1; i < forcast.length; i++) {
					const a = document.createElement('span');
					a.classList.add('forcastBlock');

					const img = new Image();
					img.src = './assets/weather/' + forcast[i].weather[0].icon + '.svg';
					a.appendChild(img);

					const b = document.createElement('span');
					b.innerHTML = Math.round(forcast[i].main.temp) + '°';
					a.appendChild(b);

					const d = document.createElement('span');
					d.innerHTML = forcast[i].dt_txt.substr(11, 5);
					a.appendChild(d);

					const c = document.createElement('span');
					c.innerHTML = forcast[i].weather[0].description;
					a.appendChild(c);

					forcastDiv.appendChild(a);
					//console.log(forcast[i])
				}
			}
			//console.log(data)
		})
		.catch((error) => {
			console.log("couldn't load weather data");
		});

	//console.log(url)
};

loadWeather('weather');
loadWeather('forecast');

setInterval(function () {
	weatherCurrentDiv.classList.toggle('hide');
	forcastDiv.classList.toggle('hide');

	weatherCurrentDiv.addEventListener('animationend', (animation) => {
		console.log();
		if (animation.animationName == 'hide') {
			loadWeather('weather');
			loadWeather('forecast');
		}
	});
}, 120000);
