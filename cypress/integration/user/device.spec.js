import {newTestEmail, url} from '../../fixtures/testUtils.js';

const addDeviceWithoutRequired = () => {
	cy.visit(url('/device/add'), {
		onLoad: (contentWindow) => {
			let inputFields = contentWindow.document.getElementsByTagName('input');
			for (let i = 0; i < inputFields.length; i++) {
				inputFields.item(i).required = false;
			}
		}
	});
};

const logIn = () => {
	cy.visit(url('user/logIn'));
	cy.fixture('registeredUser').then((user) => {
		cy.get('input[name="email"]').type(user.email);
		cy.get('input[name="password"]').type(user.password);
		cy.get('form').contains('Submit').click();
	});
}

// user must be logged in to view 'add device' page.

// device name is a required field

describe('Device name', function () {
	beforeEach(addDeviceWithoutRequired);
	it('is a required field', function () {
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Device name is a required field.');
	});
// device name mustbe unique to user
// all fields are sanitized/escaped
// form submition will supply user with access token.


describe('Sanitization', function () {
	beforeEach(registerWithoutRequired);
	it('escapes form inputs', function () {
		cy.get('input[name="email"]').type(newTestEmail());
		cy.get('input[name="name"]').type('<script>alert("ALERT!")</script>');
		cy.get('input[name="password"]').type('randomP@55word');
		cy.get('input[name="passwordConfirm"]').type('randomP@55word');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--success').should('contain', '<script>');
	});
});

describe('Email validation', function () {
	beforeEach(registerWithoutRequired);
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
		cy.fixture('registeredUser').then((user) => {
			cy.get('input[name="email"]').type(user.email);
			cy.get('input[name="name"]').type(user.name);
			cy.get('input[name="password"]').type(user.password);
			cy.get('input[name="passwordConfirm"]').type(user.password + '{enter}');
			cy.get('.flash--error').should('contain', 'Email already registered.');
		});
	});
});

describe('Success', function () {
	beforeEach(registerWithoutRequired);
	it('redirects to home after registration with success flashes', function () {
		cy.fixture('registeredUser').then((user) => {
			cy.get('input[name="email"]').type(newTestEmail());
			cy.get('input[name="name"]').type(user.name);
			cy.get('input[name="password"]').type(user.password);
			cy.get('input[name="passwordConfirm"]').type(user.password + '{enter}');
			cy.location('pathname').should('eq', '/');
		});
	});
	it('User is logged in after registration', function () {
		cy.fixture('registeredUser').then((user) => {
			cy.get('input[name="email"]').type(newTestEmail());
			cy.get('input[name="name"]').type(user.name);
			cy.get('input[name="password"]').type(user.password);
			cy.get('input[name="passwordConfirm"]').type(user.password + '{enter}');
			cy.get('.flash--success').should('contain', `${user.name}, your account was successfully created.`);
		});
	});
});
