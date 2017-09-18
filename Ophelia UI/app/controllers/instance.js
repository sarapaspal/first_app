(function() {
	var params;

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
		return e.target.getAttribute("data-id");
	}

	function init() {

		params = parseParams(window.location.href);
		console.log(params.id);

		http.get("http://localhost:5000/estancia/" + params.id + "/dispositivos", true, null, handlerListaDisp, function() {});

		http.get("http://localhost:5000/estancia/" + params.id, true, null, function(response) {
			if (response.success) {
				var data = response.data,
					list = document.getElementById("nombre-estancia");

					list.innerHTML = "<h4>" + data.nombre + "</h4>"
			}
		}, function() {});

		http.get("http://localhost:5000/estancia/" + params.id, true, null, function(response) {
			if (response.success) {
				var data = response.data,
					list = document.getElementById("dispositivos-descripcion");

					list.innerHTML = "<p>Aquí podrás ver un listado de los dispositivos conectados en la estancia " + data.nombre + ".</p>" +
			        "<p><b>Toca un aparato para conocer más detalles.</b></p>"
			}
		}, function() {});

		var editButtons = document.getElementsByClassName("edit-device");
		for (var i = 0; i < editButtons.length; i++) {
			var button = editButtons[i],
			id = button.getAttribute("data-id");

			button.addEventListener('click', injectID);
		}

		var formNewDispositivo = document.getElementById("crear-dispositivo");
		formNewDispositivo.addEventListener('click', handlerNewDispositivo);

		var formEditDispositivo = document.getElementById("edit-dispositivo");
		formEditDispositivo.addEventListener('click', editDispositivo);


	}

	function handlerListaDisp(response) {
		if (response.success) {
			var data = response.data,
				list = document.getElementById("lista-dispositivos");

			list.innerHTML = "";
			for (var i = 0; i < data.length; i++) {
				var color;
				var estadoColor;
				if  (data[i].estado == 1) {
					color = "success"
					estadoColor = "Encendido"
				} else if (data[i].estado == 0){
					color = "danger"
					estadoColor = "Apagado"
				} else if (data[i].estado == 2){
					color = "warning"
					estadoColor = "Stand-by"
				}

				var item = "<div class=list-group-item> <div class='row'>" +
	              "<a href='device.html?id=" + data[i].id + "&id_estancia=" + params.id + "' role='button' class='col-xs-8'>" + data[i].nombre + "</a>" +
	              "<div class='col-xs-2'><span class='label label-" + color + "'>" + estadoColor + "</span></div>" +
	              "<div class='col-xs-2'><button type='button' data-id='" + data[i].id + "' class='edit-device btn btn-default text-right " +
				  "btn-sm' data-toggle='modal' data-target='#editdevice'>Editar</button></div>" +
	              "</div> </div>";

				list.innerHTML += item;
			}
		} else {
			alert("Error!");
		}
	}

	function handlerNewDispositivo() {
		var name = document.getElementById("name").value,
			estado = document.getElementById("estado").value,
			posX = document.getElementById("posX").value,
			posY = document.getElementById("posY").value;

		if (Boolean(name) && Boolean(estado) && Boolean(posX) && Boolean(posY)) {
			var url = "http://localhost:5000/estancia/" + params.id,
				json = true,
				data = {
					"nombre_disp": name,
					"estado": estado,
					"posX": posX,
					"posY": posY
				};

			http.post(url, json, data, function (response) {
				if (response.success) {
					alert("Creado!");
					var list = document.getElementById("lista-dispositivos"),
						item = "<div class=list-group-item> <div class='row'>" +
			              "<a href='device.html?id=" + response.data.id + "' role='button' class='col-xs-9'>" + response.data.nombre + "</a>" +
			              "<div class='col-xs-1'><span class='label label-default'>" + response.data.estado + "</span></div>" +
			              "<div class='col-xs-2'><button type='button' data-id='" + respone.data.id + "' class='edit-device btn btn-default text-right " +
						  "btn-sm' data-toggle='modal' data-target='#editdevice'>Editar</button></div>" +
			              "</div> </div>";

					list.innerHTML += item;
				} else {
					alert("Error al crear la estancia...");
				}
			}, function() {});
		} else {
			alert("Rellene todos los campos!");
		}
	}

	function editDispositivo() {
		// Ver cómo conseguir el ID del disositvo a editar
		var name = document.getElementById("edit-name").value,
			estado = document.getElementById("edit-estado").value,
			posX = document.getElementById("edit-posX").value,
			posY = document.getElementById("edit-posY").value;

		if (Boolean(name) && Boolean(estado) && Boolean(posX) && Boolean(posY)) {
			var url = "http://localhost:5000/estancia/" + params.id + "/dispositivo/" + id_disp,
				json = true,
				data = {
					"nombre_disp": name,
					"estado": estado,
					"posX": posX,
					"posY": posY
				};

			http.put(url, json, data, function (response) {
				if (response.success) {
					alert("Creado!");
					var list = document.getElementById("lista-dispositivos"),
						item = "<div class=list-group-item> <div class='row'>" +
						  "<a href='device.html?id=" + response.data.id + "' role='button' class='col-xs-9'>" + response.data.nombre + "</a>" +
						  "<div class='col-xs-1'><span class='label label-default'>" + response.data.estado + "</span></div>" +
						  "<div class='col-xs-2'><button type='button' data-id='" + response.data.id + "' class='edit-device btn btn-default text-right " +
						  "btn-sm' data-toggle='modal' data-target='#editdevice'>Editar</button></div>" +
						  "</div> </div>";

					list.innerHTML += item;
				} else {
					alert("Error al crear la estancia...");
				}
			}, function() {});
		} else {
			alert("Rellene todos los campos!");
		}
	}



	init();
})();
