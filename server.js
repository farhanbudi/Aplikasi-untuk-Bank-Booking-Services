require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')

// Database
const db = require('./app/models');

// Sync database
db.sequelize.sync();

const app = express();

// cors
app.use(cors());

app.use(morgan('dev'));
// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes Login/Logout
app.use('/auth', require('./app/routes/auth'));
// Routes Bpba
app.use('/bpba', require('./app/routes/user'));
app.use('/bpba', require('./app/routes/tempat'));
// Routes pbam
app.use('/pbam', require('./app/routes/cuti'));
app.use('/pbam', require('./app/routes/pertemuan_pbam'));
app.use('/pbam', require('./app/routes/report'));
app.use('/pbam', require('./app/routes/user'));
app.use('/pbam', require('./app/routes/tempat2pba'));
app.use('/pbam', require('./app/routes/user_pba'));
// Routes pcu
app.use('/pcu', require('./app/routes/pertemuan_pcu'));
// Routes pba
app.use('/pba', require('./app/routes/pertemuan_pba'));

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app