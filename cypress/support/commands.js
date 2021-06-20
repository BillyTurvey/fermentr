import jeanette from '../fixtures/testUserJeanette.json';
import nelson from '../fixtures/testUserNelson.json';

Cypress.Commands.add('logInAs', userObject => {
	if (user === 'Jeanette') user = jeanette;
	if (user === 'Nelson') user = nelson;
	cy.request({
		method: 'POST',
		url: '/user/logIn',
		body: {
			email: user.email,
			password: user.password
		}
	});
});
