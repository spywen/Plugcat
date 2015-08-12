//--- RUN command ---
//@@@ 	PROD 	@@@ : NODE_ENV=prod node server.js
//@@@ 	DEV 	@@@ : NODE_ENV=dev node server.js
//@@@ 	LOCAL 	@@@ : node server.js

var configs = {};

if (process.env.NODE_ENV === 'prod') {
	configs = require('./../../config_prod');
}else if(process.env.NODE_ENV === 'dev'){
	configs = require('./../../config_dev');
}else{
	configs = require('./config_local');
}

module.exports = configs;