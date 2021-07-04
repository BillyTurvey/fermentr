describe('Fermentation thermal profile', function () {
	it('Target thermal profile is editable from the edit fermentation page', function () {
		const temporaryTestFermentationName = `Temporary Test Fermentation ${Math.random()
			.toString()
			.slice(9, 12)}`;
		cy.logInAs('Jeanette');
		cy.visit('fermentation/add');
		cy.get('input[name="name"]').type(temporaryTestFermentationName);
		cy.get('textarea[name="description"]').type(
			'This fermentation is used by integration tests, it should be automatically deleted.'
		);
		cy.get('form').contains('Submit').click();
		cy.get('article.fermentations > ul > li > a').contains(temporaryTestFermentationName).click();
		cy.get('article.thermal-profile > a').contains('Edit target thermal profile.').click();
		cy.get('input[type="number"].day').type('0');
		cy.get('input[type="number"].hour').type('0');
		cy.get('input[type="number"].temperature').type('18.5');
		cy.get('button').contains('save').click();
		cy.get('article.thermal-profile > table > tbody > tr:nth-child(3)') //
			.contains('18.5')
			.should('exist');
		cy.deleteFermentation(temporaryTestFermentationName);
	});
});
