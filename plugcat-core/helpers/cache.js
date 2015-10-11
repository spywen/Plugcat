var NodeCache = require("node-cache")
	, logger = require('./logger');;

var myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

function Cache(){

	if (false === (this instanceof Cache)) {
        console.log('Warning: Cache constructor called without "new" operator');
        return new Cache();
    }

	/*
		Set variable inside cache
	*/
	this.set = function(key, value, callback){
		myCache.set(key, value, function(error, success){
			if(!error && success){
				logger.debug('Cache : New entry: ', {'key': key, 'value':value});
				return callback(true);
			}
			logger.error("Cache : Error occured when trying to insert data inside cache : ", {'key': key, 'value':value});
			return callback(false);
		});
	}

	/*
		Get variable inside cache
	*/
	this.get = function(key, callback){
		myCache.get(key, function(error, value){
			if(!error){
				logger.debug('Cache : Get cache data with key : ' + key, {'value':value});
				return callback(value);
			}
			logger.error("Cache : Error occured when trying to get data inside cache : ", {'key': key});
			return callback(undefined);
		});
	}
}

module.exports = Cache();