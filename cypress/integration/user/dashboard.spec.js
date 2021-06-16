// Shows a list of current fermentations
// Shows a list of past fermentations
// Shows a list of devices
// links to manage account

import {logIn, logOut} from '../../fixtures/testUtils.js';

describe('Dashboard', function () {
	before(logOut);
	it('must be logged in to view user dashboard', function () {
		cy.request({
			method: 'GET',
			url: '/user/dashboard',
			failOnStatusCode: false
		}).should((response) => {
			expect(response.status).to.eq(401);
		});
	});
});

describe("Users' fermentations", function () {
	before(logIn);
	it("shows a list of user's fermentations ", function () {});
	it('contains a link to create new fermentation', function () {});
});
