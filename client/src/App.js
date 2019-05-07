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
import ReflectionPage from './components/ReflectionPage';
import UnpublishedPage from './components/UnpublishedPage';
import Inspiration from './components/Inspiration';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn :
        (localStorage.getItem('loggedIn') === null) ? false : true,
      session :
        (localStorage.getItem('session') === null) ? null : localStorage.getItem('session'),
      name :
        (localStorage.getItem('name') === null) ? null : localStorage.getItem('name')
    };
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
  login(name, session) {
    localStorage.setItem('name', name);
    localStorage.setItem('session', session);
    localStorage.setItem('loggedIn', true);
    this.setState({
      loggedIn : true
    });
    return <Link to={'/home'} />

  }

  logout() {
    console.log('hey')
    this.setState({
      loggedIn:false
    })
    localStorage.clear();
    return <Link to={"/"} />
    // remove session
  }

  goMain() {
    return <Link to={"/"} />
  }


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
                    <Route exact path='/admin' component={Admin} />
                    <Route exact path='/signup' component={SignUp} />
                    <Route exact path='/forgotpassword' render={(props) => <Forgot {...props} session={this.state.session} name={this.state.name}/>}/>
                    <Route exact path='/search' render={(props) => <Search {...props} session={this.state.session} name={this.state.name}/>}/>
                    <Route exact path='/newlesson' render={(props) => <NewPage {...props} session={this.state.session} name={this.state.name}/>}/>
                    <Route exact path='/inspiration' render={(props) => <Inspiration {...props} session={this.state.session} name={this.state.name}/>}/>
                    <Route exact path='/home' render={(props) => <Home {...props} session={this.state.session} name={this.state.name} />}/>
                    <Route exact path='/resetpassword' component={PasswordReset} />
                    <Route exact path='/addreflection/:lesson_id' render={(props) => <ReflectionPage {...props}/>}/>
                    <Route exact path='/viewpage/:lesson_id' component={PublishedPage} />
                    <Route exact path='/editpage/:lesson_id' render={(props) => <UnpublishedPage {...props} login={this.login.bind(this)}/>}/>
                  </Switch>
                </div>
              </div>
          ):(
            <div className="fullContainer">
              <Switch>
                <Route exact path='/signup' component={SignUp} />
                <Route exact path='/forgotpassword' component={Forgot} />
                <Route exact path='/' render={(props) => <Login {...props} session={this.state.session} login={this.login.bind(this)}/>}/>
                <Route exact path='/:whatever' render={(props) => <Login {...props} session={this.state.session} login={this.login.bind(this)}/>}/>
              </Switch>
            </div>
          )}
      </BrowserRouter>
    );
  }
}

export default App;
