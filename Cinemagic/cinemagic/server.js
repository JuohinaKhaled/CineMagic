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

app.get('/filme', (req, res) => {
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

app.post('/room', (req, res) => {
  const { eventID } = req.body;
  const query =`
    SELECT sp.SitzplatzID, sp.SaalID, sp.Reihennummer, sp.Sitznummer, sp.Sitztyp,
           CASE WHEN bt.SitzplatzID IS NOT NULL THEN 'Besetzt' ELSE 'Frei' END AS Buchungsstatus
    FROM Sitzplaetze sp
           LEFT JOIN buchtTicket bt ON sp.SitzplatzID = bt.SitzplatzID AND bt.VorfuehrungsID = ?
    WHERE sp.SaalID = (SELECT SaalID FROM Vorfuehrungen WHERE VorfuehrungsID = ?)`;

  con.query(query, [eventID], (error, results) => {
    if (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ error: 'Database query error' });
    } else {
      console.log("Rooms fetched successfully:", results);
      res.json(results);
    }
  });
});

app.post('/room/capacity', (req, res) => {
  const { eventID } = req.body;
  const query = `
    SELECT AnzahlSitzplaetze
    FROM Saele
    WHERE SaalID = (SELECT SaalID FROM Vorfuehrungen WHERE VorfuehrungsID = ? )`;

  con.query(query, [eventID], (error, results) => {
    if (error) {
      console.error("Error fetching room capacity:", error);
      res.status(500).json({ error: 'Database query error' });
    } else {
      if (results.length > 0) {
        const capacity = results[0].AnzahlSitzplaetze;
        console.log("Room capacity fetched successfully:", capacity);
        res.json(capacity);
      } else {
        console.error("Room capacity not found for event ID:", eventID);
        res.status(404).json({ error: 'Room capacity not found' });
      }
    }
  });
});

