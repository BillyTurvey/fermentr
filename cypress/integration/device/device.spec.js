import {newTestEmail} from '../../fixtures/testUtils.js';

const logInAndVisitAddDeviceWithoutRequired = () => {
	logIn();
	cy.visit('/device/add', {
		onLoad: (contentWindow) => {
			let inputFields = contentWindow.document.getElementsByTagName('input');
			for (let i = 0; i < inputFields.length; i++) {
				inputFields.item(i).required = false;
			}
		}
	});
};

const logIn = () => {
	cy.fixture('registeredUser').then((user) => {
		cy.request({
			method: 'POST',
			url: '/user/logIn',
			body: {
				email: 'nelsonthetestcustomer@testcustomer.com',
				// email: user.email,
				password: 'melt-Sunk-786543-Erstwhile'
				// password: user.password
			}
		});
	});
};

const logOut = () => cy.request('POST', '/user/logOut');

describe('User', function () {
	before(logOut);
	it('must be logged in to view Add Device page', function () {
		cy.request({
			method: 'GET',
			url: '/device/add',
			failOnStatusCode: false
		}).should((response) => {
			expect(response.status).to.eq(403);
		});
	});
});

describe('Device name', function () {
	beforeEach(logInAndVisitAddDeviceWithoutRequired);
	it('is a required field', function () {
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Device name is a required field.');
	});
	it('must be unique to user', function () {
		cy.get('input[name="deviceName"]').type('Arduino One');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`You already have a device named \'Arduino One\', please choose a new name.`
		);
	});
	it('must be shorter than 20 chars', function () {
		cy.get('input[name="deviceName"]').type('This string is too long for a device name');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`Device name is too long, please limit to fewer than 20 characters.`
		);
	});
});

describe('Device description', function () {
	beforeEach(logInAndVisitAddDeviceWithoutRequired);
	it('must be shorter than 100 chars', function () {
		cy.get('input[name="deviceName"]').type('Neville XIV');
		cy.get('input[name="description"]').type(
			'A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut libero eget quam volutpat sodales. Praesent aliquam elit ut dui pharetra convallis.'
		);
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`Description is too long, please limit to fewer than 100 characters.`
		);
	});
});

// all fields are sanitized/escaped
describe('Sanitization', function () {
	beforeEach(logInAndVisitAddDeviceWithoutRequired);
	it('form inputs are escaped', function () {
		cy.get('input[name="deviceName"]').type('<script>alert("ALERT!")</script>');
		cy.get('form').contains('Submit').click();
		cy.get('p').should(
			'contain',
			'Your device \'<script>alert("ALERT!")</script>\' was successfully registered.'
		);
	});
});

describe('Success', function () {
	beforeEach(logInAndVisitAddDeviceWithoutRequired);
	it('provides access token upon successfully registering device', function () {
		cy.get('input[name="deviceName"]').type(`test device ${Date.now().toString()}`);
		cy.get('form').contains('Submit').click();
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
