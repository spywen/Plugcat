var ColorRepository = require("./../../repositories/colorRepository.js")
	, logger = require('./../../helpers/logger');

function ColorsHandler(db){

	if (false === (this instanceof ColorsHandler)) {
        console.log('Warning: ColorsHandler constructor called without "new" operator');
        return new ColorsHandler(db);
    }

    var colorRepository = new ColorRepository(db);

    /*
		Get all colors
    */
    this.getColors = function(req, res, next){
		colorRepository.getColors(function(err, colors){
			if(err){
				logger.error('Error occured when trying to get colors : ');
				return res.sendStatus(404);
			}
			return res.send(colors);
		});
    };
}

module.exports = ColorsHandler;
