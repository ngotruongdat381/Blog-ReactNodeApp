var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://ngotruongdat381:always13smile@ds153113.mlab.com:53113/ntd';
var postDB_name = 'post02';

module.exports = {
	addPost: function(username, title, subject, callback){
		MongoClient.connect(url, function(err, db) {
		  	db.collection(postDB_name).insertOne( {
				"title": title,
				"subject": subject,
                "date": new Date(),
                author: {
                  "id": new mongodb.ObjectId(),
                  "name": username
                 }
			},function(err, result){
				assert.equal(err, null);
		    	console.log("Saved the blog post details.");
		    	if(err == null){
		    		callback(true)
		    	}
		    	else{
		    		callback(false)
		    	}
			});
		});
	},

	updatePost: function(id, title, subject, callback){
		MongoClient.connect(url, function(err, db) {
		  	db.collection(postDB_name).updateOne( 
		  		{ "_id": new mongodb.ObjectID(id) },
		  		{ $set: 
		  			{ "title" : title,
		  			  "subject" : subject 
		  			}
		  		},function(err, result){
				assert.equal(err, null);
		    	console.log("Updated the blog post details.");
		    	if(err == null){
		    		callback(true)
		    	}
		    	else{
		    		callback(false)
		    	}
			});
		});
	},

	deletePost: function(id, callback){

		MongoClient.connect(url, function(err, db){
			 db.collection(postDB_name).deleteOne({
			 	_id: new mongodb.ObjectID(id)
			 },
			 function(err, result){
				assert.equal(err, null);
		    	console.log("Deleted the post.");
		    	if(err == null){
		    		callback(true)
		    	}
		    	else{
		    		callback(false)
		    	}
			});
		})
	},

	getPostWithId: function(id, callback){

		MongoClient.connect(url, function(err, db){
			 db.collection(postDB_name).findOne({
			 	_id: new mongodb.ObjectID(id)
			 },
			 function(err, result){
				assert.equal(err, null);
		    	console.log("Retrived the entry.");
		    	if(err == null){
		    		callback(result)
		    	}
		    	else{
		    		callback(false)
		    	}
			});
		})
	},

    getPost: function(callback){
        console.log("getPost");
        MongoClient.connect(url, function(err, db){
             db.collection(postDB_name, function (err, collection) {
                collection.find().toArray(function (err, list) {
                    callback(list);
                });
             });
        })
    },
    
    getPostWithUser: function(username, callback){
        console.log("getPostWithUser ");
        console.log(username);
        console.log("--- ");
        MongoClient.connect(url, function(err, db){
            db.collection(postDB_name, function (err, collection) {
                collection.find({
                "author.name": "Rick" 
             }).toArray(function (err, list) {
                    callback(list);
                });
             });
        })
    }
}


