var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://ngotruongdat381:always13smile@ds153113.mlab.com:53113/ntd';
var postDB_name = 'post04';

module.exports = {
	addPost: function(username, email, title, subject, callback){
		MongoClient.connect(url, function(err, db) {
	  	db.collection(postDB_name).insertOne( {
				"title": title,
				"subject": subject,
	      "posted": new Date(),
	      author: {
	        "id": new mongodb.ObjectId(),
				  "name": username,
				  "email": email,
				  "comments":[]
	      }
			},function(err, result){
				assert.equal(err, null);
		    	console.log("Saved the blog post details.");
		    	if(err == null){
		    		callback(true);
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

    getPostSort: function(newest, callback){
		var s = -1;
		if (newest != undefined && !newest) {
			s = 1;
		}
      MongoClient.connect(url, function(err, db){
		    db.collection(postDB_name, function (err, collection) {
	        collection.find().sort( { "posted": s } ).toArray(function (err, list) {
	            callback(list);
	        });
		    });
      })
	},
	
	getPost: function(callback){
    MongoClient.connect(url, function(err, db){
      db.collection(postDB_name, function (err, collection) {
        collection.find().sort( { "posted": -1 } ).toArray(function (err, list) {
            callback(list);
        });
      });
    })
	},
	
	getPostSearch: function(text, callback){
    MongoClient.connect(url, function(err, db){
      db.collection(postDB_name, function (err, collection) {
        collection.find(
					{ "$text": { "$search": text } },
					{ "score": { "$meta": "textScore" } }
				).sort( { "score": { "$meta": "textScore" } } ).toArray(function (err, list) {
	        callback(list);
	      });
	    });
    })
	},
	
  getPostWithUser: function(email, callback){
    MongoClient.connect(url, function(err, db){
      db.collection(postDB_name, function (err, collection) {
        collection.find({
          "author.email": email 
       	}).sort( { "posted": -1 } ).toArray(function (err, list) {
          callback(list);
        });
      });
    })
	},
	
	getContent: function(id, callback){
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

	addComment: function(id, email, comment, callback){
		MongoClient.connect(url, function(err, db) {
			db.collection(postDB_name).updateOne( 
				{ "_id": new mongodb.ObjectID(id) },
				{ $push: 
					{ "comments" : { "comment": comment, "email": email }
 
					}
				},function(err, result){
			  assert.equal(err, null);
			  console.log("Updated the cmt details.");
			  if(err == null){
				  callback(true)
			  }
			  else{
				  callback(false)
			  }
		  });
		});
	},
}


