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
        <div className="col-md-5">
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
          self.setState({posted:response.data.date});
          self.setState({authoremail:response.data.author.email});
          self.setState({comments:response.data.comments});
        }
      })
      .catch(function (error) {
        console.log('error is ',error);
      });

    }

    componentDidMount(){
      document.getElementById('addHyperLink').className = "";
      document.getElementById('homeHyperlink').className = "";
      document.getElementById('profileHyperlink').className = "";
      this.getContent();
    }

    handleCommentChange(e){
      this.setState({comment:e.target.value})
    }

    render() {
      return (
        <div className="col-md-5">
          <div className="form-area">  
              <div role="form">
                <br styles="clear:both" />
                <div className="form-group">
                  <h1 name="title" id="title"> {this.state.title} </h1>
                  <div> {this.state.posted} </div>
                  <div> {this.state.authoremail} </div>
                </div>
               
                <div className="form-group">
                  <p id="subject">{this.state.subject}</p>
                </div>
              </div>

              <div className="comment" id="comment-box">
                <h2>Comment</h2>          
                {
                this.state.comments.map(function(comment,index) {
                   return <div key={index}  >
                            <div>{comment.email}</div>
                            <div>{comment.comment}</div>
                          </div>
                }.bind(this))
                }
                <form>
                  <div className="form-group">
                    <textarea value={this.state.comment} className="form-control" onChange={this.handleCommentChange} type="textarea" id="subject" maxlength="140" rows="7"></textarea>
                  </div>
              
                  <button type="button" onClick={this.addComment} id="submit" name="submit" className="btn btn-primary pull-right">Comment</button>
                </form>
              </div>

          </div>
        </div>
      )
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
        <div className="col-md-5">
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

class ShowPost extends React.Component {
    constructor(props) {
      super(props);
      this.updatePost = this.updatePost.bind(this);
      this.showPost = this.showPost.bind(this);
      this.deletePost = this.deletePost.bind(this);
      this.getPost = this.getPost.bind(this);
      this.getPostWithUser = this.getPostWithUser.bind(this);
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

    componentWillReceiveProps() {
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

    render() {
      return(
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Subject</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.posts.map(function(post,index) {
                   return <tr key={index} >
                            <td>{index+1}</td>
                            <td onClick={this.showPost.bind(this,post._id)} >{post.title}</td>
                            <td>{post.subject}</td>
                            <td>
                              <span onClick={this.updatePost.bind(this,post._id)} className="glyphicon glyphicon-pencil"></span>
                            </td>
                            <td>
                              <span onClick={this.deletePost.bind(this,post._id)} className="glyphicon glyphicon-remove"></span>
                            </td>
                          </tr>
                }.bind(this))
              }
            </tbody>
          </table>
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
