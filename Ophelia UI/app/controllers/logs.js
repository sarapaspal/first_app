// Que cargue nombre en la descripción

// Falta mostrar todos los valores

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

    function init() {

		params = parseParams(window.location.href);
		console.log(params);

        http.get("http://localhost:5000/estancia/" + params.id_estancia + "/dispositivo/" + params.id, true, null, function(response) {
			if (response.success) {
				var data = response.data,
					list = document.getElementById("nombre-dispositivo-descripcion");
					list.innerHTML = "<p>Histórico de datos del dispositivo " + data.nombre + ".</p>";
			}
		}, function() {});

        http.get("http://localhost:5000/estancia/" + params.id_estancia + "/dispositivo/" + params.id + "/historial", true, null, handlerListaValores, function() {});

		document.getElementById('return-a-metrics').href += "id_estancia=" + params.id_estancia + "&id=" + params.id;
    }

    function handlerListaValores(response) {
		if (response.success) {
			var data = response.data,
				list = document.getElementById("tabla-valores");

			list.innerHTML = "<tr><th>Fecha</th><th>Valor [V]</th></tr>";
			for (var i = 0; i < data.length; i++){
				list.innerHTML += "<tr><td>" + data[i].fecha + "</td><td>" + data[i].valor + "</td></tr>";
			}
		} else {
			alert("Error!");
		}
	}


    init();
})();
