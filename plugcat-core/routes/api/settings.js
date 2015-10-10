var UserRepository = require("./../../repositories/userRepository.js")
	, logger = require('./../../helpers/logger');

function SettingsHandler(db){

	if (false === (this instanceof SettingsHandler)) {
        console.log('Warning: SettingsHandler constructor called without "new" operator');
        return new SettingsHandler(db);
    }

    var userRepository = new UserRepository(db);

    /*
		Return index and profile of the connected user if connected or default value : undefined
    */
    this.save = function(req, res, next){
    	if(req.isAuthenticated()){
            var profile = {
                email:req.user.emails[0].value,
                color:req.body.color,
                publicName: req.body.publicName
            };
    		userRepository.upsert(profile, function(err, result){
    			if(err || result == 0){
    				logger.error('Error occured when trying to save settings : ' + JSON.stringify(profile));
    				return res.sendStatus(404);
    			}
                return res.sendStatus(200);
    		});
		}else{
            return res.sendStatus(401);
		}
    };
}

module.exports = SettingsHandler;
