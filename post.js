var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://ngotruongdat381:always13smile@ds153113.mlab.com:53113/ntd';
 
module.exports = {
    addPost: function(title, subject, callback){
        MongoClient.connect(url, function(err, db) {
            db.collection('post').insertOne( {
                "title": title,
                "subject": subject
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

    getPost: function(callback){
        MongoClient.connect(url, function(err, db){
             db.collection('post', function (err, collection) {
                collection.find().toArray(function (err, list) {
                    callback(list);
                });
             });
        })
    }

}
