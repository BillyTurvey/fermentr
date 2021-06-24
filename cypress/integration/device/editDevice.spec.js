describe('Device editing', function () {
	it("Device can be edited by following an 'edit' link on the dashboard", function () {
		cy.logInAs('Jeanette');
		cy.visit('user/dashboard');
		cy.get('article.devices > ul > li') //
			.contains('Raspberry')
			.next('a')
			.contains('Edit')
			.click();
		cy.location('pathname').should('eq', '/device/60c1b4581d8a36ac2286310a/edit');
	});
	it('Submitting the edit form updates the device details', function () {
		cy.logInAs('Jeanette');
		cy.visit('user/dashboard');
		cy.get('article.devices > ul > li') //
			.contains('Raspberry')
			.next('a')
			.contains('Edit')
			.click();
		const sameNumber = Math.random();
		cy.get('textarea[name="description"]')
			.clear()
			.type(`Persistent test device used in integration tests. Description lorem ipsum ${sameNumber}`);
		cy.get('form > button').contains('Update').click();
		cy.get('p.description').contains(sameNumber).should('exist');
	});
	it("After updating a device the same device loads in 'view' mode.", function () {
		cy.logInAs('Jeanette');
		cy.get('article.devices > ul > li') //
			.contains('Raspberry')
			.next('a')
			.contains('Edit')
			.click();
		cy.get('textarea[name="description"]').type(' 🤙');
		cy.get('form').contains('Submit').click();
		cy.location('pathname').should('eq', '/device/60c1b4581d8a36ac2286310a');
	});
	// it("causes the selected device to be listed as the device's assigned device", function () {
	// 	cy.get('article.devices > ul > li > a') //
	// 		.contains(temporaryTestFermentationName)
	// 		.click();
	// 	cy.get('p')
	// 		.contains(`Device ${jeanettesDevice} is assigned to ${temporaryTestFermentationName}.`)
	// 		.should('exist');
	// });
});
