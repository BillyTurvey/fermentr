import {newTestEmail, unrequireFormInputs, logInAs, logOut} from '../../fixtures/testUtils.js';

const visitRegisterWithoutRequired = () => {
	cy.visit('/user/register', {onLoad: unrequireFormInputs});
};

describe('Registration page', function () {
	beforeEach(visitRegisterWithoutRequired);
	it('Greets with "Register"', function () {
		cy.contains('Register');
	});
	it('Links to login page', function () {
		cy.contains('Already have an account? Log in here.').should('have.attr', 'href', '/user/logIn');
	});
});

describe('Invalid Form Submission', function () {
	beforeEach(visitRegisterWithoutRequired);
	it('Reloads page upon invalid form submission', function () {
		cy.get('input[name="email"]').type(newTestEmail());
		cy.get('form').contains('Submit').click();
		cy.location('pathname').should('eq', '/user/register');
	});
	it('Requires password', function () {
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Password is not valid.');
	});
	it('Repopulates entered form data after invalid submission - not password', function () {
		const sameEmail = newTestEmail();
		cy.get('input[name="email"]').type(sameEmail);
		cy.get('input[name="name"]').type('Any Name');
		cy.get('form').contains('Submit').click();
		cy.get('input[name="email"]').should('have.attr', 'value', sameEmail);
		cy.get('input[name="name"]').should('have.attr', 'value', 'Any Name');
	});
	it('does not repopulate password after invalid form submission', function () {
		cy.get('input[name="name"]').type("Doesn't Repopulate Passwords");
		cy.get('input[name="password"]').type('randomP@55word');
		cy.get('input[name="passwordConfirm"]').type('randomP@55word');
		cy.get('form').contains('Submit').click();
		cy.get('input[name="password"]').should('be.empty');
		cy.get('input[name="passwordConfirm"]').should('be.empty');
	});
	it('Requires passwords to match', function () {
		const sameEmail = newTestEmail();
		cy.get('input[name="email"]').type(sameEmail);
		cy.get('input[name="name"]').type('Any Name');
		cy.get('input[name="password"]').type('randomP@55word');
		cy.get('input[name="passwordConfirm"]').type('differentP@55word');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Passwords do not match.');
	});
});

describe('Email validation', function () {
	beforeEach(visitRegisterWithoutRequired);
	it('Email cannot be blank', function () {
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Email is not valid.');
	});
	it('Rejects email adresses with spaces ', function () {
		const email = newTestEmail();
		const spaceyEmail = `${email.slice(0, 9)} ${email.slice(9)}`;
		cy.get('input[name="email"]').type(spaceyEmail);
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Email is not valid.');
	});
	it('Rejects already registered emails', function () {
		cy.fixture('testUserNelson').then(user => {
			cy.get('input[name="email"]').type(user.email);
			cy.get('input[name="name"]').type(user.name);
			cy.get('input[name="password"]').type(Cypress.env('nelsonsPassword'));
			cy.get('input[name="passwordConfirm"]').type(Cypress.env('nelsonsPassword') + '{enter}');
			cy.get('.flash--error').should('contain', 'Email already registered.');
		});
	});
});

{
	const temporaryTestUser1 = {
		name: 'Temporary <br>Tilly',
		email: 'testymctestface@unreal.com',
		password: `engine-${Math.random().toString().slice(1, 12)}-float-wireless`
	};

	describe('Success', function () {
		it('Redirects to user dashboard after registration and user is logged in', function () {
			cy.visit('/user/register');
			cy.get('input[name="email"]').type(temporaryTestUser1.email);
			cy.get('input[name="name"]').type(temporaryTestUser1.name);
			cy.get('input[name="password"]').type(temporaryTestUser1.password);
			cy.get('input[name="passwordConfirm"]').type(temporaryTestUser1.password + '{enter}');
			cy.location('pathname').should('eq', '/user/dashboard');
			cy.get('nav').should('contain', `Dashboard`);
		});
	});

	describe('Sanitization', function () {
		before(logOut);
		it("User's name is escaped", function () {
			logInAs(temporaryTestUser1);
			cy.visit('/user/dashboard');
			cy.get('nav > p').contains('Logged in as Temporary <br>Tilly').should('exist');
		});
	});

	describe('Account deletion', function () {
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
