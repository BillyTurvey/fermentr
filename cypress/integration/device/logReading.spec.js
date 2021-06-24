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
			url: '/device/60d2db98d800940aa1c0b533/log',
			headers: {
				'device-key': 'e3491a5d-9c75-49c0-ae7d-c68d5b1a601d'
			},
			body: {
				temperature: Math.floor(Math.random() * 6 + 17)
			}
		}).should(response => {
			expect(response.status).to.eq(200);
		});
	});
});
