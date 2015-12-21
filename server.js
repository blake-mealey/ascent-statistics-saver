// Server config
var config = require('./server_config');

// Node libraries
var http = require('http');
var qs = require('querystring');
var GoogleSpreadsheet = require("google-spreadsheet");

var sheet = new GoogleSpreadsheet("1wJ9R3M6-LeLL4jS0VY4T6lehMwondF4_oWveNP_5DPs");

sheet.getRows( 1, function(err, row_data){
	console.log( 'pulled in '+row_data.length + ' rows');
});

var creds = require("./Ascent-Data-Saving-0ba3c8d5c237.json");

sheet.useServiceAccountAuth(creds, function(err) {
	sheet.getInfo(function(err, sheetInfo) {
		console.log(sheetInfo.title + " is loaded");

		var sheet1 = sheetInfo.worksheets[0];
		sheet1.getRows(function(err, rows) {
			rows[0].colname = "new val";
			rows[0].save();
		});
	});

	sheet.addRow(2, {colname: "col value"});

	sheet.getRows(2, {
		start: 100,
		num: 100,
		orderby: "name"
	}, function(err, rowData) {
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