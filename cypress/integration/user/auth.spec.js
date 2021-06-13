import {newTestEmail, unrequireFormInputs} from '../../fixtures/testUtils.js';

const visitLogInWithoutRequired = () => {
	cy.visit('/user/logIn', {onLoad: unrequireFormInputs});
};

describe('Log in page', function () {
	beforeEach(visitLogInWithoutRequired);
	it('Greets with "Log In"', function () {
		cy.contains('Log In');
	});
	it('Links to "Reset password"', function () {
		cy.contains('Reset password').should('have.attr', 'href', '/user/resetPassword');
	});
	it('Links to /register', function () {
		cy.contains('Register').should('have.attr', 'href', '/user/register');
	});
	it('Reloads page upon invalid submition', function () {
		cy.get('form').contains('Submit').click();
		cy.location('pathname').should('eq', '/user/logIn');
	});
	it('Repopulates email after invalid submition', function () {
		const sameEmail = newTestEmail();
		cy.get('input[name="email"]').type(sameEmail);
		cy.get('input[name="password"]').type('randomWORD89453');
		cy.get('form').contains('Submit').click();
		cy.get('input[name="email"]').should('have.attr', 'value', sameEmail);
	});
	it('Requires email', function () {
		cy.get('input[name="password"]').type('randomWORDS3453');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Email is a required field');
	});
	it('Requires password', function () {
		cy.get('input[name="email"]').type(`${newTestEmail()}{enter}`);
		cy.get('.flash--error').should('contain', 'Password is not valid.');
	});
	it('Fails with incorrect credentials', function () {
		cy.get('input[name="email"]').type(newTestEmail());
		cy.get('input[name="password"]').type('Inc0rectP@55word{enter}');
		cy.get('.flash--error').should('contain', 'Login failed.');
	});
});

describe('If user is NOT logged in...', function () {
	before(() => {
		cy.request('POST', 'user/logOut');
		cy.visit('/');
	});
	it('Log in option is present in the nav', function () {
		cy.get('a').contains('Log In').should('exist');
	});
	it('Log out option is not present in the nav', function () {
		cy.get('nav').contains('Log Out').should('not.exist');
	});
});

describe('If user is logged in...', function () {
	beforeEach(() => {
		cy.fixture('testUser1.json').then((user) => {
			cy.visit('user/logIn');
			cy.get('input[name="email"]').type(user.email);
			cy.get('input[name="password"]').type(user.password + '{enter}');
		});
	});
	it('Log In option is not present in the nav', function () {
		cy.get('a').contains('Log In').should('not.exist');
	});
	it('Log Out option is present in the nav', function () {
		cy.get('button').contains('Log Out').should('exist');
	});
	it('session persists', function () {
		cy.get('nav > ul > li > a').contains('Dashboard').click();
		cy.get('a').contains('fermentr.io').click();
		cy.get('button').contains('Log Out').should('exist');
	});
});

describe('Logging out...', function () {
	it('Log out button (not a link!) logs user out.', function () {
		cy.fixture('testUser1.json').then((user) => {
			cy.visit('user/logIn');
			cy.get('input[name="email"]').type(user.email);
			cy.get('input[name="password"]').type(user.password + '{enter}');
			cy.get('nav > form > button').contains('Log Out').click();
			cy.get('.flash--success').should('contain', 'You have successfully logged out.');
		});
	});
});
