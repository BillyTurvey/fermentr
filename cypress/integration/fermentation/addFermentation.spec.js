import {logInAsJeanette, logInAsNelson, logOut} from '../../fixtures/testUtils.js';

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

{
	const temporaryTestFermentationName = `Test Fermentation${Date.now().toString().slice(8, 11)}`;

	describe('Fermentation description', function () {
		beforeEach(logInAsJeanette);
		it('must be shorter than 300 chars', function () {
			cy.visit('fermentation/add');
			cy.get('input[name="name"]').type(temporaryTestFermentationName);
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
	// Updates the device's entry in the databse to show its active fermentation

	describe('Successfully adding a fermentation', function () {
		beforeEach(logInAsJeanette);
		it('redirects to the user dashboard', function () {
			cy.fixture('testUserJeanette.json').then((jeanette) => {
				cy.visit('fermentation/add');
				cy.get('input[name="name"]').type(temporaryTestFermentationName);
				cy.get('textarea[name="description"]').type(
					'This block of text is the description for a test fermentation. We\'re including a script element to test for correct form input sanitization: <script>alert("Gotcha!")</script>'
				);
				cy.get(`form > .deviceRadio > input[id="${jeanette.devices[0].name}"]`).click();
				cy.get('form').contains('Submit').click();
				cy.location('pathname').should('eq', '/user/dashboard');
			});
		});
		it("causes the fermentation to appear on the user's dashboard", function () {
			cy.get('article.fermentations > ul > li > a') //
				.contains(temporaryTestFermentationName)
				.should('exist');
		});
		it('causes the chosen device to have the selected device listed as its assigned device', function () {
			expect(true).to.be.false;
		});
	});

	describe('Sanitization', function () {
		it('input is escaped', function () {
			cy.get('input[name="name"]').type(temporaryTestFermentationName);
			cy.get('textarea[name="description"]').type('<script>alert("Gotcha!")</script>');
			cy.get('form').contains('Submit').click();
			cy.get('a').contains('Dashboard').click();
			cy.get('a').contains(temporaryTestFermentationName).click();
			cy.get('p').contains('<script>alert("Gotcha!")</script>').should('exist');
		});
	});
}
// gravity readings must be formatted correctly}
