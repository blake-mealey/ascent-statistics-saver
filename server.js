// Server config
var config = require('./server_config');

// Node libraries
var http = require('http');
var qs = require('querystring');
var Spreadsheet = require('edit-google-spreadsheet');

Spreadsheet.load({
	debug: true,
	spreadsheetId: "1wJ9R3M6-LeLL4jS0VY4T6lehMwondF4_oWveNP_5DPs",
	worksheetId: "od6",	//worksheetName: "Sheet1"

	oauth: {
		email: "blake-804@ascent-data-saving.iam.gserviceaccount.com",
		keyFile: "ascent-data-saving.pem"
	}
}, function sheetReady(err, spreadsheet) {
	if(err) throw err;

	spreadsheet.receive(function(err, rows, info) {
		if(err) throw err;
		console.log("Found rows: ", rows);
	});

	spreadsheet.add({3:{5:"hello!", 7:"goodbye!"}});

	spreadsheet.send(function(err) {
		if(err) throw err;
		console.log("Updated Cell at row 3, col 5 to 'hello!'");
	});
});

//Setup server
/*var server = http.createServer(function(req, res) {
	if(req.method == "POST") {
		var reqBody = '';
		req.on('data', function(data) {
			reqBody += data;
		});
		req.on('end', function() {
			var formData = JSON.parse(reqBody);

			console.log(formData.request);

			var returnJSON = {response: "hello world!"};

			if(returnJSON != null) {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify(returnJSON));
			}

			console.log("\n");
		});
	}
})*/

//server.listen(config.server_port);
//console.log('Ascent statistics server running on localhost:'+config.server_port);