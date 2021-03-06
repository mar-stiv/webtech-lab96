// ###############################################################################
//                  Web Technology at VU University Amsterdam
//                                Assignment 3
// ###############################################################################
//
// Database setup:
// First: Our code will open a sqlite database file for you, and create one if it not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'phones.db'.
// It will be automatically re-created and filled with one example item.
const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

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

const express = require("express");
const app = express();
app.use(express.json());
//app.use(express.static("ass3"));

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // adds a new middleware to the app which configures body parser to parse JSON
app.use(bodyParser.urlencoded({
   extended: true // restricts body to json
}));

var cors = require('cors');
app.use(cors());

// Routes for http://localhost:3000/

// 1. retrieve full data set (all rows in product database) - GET - WORKS
app.get("/api/phones", (req,res,next) =>{
  db.all("SELECT id, brand, model, os, image, screensize FROM phones", [], (err,rows) =>{
    if(err){
      res.status(400).json({"error":err.message});
      return;
    }
    res.status(200).json({rows});
  })
});

// 2. add data for a new product item (create) - POST - WORKS
app.post("/api/insert", (req, res, next) => {
  reqBody = req.body;
  db.run("INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)",
    [reqBody.brand, reqBody.model, reqBody.os, reqBody.image, reqBody.screensize],
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": err.message })
        return;
      }
      res.status(201).json({ "phone_id": this.lastID });
    })
});

// 3. list data of a specific item (retrieve) - GET - WORKS
app.get("/api/phones/:id", (req,res,next) => {
  var params = req.params.id;
    db.all("SELECT id, brand, model, os, image, screensize FROM phones WHERE id= ?",
    params,
    (err, row) =>{
      if(err){
        res.status(400).json({"error":err.message});
        return;
      }
      if(row.length>0){
        res.status(200).json(row);
      }else{
        res.status(400).json({"message":"invalid id"});
        return;
      }
    });
});

// 4. change data of a specific item (update) - PUT - WORKS
app.put("/api/update/:id", (req,res,next) =>{ // filters phone ID selected
  item = req.body;
  db.run(`UPDATE phones SET brand=?, model=?, os=?, image=?,screensize=? WHERE id=?`,
     [item.brand, item.model, item.os, item.image, item.screensize, req.params.id],
     function(err,result){
       if(err){
         res.status(400).json({"error": res.message});
         return;
       /*}else if(result.id === 0){
         res.status(404).json({"error": res.message});
         return;*/
       }else if(this.changes<0){
         res.status(400).json({"message":"ID not found"});
       }
       res.sendStatus(204); // return no message in body
     });
});

// 5. remove data of a specific item (delete) - DELETE - WORKS
app.delete("/api/remove/:id", (req, res, next) =>{
  db.run("DELETE FROM phones WHERE id = ?",
  req.params.id,
    function(err,result){
      if(err){
        res.status(400).json({"error":res.message})
        return;
      }
      res.sendStatus(204); // return no message in body
    });
});

// This should start the server, after the routes have been defined, at port 3000:
app.listen(3000, () =>{
  console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");
}); // Binds and listens for connections on the specified host and port. This method is identical to Node???s http.Server.listen().
