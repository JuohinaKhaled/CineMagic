const express = require('express');
const http = require('http');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 4200;
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/dist/cingemagic')));

// MySQL connection
const con = mysql.createConnection({
  host: "192.168.110.94",
  port: "3306",
  user: "24_IT_Grp1",
  password: "uCbEKPQp3SpRxXXkwRr5",
  database: "24_IT_Gruppe1"
});

// Test connection
con.connect(err => {
  if (err) throw err;
  console.log('Connected to the database');
});

// Routes

// Login endpoint
app.post('/login', (req, res) => {
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
app.post('/register', (req, res) => {
  const { Name, Email, Telefonnummer, Passwort } = req.body;
  const query = 'INSERT INTO Kunden (Name, Email, Telefonnummer, Passwort) VALUES (?, ?, ?, ?)';

  con.query(query, [Name, Email, Telefonnummer, Passwort], (error, results) => {
    if (error) throw error;
    res.status(201).json({ message: 'Kunde created', kundenID: results.insertId });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
