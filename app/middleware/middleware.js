require('dotenv').config()
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/error');
const db = require('../models')
const User = db.users;

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorResponse('Anda tidak punya akses ke halaman ini!', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findByPk(decoded.userId);

        next();
    } catch (err) {
        return next(new ErrorResponse('Anda tidak punya akses ke halaman ini!', 401));
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} tidak punya akses ke halaman ini!`,
                    403
                )
            );
        }
        next();
    };
};
