const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.js');
const { mongoose } = require('mongoose');
require('dotenv').config({ path: '.env.development' });
const passport = require("passport");
const session = require("express-session");

require("./controllers/passport.js"); // config below


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies to be sent

}));
app.use(express.json());


//code for Google Auth Login
app.use(session({
    secret: "secret", resave: false, saveUninitialized: true,
    cookie: {
        // expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expires in 1 day from now
        // maxAge: 1000 * 60 * 60 * 24 // Set the session to expire in 24 hours
        maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false  // Set 'secure: true' for HTTPS

    }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use("/api", routes);

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful login
        res.redirect('http://localhost:5173/'); // frontend URL
    }
);

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});


mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => console.log('Database Successfully connected.'))
    .catch((error) => console.error('Database Not connected : ', error));


const port = process.env.port || 3000;
app.listen(port, () => console.log(`App Listening on Port http://localhost:${port}`))