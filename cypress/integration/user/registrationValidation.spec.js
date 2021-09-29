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
		cy.get('input[name="registrationPassword"]').type(Cypress.env('registrationPassword'));
		cy.get('form').contains('Submit').click();
		cy.get('input[name="email"]').should('have.attr', 'value', sameEmail);
		cy.get('input[name="name"]').should('have.attr', 'value', 'Any Name');
	});
	it('does not repopulate password after invalid form submission', function () {
		cy.get('input[name="name"]').type("Doesn't Repopulate Passwords");
		cy.get('input[name="password"]').type('randomP@55word');
		cy.get('input[name="passwordConfirm"]').type('randomP@55word');
		cy.get('input[name="registrationPassword"]').type(Cypress.env('registrationPassword'));
		cy.get('form').contains('Submit').click();
		cy.get('input[name="password"]').should('be.empty');
		cy.get('input[name="passwordConfirm"]').should('be.empty');
	});
	it('Requires passwords to match', function () {
		cy.get('input[name="email"]').type(newTestEmail());
		cy.get('input[name="name"]').type('Any Name');
		cy.get('input[name="password"]').type('randomP@55word');
		cy.get('input[name="passwordConfirm"]').type('differentP@55word');
		cy.get('input[name="registrationPassword"]').type(Cypress.env('registrationPassword'));
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Passwords do not match.');
	});
	it('Requires a signup password for succesful registration.', function () {
		cy.get('input[name="email"]').type(newTestEmail());
		cy.get('input[name="name"]').type('Any Name');
		cy.get('input[name="password"]').type('randomP@55word');
		cy.get('input[name="passwordConfirm"]').type('randomP@55word');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'You must provide a valid registration password.');
	});
	it('Requires a valid signup password for succesful registration.', function () {
		cy.get('input[name="email"]').type(newTestEmail());
		cy.get('input[name="name"]').type('Any Name');
		cy.get('input[name="password"]').type('randomP@55word');
		cy.get('input[name="passwordConfirm"]').type('randomP@55word');
		cy.get('input[name="registrationPassword"]').type('incorrectRegPW');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'You must provide a valid registration password.');
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
			cy.get('input[name="registrationPassword"]').type(Cypress.env('registrationPassword'));
			cy.get('input[name="passwordConfirm"]').type(Cypress.env('nelsonsPassword') + '{enter}');
			cy.get('.flash--error').should('contain', 'Email already registered.');
		});
	});
});
