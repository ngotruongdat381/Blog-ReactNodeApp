var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var hashHistory = window.ReactRouter.hashHistory;
var browserHistory = window.ReactRouter.browserHistory;
var Link = window.ReactRouter.Link;


var ChangeStatus = function (activeLink) {
  document.getElementById('addHyperLink').className = "";
  document.getElementById('wallHyperlink').className = "";
  document.getElementById('homeHyperlink').className = "";
  document.getElementById('profileHyperlink').className = "";

  document.getElementById(activeLink).className = "active";
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
    document.getElementById('addHyperLink').className = "";
    document.getElementById('homeHyperlink').className = "";
    document.getElementById('profileHyperlink').className = "active";
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
    componentDidMount(){
      document.getElementById('addHyperLink').className = "active";
      document.getElementById('homeHyperlink').className = "";
      document.getElementById('profileHyperlink').className = "";
      this.getPostWithId();
    }

    addPost(){
      axios.post('/addPost', {
        title: this.state.title,
        subject: this.state.subject,
        id: this.props.params.id
      })
      .then(function (response) {
        console.log('reponse from add post is ',response);
        hashHistory.push('/')
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
      console.log("addComment");
      var id = this.props.params.id;
      axios.post('/addComment', {
        id:id,
        comment: this.state.comment
      })
      .then(function (response) {
        console.log('reponse from add comment is ',response);
        //hashHistory.push('/post/' + id);
        window.location.reload();   //a bit slow => Improve later
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
        console.log(response.data);
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

    // onBackButtonEvent(e){
    //   e.preventDefault();
    //   hashHistory.goBack();
    // }

    componentDidMount(){
      document.getElementById('addHyperLink').className = "";
      document.getElementById('homeHyperlink').className = "";
      document.getElementById('profileHyperlink').className = "";
      this.getContent();
      //window.onpopstate = this.onBackButtonEvent;
    }

    handleCommentChange(e){
      this.setState({comment:e.target.value})
    }

    render() {
      if (this.state.posted !== undefined) {
        console.log((new Date(this.state.posted)).toString());
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
                        <p>{this.state.subject}</p>
                      
                    </div>
                  </div>
                </article>
              </div>

              <div className="comment" id="comment-box">
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
      this.state = {
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

    getPost(){
      var self = this;
      axios.post('/getPost', {
      })
      .then(function (response) {
        console.log('res is ',response);
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
        console.log('res is ',response);
        self.setState({posts:response.data})
      })
      .catch(function (error) {
        console.log('error is ',error);
      });
    }

    doShow() {
      console.log("this.props.Router:",this.props.router.location.pathname);
      if (this.props.router.location.pathname == "/"){
        console.log("getPost");
        ChangeStatus("homeHyperlink");
        this.getPost();
      }
      else if (this.props.router.location.pathname == "/showMyPosts"){
        console.log("getPostWithUser");
        ChangeStatus("wallHyperlink");
        this.getPostWithUser();
      }
    }

    componentWillReceiveProps() {
      console.log("componentWillReceiveProps");
      this.doShow();
    }

    componentDidMount() {
      console.log("componentDidMount");
      this.doShow();
    }


    render() {
      return(
        <div className="col-lg-8 col-md-10 mx-auto">
          {/* <button type="button" onClick={this.updateProfile} id="submit" name="submit" className="btn btn-primary pull-right">Sort by Oldest</button> */}

          {
            this.state.posts.map(function(post,index) {
              if (post.posted !== undefined) {
                var sdate = (post.posted).toString();
                var short_date = sdate.substring(0,10);
              }

              return  <article className="post" key={index}>
                        <header className="entry-header">
                          <h1 className="entry-title" onClick={this.showPost.bind(this,post._id)}> {post.title}</h1>    
                        </header> 
                        <div className="entry-content">
                          <p>{post.subject}</p> 
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

ReactDOM.render(
    <Router history={hashHistory}>
        <Route component={ShowPost} path="/"></Route>
        <Route component={ShowPost} path="/showMyPosts"></Route>
        <Route component={ShowContent} path="/post(/:id)"></Route>
        <Route component={AddPost} path="/addPost(/:id)"></Route>
        <Route component={ShowProfile} path="/showProfile"></Route>
    </Router>,
document.getElementById('app'));
