const express = require('express');
const http = require('http');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 4200;
const server = http.createServer(app);


bodyParser = require('body-parser');


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// configuration =================
app.use(express.static(path.join(__dirname, '/dist/my-new-angular-app')));
// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/dist/cinemagic')));

server.listen(port, () => {
  console.log("Server is running on " + port);
});


// MySQL connection
const con = mysql.createConnection({
  database: "24_IT_Grp1",
  host: "192.168.110.94",
  port: "3306",
  user: "24_IT_Grp1",
  password: "uCbEKPQp3SpRxXXkwRr5"
});

// Routes
// Login endpoint
app.post('/loginKunde', (req, res) => {
  const { email, password } = req.body;
  const kundeQuery = 'SELECT * FROM Kunden WHERE Email = ? AND Passwort = ?';

  con.query(kundeQuery, [email, password], function(kundeError, kundeResults) {
    if (kundeError) throw kundeError;

    if (kundeResults.length > 0) {
      // User found
      const user = kundeResults[0];
      res.send({ status: 'success', message: 'Login successful as Kunde', data: user });
    } else {
      // User not found
      res.send({ status: 'fail', message: 'Invalid email or password' });
    }
  });
});

// Create a new Kunde
app.post('/registerKunde', (req, res) => {
  const { Name, Email, Telefonnummer, Passwort } = req.body;
  const query = 'INSERT INTO Kunden (Name, Email, Telefonnummer, Passwort) VALUES (?, ?, ?, ?)';

  con.query(query, [Name, Email, Telefonnummer, Passwort], (error, results) => {
    if (error) throw error;
    res.status(201).json({ message: 'Kunde created', kundenID: results.insertId });
  });
});

