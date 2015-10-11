var UserRepository = require("./../../repositories/userRepository.js")
	, logger = require('./../../helpers/logger')
    , Cache = require('./../../helpers/cache')
    , uuid = require('node-uuid');

function UsersHandler(db){

	if (false === (this instanceof UsersHandler)) {
        console.log('Warning: UsersHandler constructor called without "new" operator');
        return new UsersHandler(db);
    }

    var userRepository = new UserRepository(db);

    /*
		Get connected user profile
    */
    this.getConnectedUserProfile = function(req, res, next){
    	if(req.isAuthenticated()){
    		userRepository.getUser(req.user.emails[0].value, function(err, profile){
    			if(err){
    				logger.error('Error occured when trying to get connected user profile : ' + req.user.emails[0].value);
    				return res.sendStatus(500);
    			}
                return res.send(profile);
    		});
		}else{
            return res.sendStatus(401);
		}
    };

    /*
        Generate token to send to the user with :
        - if connected : is profile save in cache
        - if not : nothing saved in cache
        This token will be delivered before room connection and send to connect to a room.
        Like this the socket session will have the connected user profile
    */
    this.getToken = function(req, res, next){
        if(req.isAuthenticated()){
            userRepository.getUser(req.user.emails[0].value, function(err, profile){
                if(err){
                    logger.error('Error occured when trying to get connected user profile for generation token : ' + req.user.emails[0].value);
                    return res.sendStatus(500);
                }
                var uid = uuid.v1();
                Cache.set(uid, profile, function(success){
                    if(success){
                        return res.send(uid);
                    }
                    logger.error('Error occured when trying to cache uid');
                    return res.sendStatus(500);
                });
            });
        }else{
            return res.send('');
        }
    };
}

module.exports = UsersHandler;
