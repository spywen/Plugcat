var logger = require('./../helpers/logger');

exports.errorHandler = function(err, req, res, next) {
    logger.error('Error 500 - server error');
    res.status(500);
    res.render('500', { error: err });
};