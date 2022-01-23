describe('Viewing a fermentation', function () {
	it('User must be logged in.', function () {
		cy.logOut;
		cy.request({
			method: 'GET',
			url: '/fermentation/60e1b00a3efff60ee0a65001',
			failOnStatusCode: false
		}).should(response => {
			expect(response.status).to.eq(401);
		});
	});
});

// page lists fermentation specs:
// name
// Description
// Malt
// Hops
// OG
// Target FG
// Actual FG
// Yeast type and Pitching rate
// Water addatives
// PH
// Start date
// End date
//
// If spec has no value it is not shown on page
// Shows graph of temp
// Shows graph of target temp
// Shows graph of heating times
// Shows graph of ambient temp
// Shows graph of fermentation activity
