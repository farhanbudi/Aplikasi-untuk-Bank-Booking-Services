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
    createTokenEmail({ id, email }) {
        return jwt.sign(
            { userId: id, email },
            process.env.JWT_SECRET
        );
    },
    verifyToken(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '24h' })
        return decoded;
    }
};
exports.comparePassword = (password, hash) => bcrypt.compare(password, hash);

exports.kirimEmail = dataEmail => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'andrewhardianto8192@gmail.com',
            pass: 'jsqhehchdnnywlvh',
        },
    });
    return (
        transporter.sendMail(dataEmail)
            .then(info => console.log(`Email Terkirim: ${info.message}`))
            .catch(err => console.log(`Terjadi kesalahan: ${err}`))
    )
}