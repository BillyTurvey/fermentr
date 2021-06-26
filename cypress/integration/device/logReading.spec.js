import jeanette from '../../fixtures/testUserJeanette.json';
import {randomTemperature} from '../../fixtures/testUtils.js';

describe('Unauthenticated log request', function () {
	it('receives a 401 response code', function () {
		cy.request({
			method: 'POST',
			url: '/device/093845/log',
			headers: {
				'device-key': 'incorrect-key'
			},
			body: {
				temperature: 22
			},
			failOnStatusCode: false
		}).should(response => {
			expect(response.status).to.eq(401);
		});
	});
});

describe('Authenticated log request', function () {
	it('properly formed request responds with a 200 response code', function () {
		const device = jeanette.activeTestDevice;
		cy.request({
			method: 'POST',
			url: `/device/${device.id}/log`,
			headers: {
				'device-key': device.key
			},
			body: {
				temperature: randomTemperature()
			}
		}).should(response => {
			expect(response.status).to.eq(200);
		});
	});
});
