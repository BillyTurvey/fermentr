import jeanette from '../fixtures/testUserJeanette.json';
import nelson from '../fixtures/testUserNelson.json';

function logInAs(user) {
	if (typeof user === 'string') {
		if (user === 'Jeanette') {
			user = jeanette;
			var password = Cypress.env('jeanettesPassword');
		}
		if (user === 'Nelson') {
			user = nelson;
			var password = Cypress.env('nelsonsPassword');
		}
	} else if (typeof user === 'object') {
		var password = user.password;
	}

	cy.visit('/user/logIn');
	cy.get('input[name="email"]').type(user.email);
	cy.get('input[name="password"]').type(password + '{enter}');
}

Cypress.Commands.add('logInAs', logInAs);

Cypress.Commands.add('logOut', () => cy.request('POST', '/user/logOut'));

Cypress.Commands.add('deleteFermentation', (fermentationName, fermentationOwner) => {
	if (fermentationOwner) logInAs(fermentationOwner);
	cy.visit('/user/dashboard');
	cy.get('article.fermentations > ul > li > a') //
		.contains(fermentationName)
		.parent()
		.next('a')
		.contains('Edit')
		.click();
	cy.get('button') //
		.contains(`Delete ${fermentationName}`)
		.click();
});

Cypress.Commands.add('deleteDevice', (deviceName, deviceOwner) => {
	if (deviceOwner) logInAs(deviceOwner);
	cy.visit('/user/dashboard');
	cy.get('article.devices > ul > li > a') //
		.contains(deviceName)
		.parent()
		.next('a')
		.contains('Edit')
		.click();
	cy.get('button') //
		.contains(`Delete ${deviceName}`)
		.click();
});
