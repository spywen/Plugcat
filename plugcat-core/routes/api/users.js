var UserRepository = require("./../../repositories/userRepository.js")
	, logger = require('./../../helpers/logger');

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
    				return res.sendStatus(404);
    			}
                return res.send(profile);
    		});
		}else{
            return res.sendStatus(401);
		}
    };
}

module.exports = UsersHandler;
