// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

app.get('/', (req, res) => {
    const reviews = [
        { name: "John Doe", comment: "Fantastic service and great properties!", rating: 5 },
        { name: "Jane Smith", comment: "Found the perfect apartment for my needs.", rating: 4 },
        { name: "Sam Wilson", comment: "Easy to use platform and friendly support!", rating: 5 },
    ];
    res.render('home', { reviews });
});

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Task 2 display a formatted list of students
app.get("/all-properties-formatted", function(req, res) {
    var sql = 'select * from properties';
    db.query(sql).then(results => {
    	    // Send the results rows to the all-students template
    	    // The rows will be in a variable called data
        res.render('all-properties', {data: results});
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});