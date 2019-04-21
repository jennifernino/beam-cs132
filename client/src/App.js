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
      loggedIn : true
    };
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
              <Route exact path='/search' component={Search} />
              <Route exact path='/newlesson' component={NewPage} />
              <Route exact path='/:user_id' component={Home} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
