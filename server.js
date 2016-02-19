var express = require("express");
var app = express();
var moment = require("moment");

function getUnix(date) {
    //natural date to unix timestamp when date is in natural format
    return moment(date, "MMMM D, YYYY").format("X");
}
    
function getNatural(unix) {
    //unix timestamp to natural date when date is in unix format
    return moment.unix(unix).format("MMMM D, YYYY");
}

app.use(express.static("public/"));

app.get("/", function(req, res){
	console.log("root");
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.render("index.html");
	res.end();
});


app.get("/:query", function(req, res){
	var reqDate = req.params.query;
	res.statusCode = 200;
	if(moment(reqDate, "X").isValid() || moment(reqDate, "x").isValid() || moment(reqDate, "MMMM-M-YYYY").isValid() ){
		res.setHeader('Content-Type', 'application/json');
		//var date = new Date(reqDate);
		if(+reqDate){   //this will only work if date is in unix format otherwise it'll be NaN
			var unix = reqDate;
			var natural = getNatural(reqDate);
    		res.send(JSON.stringify({"unix": unix, "natural": natural}));
		}
		else{
			var unix = getUnix(reqDate);
			if(unix !== 'Invalid date'){
				var natural = reqDate;
    			res.send(JSON.stringify({"unix": unix, "natural": natural}));	
    		}
    		else{
    			res.send(JSON.stringify({"unix": null, "natural": null}));		
    		}
		}
	}
	else{
		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify({"unix": null, "natural": null}));	
	}
    
});

app.listen(process.env.PORT || 5000);
