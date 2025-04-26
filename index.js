const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.js');
const { mongoose } = require('mongoose');
require('dotenv').config({ path: '.env.development' });
const passport = require("passport");
const session = require("express-session");

require("./controllers/passport.js"); // config below
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // your client ID


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
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,  // Use only on HTTPS
        sameSite: 'lax', // Allow cross-origin cookies
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

// Add this POST route:
app.post('/auth/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // your client id
        });

        const payload = ticket.getPayload();
        console.log('Google Payload:', payload);

        req.session.user = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
        };

        res.status(200).json(req.session.user);
    } catch (error) {
        console.error('Error verifying Google token', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});


app.get('/api/me', (req, res) => {
    if (req.isAuthenticated()) {
        return res.json({ user: req.user });
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
});




app.get('/logout', (req, res) => {
    req.logout(() => {
        return res.json({ message: "Successfully Logged Out." });
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