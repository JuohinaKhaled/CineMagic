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
// app.use(express.static(path.join(__dirname, '/dist/my-new-angular-app')));
// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/dist/cinemagic/browser')));

server.listen(port, () => {
  console.log("Server is running on " + port);
});


// MySQL connection
const con = mysql.createConnection({
  database: "24_IT_Gruppe1",
  host: "192.168.110.94",
  port: "3306",
  user: "24_IT_Grp1",
  password: "uCbEKPQp3SpRxXXkwRr5",
  ssl: {
    rejectUnauthorized: false
  }
});

// Routes
// Login endpoint
app.post('/loginCustomer', (req, res) => {
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
app.post('/registerCustomer', (req, res) => {
  const { Vorname, Nachname, Email, Telefonnummer, Passwort } = req.body;
  const checkQuery = 'SELECT * FROM Kunden WHERE Email = ? OR Telefonnummer = ?';

  con.query(checkQuery, [Email, Telefonnummer], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking customer existence:', checkError);
      res.status(500).json({ status: 'error', message: 'Error checking customer existence' });
      return;
    }

    if (checkResults.length > 0) {
      const existingCustomer = checkResults[0];
      if (existingCustomer.Email === Email) {
        res.status(400).json({ status: 'fail', message: 'Customer already exists with this email' });
      } else if (existingCustomer.Telefonnummer === Telefonnummer) {
        res.status(400).json({ status: 'fail', message: 'Customer already exists with this phone number' });
      }
      return;
    }

    const query = 'INSERT INTO Kunden (Vorname, Nachname, Email, Telefonnummer, Passwort) VALUES (?, ?, ?, ?, ?)';

    con.query(query, [Vorname, Nachname, Email, Telefonnummer, Passwort], (error, results) => {
      if (error) {
        console.error('Error inserting customer:', error);
        res.status(500).json({ status: 'error', message: 'Error inserting customer' });
        return;
      }
      res.status(201).json({ status: 'success', message: 'Kunde created', kundenID: results.insertId });
    });
  });
});


//Display movies
app.get('/movies', (req, res) => {
  const query = `
    SELECT f.FilmID, f.Titel, f.Beschreibung, f.Dauer, f.Altersfreigabe, f.Genre, f.Regisseur, f.Erscheinungsdatum, b.PfadGrossesBild, b.PfadKleinesBild
    FROM Filme f
    LEFT JOIN Bilder b ON f.FilmID = b.FilmID`;

  con.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching films:", error);
      res.status(500).json({ error: 'Database query error' });
    } else {
      console.log("Films fetched successfully:", results);
      res.json(results);
    }
  });
});

//Display Movie Details
app.post('/movieDetails', (req, res) => {
  const { movieID } = req.body;
  const query = `
    SELECT f.FilmID, f.Titel, f.Beschreibung, f.Dauer, f.Altersfreigabe, f.Genre, f.Regisseur, f.Erscheinungsdatum, b.PfadGrossesBild, b.PfadKleinesBild
    FROM Filme f
    LEFT JOIN Bilder b ON f.FilmID = b.FilmID
    WHERE f.FilmID = ?`;

  con.query(query, [movieID], function(error, results) {
    if (error) {
      console.error("Error fetching film:", error);
      res.status(500).json({ error: 'Database query error' });
    } else {
      console.log("Film fetched successfully:", results[0]);
      res.json(results);
    }
  });
});

app.post('/seats', (req, res) => {
  const { eventID } = req.body;
  const query =`
    SELECT sp.SitzplatzID, sp.SaalID, sp.Reihennummer, sp.Sitznummer, sp.Sitztyp,
           CASE WHEN bt.SitzplatzID IS NOT NULL THEN 'Besetzt' ELSE 'Frei' END AS Buchungsstatus
    FROM Sitzplaetze sp
           LEFT JOIN buchtTicket bt ON sp.SitzplatzID = bt.SitzplatzID AND bt.VorfuehrungsID = ?
    WHERE sp.SaalID = (SELECT SaalID FROM Vorfuehrungen WHERE VorfuehrungsID = ?)`;

  con.query(query, [eventID, eventID], function(error, results) {
    if (error) {
      console.error("Error fetching seats:", error);
      res.status(500).json({ error: 'Database query error' });
    } else {
      if (results.length > 0) {
      console.log("Seats fetched successfully:", results);
      res.json(results);
      } else {
        console.error("Seats not found for event ID:", eventID);
        res.status(404).json({ error: 'Seats not found' });
      }
    }
  });
});

app.post('/room', (req, res) => {
  const { eventID } = req.body;
  const query = `
    SELECT s.SaalID, s.Saalname, s.AnzahlSitzplaetze, s.Saaltyp
    FROM Saele s
    WHERE SaalID = (SELECT SaalID FROM Vorfuehrungen WHERE VorfuehrungsID = ? )`;

  con.query(query, [eventID], (error, results) => {
    if (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ error: 'Database query error' });
    } else {
      if (results.length > 0) {
        console.log("Room fetched successfully:", results);
        res.json(results);
      } else {
        console.error("Room not found for event ID:", eventID);
        res.status(404).json({ error: 'Room not found' });
      }
    }
  });
});

app.post('/events', (req, res) => {
  const {movieID} = req.body;
  const query = `SELECT v.VorfuehrungsID, v.FilmID, v.SaalID, v.Vorfuehrungsdatum, v.Vorfuehrungszeit
                 FROM Vorfuehrungen v
                 WHERE FilmID = ?`;
  con.query(query, [movieID], (error, results) => {
    if (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: 'Database query error' });
    } else {
      console.log("Events fetched successfully:", results);
      res.json(results);
    }
  });
});
