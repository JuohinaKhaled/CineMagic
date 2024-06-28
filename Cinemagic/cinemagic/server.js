const express = require('express');
const http = require('http');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = 4200;
const server = http.createServer(app);

const io = socketIO(server);

app.use(session({
  secret: 'c1n3m4g1c',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));

bodyParser = require('body-parser');


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));

// configuration =================
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/dist/cinemagic/browser')));

server.listen(port, () => {
  console.log("Server is running on " + port);
});

app.use(cookieParser());
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


//create WebSocket-Connection
let reservedSeats = [];
let bookedSeats = [];

io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  setInterval(() => {
    io.emit('reservedSeats', reservedSeats);
  }, 1000);

  socket.on('reserveSeat', ({seat, eventID}) => {
    reservedSeats.push({seat: {...seat}, id: socket.id, eventID: eventID});
    io.emit('reservedSeats', reservedSeats);
    console.log(reservedSeats);
  });

  socket.on('releaseSeat', ({seat, eventID}) => {
    const seatIndex = reservedSeats.findIndex(s =>
      s.id === socket.id &&
      s.seat.Sitztyp === seat.Sitztyp &&
      s.seat.Reihennummer === seat.Reihennummer &&
      s.seat.Sitznummer === seat.Sitznummer &&
      s.eventID === eventID
    );
    if (seatIndex !== -1) {
      socket.broadcast.emit('seatReleased', reservedSeats[seatIndex]);
      reservedSeats.splice(seatIndex, 1);
      io.emit('reservedSeats', reservedSeats);
    } else {
      console.log("Seat not found in reservedSeats:", seat, eventID);
    }
  });

  socket.on('counterValue', ({personType, eventID}) => {
    let count = 0
    reservedSeats.forEach(s => {
      if (s.id === socket.id &&
        s.seat.personType === personType &&
        s.eventID === eventID) {
        count++;
      }
    });
    socket.emit(personType + 'Counter', count, eventID);
  });

  socket.on('updateSeat', ({seat, eventID}) => {
    const existingSeatIndex = reservedSeats.findIndex(s =>
      s.id === socket.id &&
      s.seat.Reihennummer === seat.Reihennummer &&
      s.seat.Sitznummer === seat.Sitznummer &&
      s.eventID === eventID
    );
    if (existingSeatIndex !== -1) {
      reservedSeats[existingSeatIndex] = {seat: {...seat}, id: socket.id, eventID: eventID};
      io.emit('reservedSeats', reservedSeats);
    } else {
      console.log("Seat not found in reservedSeats:", seat, eventID);
    }
  });

  socket.on('clientDisconnect', () => {
    console.log('Client disconnected');
    for (let i = reservedSeats.length - 1; i >= 0; i--) {
      if (reservedSeats[i].id === socket.id) {
        socket.broadcast.emit('seatReleased', reservedSeats[i]);
        reservedSeats.splice(i, 1);
        io.emit('reservedSeats', reservedSeats);
      } else {
        console.log("Seat not found in reservedSeats:", reservedSeats[i]);
      }
    }
  });
});

// Routes
// Login endpoint
app.post('/loginCustomer', (req, res) => {
  const {email, password} = req.body;
  const kundeQuery = 'SELECT * FROM Kunden WHERE Email = ? AND Passwort = ?';

  con.query(kundeQuery, [email, password], function (kundeError, kundeResults) {
    if (kundeError) throw kundeError;

    if (kundeResults.length > 0) {
      // User found
      const user = kundeResults[0];
      res.send({status: 'success', message: 'Login successful as Kunde', data: user});
    } else {
      // User not found
      res.send({status: 'fail', message: 'Invalid email or password'});
    }
  });
});

// Create a new Customer
app.post('/registerCustomer', (req, res) => {
  const {Vorname, Nachname, Email, Telefonnummer, Passwort} = req.body;
  const checkQuery = 'SELECT * FROM Kunden WHERE Email = ? OR Telefonnummer = ?';

  con.query(checkQuery, [Email, Telefonnummer], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking customer existence:', checkError);
      res.status(500).json({status: 'error', message: 'Error checking customer existence'});
      return;
    }

    if (checkResults.length > 0) {
      const existingCustomer = checkResults[0];
      if (existingCustomer.Email === Email) {
        res.status(400).json({status: 'fail', message: 'Customer already exists with this email'});
      } else if (existingCustomer.Telefonnummer === Telefonnummer) {
        res.status(400).json({status: 'fail', message: 'Customer already exists with this phone number'});
      }
      return;
    }

    const query = 'INSERT INTO Kunden (Vorname, Nachname, Email, Telefonnummer, Passwort) VALUES (?, ?, ?, ?, ?)';

    con.query(query, [Vorname, Nachname, Email, Telefonnummer, Passwort], (error, results) => {
      if (error) {
        console.error('Error inserting customer:', error);
        res.status(500).json({status: 'error', message: 'Error inserting customer'});
        return;
      }
      res.status(201).json({status: 'success', message: 'Kunde created', kundenID: results.insertId});
    });
  });
});

// Get customer data
app.post('/customer', (req, res) => {
  const { customerID } = req.body;

  const query = 'SELECT Vorname, Nachname, Email, Telefonnummer FROM Kunden WHERE KundenID = ?';
  con.query(query, [customerID], (error, results) => {
    if (error) {
      console.error('Error fetching customer data:', error);
      res.status(500).json({ status: 'error', message: 'Error fetching customer data' });
      return;
    }

    res.status(200).json(results[0]);
  });
});

// Update customer data
app.put('/customer', (req, res) => {
  const { customerID, Vorname, Nachname, Email, Telefonnummer, Passwort } = req.body;

  const query = 'UPDATE Kunden SET Vorname = ?, Nachname = ?, Email = ?, Telefonnummer = ?, Passwort = ? WHERE KundenID = ?';
  con.query(query, [Vorname, Nachname, Email, Telefonnummer, Passwort, customerID], (error, results) => {
    if (error) {
      console.error('Error updating customer data:', error);
      res.status(500).json({ status: 'error', message: 'Error updating customer data' });
      return;
    }

    res.status(200).json({ status: 'success', message: 'Customer data updated successfully' });
  });
});

// Change customer password
app.put('/customer/change-password', (req, res) => {
  const { customerID, oldPassword, newPassword } = req.body;

  // Verify old password
  const verifyQuery = 'SELECT Passwort FROM Kunden WHERE KundenID = ?';
  con.query(verifyQuery, [customerID], (verifyError, verifyResults) => {
    if (verifyError) {
      console.error('Error verifying old password:', verifyError);
      res.status(500).json({ status: 'error', message: 'Error verifying old password' });
      return;
    }

    if (verifyResults[0].Passwort !== oldPassword) {
      res.status(400).json({ status: 'fail', message: 'Old password is incorrect' });
      return;
    }

    // Update with new password
    const updateQuery = 'UPDATE Kunden SET Passwort = ? WHERE KundenID = ?';
    con.query(updateQuery, [newPassword, customerID], (updateError, updateResults) => {
      if (updateError) {
        console.error('Error updating password:', updateError);
        res.status(500).json({ status: 'error', message: 'Error updating password' });
        return;
      }

      res.status(200).json({ status: 'success', message: 'Password updated successfully' });
    });
  });
});

// Fetch all bookings for the current user
app.post('/allBooking', (req, res) => {
  const { customerID } = req.body;

  const query = `
    SELECT b.BuchungsID
    FROM Buchung b
    WHERE b.KundenID = ?
    ORDER BY b.BuchungsDatum DESC;
  `;

  con.query(query, [customerID], (error, results) => {
    if (error) {
      console.error('Error fetching all Booking for current User:', error);
      res.status(500).json({error: 'Error fetching all Booking for current User:'});
      return;
    }
    console.log('All Booking for current User fetched successfully.');
    res.status(201).json(results);
  });
});



//Display movies
app.get('/movies', (req, res) => {
  const query = `
    SELECT f.FilmID,
           f.Titel,
           f.Beschreibung,
           f.Dauer,
           f.Altersfreigabe,
           f.Genre,
           f.Regisseur,
           f.Erscheinungsdatum,
           b.PfadGrossesBild,
           b.PfadMittleresBild,
           b.PfadKleinesBild,
           b.PfadTrailerVideo
    FROM Filme f
           LEFT JOIN Bilder b ON f.FilmID = b.FilmID`;

  con.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching films:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      console.log("Films fetched successfully:", results);
      res.json(results);
    }
  });
});

//Display Movie Details
app.post('/movieDetails', (req, res) => {
  const {movieID} = req.body;
  const query = `
    SELECT f.FilmID,
           f.Titel,
           f.Beschreibung,
           f.Dauer,
           f.Altersfreigabe,
           f.Genre,
           f.Regisseur,
           f.Erscheinungsdatum,
           b.PfadGrossesBild,
           b.PfadKleinesBild
    FROM Filme f
           LEFT JOIN Bilder b ON f.FilmID = b.FilmID
    WHERE f.FilmID = ?`;

  con.query(query, [movieID], function (error, results) {
    if (error) {
      console.error("Error fetching film:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      console.log("Film fetched successfully:", results[0]);
      res.json(results);
    }
  });
});

app.post('/seats', (req, res) => {
  const {eventID} = req.body;
  const query = `
    SELECT sp.SitzplatzID,
           sp.SaalID,
           sp.Reihennummer,
           sp.Sitznummer,
           sp.Sitztyp,
           IF(bt.SitzplatzID IS NOT NULL, 'Occupied', 'Free') AS Buchungsstatus
    FROM Sitzplaetze sp
           LEFT JOIN buchtTicket bt ON sp.SitzplatzID = bt.SitzplatzID AND bt.VorfuehrungsID = ?
    WHERE sp.SaalID = (SELECT SaalID FROM Vorfuehrungen WHERE VorfuehrungsID = ?)`;

  con.query(query, [eventID, eventID], function (error, results) {
    if (error) {
      console.error("Error fetching seats:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      if (results.length > 0) {
        console.log("Seats fetched successfully:", results);
        res.json(results);
      } else {
        console.error("Seats not found for event ID:", eventID);
        res.status(404).json({error: 'Seats not found'});
      }
    }
  });
});

app.post('/room', (req, res) => {
  const {eventID} = req.body;
  const query = `
    SELECT s.SaalID, s.Saalname, s.AnzahlSitzplaetze, s.Saaltyp
    FROM Saele s
    WHERE s.SaalID = (SELECT v.SaalID FROM Vorfuehrungen v WHERE v.VorfuehrungsID = ?)`;

  con.query(query, [eventID], (error, results) => {
    if (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      if (results.length > 0) {
        console.log("Room fetched successfully:", results);
        res.json(results);
      } else {
        console.error("Room not found for event ID:", eventID);
        res.status(404).json({error: 'Room not found'});
      }
    }
  });
});

app.post('/events', (req, res) => {
  const {movieID} = req.body;
  const query = `
    SELECT v.VorfuehrungsID, v.FilmID, v.SaalID, v.Vorfuehrungsdatum, v.Vorfuehrungszeit, s.Saalname, s.Saaltyp
    FROM Vorfuehrungen v
           JOIN Saele s ON v.SaalID = s.SaalID
    WHERE v.FilmID = ?`;

  con.query(query, [movieID], (error, results) => {
    if (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      console.log("Events fetched successfully:", results);
      res.json(results);
    }
  });
});

app.post('/event', (req, res) => {
  const {eventID} = req.body;
  const query = `
    SELECT v.VorfuehrungsID, v.FilmID, v.SaalID, v.Vorfuehrungsdatum, v.Vorfuehrungszeit, s.Saalname, s.Saaltyp
    FROM Vorfuehrungen v
           JOIN Saele s ON v.SaalID = s.SaalID
    WHERE v.VorfuehrungsID = ?`;

  con.query(query, [eventID], (error, results) => {
    if (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      console.log("Event fetched successfully:", results);
      res.json(results);
    }
  });
});

app.post('/tickets', (req, res) => {
  const {roomType} = req.body;
  const query = `SELECT t.TicketID, t.Saaltyp, t.Tickettyp, t.Sitztyp, t.PreisNetto, t.PreisBrutto
                 FROM Tickets t
                 WHERE t.Saaltyp = ?`;
  con.query(query, [roomType], (error, results) => {
    if (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      console.log("Tickets fetched successfully:", results);
      res.json(results);
    }
  });
});


app.post('/addBooking', (req, res) => {
  const {
    customerID,
    eventID,
    bookingDate,
    totalPriceNetto,
    totalPriceBrutto,
    counterTicketsAdult,
    counterTicketsChild,
    counterTicketsStudent
  } = req.body;

  const query = `
    INSERT INTO Buchung (KundenID, VorfuehrungsID, BuchungsDatum, GesamtPreisNetto, GesamtPreisBrutto,
                         AnzahlTicketsErwachsene, AnzahlTicketsKinder, AnzahlTicketsStudenten)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  con.query(query, [customerID, eventID, bookingDate, totalPriceNetto, totalPriceBrutto,
    counterTicketsAdult, counterTicketsChild, counterTicketsStudent], (error, results) => {
    if (error) {
      console.error('Error inserting booking:', error);
      res.status(500).json({error: error.message}); // Fehlermeldung an den Client senden
      return;
    }

    console.log('Inserted booking with ID:', results.insertId);
    res.status(201).json(results.insertId); // Erfolgreiche Antwort an den Client senden
  });
});


app.put('/bookSeats', (req, res) => {
  const {bookingID, customerID, eventID, seatID, ticketID} = req.body;

  const query = `
    INSERT INTO buchtTicket (BuchungsID, KundenID, VorfuehrungsID, SitzplatzID, TicketID)
    VALUES (?, ?, ?, ?, ?)
  `;

  con.query(query, [bookingID, customerID, eventID, seatID, ticketID], (error, results) => {
    if (error) {
      console.error('Error booking tickets:', error);
      res.status(500).json({error: 'Error booking tickets:'});
      return;
    }
    console.log('Tickets booked succesfully');
    res.status(201).json({message: 'Tickets booked succesfully', affectedRows: results.affectedRows});
  });
});


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cinemagic/browser/index.html'));
});

app.post('/booking', (req, res) => {
  const {bookingID} = req.body;
  console.log('ID :', bookingID);

  const query = `
    SELECT DISTINCT b.BuchungsID,
                    b.BuchungsDatum,
                    b.GesamtPreisNetto,
                    b.GesamtPreisBrutto,
                    b.AnzahlTicketsErwachsene,
                    b.AnzahlTicketsKinder,
                    b.AnzahlTicketsStudenten,
                    b.BuchungsStatus,
                    v.Vorfuehrungsdatum,
                    v.Vorfuehrungszeit,
                    f.Titel,
                    f.Dauer,
                    f.Altersfreigabe,
                    f.Genre,
                    s.Saalname,
                    s.Saaltyp
    FROM Buchung b
           JOIN Vorfuehrungen v ON b.VorfuehrungsID = v.VorfuehrungsID
           JOIN Saele s ON v.SaalID = s.SaalID
           JOIN Filme f ON v.FilmID = f.FilmID
    WHERE b.BuchungsID  = ?
`;
  console.log("Executing query with bookingID:", bookingID);
  con.query(query, [bookingID], (error, results) => {
    if (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({error: 'Error fetching booking:'});
      return;
    }
    console.log('Booking fetched succesfully');
    res.status(201).json(results);
  });
});

app.put('/updateBooking', (req, res) => {
  const {bookingID} = req.body;
  console.log('UPDATEID', bookingID);
  const query =
    `UPDATE Buchung
     SET BuchungsStatus = 'Canceled'
     WHERE BuchungsID = ?;
    `;

  con.query(query, [bookingID], (error, results) => {
    if (error) {
      console.error('Error updating Booking:', error);
      res.status(500).json({error: 'Error updating Booking:'});
      return;
    }
    console.log('Booking updated successful.', results);
    res.status(201).json(results);
  });
});

app.delete('/deleteBooking/:bookingID', (req, res) => {
  const bookingID = req.params.bookingID;
  console.log('Attempting to delete booking with ID:', bookingID);

  const query =
    `DELETE
     FROM buchtTicket
     WHERE BuchungsID = ?
    `;

  con.query(query, [bookingID], (error, results) => {
    if (error) {
      console.error('Error removing booked Seats:', error);
      res.status(500).json({error: 'Error removing booked Seats:'});
      return;
    }
    console.log('Booked Seats removing succesfully');
    res.status(201).json(results);
  });
});
app.post('/bookedSeats', (req, res) => {
  const {bookingID} = req.body;

  const query = `
    SELECT s.SitzplatzID,
           s.SaalID,
           s.Reihennummer,
           s.Sitznummer,
           s.Sitztyp,
           t.Saaltyp,
           t.Tickettyp,
           t.PreisNetto,
           t.PreisBrutto
    FROM buchtTicket bt
           JOIN Sitzplaetze s ON bt.SitzplatzID = s.SitzplatzID
           JOIN Tickets t ON bt.TicketID = t.TicketID
    WHERE bt.BuchungsID = ?;
  `;

  con.query(query, [bookingID], (error, results) => {
    if (error) {
      console.error('Error fetching booked Seats:', error);
      res.status(500).json({error: 'Error fetching booked Seats:'});
      return;
    }
    console.log('Booked Seats fetched succesfully');
    res.status(201).json(results);
  });
});

app.post('/allBooking', (req, res) => {
  const {customerID} = req.body;

  const query = `
    SELECT b.BuchungsID
    FROM Buchung b
    WHERE b.KundenID = ?
    ORDER BY b.BuchungsDatum DESC;
  `;

  con.query(query, [customerID], (error, results) => {
    if (error) {
      console.error('Error fetching all Booking for current User:', error);
      res.status(500).json({error: 'Error fetching all Booking for current User:'});
      return;
    }
    console.log('All Booking for current User fetched successful.');
    res.status(201).json(results);
  });
});

app.post('/rating', (req, res) => {
  const {customerID, movieID} = req.body;

  const query = `
    SELECT b.Bewertung
    FROM bewertet b
    WHERE b.KundenID = ?
      AND b.FilmID = ?;
  `;

  con.query(query, [customerID, movieID], (error, results) => {
    if (error) {
      console.error('Error fetching all Booking for current User:', error);
      res.status(500).json({error: 'Error fetching all Booking for current User:'});
      return;
    }
    console.log('All Booking for current User fetched successful.');
    res.status(201).json(results);
  });
});

app.post('/rate', (req, res) => {
  const {customerID, movieID, rating} = req.body;

  const query = `
    INSERT INTO bewertet (KundenID, FilmID, Bewertung)
    VALUES (?, ?, ?);
  `;

  con.query(query, [customerID], (error, results) => {
    if (error) {
      console.error('Error fetching all Booking for current User:', error);
      res.status(500).json({error: 'Error fetching all Booking for current User:'});
      return;
    }
    console.log('All Booking for current User fetched successful.');
    res.status(201).json(results);
  });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cinemagic/browser/index.html'));
});
