import * as util from '../../support/commands.js';
describe('Viewing a device', function () {
	it('User must be logged in.', function () {
		cy.logOut;
		cy.request({
			method: 'GET',
			url: '/device/60c1b4581d8a36ac2286310a',
			failOnStatusCode: false
		}).should(response => {
			expect(response.status).to.eq(401);
		});
	});
	it('If logged in, user must also own the Device they request to view.', function () {
		cy.fixture('testUserJeanette.json').then(jeanette => {
			cy.logInAs('Nelson');
			cy.request({
				method: 'GET',
				url: `/device/${jeanette.devices[0].id}`,
				failOnStatusCode: false
			}).should(response => {
				expect(response.status).to.eq(401);
			});
		});
	});
	it('If logged in, user is able to view one of thier own devices.', function () {
		cy.logInAs('Jeanette');
		const deviceName = util.newTestDeviceName();
		cy.createDevice({
			name: deviceName,
			description: 'Device can be assigned to a fermentation when a user edits a device.'
		});
		cy.url().then(deviceURL => {
			// edit device and assign to fermentation
			cy.request({
				method: 'GET',
				url: deviceURL
			}).should(response => {
				expect(response.status).to.eq(200);
			});
		});
		cy.deleteDevice(deviceName);
	});
});
