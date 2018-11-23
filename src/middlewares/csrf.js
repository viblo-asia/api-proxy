import csurf from 'csurf';

const csrf = csurf();

/**
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export default (req, res, next) => {
    // Skip CSRF on requests with explicit Authorization header
    if (req.header('authorization')) {
        next();
    } else {
        csrf(req, res, next);
    }
};
