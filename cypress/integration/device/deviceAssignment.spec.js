describe('Device Assignment', function () {
	beforeEach(() => {
		cy.logInAs('Jeanette');
	});
	it('Device can be assigned to a fermentation when a user adds a fermentation to their account.', function () {
		const sameTestFermentationName = `TemporaryTestFermentation${Math.random().toString().slice(1, 6)}`;
		cy.visit('fermentation/add');
		cy.get('input[name="name"]').type(sameTestFermentationName);
		cy.get('textarea[name="description"]').type(
			'This temporary test fermentation is used to make sure the correct documents are updated when a user assigns a device to a fermentation during the process of registering a new fermentation.'
		);
		cy.get('form > .deviceRadio > input[id="Persistent Test Device Enid"]').click();
		cy.get('form > button').contains('Submit').click();
		cy.get('p')
			.contains(
				`Device 'Persistent Test Device Enid' is currently assigned to '${sameTestFermentationName}'.`
			)
			.should('exist');
		cy.get('a').contains('Persistent Test Device Enid').click();
		cy.get('p')
			.contains(`Persistent Test Device Holly is assigned to '${sameTestFermentationName}'.`)
			.should('exist');
		cy.get('a').contains(sameTestFermentationName).click();
		cy.get('a').contains('Edit fermentation details.').click();
		cy.get('button') //
			.contains(`Delete ${sameTestFermentationName}`)
			.click();
	});

	it('Device can be assigned to a fermentation when a user edits a fermentation.', function () {
		cy.visit('/fermentation/6162dce9b832752680700ba6/edit');
		cy.get('input[id="Persistent Test Device Holly"]').click();
		cy.get('button').contains('Update').click();
		cy.get('p')
			.contains(`Device 'Persistent Test Device Holly' is assigned to 'London Porter'.`)
			.should('exist');
		cy.visit('/device/6162dd51b832752680700bbe');
		cy.get('p')
			.contains(`Persistent Test Device Holly is currently assigned to 'London Porter'.`)
			.should('exist');
		cy.visit('/fermentation/6162dce9b832752680700ba6/edit');
		cy.get('input#none').click();
		cy.get('button').contains('Update').click();
	});

	it('Device can be assigned to a fermentation during device registration.', function () {
		const sameTestDeviceName = `TemporaryTestDevice${Date.now().toString().slice(8, 12)}`;
		cy.visit('device/add');
		cy.get('input[name="name"]').type(sameTestDeviceName);
		cy.get('textarea[name="description"]').type(
			'This temporary test device is used to make sure the correct documents are updated when a user assigns a device to a fermentation during the process of registering a new device.'
		);
		cy.get('form > .fermentationRadio > input[id="Kölsch"]') //
			.click();
		cy.get('form > button').contains('Submit').click();
		cy.get('a').contains(sameTestDeviceName).click();
		cy.get('p').contains(`${sameTestDeviceName} is currently assigned to 'Kölsch'.`).should('exist');
		cy.visit('/fermentation/6160419e90472912a08c24b3');
		cy.get('p').contains(`Device '${sameTestDeviceName}' is assigned to 'Kölsch'.`).should('exist');
		//delete device
		cy.get('a').contains('Kölsch').click();
		cy.get('button') //
			.contains(`Delete ${sameTestDeviceName}`)
			.click();
	});

	it('Device can be assigned to a fermentation when a user edits a device.', function () {
		cy.visit('/device/6162d498ce10972403217e6e/edit');
		cy.get('input[id="Best Bitter"]').click();
		cy.get('button').contains('Update').click();
		cy.visit('/fermentation/6162d04eea6c7323114592fa');
		cy.get('p')
			.contains(`Device 'Persistent Test Device Bernie' is assigned to 'Best Bitter'.`)
			.should('exist');
		cy.visit('/device/6162d498ce10972403217e6e');
		cy.get('p')
			.contains(`Persistent Test Device Bernie is currently assigned to 'Best Bitter'.`)
			.should('exist');
		cy.visit('/device/6162d498ce10972403217e6e/edit');
		cy.get('input#none').click();
		cy.get('button').contains('Update').click();
	});

	it('Device is unassigned from a fermentation when a user deletes a device.', function () {
		const sameTestDeviceName = `TemporaryTestDevice${Date.now().toString().slice(8, 12)}`;
		// create device and assign it to a fermentation (Brett IPA)
		cy.visit('device/add');
		cy.get('input[name="name"]').type(sameTestDeviceName);
		cy.get('textarea[name="description"]').type(
			'This temporary test device is used to make sure that devices are unassigned from a fermentation when a user deletes a device.'
		);
		cy.get('form > .fermentationRadio > input[id="Brett IPA"]') //
			.click();
		cy.get('form > button').contains('Submit').click();
		// assert the device is properly assigned on the fermentation page
		cy.visit('/fermentation/61632c1bf0a0762ecab52dcb');
		cy.get('article.assigned-device > p')
			.contains(`Device '${sameTestDeviceName}' is currently assigned to 'Bret IPA'.`)
			.should('exist');
		// assert the device is properly assigned on the device page
		cy.get('article.assigned-device > a').contains(sameTestDeviceName).click();
		cy.get('article.assigned-device > p')
			.contains(`${sameTestDeviceName} is currently assigned to 'Bret IPA'.`)
			.should('exist');
		//delete device
		cy.get('button') //
			.contains(`Delete ${sameTestDeviceName}`)
			.click();
		// assert the device is unassigned, on the fermentation page
		cy.visit('/fermentation/61632c1bf0a0762ecab52dcb');
		cy.get('article.assigned-device > p')
			.contains(`Brett IPA currently has no device assigned.`)
			.should('exist');
	});
});

// it('Device is unassigned from a fermentation when a user deletes a fermentation.', function () {
// 	const sameTestFermentationName = `TemporaryTestFermentation${Math.random().toString().slice(1, 6)}`;
// 	cy.visit('fermentation/add');
// 	cy.get('input[name="name"]').type(sameTestFermentationName);
// 	cy.get('textarea[name="description"]').type(
// 		'This temporary test fermentation is used to make sure that devices are unassigned from a fermentation when a user deletes a device.'
// 	);
// 	cy.get('form > .deviceRadio > input[id="Persistent Test Device Enid"]').click();
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
