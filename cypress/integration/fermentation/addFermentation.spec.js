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
// User's devices must be shown on the page to select which one will controll this fermentation

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
			`You already have a fermentation named 'Just Another IPA', please choose a new name.`
		);
	});
	it('must be shorter than 30 chars', function () {
		cy.get('input[name="name"]') //
			.type('This string really is far far far too long for a Fermentation name');
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

describe('Fermentation description', function () {
	beforeEach(logInAndVisitAddFermentationWithoutRequired);
	it('must be shorter than 200 chars', function () {
		cy.get('input[name="name"]').type(`test ${Math.random().toString().slice(2, 9)} fermentation`);
		cy.get('textarea[name="description"]') //
			.type(
				'A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut libero eget quam volutpat sodales. Praesent aliquam elit ut dui pharetra convallis.'
			);
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`Description is too long, please limit to fewer than 100 characters.`
		);
	});
	it('input is escaped', function () {
		const testFermentationName = `testName ${Math.random().toString().slice(2, 9)}`;
		cy.get('input[name="name"]').type(testFermentationName);
		cy.get('textarea[name="description"]').type('<script>alert("Gotcha!")</script>');
		cy.get('form').contains('Submit').click();
		cy.get('a').contains('Dashboard').click();
		cy.get('a').contains(testFermentationName).click();
		cy.get('p').contains('<script>alert("Gotcha!")</script>').should('exist');
	});
});

describe('Add fermentation page: Devices...', function () {
	it('contains a list of available devices owned by the user', function () {
		cy.visit('fermentation/add');
		cy.get('form')
			.should('contain', 'Name') //
			.should('contain', 'Description')
			.should('contain', 'Target FG');
	});
});

describe('Successfully adding a fermentation', function () {
	beforeEach(logInAndVisitAddFermentationWithoutRequired);
	it('redirects to the user dashboard', function () {
		expect(true).to.be.false;
	});
	it("causes the fermentation to appear on the user's dashboard", function () {
		expect(true).to.be.false;
	});
	it('causes the chosen device to have the fermentation listed as its current fermentaion', function () {
		expect(true).to.be.false;
	});
});

// gravity readings must be formatted correctly}
