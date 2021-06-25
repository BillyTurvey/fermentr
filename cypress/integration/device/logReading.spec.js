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
		cy.request({
			method: 'POST',
			url: '/device/60d6430126d74a78af3e5cfb/log',
			headers: {
				'device-key': '2ca1e6a0-da03-4cdb-8360-5737df6a8b6f'
			},
			body: {
				temperature: Math.floor(Math.random() * 6 + 17)
			}
		}).should(response => {
			expect(response.status).to.eq(200);
		});
	});
});
