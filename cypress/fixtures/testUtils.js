export const newTestEmail = () => `testemail${Date.now().toString()}@temporarytestuser.com`;

const scheme = 'http://';
const host = 'localhost:3000';
export const url = (path) => `${scheme}${host}${path}`;

export const unrequireFormInputs = (contentWindow) => {
	let inputFields = contentWindow.document.getElementsByTagName('input');
	for (let i = 0; i < inputFields.length; i++) {
		inputFields.item(i).required = false;
	}
};

export const logOut = () => cy.request('POST', '/user/logOut');

export const logInAsNelson = () => {
	cy.fixture('testUserNelson.json').then((nelson) => {
		cy.request({
			method: 'POST',
			url: '/user/logIn',
			body: {
				email: nelson.email,
				password: nelson.password
			}
		});
	});
};

export const logInAsJeanette = () => {
	cy.fixture('testUserJeanette.json').then((user) => {
		cy.request({
			method: 'POST',
			url: '/user/logIn',
			body: {
				email: user.email,
				password: user.password
			}
		});
	});
};

export const visitURLAndRemoveRequiredAttributes = (url) => cy.visit(url, {onLoad: unrequireFormInputs});

// nice idea, maybe work on this later
export const populateForm = (inputsObject) => {
	const keys = inputsObject.keys();
	keys.forEach((key) => {
		cy.get(`input[name=${key}`).type(inputsObject.key);
	});
};
