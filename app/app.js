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

app.get("/all-properties-formatted", function (req, res) {
    const { city, house_type, availability_status, page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM properties WHERE 1=1';
    const params = [];

    if (city) {
        sql += ' AND city = ?';
        params.push(city);
    }
    if (house_type) {
        sql += ' AND house_type = ?';
        params.push(house_type);
    }
    if (availability_status) {
        sql += ' AND availability_status = ?';
        params.push(availability_status);
    }

    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    db.query(sql, params)
        .then(results => {
            res.render('all-properties', { data: results, filters: req.query, page });
        })
});

app.get('/property-details/:id', function (req, res) {
    const propertyId = req.params.id;
    const sql = 'SELECT * FROM properties WHERE house_id = ?';
    db.query(sql, [propertyId])
        .then(result => {
            if (result.length > 0) {
                res.render('property-details', { property: result[0] });
            } else {
                res.render('property-details', { property: null });
            }
        })
});

app.get("/about", function(req, res) {
    res.render('about');
});

app.get("/contact", function(req, res) {
    res.render('contact');
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