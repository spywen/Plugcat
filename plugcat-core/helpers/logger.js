var CONFIGS = require('../configs.js')
	fs = require('fs'), 
    Log = require('log'), 
    stream = fs.createWriteStream(__dirname + '/../logs/file.log', { flags: 'a' }), 
    log = new Log(CONFIGS.logLevel, stream);

exports.error = function(message){
	log.error(message);
};

exports.debug = function(message){
	log.debug(message);
};