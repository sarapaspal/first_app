var http = {
	get: function(u, j, d, c, p) { this.call("GET", u, j, d, c, p); },
	post: function(u, j, d, c, p) { this.call("POST", u, j, d, c, p); },
	put: function(u, j, d, c, p) { this.call("PUT", u, j, d, c, p); },
	delete: function(u, j, d, c, p) { this.call("DELETE", u, j, d, c, p); },
	options: function(u, j, d, c, p) { this.call("OPTIONS", u, j, d, c, p); },
	call: function (method, uri, json, data, callback, progress) {
		var req = new XMLHttpRequest();
		req.open(method, uri, true);

		var payload = new FormData();
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				var value = data[key];
				payload.append(key, value);
			}
		}

		req.send(payload);

		req.onprogress = function(e) {
			if (e.lengthComputable) {
				progress({
					loaded: e.loaded,
					total: e.total,
					completed: (e.loaded/e.total)*100
				});
			}
		};

		req.onreadystatechange = function() { //Response handler
			if (req.readyState === 4) { //Done
				var res = (json) ? JSON.parse(req.responseText) : req.responseText;
				callback({
					success: (300 >= req.status && req.status >= 200), //Ok
					data: res
				});
			}
		}
	}
};
