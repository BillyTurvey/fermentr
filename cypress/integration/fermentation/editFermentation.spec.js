describe('Fermentation editing', function () {
	it("Fermentation can be edited by following an 'edit' link on the dashboard", function () {
		cy.logInAs('Jeanette');
		cy.visit('user/dashboard');
		cy.get('article.fermentations > ul > li') //
			.contains('NEIPA 21')
			.next('a')
			.contains('Edit')
			.click();
		const sameNumber = Math.random();
		cy.get('textarea[name="description"]').type(sameNumber);
		cy.get('form').contains('Submit').click();
		cy.get('p.description').contains(sameNumber).should('exist');
	});
	it("After updating a fermentation the same fermentation loads in 'view' mode.", function () {
		cy.logInAs('Jeanette');
		cy.get('article.devices > ul > li') //
			.contains('NEIPA 21')
			.next('a')
			.contains('Edit')
			.click();
		cy.get('[name="name"]').type(temporaryTestFermentationName);
		cy.get('textarea[name="description"]').type("This is the extra text I'm adding.");
		cy.get('form').contains('Submit').click();
		cy.location('pathname').should('eq', '/user/dashboard');
	});
	// it("causes the selected device to be listed as the fermentation's assigned device", function () {
	// 	cy.get('article.fermentations > ul > li > a') //
	// 		.contains(temporaryTestFermentationName)
	// 		.click();
	// 	cy.get('p')
	// 		.contains(`Device ${jeanettesDevice} is assigned to ${temporaryTestFermentationName}.`)
	// 		.should('exist');
	// });
});
