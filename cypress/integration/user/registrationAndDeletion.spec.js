import {logInAs, logOut} from '../../fixtures/testUtils.js';

{
	const temporaryTestUser1 = {
		name: 'Temporary <br>Tilly',
		email: 'testymctestface@unreal.com',
		password: `engine-${Math.random().toString().slice(1, 12)}-float-wireless`
	};

	describe('User registration - Success', function () {
		it('Redirects to user dashboard after registration and user is logged in', function () {
			cy.visit('/user/register');
			cy.get('input[name="email"]').type(temporaryTestUser1.email);
			cy.get('input[name="name"]').type(temporaryTestUser1.name);
			cy.get('input[name="registrationPassword"]').type(Cypress.env('registrationPassword'));
			cy.get('input[name="password"]').type(temporaryTestUser1.password);
			cy.get('input[name="passwordConfirm"]').type(temporaryTestUser1.password + '{enter}');
			cy.location('pathname').should('eq', '/user/dashboard');
			cy.get('nav').should('contain', `Dashboard`);
		});
	});

	describe('User registration - Sanitization', function () {
		before(() => cy.logOut());
		it("User's name is escaped", function () {
			logInAs(temporaryTestUser1);
			cy.visit('/user/dashboard');
			cy.get('nav > p').contains('Logged in as Temporary <br>Tilly').should('exist');
		});
	});

	describe('User account deletion', function () {
		it('Account deletion link takes user to a confirmation of deletion page', function () {
			logInAs(temporaryTestUser1);
			cy.visit('/user/account');
			cy.get('a').contains('Delete your account.').click();
			cy.get('h1').contains('Are you sure you want to delete your account?').should('exist');
		});
		it('Deletion confirmation page uses a button to POST the account deletion request to the server', function () {
			logInAs(temporaryTestUser1);
			cy.visit('/user/account');
			cy.get('a').contains('Delete your account.').click();
			cy.get('form[method="POST"] > button') //
				.contains('Delete my account forever')
				.should('exist');
		});
		it("User's account is deleted", function () {
			logInAs(temporaryTestUser1);
			cy.visit('/user/deleteAccount');
			cy.get('button').contains('Delete my account forever').click();
			cy.visit('/user/logIn');
			cy.get('input[name="email"]').type(temporaryTestUser1.email);
			cy.get('input[name="password"]').type(temporaryTestUser1.password + '{enter}');
			cy.get('.flash--error').should('contain', 'Login failed.');
		});
		// it('users fermentations are deleted', function () {
		// 	cy.visit('/user/account');
		// 	cy.get('input[name="email"]').type(user.email);
		// 	cy.get('input[name="password"]').type(user.password + '{enter}');
		// });
		// it('users devices are deleted', function () {
		// 	cy.visit('/user/account');
		// });
	});
}
