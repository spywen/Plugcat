function UserRepository(db){

	if (false === (this instanceof UserRepository)) {
        console.log('Warning: UserRepository constructor called without "new" operator');
        return new UserRepository(db);
    }

    var users = db.collection("users");

    /*
		User upsert: if user already insert in db -> just UPDATE account, else INSERT new account
        res == 0 if error occured
        $set : enable to add new columns, if necessary, without removing columns
    */
    this.upsert = function(profile, callback){
    	users.update({'email':profile.email}, {'$set': profile}, {upsert: true}, function(err, res){
    		return callback(err, res);
    	});
    };

    /*
		Get user profile
    */
    this.getUser = function(email, callback){
    	users.findOne({'email':email}, function(err, profile){
    		return callback(err, profile);
    	});
    };
}

module.exports = UserRepository;
