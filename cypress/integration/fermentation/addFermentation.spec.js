// Updates the device's entry in the databse to show its active fermentation
// Users' registered devices will show up on the page with a checkbox to use the device for this fermentation
// Fermentation name must be unique to user
// Fermentation name must be escaped
// Description must be escaped

import {logIn, logOut} from '../../fixtures/testUtils.js';

describe('Auth', function () {
	before(logOut);
	it('User must be logged in to view Add Device page', function () {
		cy.request({
			method: 'GET',
			url: '/fermentation/add',
			failOnStatusCode: false
		}).should((response) => {
			expect(response.status).to.eq(401);
		});
	});
	it('loads for logged in user', function () {
		logIn();
		cy.visit('fermentation/add');
		cy.get('h1').contains('Add New Fermentation');
	});
});

describe('Page', function () {
	beforeEach(() => {
		logIn();
	});
	it('contains form with correct inputs', function () {
		cy.visit('fermentation/add');
		cy.get('form')
			.should('contain', 'Name') //
			.should('contain', 'Description')
			.should('contain', 'Target FG');
	});
});
