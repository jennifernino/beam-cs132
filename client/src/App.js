import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Forgot from './components/Forgot'
import PasswordReset from './components/PasswordReset'
import Home from './components/Home'
import Menu from './components/Menu'
import Admin from './components/Admin'
import Search from './components/Search'
import NewPage from './components/NewPage'
import PublishedPage from './components/PublishedPage';
import UnpublishedPage from './components/UnpublishedPage';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn : (localStorage.getItem('loggedIn') === null) ? (false) : (true),
      session : 'abc123'
    };
    //this.login = this.login.bind(this);
  }

  componentDidMount() {
    // window.onbeforeunload = function() {
    //   localStorage.clear();
    // }
  }

  /*
   * Log out a user when they leave (remove from session map)
   */
  // componentDidMount() {
  //   window.addEventListener("beforeunload", (ev) =>
  //   {
  //     ev.preventDefault();
  //     return ev.returnValue = 'Are you sure you want to close?';
  //   });
  // }
  login() {
    //localStorage.setItem('loggedIn', true);
    this.setState({
      loggedIn : true
    });
    //this.props.history.push('/home');
    //console.log(this.state)
  }

  logout() {
    console.log('hey')
    this.setState({
      loggedIn:false
    })
    //this.props.history.push('/');
    return <Link to={"/"} />
    // remove session
  }
  goMain() {
    return <Link to={"/"} />
  }
  /*
   * In the case that its refreshed - no because it will log you out
   */
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextState.loggedIn === this.state.loggedIn) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  render () {
    return (
      <BrowserRouter>
          { this.state.loggedIn ?
            (
              <div className="fullContainer">
                <div className="leftContainer">
                  <Menu logout={this.logout.bind(this)}/>
                </div>
                <div className="rightContainer">
                  <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/admin' render={(props) => <Admin {...props} session={this.state.session} />}/>
                    <Route exact path='/signup' render={(props) => <SignUp {...props} session={this.state.session} />}/>
                    <Route exact path='/forgotpassword' render={(props) => <Forgot {...props} session={this.state.session} />}/>
                    <Route exact path='/search' render={(props) => <Search {...props} session={this.state.session} />}/>
                    <Route exact path='/newlesson' render={(props) => <NewPage {...props} session={this.state.session} />}/>
                    <Route exact path='/home' render={(props) => <Home {...props} session={this.state.session} />}/>
                    <Route exact path='/edit' render={(props) => <UnpublishedPage {...props} session={this.state.session}/>}/>
                    <Route exact path='/resetpassword' component={PasswordReset} />
                    <Route exact path='/viewpage/:lesson_id' component={PublishedPage} />
                  </Switch>
                </div>
              </div>
          ):(
            <div className="fullContainer">
              <Switch>
                <Route exact path='/signup' component={SignUp} />
                <Route exact path='/forgotpassword' component={Forgot} />
                <Route exact path='/:whatever' render={(props) => <Login {...props} session={this.state.session} login={this.login.bind(this)}/>}/>
                <Route exact path='/' render={(props) => <Login {...props} session={this.state.session} login={this.login.bind(this)}/>}/>
              </Switch>
            </div>
          )}
      </BrowserRouter>
    );
  }
}

export default App;
