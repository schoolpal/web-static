import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import Home from "../Home/Home";
import Login from '../Login/Login'
import NoMatch from "../NoMatch/NoMatch";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/' component={Home}/>
        </Switch>
      </Router>
    )
  }
}

export default App;