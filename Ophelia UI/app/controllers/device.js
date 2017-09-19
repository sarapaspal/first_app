// Falta editar nombre del dispositivo en el título

// Falta editar nombre del dispositivo en la descripción

// Que te cargue el último valor

// Que te cargue la media semanal

// Que te cargue la varianza

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


        http.get("http://localhost:5000/estancia/" + params.id_estancia + "/dispositivo/" + params.id + "/metricas", true, null, handlerHistorico, function() {});

        http.get("http://localhost:5000/estancia/" + params.id_estancia + "/dispositivo/" + params.id, true, null, function(response) {
			if (response.success) {
				var data = response.data,
					list = document.getElementById("nombre-dispositivo");

					list.innerHTML = "<h4>" + data.nombre + "</h4>"
			}
		}, function() {});
        document.getElementById('return-a-disp').href += "id=" + params.id_estancia;
		document.getElementById('historico-completo').href += "id_estancia=" + params.id_estancia + "&id=" + params.id;
    }

    function handlerHistorico(response) {
        if (response.success) {
            var data = response.data,
				list = document.getElementById("tabla-stats");

			list.innerHTML="<tr><th>Instantáneo [V]</th><th>Media semanal [V]</th><th>Varianza</th></tr>" +
            	"<tr><td>" + data.instantaneo + "</td><td>" + data.media + "</td><td>" + data.varianza + "</td></tr>";
        }
    }

    init();
})();
