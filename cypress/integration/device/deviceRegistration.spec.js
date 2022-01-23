import {logOut} from '../../fixtures/testUtils.js';
import * as util from '../../support/commands.js';

const visitAddDeviceWithoutRequired = () => {
	cy.visit('/device/add', {
		onLoad: contentWindow => {
			let inputFields = contentWindow.document.getElementsByTagName('input');
			for (let i = 0; i < inputFields.length; i++) {
				inputFields.item(i).required = false;
			}
		}
	});
};

describe('User', function () {
	before(() => cy.logOut());
	it('must be logged in to view Add Device page', function () {
		cy.request({
			method: 'GET',
			url: '/device/add',
			failOnStatusCode: false
		}).should(response => {
			expect(response.status).to.eq(401);
		});
	});
});

describe('Device name', function () {
	beforeEach(() => {
		cy.logInAs('Nelson');
		visitAddDeviceWithoutRequired();
	});
	it('is a required field', function () {
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Device name is a required field.');
	});
	it('must be unique to user', function () {
		cy.get('input[name="name"]').type('Arduino One');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`You already have a device named 'Arduino One', please choose a new name.`
		);
	});
	it('must be shorter than 30 chars', function () {
		cy.get('input[name="name"]').type('This string really is far far far too long for a device name');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`Device name is too long, please limit to fewer than 30 alphanumeric characters.`
		);
	});
});

describe('Device description', function () {
	beforeEach(() => {
		cy.logInAs('Nelson');
		visitAddDeviceWithoutRequired();
	});
	it('must be shorter than 600 chars', function () {
		cy.get('input[name="name"]').type('Neville XIV');
		cy.get('textarea[name="description"]').type(
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut libero eget quam volutpat sodales. Praesent aliquam elit ut dui pharetra convallis. A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut libero eget quam volutpat sodales. Praesent aliquam elit ut dui pharetra convallis. A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut libero eget quam volutpat sodales. Praesent aliquam elit ut dui pharetra convallis. A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut libero eget quam volutpat sodales. Praesent aliquam elit ut dui pharetra convallis.'
		);
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`Description is too long, please limit to fewer than 600 characters.`
		);
	});
});

describe('Add device page lists fermentations', function () {
	it("contains a list of user's fermentations", function () {
		cy.logInAs('Jeanette');
		// create fermentation
		const fermentationName = util.newTestFermentationName();
		cy.createFermentation(fermentationName, 'Add device page lists fermentations');
		cy.visit('/device/add');
		cy.get('form label') //
			.contains(fermentationName)
			.should('exist');
		cy.deleteFermentation(fermentationName);
	});
});

describe('All fields are properly sanitized/escaped', function () {
	beforeEach(() => cy.logInAs('Jeanette'));
	it('device name is escaped', function () {
		// create device with name to be sanitized
		const deviceName = util.newTestDeviceName().slice(20) + ' & <br>';
		cy.createDevice({name: deviceName, description: 'device name is escaped'});
		// assert name is rendered correctly
		cy.get('h1').contains(' & <br>').should('exist');
		// delete device
		cy.deleteDevice(deviceName);
	});
	it('device description is escaped', function () {
		// create device with script in description
		const deviceName = util.newTestDeviceName();
		cy.createDevice({name: deviceName, description: '<script> alert("test") </script>'});
		// assert script is rendered in full
		cy.get('p').contains('<script> alert("test") </script>').should('exist');
		// delete device
		cy.deleteDevice(deviceName);
	});
});

describe('Success', function () {
	beforeEach(() => cy.logInAs('Jeanette'));
	it('provides access key upon successfully registering device', function () {
		// create device
		const deviceName = util.newTestDeviceName();
		cy.createDevice({
			name: deviceName,
			description: 'provides access key upon successfully registering device',
			redirect: false
		});
		// assert access key is provided
		const uuidRegEx = /\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{12}/;
		cy.get('p').contains(uuidRegEx).should('exist');
		// delete device
		cy.deleteDevice(deviceName);
	});
});

describe('Successfully adding a Device', function () {
	beforeEach(() => cy.logInAs('Jeanette'));
	it("causes the device to appear in a list on the user's dashboard", function () {
		cy.visit('/user/dashboard');
		cy.get('article.devices > ul > li > a') //
			.contains(temporaryTestDeviceName)
			.should('exist');
	});
	it('causes the chosen device to have the fermentation listed as its current fermentaion', function () {
		cy.visit('/user/dashboard');
		cy.get('article.devices > ul > li > a') //
			.contains(temporaryTestDeviceName)
			.click();
	});
});

describe('Deleting a device', function () {
	beforeEach(() => cy.logInAs('Jeanette'));
	it('Device can be deleted using a button on the "edit device" page', function () {
		cy.visit('/user/dashboard');
		cy.get('article.devices > ul > li') //
			.contains(temporaryTestDeviceName)
			.next('a')
			.contains('Edit')
			.click();
		cy.get('button') //
			.contains(`Delete ${temporaryTestDeviceName}`)
			.click();
		cy.get('article.devices > ul > li') //
			.contains(temporaryTestDeviceName)
			.should('not.exist');
	});
	it("causes the device to be removed from the user's DB entry", function () {
		cy.visit('/user/dashboard');
		cy.get('article.devices > ul > li > a') //
			.contains(temporaryTestDeviceName)
			.should('not.exist');
	});
});
