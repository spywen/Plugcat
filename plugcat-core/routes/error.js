var logger = require('../helpers/logger');

exports.unknownPage = function(req, res){
	res.status(404);
    res.render('404',{});
    logger.error('Error 404 - unknown page : ' + req.url);
};
exports.serverError = function(req, res){
	res.status(500);
    res.render('500',{});
    logger.error('Error 500 - server error');
};