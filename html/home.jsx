var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var IndexRoute = window.ReactRouter.IndexRoute;
var hashHistory = window.ReactRouter.hashHistory;
var browserHistory = window.ReactRouter.browserHistory;
var Link = window.ReactRouter.Link;


var ChangeStatus = function (activeLink) {
  var lis = document.getElementById("navbarResponsive").getElementsByTagName("li");
  for (var i = 0; i < lis.length; i++) {
    lis[i].className = "";
  }
  if (document.getElementById(activeLink) != null) {
    document.getElementById(activeLink).className = "active";
  }
}

class ShowProfile extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.state = {
      name:'',
      email:'',
      password:'',
      id:''
    };
    
  }

  componentDidMount(){
    ChangeStatus("profileHyperlink");
    this.getProfile();
  }

  updateProfile(){
    var self = this;
    axios.post('/updateProfile', {
      name: this.state.name,
      password: this.state.password
    })
    .then(function (response) {
      if(response){
        hashHistory.push('/')  
      }
    })
    .catch(function (error) {
      console.log('error is ',error);
    });
  }

  handleNameChange(e){
    this.setState({name:e.target.value})
  }
  handlePasswordChange(e){
    this.setState({password:e.target.value})
  }

  getProfile(){
    var self = this;
    axios.post('/getProfile', {
    })
    .then(function (response) {
      if(response){
        self.setState({name:response.data.name});
        self.setState({email:response.data.email});
        self.setState({password:response.data.password});  
      }
    })
    .catch(function (error) {
      console.log('error is ',error);
    });
  }
  
  render() {
    return (
      <div className="col-lg-8 col-md-10 mx-auto">
        <div className="form-area">  
            <form role="form">
              <br styles="clear:both" />
              <div className="form-group">
                <input value={this.state.name} type="text" onChange={this.handleNameChange} className="form-control" placeholder="Name" required />
              </div>
             
              <div className="form-group">
                <input value={this.state.password} type="password" onChange={this.handlePasswordChange} className="form-control" placeholder="Password" required />
              </div>
             
              <button type="button" onClick={this.updateProfile} id="submit" name="submit" className="btn btn-primary pull-right">Update</button>
            </form>
        </div>
      </div>
    )
  }
}

class AddPost extends React.Component {
    constructor(props) {
      super(props);
      this.addPost = this.addPost.bind(this);
      this.getPostWithId = this.getPostWithId.bind(this);
      this.handleTitleChange = this.handleTitleChange.bind(this);
      this.handleSubjectChange = this.handleSubjectChange.bind(this);
      this.state = {
        title:'',
        subject:'',
        id:''
      };
    }
    componentDidMount() {
      ChangeStatus("addHyperLink");
      this.getPostWithId();
    }

    addPost(){
      var idpost = this.props.params.id;
      axios.post('/addPost', {
        title: this.state.title,
        subject: this.state.subject,
        id: this.props.params.id
      })
      .then(function (response) {
        //console.log('reponse from add post is ',response);
        hashHistory.push('/showMyPosts');
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    getPostWithId(){
      var id = this.props.params.id;
      var self = this;
      axios.post('/getPostWithId', {
        id: id
      })
      .then(function (response) {
        if(response){
          self.setState({title:response.data.title});
          self.setState({subject:response.data.subject});  
        }
        
      })
      .catch(function (error) {
        console.log('error is ',error);
      });

    }

    handleTitleChange(e){
      this.setState({title:e.target.value})
    }
    handleSubjectChange(e){
      this.setState({subject:e.target.value})
    }
    render() {
      return (
        <div className="col-lg-8 col-md-10 mx-auto">
          <div className="form-area">  
              <form role="form">
                <br styles="clear:both" />
                <div className="form-group">
                  <input value={this.state.title} type="text" onChange={this.handleTitleChange} className="form-control" id="title" name="title" placeholder="Title" required />
                </div>
               
                <div className="form-group">
                  <textarea value={this.state.subject} className="form-control" onChange={this.handleSubjectChange} type="textarea" id="subject" placeholder="Subject" maxlength="140" rows="7"></textarea>
                </div>
                  
                <button type="button" onClick={this.addPost} id="submit" name="submit" className="btn btn-primary pull-right">Add Post</button>
              </form>
          </div>
        </div>
      )
    }
}

class ShowContent extends React.Component {
    constructor(props) {
      super(props);
      this.getContent = this.getContent.bind(this);
      this.addComment = this.addComment.bind(this);
      this.handleCommentChange = this.handleCommentChange.bind(this);
      this.state = {
        title:'',
        subject:'',
        posted:'',
        authoremail:'',
        comments:[],
        comment:'',
        id:''
      };
    }

    //improve later
    showNewComment() {
        const element = (
          <div>
            <div>{comment.email}</div>
            <div>{comment}</div>
          </div>
        );
        ReactDOM.render(
          element,
          document.getElementById('comment-box')
        );
    }

    addComment(){
      var id = this.props.params.id;
      axios.post('/addComment', {
        id:id,
        comment: this.state.comment
      })
      .then(function (response) {
        //console.log('reponse from add comment is ',response);
        window.location.reload();   //a bit slow 
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    getContent(){
      var id = this.props.params.id;
      var self = this;
      axios.post('/getContent', {
        id: id
      })
      .then(function (response) {
        if(response){
          self.setState({title:response.data.title});
          self.setState({subject:response.data.subject});
          self.setState({posted:response.data.posted});
          self.setState({authoremail:response.data.author.email});
          self.setState({comments:response.data.comments});
        }
      })
      .catch(function (error) {
        console.log('error is ',error);
      });

    }

    componentDidMount(){
      ChangeStatus("");
      this.getContent();
    }

    handleCommentChange(e){
      this.setState({comment:e.target.value})
    }

    render() {
      if (this.state.posted !== undefined) {
        var sdate = (this.state.posted).toString();
        var short_date = sdate.substring(0,10);
      }
      return (
        <div className="col-lg-8 col-md-10 mx-auto">
          <div className="form-area">  
              <div role="form">
                <br styles="clear:both" />               
                <article>
                  <header className="entry-header">
                    <h1 className="entry-title">{this.state.title}</h1>    
                  </header>
                  <div className="entry-meta">
                    <span className="byline">
                      <i className="fa fa-user" aria-hidden="true"></i>
                      <a>{this.state.authoremail}</a>     
                    </span>
                    <span className="published-on">
                      <i className="fa fa-clock-o" aria-hidden="true"></i>
                      <time className="entry-date published">{short_date}</time>  
                    </span>
                  </div>

                  <div className="content">
                    <div className="row">
                        {this.state.subject.split("\n").map(function(item) {
                        return (
                          <span>
                            {item}
                            <br/>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </article>
              </div>

              <div className="comment" id="comment-box">
                {this.props.useremail&&
                <div className="card my-4">
                  <h5 className="card-header">Leave a Comment:</h5>
                  <div className="card-body">
                    <form>
                      <div className="form-group">
                        <textarea className="form-control" value={this.state.comment} onChange={this.handleCommentChange} type="textarea" id="subject" maxlength="140" rows="3"></textarea>
                      </div>
                      <button type="submit" onClick={this.addComment} id="submit" name="submit" className="btn btn-primary">Comment</button>
                    </form>
                  </div>
                </div>
                }

                {this.state.comments && this.state.comments.length > 0 &&
                  this.state.comments.map(function(comment,index) {
                    return <div className="media mb-4" key={index}  >
                            <img className="d-flex mr-3 rounded-circle" src="http://placehold.it/50x50" alt=""/>
                            <div className="media-body">
                              <h5 className="mt-0">{comment.email}</h5>
                              {comment.comment}
                            </div>
                            </div>
                  }.bind(this))
                }
              </div>
          </div>
        </div>
      )
    }
}



class ShowPost extends React.Component {
    constructor(props) {
      super(props);
      this.updatePost = this.updatePost.bind(this);
      this.showPost = this.showPost.bind(this);
      this.deletePost = this.deletePost.bind(this);
      this.getPost = this.getPost.bind(this);
      this.getPostWithUser = this.getPostWithUser.bind(this);
      this.doShow = this.doShow.bind(this);
      this.sort = this.sort.bind(this);
      this.state = {
        newest: true,
        posts:[]
      };
    }

    updatePost(id){
      hashHistory.push('/addPost/' + id);
    }

    showPost(id){
      hashHistory.push('/post/' + id);
    }

    deletePost(id){
      if(confirm('Are you sure ?')){
        var self = this;
        axios.post('/deletePost', {
          id: id
        })
        .then(function (response) {
          self.getPost();
        })
        .catch(function (error) {
          console.log('Error is ',error);
        });
      }
    }

    getPost(newest){
      var self = this;
      axios.post('/getPost', {
        newest: newest
      })
      .then(function (response) {
        //console.log('res is ',response);
        self.setState({posts:response.data})
      })
      .catch(function (error) {
        console.log('error is ',error);
      });
    }
    
    getPostWithUser() {
      var self = this;
      axios.post('/getPostWithUser', {
      })
      .then(function (response) {
        //console.log('res is ',response);
        self.setState({posts:response.data})
      })
      .catch(function (error) {
        console.log('error is ',error);
      });
    }

    doShow() {
      if (this.props.router.location.pathname == "/"){
        //console.log("getHome");
        ChangeStatus("homeHyperlink");
        this.getPost();
      }
      else if (this.props.router.location.pathname == "/showMyPosts"){
        //console.log("getPostWithUser");
        ChangeStatus("wallHyperlink");
        this.getPostWithUser();
      }
    }

    sort() {
      this.setState({newest:!this.state.newest});
      this.getPost(!this.state.newest);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.useremail != ""){
        this.doShow();
      }
    }

    componentDidMount() {
      this.doShow();
    }

    render() {
      return(
        <div className="col-lg-8 col-md-10 mx-auto">
          {this.props.router.location.pathname == "/"&&
            <div className="greeting">
              <h1> Hi {this.props.useremail}! We got some new blogs for you </h1>
            </div>
          }
          
          {this.props.router.location.pathname == "/"&&
          <button type="button" onClick={this.sort}  className="btn btn-primary pull-right floating-btn" title="Sort by chronological order">
            <i className="fa fa-sort-amount-asc" aria-hidden="true"></i>
          </button>
          }

          {this.state.posts.map(function(post,index) {
              if (post.posted !== undefined) {
                var sdate = (post.posted).toString();
                var short_date = sdate.substring(0,10);
              }
              var content = post.subject;
              if (this.props.router.location.pathname == "/"){
                var content = post.subject.substring(0,700) + " ...";
              }
              console.log(content);    
              
              return  <article className="post" key={index}>
                        <header className="entry-header">
                          <h1 className="entry-title" onClick={this.showPost.bind(this,post._id)}> {post.title}</h1>    
                        </header> 
                        <div className="entry-content">
                          {content}
                        </div>
                      
                        <footer className="entry-footer">
                          <div className="entry-meta">
                            <span className="byline">
                              <i className="fa fa-user" aria-hidden="true"></i>
                              <a>{post.author.email}</a>     
                            </span>
                            <span className="published-on">
                              <i className="fa fa-clock-o" aria-hidden="true"></i>
                              <time className="entry-date published" datetime={short_date}>{short_date}</time>  
                            </span>
                          </div>
                        </footer>
                      </article>
          }.bind(this))
        }
        
      </div>
      )
    }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <div className="container">
            <a className="navbar-brand" href="#">Ngo Truong Dat</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              {!this.props.useremail&&
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active"  id="homeHyperlink" >
                  <a className="nav-link" href="#">Home
                    <span className="sr-only">(current)</span>
                  </a>
                </li>
              
                <li className="nav-item" id="SigninHyperlink">
                  <a className="nav-link" href="/user#/signin">Sign in</a>
                </li>
                <li className="nav-item" id="SignupHyperlink">
                  <a className="nav-link" href="/user#/signup">Sign up</a>
                </li>
              </ul>
              }

              {this.props.useremail&&
              <ul className="navbar-nav ml-auto">
                <li className="nav-item" id="wallHyperlink">
                  <a className="nav-link" href="/#/showMyPosts">{this.props.useremail}</a>
                </li>
                <li className="nav-item active"  id="homeHyperlink" >
                  <a className="nav-link" href="#">Home
                    <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item" id="addHyperLink">
                  <a className="nav-link" href="/#/addPost">Add</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={this.props.logOut} href="#">Logout</a>
                </li>
              </ul>
              }

            </div>
          </div>
        </nav>
      </div>
    );
  }
}

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.checkSession = this.checkSession.bind(this);
    this.logOut = this.logOut.bind(this);
    this.state = {
      useremail:''
    };
  }

  checkSession(){
    var self = this;
    axios.post('/username', {
    })
    .then(function (response) {
      if(response){
        //console.log("data loaded: ", response.data.email);
        self.setState({useremail:response.data.email})
      }
    })
    .catch(function (error) {
      console.log('error is ',error);
    });
  }

  logOut() {
    this.setState({useremail:''});
  }

  componentDidMount() {
    this.checkSession();
  }

  render() {
      return (
          <div>
              <Header useremail={this.state.useremail} logOut={this.logOut}/>
              {React.cloneElement(this.props.children, {useremail: this.state.useremail})}
          </div>
      )
  }
}

ReactDOM.render(
    <Router history={hashHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={ShowPost} />
        <Route component={ShowPost} path="/showMyPosts"></Route>
        <Route component={ShowContent} path="/post(/:id)"></Route>
        <Route component={AddPost} path="/addPost(/:id)"></Route>
        <Route component={ShowProfile} path="/showProfile"></Route>
      </Route>
    </Router>,
document.getElementById('app'));
