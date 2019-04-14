import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/forgotpassword' component={Forgot} />
            <Route exact path='/:user_id' component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
