const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

// Initialize the app
const app = express();
app.use(cors());
app.use(express.json());

// Set up file upload destination
const upload = multer({ dest: 'uploads/' });

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sabeer20",
  database: "internship_form"
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database");
});

// POST endpoint to handle form submission
app.post('/formdetails', upload.fields([{ name: 'aadhar' }, { name: 'resume' }]), (req, res) => {
  const {
    firstName,
    lastName,
    email,
    universityName,
    universityRegNumber,
    course,
    stream,
    semester,
    dob,
    gender,
    mobileNo,
    fatherNo,
    domainsInterested,
    skillsKnown,
    haslaptop,
    acknowledgement
  } = req.body;

  // Read files from the request
  const aadharFile = req.files['aadhar'] ? req.files['aadhar'][0] : null;
  const resumeFile = req.files['resume'] ? req.files['resume'][0] : null;

  // Read file data as binary (BLOB)
  const aadharData = aadharFile ? fs.readFileSync(aadharFile.path) : null;
  const resumeData = resumeFile ? fs.readFileSync(resumeFile.path) : null;

  // SQL query to insert form data into the database
  const query = `
    INSERT INTO userForm (
      firstName, lastName, email, universityName, universityRegNumber,
      course, stream, semester, dob, gender, mobileNo, fatherNo,
      aadhar, domainsInterested, skillsKnown, resume,haslaptop, acknowledgement
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  db.query(query, [
    firstName, lastName, email, universityName, universityRegNumber,
    course, stream, semester, dob, gender, mobileNo, fatherNo,
    aadharData, domainsInterested, skillsKnown, resumeData,haslaptop, acknowledgement
  ], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Form submitted successfully" });
  });
});

// Start the server
app.listen(8082, () => {
  console.log("Server running on port 8081...");
});
