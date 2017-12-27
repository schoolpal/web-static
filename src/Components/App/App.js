import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import Home from "../Home/Home";
import Login from '../Login/Login'
import "./App.css"

const App = () => (
  <Router>
    <Switch>
      <Route path='/login' component={Login}/>
      <Route path='/' component={Home}/>
    </Switch>
  </Router>
);

export default App;