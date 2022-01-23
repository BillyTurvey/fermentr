import {logOut} from '../../fixtures/testUtils.js';
import * as util from '../../support/commands.js';

const logInAndVisitAddFermentationWithoutRequired = () => {
	cy.logInAs('Nelson');
	cy.visit('/fermentation/add', {
		onLoad: contentWindow => {
			let inputFields = contentWindow.document.getElementsByTagName('input');
			for (let i = 0; i < inputFields.length; i++) {
				inputFields.item(i).required = false;
			}
		}
	});
};

describe('Add fermentation - auth', function () {
	before(() => cy.logOut());
	it('User must be logged in to view Add Device page', function () {
		cy.request({
			method: 'GET',
			url: '/fermentation/add',
			failOnStatusCode: false
		}).should(response => {
			expect(response.status).to.eq(401);
		});
	});
	it('loads for logged in user', function () {
		cy.logInAs('Nelson');
		cy.visit('fermentation/add');
		cy.get('h1').contains('Add New Fermentation');
	});
});

describe('Add fermantation page', function () {
	beforeEach(() => {
		cy.logInAs('Nelson');
	});
	it('contains form with correct inputs', function () {
		cy.visit('/fermentation/add');
		cy.get('form')
			.should('contain', 'Name') //
			.should('contain', 'Description')
			.should('contain', 'Target final gravity')
			.should('contain', 'Target original gravity')
			.should('contain', 'Actual original gravity');
	});
});

describe('Fermentation name', function () {
	beforeEach(logInAndVisitAddFermentationWithoutRequired);
	it('is a required field', function () {
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Fermentation name is a required field.');
	});
	it('must be unique to user', function () {
		const fermentationName = util.newTestFermentationName();
		cy.createFermentation({
			name: fermentationName,
			description: 'Fermentation can be deleted using a button on the "edit fermentation" page'
		});
		cy.visit('/fermentation/add');
		cy.get('input[name="name"]').type(fermentationName);
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`You already have a fermentation named '${fermentationName}', please choose a new name.`
		);
		cy.deleteFermentation(fermentationName);
	});
	it('must be shorter than 30 chars', function () {
		cy.get('input[name="name"]') //
			.type('This string really is far far far too long for a Fermentation name', {delay: 0});
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`Fermentation name is too long, please limit to fewer than 30 alphanumeric characters.`
		);
	});
	it('input is escaped', function () {
		cy.get('input[name="name"]').type('<script>&');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`You already have a fermentation named '<script>&', please choose a new name.`
		);
	});
});

describe('Add fermentation page: Devices...', function () {
	before(() => cy.logInAs('Jeanette'));
	it('contains a list of available devices owned by the user', function () {
		cy.visit('/fermentation/add');
		cy.get('form h3') //
			.contains('Select a device to monitor/control this fermentation')
			.should('exist');
		cy.get('form div.radio-container') //
			.should('exist');
	});
});

describe('Fermentation description', function () {
	beforeEach(() => cy.logInAs('Jeanette'));
	it('must be shorter than 600 chars', function () {
		cy.visit('/fermentation/add');
		cy.get('input[name="name"]').type('Test Fermentation');
		cy.get('textarea[name="description"]') //
			.type(
				'A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum A description which consists of too many characters.',
				{delay: 0}
			);
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`Description is too long, please limit to fewer than 600 characters.`
		);
	});
});

describe('Successfully adding a fermentation', function () {
	beforeEach(() => cy.logInAs('Jeanette'));
	it('redirects to viewing the saved fermentation', function () {
		const fermentationName = util.newTestFermentationName();
		cy.createFermentation({
			name: fermentationName,
			description: 'Successfully adding a fermentation redirects to viewing the saved fermentation'
		});
		cy.get('h1').contains(fermentationName).should('exist');
		cy.deleteFermentation(fermentationName);
	});
	it("causes the fermentation to appear on the user's dashboard", function () {
		const fermentationName = util.newTestFermentationName();
		cy.createFermentation({
			name: fermentationName,
			description: "Successfully adding a fermentation causes it to appear on the user's dashboard"
		});
		cy.visit('/user/dashboard');
		cy.get('article.fermentations a') //
			.contains(fermentationName)
			.should('exist');
		cy.deleteFermentation(fermentationName);
	});
});

describe('Sanitization', function () {
	beforeEach(() => cy.logInAs('Jeanette'));
	it('fermentation name is escaped', function () {
		const fermentationName = util.newTestFermentationName().slice(20) + ' & <br>';
		cy.createFermentation({name: fermentationName, description: 'fermentation name is escaped'});
		cy.get('h1').contains(' & <br>').should('exist');
		cy.deleteFermentation(fermentationName);
	});
	it('fermentation description is escaped', function () {
		const fermentationName = util.newTestFermentationName();
		cy.createFermentation({name: fermentationName, description: '<script> alert("test") </script>'});
		cy.get('p').contains('<script> alert("test") </script>').should('exist');
		cy.deleteFermentation(fermentationName);
	});
});

describe('Deleting a fermentation', function () {
	beforeEach(() => cy.logInAs('Jeanette'));
	it('Fermentation can be deleted using a button on the "edit fermentation" page', function () {
		const fermentationName = util.newTestFermentationName();
		cy.createFermentation({
			name: fermentationName,
			description: 'Fermentation can be deleted using a button on the "edit fermentation" page'
		});
		cy.get('a') //
			.contains('Edit fermentation details')
			.click();
		cy.get('button') //
			.contains(`Delete ${fermentationName}`)
			.click();
		cy.get('p.flash__text') //
			.contains(`${fermentationName} was successfully deleted`)
			.should('exist');
		cy.get('article.fermentations li') //
			.contains(fermentationName)
			.should('not.exist');
	});
});
// gravity readings must be formatted correctly}
