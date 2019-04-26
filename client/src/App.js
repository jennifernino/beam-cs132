import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Forgot from './components/Forgot'
import Home from './components/Home'
import Menu from './components/Menu'
import Search from './components/Search'
import NewPage from './components/NewPage'
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
        <div className="fullContainer">
          <div className="leftContainer">
          { this.state.loggedIn ? (<Menu />) : null }
          </div>
          <div className="rightContainer">
            <Switch>
              <Route exact path='/' component={Login} />

              <Route exact path='/signup' component={SignUp} />
              <Route exact path='/forgotpassword' component={Forgot} />

              <Route exact path='/search' render={(props) => <Search {...props} session={this.state.session} />}/>
              <Route exact path='/newlesson' render={(props) => <NewPage {...props} session={this.state.session} />}/>
              <Route exact path='/home' render={(props) => <Home {...props} session={this.state.session} />}/>

            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
