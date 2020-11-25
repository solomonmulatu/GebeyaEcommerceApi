const bodyParser = require('body-parser');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();


// Init Middleware
app.use(cors(), express.json({extended: false})
);

app.use(express.static('public'));

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).redirect('/500.html');
})
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', (req, res) => res.send('API Running'));

// Define Routes
// aman routes started here
app.use('/api/users', require('./routes/api/user'));

// Capture All 404 errors
app.use(function (req, res, next) {
    res.status(404).redirect('/404.html');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
