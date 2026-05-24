import React, { useState, useEffect } from 'react';
import './Transportation.css';

const transportationIcons = import.meta.glob('../assets/transportation/*.svg', {
	eager: true,
	import: 'default',
});

const Transportation = () => {
	const [departures, setDepartures] = useState([]);

	useEffect(() => {
		const fetchDepartures = async () => {
			try {
				const response = await fetch('https://v6.bvg.transport.rest/stops/900191001/departures?duration=20&results=10&linesOfStops=false&remarks=false&language=de');
				const data = await response.json();
				setDepartures(data.departures || []);
			} catch (error) {
				console.error('Error loading departures:', error);
			}
		};

		fetchDepartures();

		// refresh every 30 seconds
		const interval = setInterval(fetchDepartures, 30000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	const getIcon = (product) => {
		const map = {
			suburban: 'sbahn',
			subway: 'ubahn',
			tram: 'tram',
			bus: 'bus',
			ferry: 'faehre',
			express: 'ice',
			regional: 'regional',
		};
		const iconName = map[product] || product;
		return transportationIcons[`../assets/transportation/${iconName}.svg`];
	};

	return (
		<div id='transportationList'>
			{departures.map((dep, i) => {
				const time = new Date(dep.when || dep.plannedWhen).toLocaleTimeString('de-DE', {
					hour: '2-digit',
					minute: '2-digit',
				});

				let delay = 0;
				if (dep.prognosisType === 'prognosed') {
					const diff = new Date(dep.when) - new Date(dep.plannedWhen);
					delay = Math.max(1, Math.floor(diff / 60000));
				}

				return (
					<div key={dep.tripId} className='departure'>
						<div className='departure-time'>{time}</div>
						<div className='departure-delay'>{delay > 0 ? `+${delay}` : ''}</div>
						<div className='departure-type'>
							<img src={getIcon(dep.line.product)} alt={dep.line.product} />
						</div>
						<div className={`departure-line ${dep.line.product}`}>{dep.line.name}</div>
						<div className='departure-direction'>{dep.direction}</div>
					</div>
				);
			})}
		</div>
	);
};

export default Transportation;
