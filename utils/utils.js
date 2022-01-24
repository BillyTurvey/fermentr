export const makeTimeStrings = timeStampMS => {
	const //
		date = new Date(timeStampMS),
		dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];

	return {
		hours: date.getHours(),
		minutes: `${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`,
		date: date.getDate(),
		dateSuffix: getDateSuffix(date.getDate()),
		dayName: dayNames[date.getDay()],
		monthName: monthNames[date.getMonth()],
		year: date.getFullYear(),
		isThisYear: date.getFullYear() === new Date(Date.now()).getFullYear(),
		get timeString() {
			return `${this.hours}:${this.minutes}`;
		},
		get dateString() {
			return `${this.dayName} ${this.monthName} ${this.date}${this.dateSuffix}${
				this.isThisYear ? '' : ' ' + this.year
			}`;
		},
		get timeDateString() {
			return `${this.timeString} ${this.dateString}`;
		}
	};
};

function getDateSuffix(date) {
	switch (date % 10) {
		case 1:
			if (date == 11) return 'th';
			return 'st';

		case 2:
			if (date == 12) return 'th';
			return 'nd';

		case 3:
			if (date == 13) return 'th';
			return 'rd';

		default:
			return 'th';
	}
}

export const removeSessionFromRequest = (req, res, next) => {
	req.session = null;
	res.locals.flashes = null;
	next();
};
