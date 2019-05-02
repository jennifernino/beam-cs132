import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Forgot from './components/Forgot'
import PasswordReset from './components/PasswordReset'
import Home from './components/Home'
import Menu from './components/Menu'
import Admin from './components/Admin'
import Search from './components/Search'
import EditLesson from './components/EditLesson'
import NewPage from './components/NewPage'
import PublishedPage from './components/PublishedPage';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn : true,
      session: 'abc123'
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

  /*
   * In the case that its refreshed - no because it will log you out
   */
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render () {
    return (
      <BrowserRouter>
          { this.state.loggedIn ?
            (
              <div className="fullContainer">
                <div className="leftContainer">
                  <Menu />
                </div>
                <div className="rightContainer">
                  <Switch>
                    <Route exact path='/' component={Login} />
                    <Route exact path='/admin' render={(props) => <Admin {...props} session={this.state.session} />}/>
                    <Route exact path='/signup' component={SignUp} />
                    <Route exact path='/forgotpassword' component={Forgot} />
                    <Route exact path='/search' render={(props) => <Search {...props} session={this.state.session} />}/>
                    <Route exact path='/newlesson' render={(props) => <NewPage {...props} session={this.state.session} />}/>
                    <Route exact path='/home' render={(props) => <Home {...props} session={this.state.session} />}/>
                    <Route exact path='/edit' render={(props) => <EditLesson {...props} session={this.state.session}/>}/>
                    <Route exact path='/resetpassword' component={PasswordReset} />
                    <Route exact path='/viewpage/:lesson_id' component={PublishedPage} />
                  </Switch>
                </div>
              </div>
          ):(
            <div className="fullContainer">
              <Switch>
                <Route exact path='/' component={Login} />
                <Route exact path='/signup' component={SignUp} />
                <Route exact path='/forgotpassword' component={Forgot} />
                <Route exact path='/:whatever' component={SignUp} />
              </Switch>
            </div>
          )}
      </BrowserRouter>
    );
  }
}

export default App;
