import {logInAsJeanette, logInAsNelson, logOut} from '../../fixtures/testUtils.js';

// User miust be logged in to view or edit device
describe('Viewing a device', function () {
	before(logOut);
	it('User must be logged in.', function () {
		cy.request({
			method: 'GET',
			url: '/device/60c1b4581d8a36ac2286310a',
			failOnStatusCode: false
		}).should((response) => {
			expect(response.status).to.eq(401);
		});
	});
	it('If logged in, user must also own the Device they request to view.', function () {
		logInAsNelson();
		cy.request({
			method: 'GET',
			url: '/device/60c1b4581d8a36ac2286310a',
			failOnStatusCode: false
		}).should((response) => {
			expect(response.status).to.eq(401);
		});
	});
	it('If logged in user is able to view one of thier own devices.', function () {
		logInAsJeanette();
		cy.visit('/dashboard');
	});
});

describe('Editing a device', function () {
	before(logOut);
	it('User must be logged in.', function () {
		cy.request({
			method: 'GET',
			url: '/device/60c1b4581d8a36ac2286310a/edit',
			failOnStatusCode: false
		}).should((response) => {
			expect(response.status).to.eq(401);
		});
	});
	it('If logged in, user must also own the Device they request to view.', function () {
		logInAsNelson();
		cy.request({
			method: 'GET',
			url: '/device/60c1b4581d8a36ac2286310a/edit',
			failOnStatusCode: false
		}).should((response) => {
			expect(response.status).to.eq(401);
		});
	});
});
