import {logInAsJeanette, logInAsNelson, logOut} from '../../fixtures/testUtils.js';
import nelson from '../../fixtures/testUserNelson.json';
import jeanette from '../../fixtures/testUserJeanette.json';

const logInAndVisitAddFermentationWithoutRequired = () => {
	logInAsNelson();
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
		logInAsNelson();
		cy.visit('fermentation/add');
		cy.get('h1').contains('Add New Fermentation');
	});
});

describe('Add fermantation page', function () {
	beforeEach(() => {
		logInAsNelson();
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

describe('Add fermentation page: Devices...', function () {
	before(logInAsJeanette);
	it('contains a list of available devices owned by the user', function () {
		cy.visit('fermentation/add');
		cy.get('form > .deviceRadio > label') //
			.contains('Arduino MKR')
			.should('exist');
	});
});

describe('Fermentation description', function () {
	beforeEach(logInAsJeanette);
	it('must be shorter than 300 chars', function () {
		cy.visit('fermentation/add');
		cy.get('input[name="name"]').type('Test Fermentation');
		cy.get('textarea[name="description"]') //
			.type(
				'A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum A description which consists of too many characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
			);
		cy.get('form').contains('Submit').click();
		cy.get('.flash--error').should(
			'contain',
			`Description is too long, please limit to fewer than 300 characters.`
		);
	});
});

{
	const temporaryTestFermentationName = `Test Fermentation<br>${Math.random().toString().slice(9, 12)}`;
	const jeanettesDevice = jeanette.devices[0].name;

	// Updates the device's entry in the databse to show its active fermentation

	describe('Successfully adding a fermentation', function () {
		beforeEach(logInAsJeanette);
		it('redirects to the user dashboard', function () {
			cy.visit('fermentation/add');
			cy.get('input[name="name"]').type(temporaryTestFermentationName);
			cy.get('textarea[name="description"]').type(
				'This block of text is the description for a test fermentation. We\'re including a script element to test for correct form input sanitization: <script>alert("Gotcha!")</script>.'
			);
			cy.get(`form > .deviceRadio > input[id="${jeanettesDevice}"]`).click();
			cy.get('form').contains('Submit').click();
			cy.location('pathname').should('eq', '/user/dashboard');
		});
		it("causes the fermentation to appear on the user's dashboard", function () {
			cy.get('article.fermentations > ul > li > a') //
				.contains(temporaryTestFermentationName)
				.should('exist');
		});
		it("causes the selected device to be listed as the fermentation's assigned device", function () {
			cy.get('article.fermentations > ul > li > a') //
				.contains(temporaryTestFermentationName)
				.click();
			cy.get('p')
				.contains(`Device ${jeanettesDevice} is assigned to ${temporaryTestFermentationName}.`)
				.should('exist');
		});
	});

	describe('Sanitization', function () {
		beforeEach(logInAsJeanette);
		it('Fermentation name is escaped', function () {
			cy.visit('user/dashboard');
			cy.get('a').contains(temporaryTestFermentationName).should('exist');
		});
		it('Fermentation description is escaped', function () {
			cy.visit('user/dashboard');
			cy.get('a').contains(temporaryTestFermentationName).click();
			cy.get('p').contains('<script>alert("Gotcha!")</script>').should('exist');
		});
	});

	describe('Deleting a fermentation', function () {
		beforeEach(logInAsJeanette);
		it('Fermentation can be deleted using a button on the "edit fermentation" page', function () {
			cy.visit('user/dashboard');
			cy.get('article.fermentations > ul > li') //
				.contains(temporaryTestFermentationName)
				.next('a')
				.contains('Edit')
				.click();
			cy.get('button') //
				.contains(`Delete ${temporaryTestFermentationName}`)
				.click();
			cy.visit('user/dashboard');
			cy.get('article.fermentations > ul > li') //
				.contains(temporaryTestFermentationName)
				.should('not.exist');
		});
		it("causes the fermentation to be removed from the user's DB entry", function () {
			cy.visit('user/dashboard');
			cy.get('article.fermentations > ul > li > a') //
				.contains(temporaryTestFermentationName)
				.should('not.exist');
		});
		it("causes the fermentation's active device to no longer have an active fermentation", function () {
			cy.visit('user/dashboard');
			cy.get('article.devices > ul > li > a') //
				.contains(jeanettesDevice)
				.click();
			cy.get('p') //
				.contains(`${jeanettesDevice} is not currently assigned to a fermentation.`)
				.should('exist');
		});
	});
}
// gravity readings must be formatted correctly}
