var express = require("express");
var session = require('express-session');
var path = require("path");
var bodyParser = require("body-parser");
var user = require('./user')
var post = require('./post')
var app = express();
var sessions;

app.use(session({secret: 'my-secret'}));
app.use(express.static(path.join(__dirname,"/html")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/posts", function(req, res) {
  //console.log(req.query);
  if (req.query.searchtext == undefined){
    post.getPost(function(result){
        res.send(result);
    });
  }
  else {
    post.getPostSearch(req.query.searchtext, function(result){
        res.send(result);
    });
  }
});

app.get('/', function(req,res){
  res.sendFile(__dirname + '/html/index.html');
})

app.get('/user', function(req,res){
  res.sendFile(__dirname + '/html/user.html');
})

app.get('/home', function (req, res) {
  res.sendFile(__dirname + '/html/index.html');
  if(req.session.email == undefined){
    console.log("# Username not set in session yet");
  } else {
    console.log("# Username from session: "+ req.session.email);
  }
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
  if(id == '' || id == undefined){
    post.addPost(sessions.username, sessions.email, title, subject ,function(result){
      res.send(result);
    }); 
  }
  else{
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

//Save the username when the user posts the set username form
app.post('/username', function(req, res){
  req.session.save();
  res.send(req.session);
});

app.post('/getpost', function (req, res) {
  var newest = req.body.newest;
  post.getPostSort(newest, function(result){
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