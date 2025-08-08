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

const allowedOrigins = [
    'http://localhost:5173', // local dev
    'https://text-to-speech-frontend-lywk.onrender.com', // deployed frontend
];


app.use(cors({
    // origin: process.env.FRONT_APP_URI,
    origin: function (origin, callback) {
        // allow requests with no origin (like curl or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },

    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies to be sent

}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


//code for Google Auth Login
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    rolling: false, // refresh expiration on every request
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 Hour
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    }
}));


app.use(passport.initialize());
app.use(passport.session());

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Session expired' });
}


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use("/api", ensureAuth, routes);


app.get('/api/me', (req, res) => {
    // Disable caching for this endpoint
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    if (req.isAuthenticated()) {
        return res.status(200).json({ user: req.user });
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
});



app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);



app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful login
        res.redirect(`${process.env.FRONT_APP_URI}/dashboard`); // frontend URL
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



app.get('/logout', (req, res) => {
    req.logout(() => {
        return res.json({ message: "Successfully Logged Out." });
    });
});


const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const database = process.env.MONGODB_DATABASE;

const uri = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;  // For Live Database
mongoose.connect(uri, {
    //useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => console.log("DB Connected"))
    .catch(err => {
        console.error("Connection error", err);
    });


// mongoose.connect(process.env.MONGO_URI, {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
// })
//     .then(() => console.log('Database Successfully connected.'))
//     .catch((error) => console.error('Database Not connected : ', error));


const port = process.env.port || 3000;
app.listen(port, () => console.log(`App Listening on Port http://localhost:${port}`))
