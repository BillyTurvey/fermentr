import {logOut} from '../../fixtures/testUtils.js';

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
		cy.visit('device/add');
		cy.get('form > .fermentationRadio > label') //
			.contains('Breakfast Stout')
			.should('exist');
	});
});

// all fields are sanitized/escaped
describe('Sanitization', function () {
	it('form inputs are escaped', function () {
		cy.logInAs('Jeanette');
		cy.visit('device/add');
		cy.get('input[name="name"]').type('<script>&');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`You already have a device named '<script>&', please choose a new name.`
		);
		logOut();
	});
});

{
	const temporaryTestDeviceName = `TemporaryTestDevice${Date.now().toString().slice(8, 12)}`;

	describe('Success', function () {
		before(() => cy.logInAs('Jeanette'));
		it('provides access key upon successfully registering device', function () {
			const uuidRegEx = /\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{12}/;
			cy.visit('device/add');
			cy.get('input[name="name"]').type(temporaryTestDeviceName);
			cy.get('form > .fermentationRadio > input[id="Bière De Saison"]') //
				.click();
			cy.get('form').contains('Submit').click();
			cy.get('p').contains(uuidRegEx).should('exist');
		});
	});

	describe('Successfully adding a Device', function () {
		beforeEach(() => cy.logInAs('Jeanette'));
		it("causes the device to appear in a list on the user's dashboard", function () {
			cy.visit('user/dashboard');
			cy.get('article.devices > ul > li > a') //
				.contains(temporaryTestDeviceName)
				.should('exist');
		});
		it('causes the chosen device to have the fermentation listed as its current fermentaion', function () {
			cy.visit('user/dashboard');
			cy.get('article.devices > ul > li > a') //
				.contains(temporaryTestDeviceName)
				.click();
		});
	});

	describe('Deleting a device', function () {
		beforeEach(() => cy.logInAs('Jeanette'));
		it('Device can be deleted using a button on the "edit device" page', function () {
			cy.visit('user/dashboard');
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
			cy.visit('user/dashboard');
			cy.get('article.devices > ul > li > a') //
				.contains(temporaryTestDeviceName)
				.should('not.exist');
		});
	});
}