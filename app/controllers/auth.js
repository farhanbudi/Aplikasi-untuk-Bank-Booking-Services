require('dotenv').config();
const db = require('../models')
const User = db.users;
const bcrypt = require('bcryptjs')
const utils = require('../utils');

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user && utils.comparePassword(password, user.password)) {
            const { nama, id, role } = user;
            const token = utils.jwtToken.createToken(user);
            return res.status(200).send({ token, user: { id, nama, email, role } });
        }
        return res.status(401).send({ error: 'email/password salah' });
    } catch (e) {
        return next(new Error(e));
    }
}

exports.logoutUser = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    })
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) {
        return res.status(400).json({
            message: `User dengan email ${email} tidak ada`
        })
    }

    const token = utils.jwtToken.createTokenEmail(user);
    await user.update({ resetPassword: token }, {
        where: { email }
    })

    const templateEmail = {
        from: 'BRI Booking Service',
        to: email,
        subject: 'Permintaan Reset Password',
        html: `<h5>Permintaan Rest Password</h5> </br>
               <p>Silahkan klik link dibawah untuk mereset password anda</p>
               <p>${process.env.LINK}/auth/resetpassword/${token}</p>`
    }
    utils.kirimEmail(templateEmail)
    return res.status(200).json({
        message: 'Email berhasil di kirim'
    })
}

exports.resetPassword = async (req, res, next) => {
    const { token, password } = req.body
    const user = await User.findOne({ where: { resetPassword: token } })
    if (user) {
        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword
        await user.save()
        return res.status(201).json({
            message: 'Password berhasil di ganti'
        })
    }
    next()
}