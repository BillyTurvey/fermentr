// Shows a list of current fermentations
// Shows a list of past fermentations
// Shows a list of devices
// links to manage account

import {logInAsNelson, logOut} from '../../fixtures/testUtils.js';

describe('Dashboard', function () {
	before(() => cy.logOut());
	it('User must be logged in to view dashboard', function () {
		cy.request({
			method: 'GET',
			url: '/user/dashboard',
			failOnStatusCode: false
		}).should(response => {
			expect(response.status).to.eq(401);
		});
	});
});

describe("Users' fermentations", function () {
	beforeEach(() => cy.logInAs('Nelson'));
	it('contains a link to create new fermentation', function () {
		cy.visit('/user/dashboard');
		cy.get('a') //
			.contains('Add a new fermentation')
			.click();
		cy.location('pathname').should('include', 'fermentation/add');
	});
	it('contains a link to register a new device', function () {
		cy.visit('/user/dashboard');
		cy.get('a') //
			.contains('Register a new device')
			.click();
		cy.location('pathname').should('include', 'device/add');
	});
});
