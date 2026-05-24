import React, { useState, useEffect } from 'react';

const Time = () => {
	const [date, setDate] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setDate(new Date());
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
	const timeOptions = { hour: '2-digit', minute: '2-digit' };

	const timeString = date.toLocaleTimeString('de-DE', timeOptions);
	const day = date.getDate();
	const monthString = months[date.getMonth()];
	const weekdayString = weekdays[date.getDay()];
	const secondsString = date.getSeconds().toString().padStart(2, '0');

	const dateString = `${weekdayString} ${day} ${monthString}`;

	return (
		<div id='time'>
			<div id='digitime' className='time-display'>
				{timeString.split('').map((char, index) => (
					<span key={index} className={`digit ${char === ':' ? 'colon' : ''}`}>
						{char}
					</span>
				))}
			</div>
			<div id='date' className='date-display'>
				{dateString}
				<div className='seconds-display'>
					{secondsString.split('').map((char, index) => (
						<span key={index} className='second-digit'>
							{char}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default Time;
