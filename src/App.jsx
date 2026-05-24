import React from 'react';
import Weather from './components/Weather';
import Time from './components/Time';
import Transportation from './components/Transportation';

const App = () => {
	return (
		<>
			<div id='left'>
				<Time />
				<Transportation />
			</div>

			<div id='right'>
				<Weather />
			</div>
		</>
	);
};

export default App;
