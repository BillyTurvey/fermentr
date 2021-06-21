import {editDevice} from '../../../controllers/deviceController';

describe('Fermentation editing', function () {
	it("Fermentation can be edited by following an 'edit' link on the dashboard", function () {
		cy.logInAs('Jeanette');
		cy.get('article.devices > ul > li') //
			.contains('NEIPA 21')
			.next('a')
			.contains('Edit')
			.click();
		cy.get('input[name="name"]').type(temporaryTestFermentationName);
		cy.get('textarea[name="description"]').type(
			'This block of text is the description for a test fermentation. We\'re including a script element to test for correct form input sanitization: <script>alert("Gotcha!")</script>.'
		);
		cy.get(`form > .deviceRadio > input[id="${jeanettesDevice}"]`).click();
		cy.get('form').contains('Submit').click();
		cy.location('pathname').should('eq', '/user/dashboard');
	});
	it("causes the fermentation to appear on the user's dashboard", function () {
		cy.get('article.fermentations > ul > li > a') //
			.contains(temporaryTestFermentationName)
			.should('exist');
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
