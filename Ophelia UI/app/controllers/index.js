(function() {
	function init() {
		http.get("http://localhost:5000/estancia", true, null, handlerLista, function() {});

		var formNewEstancia = document.getElementById("crear-estancia");
		formNewEstancia.addEventListener('click', handlerNewEstancia);
	}

	function handlerLista(response) {
		if (response.success) {
			var data = response.data,
				list = document.getElementById("lista-estancias-index");

			list.innerHTML = "";
			for (var i = 0; i < data.length; i++) {
				var item = "<a href='instance.html?id=" + data[i].id + "' class='list-group-item'>" +
					"<div class='row'>" +
						"<div class='col-xs-8'>" + data[i].nombre +"</div>" +
						"<div class='col-xs-1'><span class='label label-success'>" + data[i].dispositivos.on + "</span></div>" +
						"<div class='col-xs-1'><span class='label label-warning'>" + data[i].dispositivos.off + "</span></div>" +
						"<div class='col-xs-1'><span class='label label-danger'>" + data[i].dispositivos.standby + "</span></div>" +
					"</div>" +
				"</a>";

				list.innerHTML += item;
			}
		} else {
			alert("Error!");
		}
	}

	function handlerNewEstancia() {
		var name = document.getElementById("name").value,
			width = document.getElementById("width").value,
			height = document.getElementById("height").value;

		if (Boolean(name) && Boolean(width) && Boolean(height)) {
			var url = "http://localhost:5000/estancia",
				json = true,
				data = {
					"nombre": name,
					"ancho": width,
					"alto": height
				};

			http.post(url, json, data, function (response) {
				if (response.success) {
					alert("Creado!");
					var list = document.getElementById("lista-estancias-index"),
						item = "<a href='instance.html?id=" + response.data.id + "' class='list-group-item'>" +
							"<div class='row'>" +
								"<div class='col-xs-8'>" + response.data.nombre +"</div>" +
								"<div class='col-xs-1'><span class='label label-success'>0</span></div>" +
								"<div class='col-xs-1'><span class='label label-warning'>0</span></div>" +
								"<div class='col-xs-1'><span class='label label-danger'>0</span></div>" +
							"</div>" +
						"</a>";

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
