var SettingsHandler = require('./settings');
var ColorsHandler = require('./colors');
var UsersHandler = require('./users');

module.exports = exports = function(db, app) {

    var settingsHandler = new SettingsHandler(db);
    var colorsHandler = new ColorsHandler(db);
    var usersHandler = new UsersHandler(db);

	// --- Settings ---
	app.post('/api/settings', settingsHandler.save);

    // --- Enum ---
    app.get('/api/colors', colorsHandler.getColors);

    // --- Auth ---
    app.get('/api/auth', usersHandler.getConnectedUserProfile);
};
