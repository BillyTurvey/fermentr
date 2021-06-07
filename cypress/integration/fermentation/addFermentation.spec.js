// fermentation/add exhists
// fermentation/add must be logged in to view
// form with the following inputs:
// name
// Description
// Malt bill
// Hops
// OG
// Target FG
// Yeast & Pitch Rate
// Water additions

// Updates the device's entry in the databse to show its active fermentation
// Users' registered devices will show up on the page with a checkbox to use the device for this fermentation
// Fermentation name must be unique to user
// Fermentation name must be escaped
// Description must be escaped
import {logIn, logOut} from '../../fixtures/testUtils.js';

// const logOut = () => cy.request('POST', '/user/logOut');

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
});

describe('Auth', function () {
	before(logIn);
	it('Page loads for logged in user', function () {
		cy.request({
			method: 'GET',
			url: '/fermentation/add',
			failOnStatusCode: false
		}).should((response) => {
			expect(response.status).to.eq(200);
		});
	});
});
