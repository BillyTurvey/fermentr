document.addEventListener('DOMContentLoaded', addFlashCloseListeners);

function addFlashCloseListeners() {
	const closeButtons = [...document.getElementsByClassName('flash-remove')];

	closeButtons.forEach(button => {
		button.addEventListener('click', removeFlash);
	});

	function removeFlash(event) {
		event.target.parentElement.remove();
	}
}
