var express = require("express");
var session = require('express-session');

var path = require("path");
var bodyParser = require("body-parser");
var user = require('./user')
var post = require('./post')

var app = express();

app.use(session({secret: 'my-secret'}));
var sessions;


app.use(express.static(path.join(__dirname,"/html")));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/posts", function(req, res) {
    post.getPost(function(result){
        res.send(result);
    });
});

app.get('/', function(req,res){
  res.sendFile(__dirname + '/html/home.html');
})

app.get('/home', function (req, res) {
  res.sendFile(__dirname + '/html/home.html');

  // if(sessions && sessions.email){
  //   res.sendFile(__dirname + '/html/home.html');
  // }
  // else{
  //   res.send('unauthorized');
  // }
})

app.post('/signin', function (req, res) {
  sessions=req.session;
  var email=req.body.email;
  var user_name=req.body.name;
  var password=req.body.password;
  user.validateSignIn(email,password,function(result){
    if(result){
      sessions.username = user_name;
      sessions.email = email;
      res.send('success');
    }
    else{
      res.send('Wrong username pass');
    }
  });
})

app.post('/signup', function (req, res) {
  var name=req.body.name;
  var email=req.body.email;
  var password=req.body.password;

  if(name && email && password){
  	user.signup(name, email, password)
  }
  else{
  	res.send('Failure');
  }
})

app.post('/addpost', function (req, res) {
  var title = req.body.title;
  var subject = req.body.subject;
  var id = req.body.id;
  console.log('id is ',id);
  if(id == '' || id == undefined){
    console.log('add');
    post.addPost(sessions.username, sessions.email, title, subject ,function(result){
      res.send(result);
    }); 
  }
  else{
    console.log('update',title,subject);
    post.updatePost(id, title, subject ,function(result){
      res.send(result);
    }); 
  }
  
})

app.post('/updateProfile', function(req, res){
  var name = req.body.name;
  var password = req.body.password;
  
  user.updateProfile(name, password, sessions.username, function(result){
      res.send(result);
  })
})

app.post('/getpost', function (req, res) {
  post.getPost(function(result){
    res.send(result);
  });
})

app.post('/deletePost', function(req,res){
  var id = req.body.id;
  post.deletePost(id, function(result){
    res.send(result)
  })
})

app.post('/getProfile', function(req,res){
  console.log('getProfile');
  console.log(sessions.email);
  user.getUserInfo(sessions.email, function(result){
    res.send(result)
  })
})

app.post('/getPostWithId', function(req,res){
  var id = req.body.id;
  post.getPostWithId(id, function(result){
    res.send(result)
  })
})

app.post('/getPostWithUser', function(req,res){
  post.getPostWithUser(sessions.email, function(result){
    res.send(result)
  })
})

app.post('/getContent', function(req,res){
  var id = req.body.id;
  post.getContent(id, function(result){
    res.send(result)
  })
})

app.post('/addComment', function (req, res) {
  var id = req.body.id;
  var comment = req.body.comment;
    post.addComment(id, sessions.email, comment ,function(result){
      res.send(result);
    }); 

})

app.listen(process.env.PORT || 7777,function(){
    console.log("Started listening on port", 7777);
})