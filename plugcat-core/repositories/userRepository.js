function UserRepository(db){

	if (false === (this instanceof UserRepository)) {
        console.log('Warning: UserRepository constructor called without "new" operator');
        return new UserRepository(db);
    }

    var users = db.collection("users");

    /*
		User log in : if user already insert in db -> just UPDATE account, else INSERT new account
    */
    this.login = function(profile, callback){
    	users.update({'_id':profile.email}, profile, {upsert: true}, function(err, res){
    		return callback(err, res);
    	});
    };

    /*
		Get user profile
    */
    this.getUser = function(email, callback){
    	users.findOne({'_id':email}, function(err, profile){
    		return callback(err, profile);
    	});
    };
}

module.exports = UserRepository;
