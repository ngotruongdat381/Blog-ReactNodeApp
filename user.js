var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://ngotruongdat381:always13smile@ds153113.mlab.com:53113/ntd';

module.exports = {
	signup: function(name, email, password){
		MongoClient.connect(url, function(err, db) {
		  	db.collection('user').insertOne( {
				"name": name,
				"email": email,
				"password": password
			},function(err, result){
				assert.equal(err, null);
		    	console.log("Saved the user sign up details.");
			});
		});
	},
	getUserInfo: function(email, callback){
		console.log('getUserInfo - user.js')
		MongoClient.connect(url, function(err, db){
			
			db.collection('user').findOne( { email : email 
			},function(err, result){
				if(result==null){
					console.log('returning false')
					callback(false)
				}
				else{
					console.log('returning true')
					callback(result);
				}
			});
		});
	},
	updateProfile: function(name, password, email, callback){
		MongoClient.connect(url, function(err, db) {
		  	db.collection('user').updateOne( 
		  		{ "email": email },
		  		{ $set: 
		  			{ "name" : name,
		  			  "password" : password 
		  			}
		  		},function(err, result){
				assert.equal(err, null);
		    	console.log("Updated user details.");
		    	if(err == null){
		    		callback(true)
		    	}
		    	else{
		    		callback(false)
		    	}
			});
		});
	},
	validateSignIn: function(email, password,callback){
		MongoClient.connect(url, function(err, db){
			
			db.collection('user').findOne( { email : email ,password: password 
			},function(err, result){
				if(result==null){
					console.log('returning false')
					callback(false)
				}
				else{
					console.log('returning true')
					callback(true)
				}
			});
		});
	}
}


