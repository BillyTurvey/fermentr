import * as util from '../../support/commands.js';

describe('Device Assignment', function () {
	beforeEach(() => {
		cy.logInAs('Jeanette');
	});
	it('Device can be assigned to a fermentation when a user adds a fermentation to their account.', function () {
		const sameTestFermentationName = util.newTestFermentationName();
		const sameTestDeviceName = util.newTestDeviceName();
		cy.createDevice({
			name: sameTestDeviceName,
			description:
				'Device can be assigned to a fermentation when a user adds a fermentation to their account.'
		});
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
		//create fermentation and device
		cy.createDevice({
			name: sameTestDeviceName,
			description: 'Test device for ensuring devices are properly assigned while editing a fermentation.'
		});
		cy.createFermentation(
			sameTestFermentationName,
			'Test fermentation for ensuring devices are properly assigned while editing a fermentation.'
		);
		cy.url().then(fermentationURL => {
			// edit fermentation and assign the device
			cy.visit(fermentationURL + '/edit');
			cy.get(`input[id="${sameTestDeviceName}"]`).click();
			cy.get('button').contains('Update').click();
			// assert the device has been successfully assigned, on the fermentation page
			cy.get('p')
				.contains(`Device '${sameTestDeviceName}' is currently assigned to '${sameTestFermentationName}'.`)
				.should('exist');
			// assert the assignment on the device page
			cy.get('a').contains(sameTestDeviceName).click();
			cy.get('p')
				.contains(`${sameTestDeviceName} is currently assigned to '${sameTestFermentationName}'.`)
				.should('exist');
			// delete device and fermentation
			cy.deleteFermentation(sameTestFermentationName);
			cy.deleteDevice(sameTestDeviceName);
		});
	});

	it('Device can be assigned to a fermentation during device registration.', function () {
		const testDeviceName = util.newTestDeviceName();
		const testFermentationName = util.newTestFermentationName();
		// create fermentation
		cy.createFermentation(
			testFermentationName,
			'Device can be assigned to a fermentation during device registration.'
		);
		cy.url().then(fermentationURL => {
			// create a device and assign it to the fermentation
			cy.visit('/device/add');
			cy.get('input[name="name"]').type(testDeviceName);
			cy.get('textarea[name="description"]').type(
				'Temporary test device to ensure the correct documents are updated when a user assigns a device to a fermentation during device registration.'
			);
			cy.get(`form input[id="${testFermentationName}"]`).click();
			cy.get('form > button').contains('Submit').click();
			// assert assignment, on fermentation page
			cy.visit(fermentationURL);
			cy.get('p')
				.contains(`Device '${testDeviceName}' is currently assigned to '${testFermentationName}'.`)
				.should('exist');
			// assert assignment, on device page
			cy.get('a').contains(testDeviceName).click();
			cy.get('p')
				.contains(`${testDeviceName} is currently assigned to '${testFermentationName}'.`)
				.should('exist');
			// delete device and fermentation
			cy.deleteFermentation(testFermentationName);
			cy.deleteDevice(testDeviceName);
		});
	});

	it('Device can be assigned to a fermentation when a user edits a device.', function () {
		const testDeviceName = util.newTestDeviceName();
		const testFermentationName = util.newTestFermentationName();
		// create fermentation
		cy.createFermentation(
			testFermentationName,
			'Device can be assigned to a fermentation when a user edits a device.'
		);
		cy.url().then(fermentationURL => {
			// create device
			cy.createDevice({
				name: testDeviceName,
				description: 'Device can be assigned to a fermentation when a user edits a device.'
			});
			cy.url().then(deviceURL => {
				// edit device and assign to fermentation
				cy.visit(deviceURL + '/edit');
				cy.get(`input[id="${testFermentationName}"]`).click();
				cy.get('button').contains('Update').click();
				// assert the assignment, on the fermentation page
				cy.visit(fermentationURL);
				cy.get('p')
					.contains(`Device '${testDeviceName}' is currently assigned to '${testFermentationName}'.`)
					.should('exist');
				// assert the assignment, on the device page
				cy.visit(deviceURL);
				cy.get('p')
					.contains(`${testDeviceName} is currently assigned to '${testFermentationName}'.`)
					.should('exist');
				// delete device and fermentation
				cy.deleteFermentation(testFermentationName);
				cy.deleteDevice(testDeviceName);
			});
		});
	});

	it('Device is unassigned from a fermentation when a user deletes a device.', function () {
		const sameTestDeviceName = util.newTestDeviceName();
		const sameTestFermentationName = util.newTestFermentationName();
		// create fermentation
		cy.createFermentation(
			sameTestFermentationName,
			'Device is unassigned from a fermentation when a user deletes a device.'
		);
		cy.url().then(fermentationURL => {
			// create device and assign it to a fermentation (Brett IPA)
			cy.visit('/device/add');
			cy.get('input[name="name"]').type(sameTestDeviceName);
			cy.get('textarea[name="description"]').type(
				'Temporary test device to ensure devices are unassigned from fermentations when a user deletes a device.'
			);
			cy.get(`form input[id="${sameTestFermentationName}"]`) //
				.click();
			cy.get('form > button').contains('Submit').click();
			// assert the device is properly assigned on the fermentation page
			cy.visit(fermentationURL);
			cy.get('article.assigned-device > p')
				.contains(`Device '${sameTestDeviceName}' is currently assigned to '${sameTestFermentationName}'.`)
				.should('exist');
			// navigate to the device page
			cy.get('article.assigned-device > p > a').contains(sameTestDeviceName).click();
			// assert the device is properly assigned on the device page
			cy.get('article.assigned-fermentation > p')
				.contains(`${sameTestDeviceName} is currently assigned to '${sameTestFermentationName}'.`)
				.should('exist');
			// delete device
			cy.deleteDevice(sameTestDeviceName);
			// assert the device is unassigned, on the fermentation page
			cy.visit(fermentationURL);
			cy.get('article.assigned-device > p')
				.contains(`${sameTestFermentationName} currently has no device assigned.`)
				.should('exist');
			// delete fermentation
			cy.deleteFermentation(sameTestFermentationName);
		});
	});

	it('Device is unassigned from a fermentation when a user deletes a fermentation.', function () {
		const sameTestFermentationName = util.newTestFermentationName();
		const sameTestDeviceName = util.newTestDeviceName();
		// create device
		cy.createDevice({
			name: sameTestDeviceName,
			description: 'Test device for ensuring devices are unnassigned during fermentation deletion.'
		});
		// create fermentation and assign device
		cy.visit('/fermentation/add');
		cy.get('input[name="name"]').type(sameTestFermentationName);
		cy.get('textarea[name="description"]').type(
			'This temporary test fermentation is used to make sure that devices are unassigned from a fermentation when a user deletes a device.'
		);
		cy.get(`form input[id="${sameTestDeviceName}"]`).click();
		cy.get('form > button').contains('Submit').click();
		cy.url().then(fermentationURL => {
			// assert device is assigned to fermentation on view fermentation page
			cy.get('p')
				.contains(`Device '${sameTestDeviceName}' is currently assigned to '${sameTestFermentationName}'.`)
				.should('exist');
			// delete device
			cy.deleteDevice(sameTestDeviceName);
			// assert device is NOT assigned to fermentation on view fermentation page
			cy.visit(fermentationURL);
			cy.get('p').contains(`${sameTestFermentationName} currently has no device assigned.`).should('exist');
			// delete fermetation
			cy.deleteFermentation(sameTestFermentationName);
		});
	});
});
