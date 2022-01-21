import * as util from '../../support/commands.js';

describe('Device Assignment', function () {
	beforeEach(() => {
		cy.logInAs('Jeanette');
	});
	it('Device can be assigned to a fermentation when a user adds a fermentation to their account.', function () {
		const sameTestFermentationName = util.newTestFermentationName();
		const sameTestDeviceName = util.newTestDeviceName();
		cy.createDevice(sameTestDeviceName);
		// create fermentation
		cy.visit('/fermentation/add');
		cy.get('input[name="name"]').type(sameTestFermentationName);
		// select device
		cy.get(`input[id="${sameTestDeviceName}"]`).click();
		cy.get('textarea[name="description"]').type(
			'Test fermentation to ensure the correct documents are updated when a user assigns a device to a fermentation during the process of registering a new fermentation.'
		);
		cy.get('form > button').contains('Submit').click();
		// assert device is assigned to fermentation on fermentation page
		cy.get('p')
			.contains(`Device '${sameTestDeviceName}' is currently assigned to '${sameTestFermentationName}'.`)
			.should('exist');
		// assert device is assigned to fermentation on device page
		cy.get('a').contains(`${sameTestDeviceName}`).click();
		cy.get('p')
			.contains(`${sameTestDeviceName} is currently assigned to '${sameTestFermentationName}'.`)
			.should('exist');
		// delete device and fermentation
		cy.deleteFermentation(sameTestFermentationName);
		cy.deleteDevice(sameTestDeviceName);
	});

	it('Device can be assigned to a fermentation when a user edits a fermentation.', function () {
		const sameTestFermentationName = util.newTestFermentationName();
		const sameTestDeviceName = util.newTestDeviceName();
		cy.createDevice(
			sameTestDeviceName,
			'Test device for ensuring devices are properly assigned while editing a fermentation.'
		);
		cy.createFermentation(
			sameTestFermentationName,
			'Test fermentation for ensuring devices are properly assigned while editing a fermentation.'
		);
		cy.url().then(fermentationURL => {
			cy.visit(fermentationURL + '/edit');
			cy.get(`input[id="${sameTestDeviceName}"]`).click();
			cy.get('button').contains('Update').click();
			cy.get('p')
				.contains(`Device '${sameTestDeviceName}' is currently assigned to '${sameTestFermentationName}'.`)
				.should('exist');
			cy.get('a').contains(sameTestDeviceName).click();
			cy.get('p')
				.contains(`${sameTestDeviceName} is currently assigned to '${sameTestFermentationName}'.`)
				.should('exist');
			cy.deleteFermentation(sameTestFermentationName);
			cy.deleteDevice(sameTestDeviceName);
		});
	});

	it('Device can be assigned to a fermentation during device registration.', function () {
		const testDeviceName = util.newTestDeviceName();
		const testFermentationName = util.newTestFermentationName();
		cy.createFermentation(testFermentationName);
		cy.visit('/device/add');
		cy.get('input[name="name"]').type(testDeviceName);
		cy.get('textarea[name="description"]').type(
			'Temporary test device to ensure the correct documents are updated when a user assigns a device to a fermentation during device registration.'
		);
		cy.get(`form input[id="${testFermentationName}"]`).click();
		cy.get('form > button').contains('Submit').click();
		cy.get('a').contains(testDeviceName).click();
		cy.get('p')
			.contains(`${testDeviceName} is currently assigned to '${testFermentationName}'.`)
			.should('exist');
		cy.get('a').contains(testFermentationName).click();
		cy.get('p')
			.contains(`Device '${testDeviceName}' is currently assigned to '${testFermentationName}'.`)
			.should('exist');
		cy.deleteFermentation(testFermentationName);
		cy.deleteDevice(testDeviceName);
	});

	it('Device can be assigned to a fermentation when a user edits a device.', function () {
		const testDeviceName = util.newTestDeviceName();
		const testFermentationName = util.newTestFermentationName();
		cy.createFermentation(testFermentationName);
		cy.url().then(fermentationURL => {
			cy.createDevice(testDeviceName);
			cy.url().then(deviceURL => {
				cy.visit(deviceURL + '/edit');
				cy.get(`input[id="${testFermentationName}"]`).click();
				cy.get('button').contains('Update').click();
				cy.visit(fermentationURL);
				cy.get('p')
					.contains(`Device '${testDeviceName}' is currently assigned to '${testFermentationName}'.`)
					.should('exist');
				cy.visit(deviceURL);
				cy.get('p')
					.contains(`${testDeviceName} is currently assigned to '${testFermentationName}'.`)
					.should('exist');
				cy.deleteFermentation(testFermentationName);
				cy.deleteDevice(testDeviceName);
			});
		});
	});

	it('Device is unassigned from a fermentation when a user deletes a device.', function () {
		const sameTestDeviceName = util.newTestDeviceName();
		// create device and assign it to a fermentation (Brett IPA)
		cy.visit('/device/add');
		cy.get('input[name="name"]').type(sameTestDeviceName);
		cy.get('textarea[name="description"]').type(
			'This temporary test device is used to make sure that devices are unassigned from a fermentation when a user deletes a device.'
		);
		cy.get('form input[id="Brett IPA"]') //
			.click();
		cy.get('form > button').contains('Submit').click();
		// assert the device is properly assigned on the fermentation page
		cy.visit('/fermentation/61632c1bf0a0762ecab52dcb');
		cy.get('article.assigned-device > p')
			.contains(`Device '${sameTestDeviceName}' is currently assigned to 'Brett IPA'.`)
			.should('exist');
		// navigate to the device page
		cy.get('article.assigned-device > p > a').contains(sameTestDeviceName).click();
		// assert the device is properly assigned on the device page
		cy.get('article.assigned-fermentation > p')
			.contains(`${sameTestDeviceName} is currently assigned to 'Brett IPA'.`)
			.should('exist');

		cy.deleteDevice(sameTestDeviceName);

		// assert the device is unassigned, on the fermentation page
		cy.visit('/fermentation/61632c1bf0a0762ecab52dcb');
		cy.get('article.assigned-device > p')
			.contains(`Brett IPA currently has no device assigned.`)
			.should('exist');
	});
});

// it('Device is unassigned from a fermentation when a user deletes a fermentation.', function () {
// 	const sameTestFermentationName = `TemporaryTestFermentation${Math.random().toString().slice(1, 6)}`;
// 	cy.visit('/fermentation/add');
// 	cy.get('input[name="name"]').type(sameTestFermentationName);
// 	cy.get('textarea[name="description"]').type(
// 		'This temporary test fermentation is used to make sure that devices are unassigned from a fermentation when a user deletes a device.'
// 	);
// 	cy.get('form > .device-radio-container > input[id="Persistent Test Device Enid"]').click();
// 	cy.get('form > button').contains('Submit').click();
// 	cy.get('p')
// 		.contains(`Device 'Persistent Test Device Enid' is currently assigned to '${sameTestFermentationName}'.`)
// 		.should('exist');
// 	cy.get('a').contains('Persistent Test Device Enid').click();
// 	cy.get('p')
// 		.contains(`Persistent Test Device Holly is assigned to '${sameTestFermentationName}'.`)
// 		.should('exist');
// 	cy.get('a').contains(sameTestFermentationName).click();
// 	cy.get('a').contains('Edit fermentation details.').click();
// 	cy.get('button') //
// 		.contains(`Delete ${sameTestFermentationName}`)
// 		.click();
// });
