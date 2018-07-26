const csrf = require('csurf')();

/**
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
module.exports = (req, res, next) => {
    // Skip CSRF on requests with explicit Authorization header
    if (req.header('authorization')) {
        next();
    } else {
        csrf(req, res, next);
    }
};
