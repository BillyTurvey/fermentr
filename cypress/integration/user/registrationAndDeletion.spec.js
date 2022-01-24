import {logInAs, logOut} from '../../fixtures/testUtils.js';

const temporaryTestUser1 = {
	name: 'Temporary <br>Tilly',
	email: 'testymctestface@unreal.com',
	password: `engine-${Math.random().toString().slice(1, 12)}-float-wireless`
};

describe('User registration - Success', function () {
	it('Redirects to user dashboard after registration and user is logged in', function () {
		const testUser = {
			name: 'Temporary Test User',
			email: `email${Math.random().toString().slice(3, 12)}@testemail.com`,
			password: `engine-${Math.random().toString().slice(1, 12)}-float-wireless`
		};
		cy.visit('/user/register');
		cy.get('input[name="email"]').type(testUser.email, {delay: 0});
		cy.get('input[name="name"]').type(testUser.name, {delay: 0});
		cy.get('input[name="registrationPassword"]').type(Cypress.env('registrationPassword'), {delay: 0});
		cy.get('input[name="password"]').type(testUser.password, {delay: 0});
		cy.get('input[name="passwordConfirm"]').type(testUser.password + '{enter}', {delay: 0});
		// assert
		cy.location('pathname').should('eq', '/user/dashboard');
		cy.get('nav').should('contain', `Dashboard`);
		// delete account
		cy.visit('/user/account');
		cy.get('form[method="GET"] > button') //
			.contains('Delete your account')
			.click();
		cy.get('form[method="POST"] > button') //
			.contains('Delete my account forever')
			.click();
	});
});

describe('User registration - Sanitization', function () {
	before(() => cy.logOut());
	it("User's name is escaped", function () {
		const testUser = {
			name: 'Test User <br> Name',
			email: `email${Math.random().toString().slice(3, 12)}@testemail.com`,
			password: `engine-${Math.random().toString().slice(1, 12)}-float-wireless`
		};
		cy.visit('/user/register');
		cy.get('input[name="email"]').type(testUser.email, {delay: 0});
		cy.get('input[name="name"]').type(testUser.name, {delay: 0});
		cy.get('input[name="registrationPassword"]').type(Cypress.env('registrationPassword'), {delay: 0});
		cy.get('input[name="password"]').type(testUser.password, {delay: 0});
		cy.get('input[name="passwordConfirm"]').type(testUser.password + '{enter}', {delay: 0});
		// assert
		cy.get('nav p').contains(testUser.name).should('exist');
		// delete account
		cy.visit('/user/account');
		cy.get('form[method="GET"] > button') //
			.contains('Delete your account')
			.click();
		cy.get('form[method="POST"] > button') //
			.contains('Delete my account forever')
			.click();
	});
});

describe('User account deletion', function () {
	it('Account deletion link takes user to a confirmation of deletion page', function () {
		const testUser = {
			name: 'Temporary Test User',
			email: `email${Math.random().toString().slice(3, 12)}@testemail.com`,
			password: `engine-${Math.random().toString().slice(1, 12)}-float-wireless`
		};
		cy.visit('/user/register');
		cy.get('input[name="email"]').type(testUser.email, {delay: 0});
		cy.get('input[name="name"]').type(testUser.name, {delay: 0});
		cy.get('input[name="registrationPassword"]').type(Cypress.env('registrationPassword'), {delay: 0});
		cy.get('input[name="password"]').type(testUser.password, {delay: 0});
		cy.get('input[name="passwordConfirm"]').type(testUser.password + '{enter}', {delay: 0});
		cy.visit('/user/account');
		cy.get('form[method="GET"] > button') //
			.contains('Delete your account')
			.click();
		cy.get('h1').contains('Are you sure you want to delete your account?').should('exist');
		cy.get('form[method="POST"] > button') //
			.contains('Delete my account forever')
			.click();
	});

	it('Deletion confirmation page uses a button to POST the account deletion request to the server', function () {
		const testUser = {
			name: 'Temporary Test User',
			email: `email${Math.random().toString().slice(3, 12)}@testemail.com`,
			password: `engine-${Math.random().toString().slice(1, 12)}-float-wireless`
		};
		cy.visit('/user/register');
		cy.get('input[name="email"]').type(testUser.email, {delay: 0});
		cy.get('input[name="name"]').type(testUser.name, {delay: 0});
		cy.get('input[name="registrationPassword"]').type(Cypress.env('registrationPassword'), {delay: 0});
		cy.get('input[name="password"]').type(testUser.password, {delay: 0});
		cy.get('input[name="passwordConfirm"]').type(testUser.password + '{enter}', {delay: 0});
		cy.visit('/user/account');
		cy.get('form[method="GET"] > button') //
			.contains('Delete your account')
			.click();
		cy.get('form[method="POST"] > button') //
			.contains('Delete my account forever')
			.should('exist')
			.click();
	});

	it("User's account is deleted", function () {
		const testUser = {
			name: 'Temporary Test User',
			email: `email${Math.random().toString().slice(3, 12)}@testemail.com`,
			password: `engine-${Math.random().toString().slice(1, 12)}-float-wireless`
		};
		cy.visit('/user/register');
		cy.get('input[name="email"]').type(testUser.email, {delay: 0});
		cy.get('input[name="name"]').type(testUser.name, {delay: 0});
		cy.get('input[name="registrationPassword"]').type(Cypress.env('registrationPassword'), {delay: 0});
		cy.get('input[name="password"]').type(testUser.password, {delay: 0});
		cy.get('input[name="passwordConfirm"]').type(testUser.password + '{enter}', {delay: 0});
		cy.visit('/user/account');
		cy.get('form[method="GET"] > button') //
			.contains('Delete your account')
			.click();
		cy.get('form[method="POST"] > button') //
			.contains('Delete my account forever')
			.click();
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
