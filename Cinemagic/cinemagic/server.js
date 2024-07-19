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
  secret: 'c1n3m4g1c', resave: false, saveUninitialized: true, cookie: {secure: false}
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


io.on('connection', (socket) => {
  console.log('WebSocket: Client connected', socket.id);

  setInterval(() => {
    io.emit('reservedSeats', reservedSeats);
  }, 1000);

  socket.on('reserveSeat', ({seat, eventID}) => {
    reservedSeats.push({seat: {...seat}, id: socket.id, eventID: eventID});
    io.emit('reservedSeats', reservedSeats);
    console.log('WebSocket: Reserved Seats: ', reservedSeats);
  });

  socket.on('releaseSeat', ({seat, eventID, isBooked}) => {
    const seatIndex = reservedSeats.findIndex(s =>
      s.id === socket.id &&
      s.seat.seatType === seat.seatType &&
      s.seat.rowNumber === seat.rowNumber &&
      s.seat.seatNumber === seat.seatNumber &&
      s.eventID === eventID);
    if (seatIndex !== -1) {
      reservedSeats[seatIndex].seat.isBooked = isBooked;
      socket.broadcast.emit('seatReleased', reservedSeats[seatIndex]);
      reservedSeats.splice(seatIndex, 1);
      io.emit('reservedSeats', reservedSeats);
    } else {
      console.error('WebSocket: Seat not found in reservedSeats: ', seat, eventID);
    }
  });

  socket.on('counterValue', ({personType, eventID}) => {
    let count = 0
    reservedSeats.forEach(s => {
      if (s.id === socket.id && s.seat.personType === personType && s.eventID === eventID) {
        count++;
      }
    });
    socket.emit(personType + 'Counter', count, eventID);
  });

  socket.on('updateSeat', ({seat, eventID}) => {
    const existingSeatIndex = reservedSeats.findIndex(s =>
      s.id === socket.id &&
      s.seat.rowNumber === seat.rowNumber &&
      s.seat.seatNumber === seat.seatNumber &&
      s.eventID === eventID);
    if (existingSeatIndex !== -1) {
      reservedSeats[existingSeatIndex] = {seat: {...seat}, id: socket.id, eventID: eventID};
      io.emit('reservedSeats', reservedSeats);
    } else {
      console.error('WebSocket: Seat not found in reservedSeats:', seat, eventID);
    }
  });

  socket.on('disconnect', () => {
    console.log('WebSocket: Client disconnected');
    for (let i = reservedSeats.length - 1; i >= 0; i--) {
      if (reservedSeats[i].id === socket.id) {
        reservedSeats[i].seat.isBooked = false;
        socket.broadcast.emit('seatReleased', reservedSeats[i]);
        reservedSeats.splice(i, 1);
        io.emit('reservedSeats', reservedSeats);
      } else {
        console.error('WebSocket: Seat not found in reservedSeats:', reservedSeats[i]);
      }
    }
  });
});

// Routes

// Login endpoint
app.post('/api/login', (req, res) => {
  const {email, password} = req.body;
  const query = `
    SELECT k.KundenID      AS customerID,
           k.Email         AS email,
           k.Telefonnummer AS phoneNumber,
           k.Passwort      AS password,
           k.Vorname       AS firstName,
           k.Nachname      AS lastName
    FROM Kunden k
    WHERE Email = ?
      AND Passwort = ?`;

  con.query(query, [email, password], function (error, results) {
    if (error) throw error;

    if (results.length > 0) {
      res.send({status: 'success', message: 'Login successful as Kunde', data: results[0]});
    } else {
      res.send({status: 'fail', message: 'Invalid email or password'});
    }
  });
});

// Create a new Customer
app.post('/api/register', (req, res) => {
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

// Update Customer Data
app.put('/api/user/update', (req, res) => {
  const {customerID, Vorname, Nachname, Email, Telefonnummer} = req.body;

  let query = 'UPDATE Kunden SET';
  const fields = [];
  const values = [];

  if (Vorname) {
    fields.push('Vorname = ?');
    values.push(Vorname);
  }
  if (Nachname) {
    fields.push('Nachname = ?');
    values.push(Nachname);
  }
  if (Email) {
    fields.push('Email = ?');
    values.push(Email);
  }
  if (Telefonnummer) {
    fields.push('Telefonnummer = ?');
    values.push(Telefonnummer);
  }

  if (fields.length === 0) {
    res.status(400).json({status: 'fail', message: 'No fields to update'});
    return;
  }

  query += ` ${fields.join(', ')} WHERE KundenID = ?`;
  values.push(customerID);

  con.query(query, values, (error, results) => {
    if (error) {
      console.error('Error updating customer data:', error);
      res.status(500).json({status: 'error', message: 'Error updating customer data'});
      return;
    }
    if(results) {
      res.status(200).json({status: 'success', message: 'Customer data updated successfully'});
    }
  });
});

// Change User Password
app.put('/api/user/change-password', (req, res) => {
  const {customerID, oldPassword, newPassword} = req.body;

  const verifyQuery = 'SELECT Passwort FROM Kunden WHERE KundenID = ?';

  con.query(verifyQuery, [customerID], (verifyError, verifyResults) => {
    if (verifyError) {
      console.error('Error verifying old password:', verifyError);
      res.status(500).json({status: 'error', message: 'Error verifying old password'});
      return;
    }

    if (verifyResults[0].Passwort !== oldPassword) {
      res.status(400).json({status: 'fail', message: 'Old password is incorrect'});
      return;
    }

    const updateQuery = 'UPDATE Kunden SET Passwort = ? WHERE KundenID = ?';
    con.query(updateQuery, [newPassword, customerID], (updateError, updateResults) => {
      if (updateError) {
        console.error('Error updating password:', updateError);
        res.status(500).json({status: 'error', message: 'Error updating password'});
        return;
      }
      if (updateResults) {
        res.status(200).json({status: 'success', message: 'Password updated successfully'});
      }
    });
  });
});

// Fetch User-Data
app.post('/api/user', (req, res) => {
  const {customerID} = req.body;
  const query = `
    SELECT k.KundenID      AS customerID,
           k.Email         AS email,
           k.Telefonnummer AS phoneNumber,
           k.Passwort      AS password,
           k.Vorname       AS firstName,
           k.Nachname      AS lastName
    FROM Kunden k
    WHERE KundenID = ?`;

  con.query(query, [customerID], function (error, results) {
    if (error) {
      console.error('Error fetching User-Data:', error);
      res.status(500).json({error: 'Database query error'});
    } else {
      if (results.length > 0) {
        console.log('User-Data fetched successfully:', results[0]);
        res.status(200).json(results[0]);
      } else {
        console.error('User-Data not found for customer ID:', customerID);
        res.status(404).json({error: 'User-Data not found not found'});
      }
    }
  });
});

// Display Movies
app.get('/api/movies', (req, res) => {
  const query = `
    SELECT f.FilmID            AS movieID,
           f.Titel             AS movieName,
           f.Beschreibung      AS movieDescription,
           f.Dauer             AS duaration,
           f.Altersfreigabe    AS age,
           f.Genre             AS genre,
           f.Regisseur         AS regisseur,
           f.Erscheinungsdatum AS releaseDate,
           f.Gesamtbewertung   AS overallRating,
           f.AnzahlBewertungen AS numberRatings,
           b.PfadGrossesBild   AS pathPictureLarge,
           b.PfadMittleresBild AS pathPictureMiddle,
           b.PfadKleinesBild   AS pathPictureSmall,
           b.PfadTrailerVideo  AS pathTrailerVideo
    FROM Filme f
           LEFT JOIN Bilder b ON f.FilmID = b.FilmID`;

  con.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching films:', error);
      res.status(500).json({error: 'Database query error'});
    } else {
      console.log('Films fetched successfully:', results);
      res.json(results);
    }
  });
});

//Display Movie Details
app.post('/api/movie', (req, res) => {
  const {movieID} = req.body;
  const query = `
    SELECT f.FilmID            AS movieID,
           f.Titel             AS movieName,
           f.Beschreibung      AS movieDescription,
           f.Dauer             AS duaration,
           f.Altersfreigabe    AS age,
           f.Genre             AS genre,
           f.Regisseur         AS regisseur,
           f.Erscheinungsdatum AS releaseDate,
           f.Gesamtbewertung   AS overallRating,
           f.AnzahlBewertungen AS numberRatings,
           b.PfadGrossesBild   AS pathPictureLarge,
           b.PfadMittleresBild AS pathPictureMiddle,
           b.PfadKleinesBild   AS pathPictureSmall,
           b.PfadTrailerVideo  AS pathTrailerVideo
    FROM Filme f
           LEFT JOIN Bilder b ON f.FilmID = b.FilmID
    WHERE f.FilmID = ?`;

  con.query(query, [movieID], function (error, results) {
    if (error) {
      console.error("Error fetching film:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      console.log("Film fetched successfully:", results[0]);
      res.status(200).json(results[0]);
    }
  });
});

// Fetch Seats
app.post('/api/seats', (req, res) => {
  const {eventID} = req.body;
  const query = `
    SELECT sp.SitzplatzID                                     AS seatID,
           sp.SaalID                                          AS roomID,
           sp.Reihennummer                                    AS rowNumber,
           sp.Sitznummer                                      AS seatNumber,
           sp.Sitztyp                                         AS seatType,
           IF(bt.SitzplatzID IS NOT NULL, 'Occupied', 'Free') AS bookingStatus
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
        res.status(200).json(results);
      } else {
        console.error("Seats not found for event ID:", eventID);
        res.status(404).json({error: 'Seats not found'});
      }
    }
  });

});

// Fetch Room
app.post('/api/room', (req, res) => {
  const {eventID} = req.body;
  const query = `
    SELECT s.SaalID            AS roomID,
           s.Saalname          AS roomName,
           s.AnzahlSitzplaetze AS roomCapacity,
           s.Saaltyp           AS roomType
    FROM Saele s
    WHERE s.SaalID = (SELECT v.SaalID FROM Vorfuehrungen v WHERE v.VorfuehrungsID = ?)`;

  con.query(query, [eventID], (error, results) => {
    if (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      if (results.length > 0) {
        console.log("Room fetched successfully:", results[0]);
        res.json(results[0]);
      } else {
        console.error("Room not found for event ID:", eventID);
        res.status(404).json({error: 'Room not found'});
      }
    }
  });
});

// Fetch Events
app.post('/api/events', (req, res) => {
  const {movieID} = req.body;
  const query = `
    SELECT v.VorfuehrungsID    AS eventID,
           v.FilmID            AS movieID,
           v.SaalID            AS roomID,
           v.Vorfuehrungsdatum AS eventDate,
           v.Vorfuehrungszeit  AS eventTime,
           s.Saalname          AS roomName,
           s.Saaltyp           AS roomType
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

// Fetch Event Details
app.post('/api/event', (req, res) => {
  const {eventID} = req.body;
  const query = `
    SELECT v.VorfuehrungsID    AS eventID,
           v.FilmID            AS movieID,
           v.SaalID            AS roomID,
           v.Vorfuehrungsdatum AS eventDate,
           v.Vorfuehrungszeit  AS eventTime,
           s.Saalname          AS roomName,
           s.Saaltyp           AS roomType
    FROM Vorfuehrungen v
           JOIN Saele s ON v.SaalID = s.SaalID
    WHERE v.VorfuehrungsID = ?`;

  con.query(query, [eventID], (error, results) => {
    if (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      console.log("Event fetched successfully:", results[0]);
      res.json(results[0]);
    }
  });
});

// Fetch Tickets
app.post('/api/tickets', (req, res) => {
  const {roomType} = req.body;
  const query = `
    SELECT t.TicketID    AS ticketID,
           t.Saaltyp     AS roomType,
           t.Tickettyp   AS personType,
           t.Sitztyp     AS seatType,
           t.PreisNetto  AS priceNetto,
           t.PreisBrutto AS priceBrutto
    FROM Tickets t
    WHERE t.Saaltyp = ?`;
  con.query(query, [roomType], (error, results) => {
    if (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({error: 'Database query error'});
    } else {
      console.log("Tickets fetched successfully:", results);
      res.status(200).json(results);
    }
  });
});

// Add Booking
app.post('/api/add-booking', (req, res) => {
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

  con.query(query, [customerID, eventID, bookingDate, totalPriceNetto, totalPriceBrutto, counterTicketsAdult, counterTicketsChild, counterTicketsStudent], (error, results) => {
    if (error) {
      console.error('Error inserting booking:', error);
      res.status(500).json({error: error.message}); // Fehlermeldung an den Client senden
      return;
    }

    console.log('Inserted booking with ID:', results.insertId);
    res.status(201).json(results.insertId); // Erfolgreiche Antwort an den Client senden
  });
});

// Add Tickets
app.put('/api/add-booking-tickets', (req, res) => {
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

// Fetch Booking
app.post('/api/booking', (req, res) => {
  const {bookingID} = req.body;

  const query = `
    SELECT DISTINCT b.BuchungsID              AS bookingID,
                    b.BuchungsDatum           AS bookingDate,
                    b.GesamtPreisNetto        AS totalPriceNetto,
                    b.GesamtPreisBrutto       AS totalPriceBrutto,
                    b.AnzahlTicketsErwachsene AS counterTicketsAdult,
                    b.AnzahlTicketsKinder     AS counterTicketsChild,
                    b.AnzahlTicketsStudenten  AS counterTicketsStudent,
                    b.BuchungsStatus          AS bookingStatus,
                    v.Vorfuehrungsdatum       AS eventDate,
                    v.Vorfuehrungszeit        AS eventTime,
                    f.FilmID                  AS movieID,
                    f.Titel                   AS movieName,
                    f.Dauer                   AS duration,
                    f.Altersfreigabe          AS age,
                    f.Genre                   AS genre,
                    s.Saalname                AS roomName,
                    s.Saaltyp                 AS roomType
    FROM Buchung b
           JOIN Vorfuehrungen v ON b.VorfuehrungsID = v.VorfuehrungsID
           JOIN Saele s ON v.SaalID = s.SaalID
           JOIN Filme f ON v.FilmID = f.FilmID
    WHERE b.BuchungsID = ?
  `;

  con.query(query, [bookingID], (error, results) => {
    if (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({error: 'Error fetching booking:'});
      return;
    }
    console.log('Booking fetched succesfully');
    res.status(201).json(results[0]);
  });
});

// Update Booking
app.put('/api/update-booking', (req, res) => {
  const {bookingID} = req.body;
  console.log('UPDATEID', bookingID);
  const query = `UPDATE Buchung
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

// Cancel Booking
app.delete('/api/delete-booking/:bookingID', (req, res) => {
  const bookingID = req.params.bookingID;

  const query = `DELETE
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

//Fetch booked Tickets
app.post('/api/booked-tickets', (req, res) => {
  const {bookingID} = req.body;

  const query = `
    SELECT s.SitzplatzID  AS seatID,
           s.SaalID       AS roomID,
           s.Reihennummer AS rowNumber,
           s.Sitznummer   AS seatNumber,
           s.Sitztyp      AS seatType,
           t.Saaltyp      AS roomType,
           t.Tickettyp    AS personType,
           t.PreisNetto   AS priceNetto,
           t.PreisBrutto  AS priceBrutto
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
    console.log('Booked Seats fetched succesfully', results);
    res.status(201).json(results);
  });
});

// Fetch Bookings
app.post('/api/bookings', (req, res) => {
  const {customerID} = req.body;

  const query = `
    SELECT b.BuchungsID              AS bookingID,
           b.BuchungsDatum           AS bookingDate,
           b.GesamtPreisNetto        AS totalPriceNetto,
           b.GesamtPreisBrutto       AS totalPriceBrutto,
           b.AnzahlTicketsErwachsene AS counterTicketsAdult,
           b.AnzahlTicketsKinder     AS counterTicketsChild,
           b.AnzahlTicketsStudenten  AS counterTicketsStudent,
           b.BuchungsStatus          AS bookingStatus,
           v.Vorfuehrungsdatum       AS eventDate,
           v.Vorfuehrungszeit        AS eventTime,
           f.FilmID                  AS movieID,
           f.Titel                   AS movieName,
           f.Dauer                   AS duration,
           f.Altersfreigabe          AS age,
           f.Genre                   AS genre,
           s.Saalname                AS roomName,
           s.Saaltyp                 AS roomType
    FROM Buchung b
           JOIN Vorfuehrungen v ON b.VorfuehrungsID = v.VorfuehrungsID
           JOIN Saele s ON v.SaalID = s.SaalID
           JOIN Filme f ON v.FilmID = f.FilmID
    WHERE b.KundenID = ?
    ORDER BY b.BuchungsID DESC;
  `;

  con.query(query, [customerID], (error, results) => {
    if (error) {
      console.error('Error fetching all Booking for current User:', error);
      res.status(500).json({error: 'Error fetching all Booking for current User:'});
      return;
    }
    console.log('All Booking for current User fetched successful.', results);
    res.status(201).json(results);
  });
});

// Fetch Rating
app.post('/api/rating', (req, res) => {
  const {bookingID, movieID} = req.body;

  const query = `
    SELECT b.Bewertung AS rating
    FROM bewertet b
    WHERE b.BuchungsID = ?
      AND b.FilmID = ?;
  `;

  con.query(query, [bookingID, movieID], (error, results) => {
    if (error) {
      console.error('Error fetching Rating:', error);
      res.status(500).json({error: 'Error fetching Rating: '});
      return;
    }
    console.log('Rating fetched successful.', results);
    res.status(201).json(results[0]);
  });
});

// Add Rating
app.put('/api/add-rating', (req, res) => {
  const {bookingID, movieID, rating} = req.body;
  const query = `
    INSERT INTO bewertet (BuchungsID, FilmID, Bewertung)
    VALUES (?, ?, ?);
  `;

  con.query(query, [bookingID, movieID, rating], (error, results) => {
    if (error) {
      console.error('Error adding rating:', error);
      res.status(500).json({error: 'Error adding rating:'});
      return;
    }
    console.log('Adding Rating successful.');
    res.status(201).json(results);
  });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cinemagic/browser/index.html'));
});
