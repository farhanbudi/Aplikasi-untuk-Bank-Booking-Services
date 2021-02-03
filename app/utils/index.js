const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
require('dotenv').config();

exports.jwtToken = {
    createToken({ id, email }) {
        return jwt.sign(
            { userId: id, email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    },
    verifyToken(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '24h' })
        return decoded;
    }
};