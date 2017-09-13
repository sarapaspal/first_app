var url = "../Ophelia API/JulesBBDD.db",
	json = true,
	data = {
		title: "Example",
		body: "Hello world!",
		userId: 1917
	};

http.post(url, json, data, function (res) {
	if (res.success) {
		console.log(res.data);
	} else {
		console.log("Error!");
	}
}, function(progress) {
	console.log(progress.completed + "% completed.");
});
