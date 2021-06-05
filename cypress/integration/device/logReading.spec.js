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
		}).should((response) => {
			expect(response.status).to.eq(401);
		});
	});
});
