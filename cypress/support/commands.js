import jeanette from '../fixtures/testUserJeanette.json';
import nelson from '../fixtures/testUserNelson.json';

Cypress.Commands.add('logInAs', user => {
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
});

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

Cypress.Commands.add('createDevice', device => {
	cy.visit('/device/add');
	cy.get('input[name="name"]').type(device.name);
	cy.get('textarea[name="description"]').type(device.description || 'Temporary test device.');
	cy.get('form').contains('Submit').click();
	if (!(device.redirect === false)) {
		cy.get('a').contains(device.name).click(); //allows tests to save the url of the freshly created device
	}
});

Cypress.Commands.add('createFermentation', (fermentationName, description) => {
	cy.visit('/fermentation/add');
	cy.get('input[name="name"]').type(fermentationName);
	cy.get('textarea[name="description"]').type(description || 'Temporary test fermentation.');
	cy.get('form').contains('Submit').click();
});

export const newTestDeviceName = () => `TemporaryTestDevice${Math.random().toString().slice(2, 7)}`;
export const newTestFermentationName = () =>
	`TemporaryTestFermentation${Math.random().toString().slice(2, 7)}`;
