(function() {
	function parseParams(url) {
		var raw_params = url.split("?")[1],
			params_unparsed = raw_params.split("&");

		var params = {};
		for (var i = 0; i < params_unparsed.length; i++) {
			var key = params_unparsed[i].split("=")[0],
			 	value = params_unparsed[i].split("=")[1];

			params[key] = value;
		}

		return params;
	}

	function injectID(_this) {
		console.log(_this)
	}

	function init() {
		var params = parseParams(window.location.href);
		console.log(params.id);

		var editButtons = document.getElementsByClassName("edit-device");
		for (var i = 0; i < editButtons.length; i++) {
			var button = editButtons[i],
				id = button.getAttribute("data-id");

			button.addEventListener('click', function() {
				injectID(id);
			});
		}
	}

	init();
})();
