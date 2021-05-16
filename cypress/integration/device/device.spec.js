import {newTestEmail} from '../../fixtures/testUtils.js';

const visitAddDeviceWithoutRequired = () => {
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
	cy.visit('/user/logIn');
	cy.fixture('registeredUser').then((user) => {
		cy.get('input[name="email"]').type(user.email);
		cy.get('input[name="password"]').type(user.password + '{enter}');
	});
};

const logOut = () => cy.request('POST', '/user/logOut');

describe('User', function () {
	before(() => {
		cy.request('POST', 'user/logOut');
	});
	it('must be logged in to view Add Device page', function () {
		cy.request('/device/add').then((response) => {
			expect(response).property('status').to.equal(403);
		});
		// cy.visit('/device/add');
	});
});

// describe('Device name', function () {
// 	beforeEach(visitAddDeviceWithoutRequired);
// 	it('is a required field', function () {
// 		cy.get('form').contains('Submit').click();
// 		cy.get('.flash--error').should('contain', 'Device name is a required field.');
// 	});
// 	it('must be unique to user', function () {
// 		cy.get('input[name="deviceName"]').type('Arduino One');
// 		cy.get('form').contains('Submit').click();
// 		cy.get('.flash--error').should(
// 			'contain',
// 			`You already have a device named \'Arduino One\', please choose a new name.`
// 		);
// 	});
// 	it('must be shorter than 20 chars', function () {
// 		cy.get('input[name="deviceName"]').type('This string is too long for a device name');
// 		cy.get('form').contains('Submit').click();
// 		cy.get('.flash--error').should(
// 			'contain',
// 			`Device name is too long, please limit to fewer than 20 characters.`
// 		);
// 	});
// });

// // all fields are sanitized/escaped
// describe('Sanitization', function () {
// 	beforeEach(visitAddDeviceWithoutRequired);
// 	it('form inputs are escaped', function () {
// 		cy.get('input[name="deviceName"]').type('<script>alert("ALERT!")</script>');
// 		cy.get('form').contains('Submit').click();
// 		cy.get('p').should(
// 			'contain',
// 			'Your device \'<script>alert("ALERT!")</script>\' was successfully registered.'
// 		);
// 	});
// });

// describe('Success', function () {
// 	beforeEach(visitAddDeviceWithoutRequired);
// 	it('provides access token upon successfully registering device', function () {
// 		cy.get('input[name="deviceName"]').type(`test device ${Date.now().toString()}`);
// 		cy.get('form').contains('Submit').click();
// 	});
// 	it('User is logged in after registration', function () {
// 		cy.fixture('registeredUser').then((user) => {
// 			cy.get('input[name="email"]').type(newTestEmail());
// 			cy.get('input[name="name"]').type(user.name);
// 			cy.get('input[name="password"]').type(user.password);
// 			cy.get('input[name="passwordConfirm"]').type(user.password + '{enter}');
// 			cy.get('.flash--success').should('contain', `${user.name}, your account was successfully created.`);
// 		});
// 	});
// });