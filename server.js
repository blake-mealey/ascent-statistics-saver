// Server config
var config = require('./server-config');

// Node libraries
var http = require('http');
var qs = require('querystring');
var Spreadsheet = require('edit-google-spreadsheet');

var spreadsheet;

function incrementSaleCount(itemtype, itemname) {
	spreadsheet.receive(function(err, rows, info) {
		if(err) throw err;

		var row = 19;
		var col = 1;

		var type = rows[row][col];
		while(type != null && type != itemtype) {
			col += 4;
			type = rows[row][col];
			console.log(col);
		}

		if(type == null) return false;
		row += 2;

		var name = rows[row][col];
		while(name != null && name != itemname) {
			row += 1;
			name = rows[row][col];
			console.log(row);
		}

		if(name == null) return false;
		col += 3;

		var saleCount = rows[row][col] + 1;
		console.log("Current Sale Count: ", saleCount - 1);

		var data = {};
		data[row] = {};
		data[row][col] = saleCount;

		console.log('adding');
		spreadsheet.add(data);
		spreadsheet.send(function(err) {
			if(err) throw err;
			console.log("Updated Sale Count: ", saleCount);
		});

		return true;
	});
}

Spreadsheet.load({
	debug: true,
	spreadsheetId: "1wJ9R3M6-LeLL4jS0VY4T6lehMwondF4_oWveNP_5DPs",
	worksheetId: "o7clbnm",

	oauth: {
		email: "blake-804@ascent-data-saving.iam.gserviceaccount.com",
		keyFile: "ascent-data-saving.pem"
	}
}, function sheetReady(err, ss) {
	if(err) throw err;

	spreadsheet = ss;
});

//Setup server
var server = http.createServer(function(req, res) {
	if(req.method == "POST") {
		var reqBody = '';
		req.on('data', function(data) {
			reqBody += data;
		});
		req.on('end', function() {
			var formData = JSON.parse(reqBody);

			if(formData.reqtype == "IncrementSales") {
				console.log(formData.itemtype, formData.itemname);

				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({
					error: incrementSaleCount(formData.itemtype, formData.itemname)
				}));
			}

			console.log("\n");
		});
	}
})

server.listen(config.server_port);
console.log('Ascent statistics server running on localhost:'+config.server_port);