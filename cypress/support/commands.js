import jeanette from '../fixtures/testUserJeanette.json';
import nelson from '../fixtures/testUserNelson.json';

function logInAs(user) {
	if (user === 'Jeanette') user = jeanette;
	if (user === 'Nelson') user = nelson;
	cy.request('POST', '/user/logOut').then(() => {
		cy.request({
			method: 'POST',
			url: '/user/logIn',
			body: {
				email: user.email,
				password: user.password
			}
		});
	});
}

Cypress.Commands.add('logInAs', logInAs);

Cypress.Commands.add('logOut', () => cy.request('POST', '/user/logOut'));

Cypress.Commands.add('deleteFermentation', (fermentationName, fermentationOwner) => {
	if (fermentationOwner) logInAs(fermentationOwner);
	cy.visit('/user/dashboard');
	cy.get('article.fermentations > ul > li') //
		.contains(fermentationName)
		.next('a')
		.contains('Edit')
		.click();
	cy.get('button') //
		.contains(`Delete ${fermentationName}`)
		.click();
});

// Cypress.Commands.add('', () => );
// Cypress.Commands.add('', () => );
