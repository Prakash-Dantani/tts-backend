const express = require('express');
const cors = require('cors');
const routes = require('./routes/index.js');
const { mongoose } = require('mongoose');
require('dotenv').config({ path: '.env.development' });

const app = express();

app.use(express.json())
app.use("/api", routes);

app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => console.log('Database Successfully connected.'))
    .catch((error) => console.error('Database Not connected : ', error));


const port = process.env.port || 3000;
app.listen(port, () => console.log(`App Listening on Port http://localhost:${port}`))