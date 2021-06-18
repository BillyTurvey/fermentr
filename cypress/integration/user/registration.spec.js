import {newTestEmail, unrequireFormInputs} from '../../fixtures/testUtils.js';

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
			cy.get('input[name="password"]').type(user.password);
			cy.get('input[name="passwordConfirm"]').type(user.password + '{enter}');
			cy.get('.flash--error').should('contain', 'Email already registered.');
		});
	});
});

describe('Success', function () {
	beforeEach(visitRegisterWithoutRequired);
	it('Redirects to user dashboard after registration with success flashes', function () {
		cy.fixture('testUserNelson').then(user => {
			cy.get('input[name="email"]').type(newTestEmail());
			cy.get('input[name="name"]').type(user.name);
			cy.get('input[name="password"]').type(user.password);
			cy.get('input[name="passwordConfirm"]').type(user.password + '{enter}');
			cy.location('pathname').should('eq', '/user/dashboard');
		});
	});
	it('User is logged in after registration', function () {
		cy.fixture('testUserNelson').then(user => {
			cy.get('input[name="email"]').type(newTestEmail());
			cy.get('input[name="name"]').type(user.name);
			cy.get('input[name="password"]').type(user.password);
			cy.get('input[name="passwordConfirm"]').type(user.password + '{enter}');
			cy.get('nav').should('contain', `Dashboard`);
		});
	});
});

describe('Sanitization', function () {
	beforeEach(visitRegisterWithoutRequired);
	it("User's name is escaped", function () {
		cy.get('input[name="email"]').type(newTestEmail());
		cy.get('input[name="name"]').type('<script>alert("ALERT!")</script>');
		cy.get('input[name="password"]').type('randomP@55word');
		cy.get('input[name="passwordConfirm"]').type('randomP@55word');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--success').should('contain', '<script>');
	});
});

//User account has link to delete account
//folloeing user account deletiion link takes user to a confirmation of deletion page
//confirm deletion page has a button to delete user account
// user's account is deleted
// users fermentations are deleted
// users devices are deleted
