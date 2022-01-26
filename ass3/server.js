// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3
//
// The assignment description is available on Canvas.
// Please read it carefully before you proceed.
//
// This is a template for you to quickly get started with Assignment 3.
// Read through the code and try to understand it.
//
// Have you read the zyBook chapter on Node.js?
// Have you looked at the documentation of sqlite?
// https://www.sqlitetutorial.net/sqlite-nodejs/
//
// Once you are familiar with Node.js and the assignment, start implementing
// an API according to your design by adding routes.

// ###############################################################################
//
// Database setup:
// First: Our code will open a sqlite database file for you, and create one if it not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'phones.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

const express = require("express");
const router = express.Router(); // import routes

const app = express();
app.use(express.json());

// We need some middleware to parse JSON data in the body of our HTTP requests:
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // adds a new middleware to the app which configures body parser to parse JSON
app.use(bodyParser.urlencoded({
   extended: true // restricts body to json
}));

// ###############################################################################
// Routes
//
// TODO: Add your routes here and remove the example routes once you know how
//       everything works.
router.get('/home',function(req,res){
  response_body = {'message': 'ping successful'};
  res.json(response_body);
});

// POST method route
app.get('/newphone', function(req,res){ // dummy function
  res.send('POST new phone');
});

// retrieve full data set (all rows in product database)

// add data for a new product item (create)

// list data of a specific item (retrieve)

// change data of a specific item (update)

// remove data of a specific item (delete)
// ###############################################################################

app.use('/',router); // if any request comes with the ‘/’, it will call the router function with its route.

// This example route responds to http://localhost:3000/hello with an example JSON object.
// Please test if this works on your own device before you make any changes.

//reset database to first two items only
app.get("/hello", function(req, res) { // Routes HTTP GET requests to the specified path with the specified callback functions.
    response_body = {'Hello': 'World'} ;

    // This example returns valid JSON in the response, but does not yet set the
    // associated HTTP response header.  This you should do yourself in your
    // own routes!
    res.json(response_body);
    res.send('GET request to homepage');
});

// This route responds to http://localhost:3000/db-example by selecting some data from the
// database and return it as JSON object.
// Please test if this works on your own device before you make any changes.

//
app.get('/database', function(req, res) {
    // Example SQL statement to select the name of all products from a specific brand
    db.all(`SELECT * FROM phones WHERE brand=?`, ['Fairphone'], function(err, rows) {

    	// TODO: add code that checks for errors so you know what went wrong if anything went wrong
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

    	// TODO: set the appropriate HTTP response headers and HTTP response codes here.


    	// # Return db response as JSON
    	return res.json(rows)
    });
});

//
app.post('/post-example', function(req, res) {
	// This is just to check if there is any data posted in the body of the HTTP request:
	console.log(req.body);
	return res.json(req.body);
});

// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:
app.listen(3000, () =>{
  console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");
}); // Binds and listens for connections on the specified host and port. This method is identical to Node’s http.Server.listen().

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}
