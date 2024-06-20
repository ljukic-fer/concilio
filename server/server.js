const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config;
const { Pool } = require('pg');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

const uri = "mongodb+srv://leonjukic:ZMgtY1dSKfKOYUOr@conmancluster.iblophi.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=ConManCluster";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const pool = new Pool({
  user: "postgres",
  password: "Leonjukic12",
  host: "localhost",
  port: 5434,
  database: "ConMan"
});

const JWT_SECRET = "c079f84dd8e4daaad60e2c5b9ee8af47f37658c314ab755a9aaa2907581194b0"

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to decode JWT token and calculate remaining time
const trackTokenExpiration = (token) => {
  const decodedToken = jwt.decode(token);
  if (decodedToken && decodedToken.exp && decodedToken.exp >= Math.floor(Date.now() / 1000)) {
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = decodedToken.exp - currentTime;
    console.log(`Remaining time for token expiration: ${remainingTime} seconds`);
  } else {
    console.log('Invalid token or expiration time not found');
  }
};

//Verifying the login token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 

    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp <= currentTime) {
      return res.status(401).json({ error: 'Unauthorized: Token has expired' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

//GET COMMENTS endpoint
app.get('/comments', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('sample_mflix');
    const commentsCollection = database.collection('comments');

    const comments = await commentsCollection.find({}).limit(20).toArray();

    res.json(comments);
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

//Registration endpoint FOR MONGO
/* app.post('/register', async (req, res) => {
  try {
    // Validate user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, dob, role } = req.body;

    // Validate captcha
    //if (captcha !== 'your_generated_captcha') {
    //  return res.status(400).json({ error: 'Invalid captcha' });
    //} 

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connect to MongoDB and insert user data
    await client.connect();
    const database = client.db('authDB');
    const usersCollection = database.collection('users');
    const existingUser = await usersCollection.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = {
      firstName,
      lastName,
      email,
      hashedPassword,
      dob,
      role
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}); */


//REGISTER USER endpoint
app.post('/register', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, dob, role } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Insert new user into the database
    const newUserQuery = 'INSERT INTO users (firstname, lastname, email, hashedpassword, dob, role) VALUES ($1, $2, $3, $4, $5, $6)';
    await pool.query(newUserQuery, [firstName, lastName, email, hashedPassword, dob, role]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// LOG IN endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    console.log('Lozinka klijenta:');
    console.log(password)
    console.log('Lozinka u bazi:');
    console.log(user.hashedpassword)

    if (!user || !await bcrypt.compare(password, user.hashedpassword)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '30m' });


    const interval = setInterval(() => {
      trackTokenExpiration(token);
    }, 10000); // Log every 10 seconds

    setTimeout(() => {
      clearInterval(interval); // Stop logging after 1 hour
      console.log('Token expiration tracking stopped');
    }, 1800000); // Stop after 30 min

    res.json({ user, token });
    console.log(token)
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users');
    const users = result.rows;
    client.release();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//GET PROFILE endpoint
app.get('/profile', async (req, res) => {
  const token = req.headers.authorization;

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    } else {
      try {
        const email = decoded.email;

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // Check if user exists
        if (user.rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        const userProfile = {
          firstName: user.rows[0].firstname,
          lastName: user.rows[0].lastname,
          email: user.rows[0].email,
          dob: user.rows[0].dob,
          role: user.rows[0].role
        };

        res.json(userProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  });
});


// FETCH MESSAGES endpoint
app.get('/messages', async (req, res) => {
  const token = req.headers.authorization;

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    } else {
      try {
        const email = decoded.email;

        const result = await pool.query('SELECT * FROM messages WHERE sender=$1 OR receiver=$1 ORDER BY latest', [email]);
        const messages = result.rows;

        res.json(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  })
});


//FETCH CHAT DETAILS endpoint
app.get('/chat/:chatId', async (req, res) => {
  const chatId = req.params.chatId;
  const token = req.headers.authorization;

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    } else {
      try {
        const result = await pool.query('SELECT * FROM chat_info WHERE message_id=$1 ORDER BY time_sent DESC', [chatId]);
        const messages = result.rows;

        res.json(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  })
});


//REPLY TO CHAT endpoint
app.post('/reply', async (req, res) => {
  const { id, sender, receiver, body } = req.body;

  try {
    const result = await pool.query('INSERT INTO chat_info (message_id, body, sender, receiver) VALUES ($1, $2, $3, $4) RETURNING *', [id, body, sender, receiver]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting reply:', error);
    res.status(500).json({ error: 'An error occurred while inserting reply' });
  }
});

//NEW MESSAGE endpoint
app.post('/messages/new', async (req, res) => {
  const { sender, receiver, subject, body } = req.body;

  try {
    const messageResult = await pool.query('INSERT INTO messages (sender, receiver, subject, sender_read, receiver_read) VALUES ($1, $2, $3, $4, $5) RETURNING chat_id', [sender, receiver, subject, true, false]);
    const chatId = messageResult.rows[0].chat_id;

    const chatResult = await pool.query('INSERT INTO chat_info (message_id, body, sender, receiver) VALUES ($1, $2, $3, $4) RETURNING *', [chatId, body, sender, receiver]);

    res.json(chatResult.rows[0]);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'An error occurred while creating the message' });
  }
});


// FETCH CONFERENCES endpoint
app.get('/conferences', async (req, res) => {
  const token = req.headers.authorization;

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    } else {
      try {
        const email = decoded.email;

        // find conferences where the attendee is the logged-in user
        const result = await pool.query('SELECT * FROM conference WHERE coordinator = $1 OR $1 = ANY (attendees)', [email]);
        const conferences = result.rows;

        res.json(conferences);
      } catch (error) {
        console.error('Error fetching conferences:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  })
});

//FETCH INVITES endpoint
app.get('/invites', async (req, res) => {
  const token = req.headers.authorization;

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    } else {
      try {
        const email = decoded.email;

        // find conferences where the user is an invitee
        const result = await pool.query('SELECT * FROM conference WHERE $1 = ANY (invites)', [email]);
        const conferences = result.rows;

        res.json(conferences);
      } catch (error) {
        console.error('Error fetching conferences:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  })
});


// FETCH EVENTS endpoint
app.get('/conference/:conferenceId', async (req, res) => {
  const conferenceId = req.params.conferenceId;
  const token = req.headers.authorization;

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ error: 'Unauthorized' });
    } else {
      try {
        const result = await pool.query('SELECT * FROM event WHERE conference_id=$1', [conferenceId]);
        const conference_details = result.rows;

        res.json(conference_details);
      } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  })
});

//CREATE EVENT endpoint
app.post('/events', async (req, res) => {
  const { title, description, start_time, end_time, authors, venue, conference_id } = req.body;
  try {
      const newEvent = await pool.query(
          'INSERT INTO event (title, description, start_time, end_time, authors, venue, conference_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [title, description, start_time, end_time, authors, venue, conference_id]
      );
      res.json(newEvent.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

// DELETE event endpoint
app.delete('/events/:event_id', async (req, res) => {
  const { event_id } = req.params;
  try {
      await pool.query('DELETE FROM event WHERE event_id = $1', [event_id]);
      res.json({ message: 'Event deleted successfully!' });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

//FETCH CONFERENCE DETAILS endpoint
app.get('/attendees/:conference_id', async (req, res) => {
  const conferenceId = req.params.conference_id;

  try {
    const query = 'SELECT * FROM conference WHERE conference_id = $1';
    const result = await pool.query(query, [conferenceId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    const conferenceDetails = result.rows[0];

    res.status(200).json(conferenceDetails);
  } catch (error) {
    console.error('Error fetching conference details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//CHECK EMAIL endpoint for sending messages
app.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.status(200).json({ message: 'Email found' });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//UPLOAD FILES endpoint
app.post('/api/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const pdfData = req.file.buffer; // Binary data of the uploaded PDF
    const { conference_id, email, title } = req.body;

    if (!pdfData || !conference_id || !email || !title) {
      return res.status(400).send('Missing required fields');
    }

    const query = 'INSERT INTO files (conference_id, pdf_data, author, title) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [conference_id, pdfData, email, title]);

    res.status(200).json({ message: 'PDF uploaded successfully' });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//DOWNLOAD FILES endpoint
app.get('/api/download-pdf/:id', async (req, res) => {
  const fileId = req.params.id;

  try {
    const result = await pool.query('SELECT pdf_data FROM files WHERE file_id = $1', [fileId]);
    const file = result.rows[0];

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');

    res.send(file.pdf_data);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET APPROVED FILES endoint
app.get('/api/conference/:conference_id/approved-files', async (req, res) => {
  const { conference_id } = req.params;

  try {
    const files = await pool.query(
      'SELECT * FROM files WHERE conference_id = $1 AND approved = true',
      [conference_id]
    );

    if (files.rows.length === 0) {
      return res.status(404).send('No approved files found for this conference');
    }

    res.json(files.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// GET PENDING FILES endoint
app.get('/api/conference/:conference_id/pending-files', async (req, res) => {
  const { conference_id } = req.params;

  try {
    const files = await pool.query(
      'SELECT * FROM files WHERE conference_id = $1 AND approved = false',
      [conference_id]
    );

    if (files.rows.length === 0) {
      return res.status(404).send('No pending files found for this conference');
    }

    res.json(files.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


//APPROVE FILE endpoint
app.post('/api/approve-file/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const result = await pool.query('UPDATE files SET approved = true WHERE file_id = $1 RETURNING *', [fileId]);

    if (result.rowCount === 0) {
      return res.status(404).send('File not found');
    }

    res.status(200).send({ message: 'File approved successfully!', file: result.rows[0] });
  } catch (error) {
    console.error('Error approving file:', error);
    res.status(500).send('Internal Server Error');
  }
});


//CREATE NEW CONFERENCE endpoint
app.post('/conferences/new', async (req, res) => {
  const { title, description, coordinator, start_time, end_time, invitees } = req.body;

  try {
    const messageResult = await pool.query('INSERT INTO conference (title, description, coordinator, start_time, end_time, attendees, invites) VALUES ($1, $2, $3, $4, $5, $6, $7)', [title, description, coordinator, start_time, end_time, [], invitees]);
    res.status(200).json({ message: 'Conference created successfully' });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'An error occurred while creating the message' });
  }
});


//REMOVE PARTICIPANT endpoint
app.delete('/conference/:id/attendees', async (req, res) => {
  const conferenceId = req.params.id;
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT attendees FROM conference WHERE conference_id = $1', [conferenceId]);
    const conference = result.rows[0];

    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    // Remove the attendee from the list
    const updatedAttendees = conference.attendees.filter(attendee => attendee !== email);

    // Update the conference with the new list of attendees
    await pool.query('UPDATE conference SET attendees = $1 WHERE conference_id = $2', [updatedAttendees, conferenceId]);

    res.status(200).json({ message: 'Attendee removed successfully' });
  } catch (error) {
    console.error('Error removing attendee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//SEND INVITES endpoint
app.post('/conference/:id/invites', async (req, res) => {
  const conferenceId = req.params.id;
  const { emails } = req.body;
  try {
    // Check if provided emails exists
    const emailQueryResult = await pool.query('SELECT email FROM users WHERE email = ANY($1)', [emails]);
    const foundEmails = emailQueryResult.rows.map(row => row.email);
    
    const missingEmails = emails.filter(email => !foundEmails.includes(email));
    
    if (missingEmails.length > 0) {
      return res.status(400).json({ error: 'Some emails are not registered users', missingEmails });
    }

    const result = await pool.query('SELECT invites, attendees FROM conference WHERE conference_id = $1', [conferenceId]);
    const conference = result.rows[0];
    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    let currentInvites = conference.invites || [];
    let currentAttendees = conference.attendees || [];

    if (!Array.isArray(currentInvites)) {
      currentInvites = [];
    }

    if (!Array.isArray(currentAttendees)) {
      currentAttendees = [];
    }

    //Check if the user is already attending
    const alreadyAttendees = emails.filter(email => currentAttendees.includes(email));
    if (alreadyAttendees.length > 0) {
      return res.status(400).json({ error: 'Some users are already attending', alreadyAttendees });
    }

    const updatedInvites = [...currentInvites, ...emails];
    await pool.query('UPDATE conference SET invites = $1 WHERE conference_id = $2', [updatedInvites, conferenceId]);
    res.status(200).json({ message: 'Invites sent successfully' });
  } catch (error) {
    console.error('Error sending invites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//ACCEPT INVITE endpoint
app.post('/attend-conference', async (req, res) => {
  const { email, conference_id } = req.body;

  try {
    // Update attendees array and remove from invites array
    const updateQuery = `
      UPDATE conference SET attendees = array_append(attendees, $1), invites = array_remove(invites, $1)
      WHERE conference_id = $2
    `;
    await pool.query(updateQuery, [email, conference_id]);

    res.status(200).json({ message: 'Successfully joined the conference' });
  } catch (error) {
    console.error('Error updating conference:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//GET REVIEW_GRADE endpoint
app.get('/api/reviews/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  try {
      const reviews = await pool.query('SELECT review_grade FROM reviews WHERE file_id = $1', [fileId]);
      const totalGrades = reviews.rows.reduce((sum, review) => sum + review.review_grade, 0);
      const averageGrade = reviews.rows.length ? totalGrades / reviews.rows.length : 0;
      res.json({ averageGrade });
  } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).send('Server error');
  }
});


//GET REVIEWS endpoint
app.get('/reviews/:fileId', async (req, res) => {
  const { fileId } = req.params;
  try {
    const reviews = await pool.query('SELECT * FROM reviews WHERE file_id = $1', [fileId]);
    res.json({ reviews: reviews.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


//ADD REVIEW endpoint
app.post('/insert_review', async (req, res) => {
  const { file_id, reviewer, review_body, review_grade } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reviews (file_id, reviewer, review_body, review_grade) VALUES ($1, $2, $3, $4) RETURNING *',
      [file_id, reviewer, review_body, review_grade]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


//GET USERS endpoint
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE role>1');

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'users not found' });
    }

    const users = result.rows;

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//GET REGULAR USERS endpoint
app.get('/regulars', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE role=3');

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'users not found' });
    }

    const users = result.rows;

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//GET COORDINATORS endpoint
app.get('/coordinators', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE role=2');

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'users not found' });
    }

    const users = result.rows;

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//DELETE USER endpoint
app.delete('/delete_user', async (req, res) => {
  const { email } = req.body;
  console.log('Mail za brisanje: ' + email)
  try {
    const result = await pool.query('DELETE FROM users WHERE email=$1', [email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//GRANT ACCESS endpoint
app.post('/grant-access/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const result = await pool.query('UPDATE users SET role = 2 WHERE email = $1 RETURNING *', [email]);

    if (result.rowCount === 0) {
      return res.status(404).send('USER NOT FOUND!');
    }

    res.status(200).send({ message: 'User granted access successfully!' });
  } catch (error) {
    console.error('Error granting access:', error);
    res.status(500).send('Internal Server Error');
  }
});


//REVOKE ACCESS endpoint
app.post('/revoke-access/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const result = await pool.query('UPDATE users SET role = 3 WHERE email = $1 RETURNING *', [email]);

    if (result.rowCount === 0) {
      return res.status(404).send('USER NOT FOUND!');
    }

    res.status(200).send({ message: 'User revoked access successfully!' });
  } catch (error) {
    console.error('Error revoking access:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});