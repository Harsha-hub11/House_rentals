// Import express.js
const express = require("express");
const bodyParser = require('body-parser');
const { User } = require("./models/user");
const cookieParser = require("cookie-parser");
const session = require('express-session');
// Create express app
var app = express();
const bcrypt = require('bcryptjs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname));
const oneDay = 1000 * 60 * 60 * 24;
const sessionMiddleware = session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
});
app.use(sessionMiddleware);


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

app.get("/admin-dashboard", function (req, res) {
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
            res.render('admin-dashboard', { data: results, filters: req.query, page });
        })
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

// Route for rendering the contact page
app.get("/contact", function(req, res) {
    const { error, success } = req.query;
    res.render('contact', { error, success });
});


app.get("/login", function(req, res) {
    res.render('login');
});
app.get("/register", function(req, res) {
    res.render('register');
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

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/forgot-password', function (req, res) {
    res.render('forgot-password');
});
// app.get('/login', function (req, res) {
//     res.render('login');
// });

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        var user = new User(email);
        const uId = await user.getIdFromEmail();
        if (!uId) {
            return res.render('login',{ errorMessage: 'Invalid Email' });
        }

        const match = await user.authenticate(password);
        if (!match) {
            return res.render('login',{ errorMessage: 'Invalid Email' })
        }

        req.session.uid = uId;
        req.session.loggedIn = true;
        console.log(req.session.id);
        res.redirect('/admin-dashboard');
    } catch (err) {
        console.error(`Error while authenticating user:`, err.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/login", function (req, res) {
    try {
        if (req.session.uid) {
            res.redirect('/dashboard');
        } else {
            res.render('login');
        }
        res.end();
    } catch (err) {
        console.error("Error accessing root route:", err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', function (req, res) {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/set-password', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            // If a valid, existing user is found, set the password and redirect to the users single-student page
            await user.setUserPassword(params.password);
            console.log(req.session.id);
            res.render('forgot-password', { successMessage: 'Password set successfully' });
            // res.send('Password set successfully');
        }
        else {
            // If no existing user is found, add a new one
            // newId = await user.addUser(params.email);
            res.render('forgot-password', { errorMessage: 'Email is not exists,Please check your Email' });
            // res.send('Email is not exists,Please check your Email');
        }
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});

// Create a route for handling /contactus POST requests
app.post("/submit-contact-form", async (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.redirect('/contact?error=All fields are required.');
    }

    // Prepare data to be stored (e.g., storing in a database, sending an email, etc.)
    const sql = 'INSERT INTO contact_us(name, email, message) VALUES (?, ?, ?)';
    const values = [name, email, message];

    try {
        // Save the message to the database
        await db.query(sql, values);

        // Redirect to the contact page with a success message
        res.redirect('/contact?success=Your message has been received, we will get back to you soon.');
    } catch (err) {
        console.error("Error saving contact message:", err);

        // Redirect to the contact page with an error message
        res.redirect('/contact?error=Internal server error, please try again later.');
    }
});

// GET route to display property details for booking
app.get('/bookings/:id', (req, res) => {
    const propertyId = req.params.id;
    const { success, error } = req.query;  // Capture success or error messages from the query string
    
    // Render the book-property template with the propertyId and messages
    res.render('book-property', { 
        property: propertyId, 
        success: success,
        error: error
    });
});



app.post('/submit-booking/:id', async (req, res) => {
    const propertyId = req.params.id;
    const { start_date, end_date, customer_name, customer_email } = req.body;

    // Validate input
    if (!start_date || !end_date || !customer_name || !customer_email) {
        return res.redirect(`/bookings/${propertyId}?error=All fields are required.`);
    }

    // Prepare SQL query to insert the booking
    const sql = 'INSERT INTO bookings (property_id, start_date, end_date, customer_name, customer_email) VALUES (?, ?, ?, ?, ?)';
    const values = [propertyId, start_date, end_date, customer_name, customer_email];

    try {
        await db.query(sql, values);

        // Redirect to the booking page with a success message
        res.redirect(`/bookings/${propertyId}?success=Booking successfully submitted!`);
    } catch (err) {
        console.error('Error saving booking:', err);

        // Redirect to the booking page with an error message
        res.redirect(`/bookings/${propertyId}?error=Internal server error, please try again later.`);
    }
});


// create User api
app.post('/userregistration', async (req, res) => {
    const { username, email, password, fullname, dob, gender } = req.body;

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Prepare SQL query
        const sql = 'INSERT INTO Users(username, email, password, fullname, dob, gender) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [username, email, hashedPassword, fullname, dob, gender];
        // Execute SQL query
        await db.query(sql, values);

        res.render('register', { successMessage: 'User created successfully' });
    } catch (error) {
        console.log(error)
        res.render('register', { errorMessage: 'Error inserting data into the database' });
    }
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});