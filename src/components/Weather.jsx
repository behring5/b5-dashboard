import React, { useEffect, useState } from 'react';
import './Weather.css';

const weatherIcons = import.meta.glob('../assets/weather/*.svg', {
	eager: true,
	import: 'default',
});

const Weather = () => {
	const [weatherData, setWeatherData] = useState(null);

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const response = await fetch('https://weather.behring5.de/?id=baumschulenweg');
				const data = await response.json();
				setWeatherData(data);
			} catch (error) {
				console.error('Error loading weather data:', error);
			}
		};

		fetchWeather();

		// reload every 10 min
		const interval = setInterval(fetchWeather, 600000);
		return () => clearInterval(interval);
	}, []);

	if (!weatherData) return <p>Loading weather data...</p>;

	// Helper Icons
	const getIconUrl = (iconCode) => {
		const path = `../assets/weather/${iconCode}.svg`;
		return weatherIcons[path];
	};

	const { current, hourly, name } = weatherData;

	return (
		<>
			<div id='weather'>
				{current && current.weather && current.weather[0] && (
					<>
						<img src={getIconUrl(current.weather[0].icon)} alt={current.weather[0].description} />
						<span className='weather-now-temp'>{Math.round(current.temp)}°</span>
						<span className='weather-now-description'>{current.weather[0].description}</span>
						<span className='weather-now-location'>{name}</span>
					</>
				)}
			</div>

			{hourly && hourly.length > 0 && (
				<div id='forecast'>
					{hourly
						.filter((_, i) => i % 3 === 0)
						.slice(1, 6)
						.map((hour, index) => {
							const time = new Date(hour.dt * 1000).toLocaleTimeString('de-DE', {
								hour: '2-digit',
								minute: '2-digit',
							});

							return (
								<div key={index} className='forecastBlock'>
									<img src={getIconUrl(hour.weather[0].icon)} alt={hour.weather[0].description} />
									<span className='forecast-temp'>{Math.round(hour.temp)}°</span>
									<span className='forecast-weather'>{hour.weather[0].description}</span>
									<span className='forecast-time'>{time}</span>
								</div>
							);
						})}
				</div>
			)}
		</>
	);
};

export default Weather;
