const closeButtons = [...document.getElementsByClassName('flash-remove')];

closeButtons.forEach(button => {
	button.addEventListener('click', removeFlash);
});

function removeFlash(event) {
	console.log(event);
}
