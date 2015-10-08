var UserRepository = require("./../repositories/userRepository.js")
	, logger = require('./../helpers/logger');

function RouteHandler(db){

	if (false === (this instanceof RouteHandler)) {
        console.log('Warning: RouteHandler constructor called without "new" operator');
        return new RouteHandler(db);
    }

    var userRepository = new UserRepository(db);

    /*
		Return index and profile of the connected user if connected
    */
    this.returnIndexAndConnectedUserProfile = function(req, res, next){
    	if(req.isAuthenticated()){
    		userRepository.getUser(req.user.emails[0].value, function(err, profile){
    			if(err){
    				logger.error('User authenticate but impossible to get profile : ' + req.user.emails[0].value);
    				return res.redirect('/logout');
    			}
    			return res.render('index',{user:JSON.stringify(profile)});
    		});
		}else{
			return res.render('index',{user:"undefined"});
		}
    };
}

module.exports = RouteHandler;
