describe('Device editing', function () {
	it("Device can be edited by following an 'edit' link on the dashboard", function () {
		cy.logInAs('Jeanette');
		cy.visit('/user/dashboard');
		cy.get('article.devices > ul > li') //
			.contains('Raspberry')
			.next('a')
			.contains('Edit')
			.click();
		cy.location('pathname').should('eq', '/device/60e2a2d860d83e1f4f3eb1e9/edit');
	});
	it('Submitting the edit form updates the device details', function () {
		cy.logInAs('Jeanette');
		cy.visit('/user/dashboard');
		cy.get('article.devices > ul > li') //
			.contains('Raspberry')
			.next('a')
			.contains('Edit')
			.click();
		const sameNumber = Math.random();
		cy.get('textarea[name="description"]')
			.clear()
			.type(`Persistent test device used in integration tests. Do not delete! ${sameNumber}`);
		cy.get('form > button').contains('Update').click();
		cy.get('p.description').contains(sameNumber).should('exist');
	});
	it("After updating a device the same device loads in 'view' mode.", function () {
		cy.logInAs('Jeanette');
		cy.visit('/user/dashboard');
		cy.get('article.devices > ul > li') //
			.contains('Raspberry')
			.next('a')
			.contains('Edit')
			.click();
		cy.get('textarea[name="description"]').type(' 🤙');
		cy.get('form').contains('Update').click();
		cy.location('pathname').should('contain', '/device/60e2a2d860d83e1f4f3eb1e9');
	});
});
