const CONFIGS = require('./../configs.js');
var logger = require('./../helpers/logger');
var UserRepository = require("./../repositories/userRepository.js");

module.exports = exports = function(db, passport) {

	var userRepository = new UserRepository(db);

	// --- required methods ---
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});

	// --- GOOGLE STRATEGY ---
	passport.use(new GoogleStrategy({
			clientID: CONFIGS.googleAuth.clientID,
			clientSecret: CONFIGS.googleAuth.clientSecret,
			callbackURL: CONFIGS.googleAuth.callbackURL
		},
		function(accessToken, refreshToken, profile, done) {
			/*
			Google profile response : 

			{ provider: 'google',
			  id: '116228520514460413374',
			  displayName: 'Laurent Babin',
			  name: { familyName: 'Babin', givenName: 'Laurent' },
			  emails: [ { value: 'suplinknice@gmail.com', type: 'account' } ],
			  photos: [ { value: 'https://lh6.googleusercontent.com/-u5CxC2_IAVQ/AAAAAAAAAAI/AAAAAAAAAHQ/sWPkiyUdBU4/photo.jpg?sz=50' } ],
			  gender: 'male',
			  _raw: '{\n "kind": "plus#person",\n "etag": "\\"i9aZP8TD8jXVPIxD0T0PWsMRx6s/iclwAVq8Cm1Y6i_I79z5Z96q6wI\\"",\n "gender": "male",\n "emails": [\n  {\n   "value": "suplinknice@gmail.com",\n   "type": "account"\n  }\n ],\n "urls": [\n  {\n   "value": "http://twitter.com/laurentbabin",\n   "type": "otherProfile",\n   "label": "laurentbabin"\n  },\n  {\n   "value": "http://www.linkedin.com/in/laurentbabin",\n   "type": "otherProfile",\n   "label": "laurentbabin"\n  },\n  {\n   "value": "http://www.facebook.com/babinlaurent",\n   "type": "otherProfile",\n   "label": "babinlaurent"\n  },\n  {\n   "value": "http://laurentbabin.fr",\n   "type": "other",\n   "label": "Site Internet personnel -laurentbabin.fr"\n  }\n ],\n "objectType": "person",\n "id": "116228520514460413374",\n "displayName": "Laurent Babin",\n "name": {\n  "familyName": "Babin",\n  "givenName": "Laurent"\n },\n "url": "https://plus.google.com/+LaurentBabin",\n "image": {\n  "url": "https://lh6.googleusercontent.com/-u5CxC2_IAVQ/AAAAAAAAAAI/AAAAAAAAAHQ/sWPkiyUdBU4/photo.jpg?sz=50",\n  "isDefault": false\n },\n "organizations": [\n  {\n   "name": "Supinfo Nice",\n   "title": "Informatique",\n   "type": "school",\n   "startDate": "2011",\n   "primary": true\n  },\n  {\n   "name": "Supinfo",\n   "title": "Etudiant",\n   "type": "work",\n   "startDate": "2011",\n   "primary": true\n  }\n ],\n "isPlusUser": true,\n "language": "fr",\n "circledByCount": 28,\n "verified": false,\n "cover": {\n  "layout": "banner",\n  "coverPhoto": {\n   "url": "https://lh3.googleusercontent.com/-IWrkzhVYYFI/Um0s2DHtOKI/AAAAAAAAAW0/VZZzmZbS2QY/s630-fcrop64=1,204e293fdf47d618/bg.png",\n   "height": 587,\n   "width": 940\n  },\n  "coverInfo": {\n   "topImageOffset": 0,\n   "leftImageOffset": 0\n  }\n }\n}\n',
			  _json:
			   { kind: 'plus#person',
			     etag: '"i9aZP8TD8jXVPIxD0T0PWsMRx6s/iclwAVq8Cm1Y6i_I79z5Z96q6wI"',
			     gender: 'male',
			     emails: [ [Object] ],
			     urls: [ [Object], [Object], [Object], [Object] ],
			     objectType: 'person',
			     id: '116228520514460413374',
			     displayName: 'Laurent Babin',
			     name: { familyName: 'Babin', givenName: 'Laurent' },
			     url: 'https://plus.google.com/+LaurentBabin',
			     image:
			      { url: 'https://lh6.googleusercontent.com/-u5CxC2_IAVQ/AAAAAAAAAAI/AAAAAAAAAHQ/sWPkiyUdBU4/photo.jpg?sz=50',
			        isDefault: false },
			     organizations: [ [Object], [Object] ],
			     isPlusUser: true,
			     language: 'fr',
			     circledByCount: 28,
			     verified: false,
			     cover: { layout: 'banner', coverPhoto: [Object], coverInfo: [Object] } } }
			*/
			process.nextTick(function () {
				var dbProfile = {
					'email':profile.emails[0].value,
					'account':['google'],
					'givenName':profile._json.name.givenName,
					'familyName':profile._json.name.familyName,
					'avatar':{
						'url':profile._json.image.url
					}
				};
				userRepository.upsert(dbProfile, function(err, res){
					if (err || res == 0){
						logger.error("An error occured when trying to insert in db the user : " + dbProfile.email + "(" + JSON.stringify(dbProfile) + ")");
			  			return done(err, null);
					}else{
						logger.debug("User connected : " + profile.displayName);
			  			return done(null, profile);
					}
				});
			});
		}
	));
};