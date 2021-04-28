export const newTestEmail = () => `testemail${Date.now().toString()}@test.com`;

const scheme = 'http://';
const host = 'localhost:3000';
export const url = path => `${scheme}${host}${path}`;

const unrequireFormInputs = (contentWindow) => {
	let inputFields = contentWindow.document.getElementsByTagName("input");
	for (let i = 0; i < inputFields.length; i++) {
		inputFields.item(i).required = false;
	}
};

export const visitURLAndRemoveRequiredAttributes = url => cy.visit(url, {onLoad: unrequireFormInputs});

// nice idea, maybe work on this later
export const populateForm = inputsObject => {
	const keys = inputsObject.keys();
	keys.forEach(key => {
		cy.get(`input[name=${key}`).type(inputsObject.key);
	});
};

