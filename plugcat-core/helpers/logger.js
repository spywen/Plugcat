const CONFIGS = require('./../configs.js');

var fs = require('fs'), 
    Log = require('log'), 
    stream = fs.createWriteStream(__dirname + '/../logs/file.log', { flags: 'a' }), 
    log = new Log(CONFIGS.logLevel, stream);

module.exports = {

	error : function(message){
		log.error(message);
	},

	info : function(message){
		log.info(message);
	},

	debug : function(message){
		log.debug(message);
	}
};