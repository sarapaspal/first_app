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

	function injectID(e) {
		console.log(e.target.getAttribute("data-id"));
	}

	function init() {
		var params = parseParams(window.location.href);
		console.log(params.id);

		var editButtons = document.getElementsByClassName("edit-device");
		for (var i = 0; i < editButtons.length; i++) {
			var button = editButtons[i],
			id = button.getAttribute("data-id");

			button.addEventListener('click', injectID);
		}

		http.get("http://localhost:5000/estancia/" + params["id"], true, null, handlerListaDisp, function() {});

	}

	function handlerListaDisp(response) {
		if (response.success) {
			var data = response.data,
				list = document.getElementById("lista-dispositivos");

			list.innerHTML = "";
			for (var i = 0; i < data.length; i++) {
				var item = "<div class='row'>" +
	              "<a href='device.html?id=" + data[i].id + "' role='button' class='col-xs-7'>" + data[i].nombre + "<a>" +
	              "<div class='col-xs-3'><span class='label label-success'>Encendido</span><div>" +
	              "<div class='col-xs-2'><button type='button' data-id='0' class='edit-device btn btn-default" +
				  "btn-sm' data-toggle='modal' data-target='#editdevice'>Editar</button></div>" +
	              "</div>";

				list.innerHTML += item;
			}
		} else {
			alert("Error!");
		}
	}

	function showNombre(response){
		if (response.success) {
			var data = response.data,
				list = document.getElementById("nombre-estancia");

		}

	}

	init();
})();
