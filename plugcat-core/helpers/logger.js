const CONFIGS = require('./../configs.js');
var winston = require("winston");

/*
https://github.com/winstonjs/winston
*/

var logger = new (winston.Logger)({
    transports: [
        new winston.transports.File({//FILE logs
            level: CONFIGS.logger.file.level,
            filename: CONFIGS.logger.file.path,
            handleExceptions: CONFIGS.logger.handleException,
            json: true,
            maxsize: CONFIGS.logger.file.maxsize, //MB
            maxFiles: CONFIGS.logger.file.maxfiles,
            colorize: false
        }),
        new winston.transports.Console({//CONSOLE logs
            level: CONFIGS.logger.console.level,
            handleExceptions: CONFIGS.logger.handleException,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;