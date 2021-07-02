describe('Fermentation editing', function () {
	it("Fermentation can be edited by following an 'edit' link on the dashboard", function () {
		cy.logInAs('Jeanette');
		cy.visit('user/dashboard');
		cy.get('article.fermentations > ul > li') //
			.contains('NEIPA 21')
			.next('a')
			.contains('Edit')
			.click();
		cy.location('pathname').should('eq', '/fermentation/60c4cefc55d2a518d3004ec8/edit');
	});
	it('Submitting the edit form updates the fermentation details', function () {
		cy.logInAs('Jeanette');
		cy.visit('user/dashboard');
		cy.get('article.fermentations > ul > li') //
			.contains('NEIPA 21')
			.next('a')
			.contains('Edit')
			.click();
		const sameNumber = Math.random();
		cy.get('textarea[name="description"]').clear().type(`Fermentation description lorem ipsum ${sameNumber}`);
		cy.get('form > button').contains('Update').click();
		cy.get('p.description').contains(sameNumber).should('exist');
	});
	it("After updating a fermentation the same fermentation loads in 'view' mode.", function () {
		cy.logInAs('Jeanette');
		cy.visit('user/dashboard');
		cy.get('article.fermentations > ul > li') //
			.contains('NEIPA 21')
			.next('a')
			.contains('Edit')
			.click();
		cy.get('form').contains('Update').click();
		cy.location('pathname').should('eq', '/fermentation/60c4cefc55d2a518d3004ec8');
	});
	it("causes the selected device to be listed as the fermentation's assigned device", function () {
		cy.get('article.fermentations > ul > li > a') //
			.contains(temporaryTestFermentationName)
			.click();
		cy.get('p')
			.contains(`Device ${jeanettesDevice} is assigned to ${temporaryTestFermentationName}.`)
			.should('exist');
	});
});
