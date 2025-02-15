// TRANSPORTATION

const locationID = 900191001; //station ID of baumschulenweg
const bvgURL =
	'https://v6.bvg.transport.rest/stops/' + locationID + '/departures?duration=20&results=10&linesOfStops=false&remarks=false&language=de';
console.log(bvgURL);
loadDeparture = (station) => {
	fetch(bvgURL)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			const allDepartures = []; //collecting all departures in an array

			console.log(data.departures);
			let departures = data.departures;

			for (i = 0; i < departures.length; i++) {
				console.log(departures[i]);
				allDepartures.push(departures[i].destination.id);
				createDeparture(departures[i], i);
			}
		})
		.catch((error) => {
			console.log("couldn't load transportation data");
		});
};

const list = document.getElementById('transportationList');

createDeparture = (data, index) => {
	const departure = document.createElement('div');
	departure.classList.add('departure');

	//using the index of the loop for the animationdelay
	departure.style.animationDelay = index * 0.05 + 's';

	//departure time
	let a = document.createElement('div');
	a.innerHTML = data.plannedWhen.substr(11, 5);
	departure.appendChild(a);

	// delay time
	let delaytime = document.createElement('div');
	delaytime.classList.add('delay');

	// if there is a delay, calculate delay
	if (data.prognosisType == 'prognosed') {
		//console.log(data.prognosisType)
		let verspätung = 1; //default verspätung (1 min)
		let wievielVerspätung = new Date(data.when.substr(0, 19)) - new Date(data.plannedWhen.substr(0, 19));

		if (wievielVerspätung >= 6000) {
			verspätung = wievielVerspätung / 60000;
		}
		delaytime.innerHTML = '+' + verspätung;
	}
	//adding delaytime div, no matter if delay or not, for better alignment
	departure.appendChild(delaytime);

	// type of transportaion
	let lineType = document.createElement('div');
	lineType.classList.add('lineType');
	let img = new Image();
	if (data.line.mode == 'bus') {
		img.src = './assets/transportation/bus.svg';
	} else if (data.line.mode == 'train') {
		img.src = './assets/transportation/sbahn.svg';
	}

	lineType.appendChild(img);
	departure.appendChild(lineType);

	// line number
	let line = document.createElement('div');
	line.classList.add('line');
	line.classList.add(data.line.mode);
	line.innerHTML = data.line.name;
	departure.appendChild(line);

	//direction
	let b = document.createElement('div');
	b.innerHTML = data.direction;
	departure.appendChild(b);

	list.appendChild(departure);
};

loadDeparture(locationID);

setInterval(function () {
	let departures = document.getElementsByClassName('departure');

	for (i = 0; i < departures.length; i++) {
		departures[i].classList.add('hide');

		//find last element --> after animation is done, reload transportation data
		if (i + 1 == departures.length) {
			departures[i].addEventListener('animationend', function () {
				document.getElementById('transportationList').innerHTML = '';
				loadDeparture(locationID);
			});
		}
	}
}, 60000);
