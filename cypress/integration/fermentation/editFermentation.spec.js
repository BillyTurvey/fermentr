describe('Fermentation editing', function () {
	it("Fermentation can be edited by following an 'edit' link on the dashboard", function () {
		cy.logInAs('Jeanette');
		cy.visit('/user/dashboard');
		cy.get('article.fermentations > ul > li') //
			.contains('NEIPA 21')
			.next('a')
			.contains('Edit')
			.click();
		cy.location('pathname').should('eq', '/fermentation/60e1b00a3efff60ee0a65001/edit');
	});
	it('Submitting edit fermentation form with invalid data causes the form to reload with the invalid data populated in their fields', function () {
		cy.logInAs('Jeanette');
		cy.visit('/user/dashboard');
		cy.get('article.fermentations > ul > li') //
			.contains('NEIPA 21')
			.next('a')
			.contains('Edit')
			.click();
		cy.get('textarea[name="description"]').type(
			'A load more text to cause this description to be too long and fail validation. Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah A load more text to cause this description to be too long and fail validation. Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah A load more text to cause this description to be too long and fail validation.'
		);
		cy.get('form > button').contains('Update').click();
		cy.get('textarea[name=description]').contains('blah blah').should('exist');
	});
	it('Submitting the edit form updates the fermentation details', function () {
		cy.logInAs('Jeanette');
		cy.visit('/user/dashboard');
		cy.get('article.fermentations > ul > li') //
			.contains('NEIPA 21')
			.next('a')
			.contains('Edit')
			.click();
		const sameNumber = Math.random();
		cy.get('textarea[name="description"]')
			.clear()
			.type(`Persistent test fermentation, do not delete. Lorem ipsum... ${sameNumber}`);
		cy.get('form > button').contains('Update').click();
		cy.get('p.description').contains(sameNumber).should('exist');
	});
	it("After updating a fermentation the same fermentation loads in 'view' mode.", function () {
		cy.logInAs('Jeanette');
		cy.visit('/user/dashboard');
		cy.get('article.fermentations > ul > li') //
			.contains('NEIPA 21')
			.next('a')
			.contains('Edit')
			.click();
		cy.get('form').contains('Update').click();
		cy.location('pathname').should('eq', '/fermentation/60e1b00a3efff60ee0a65001');
	});
});
