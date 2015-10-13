function ColorRepository(db){

	if (false === (this instanceof ColorRepository)) {
        console.log('Warning: ColorRepository constructor called without "new" operator');
        return new ColorRepository(db);
    }

    var colors = db.collection("colors");

    /*
		Get colors
    */
    this.getColors = function(callback){
        colors.find().sort({sortOrder:1}).toArray(function(err, colors){
            return callback(err, colors);
        });
    };
}

module.exports = ColorRepository;
