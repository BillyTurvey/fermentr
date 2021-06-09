// Updates the device's entry in the databse to show its active fermentation
// Users' registered devices will show up on the page with a checkbox to use the device for this fermentation

import {logIn, logOut} from '../../fixtures/testUtils.js';

const logInAndVisitAddFermentationWithoutRequired = () => {
	logIn();
	cy.visit('/fermentation/add', {
		onLoad: (contentWindow) => {
			let inputFields = contentWindow.document.getElementsByTagName('input');
			for (let i = 0; i < inputFields.length; i++) {
				inputFields.item(i).required = false;
			}
		}
	});
};

describe('Auth', function () {
	before(logOut);
	it('User must be logged in to view Add Device page', function () {
		cy.request({
			method: 'GET',
			url: '/fermentation/add',
			failOnStatusCode: false
		}).should((response) => {
			expect(response.status).to.eq(401);
		});
	});
	it('loads for logged in user', function () {
		logIn();
		cy.visit('fermentation/add');
		cy.get('h1').contains('Add New Fermentation');
	});
});

describe('Add fermantation page', function () {
	beforeEach(() => {
		logIn();
	});
	it('contains form with correct inputs', function () {
		cy.visit('fermentation/add');
		cy.get('form')
			.should('contain', 'Name') //
			.should('contain', 'Description')
			.should('contain', 'Target FG');
	});
});

describe('Fermentation name', function () {
	beforeEach(logInAndVisitAddFermentationWithoutRequired);
	it('is a required field', function () {
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should('contain', 'Fermentation name is a required field.');
	});
	it('must be unique to user', function () {
		cy.get('input[name="name"]').type('Just Another IPA');
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`You already have a Fermentation named 'Just Another IPA', please choose a new name.`
		);
	});
	it('must be shorter than 30 chars', function () {
		cy.get('input[name="fermentationName"]').type(
			'This string really is far far far too long for a Fermentation name'
		);
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`Fermentation name is too long, please limit to fewer than 30 alphanumeric characters.`
		);
	});
});

// Fermentation name must be unique to user
// Fermentation name must be escaped
// Description must be escaped

// User's devices must be shown on the page to select which one will controll this fermentation
