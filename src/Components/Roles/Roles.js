import React from 'react'
import {Route, Switch} from 'react-router-dom'

import List from './List'
import Create from './Create'
import Editor from './Editor'

class Roles extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const groupCommands = this.props.commands.find((item) => {
      return item.rule.test(this.props.location.pathname) === true
    });

    return (
      <Switch>
        <Route path={`${this.props.match.url}/create`} render={(props) => (
          <Create {...props} profile={this.props.profile}/>
        )}/>
        <Route path={`${this.props.match.url}/:roleId`} render={(props) => (
          <Editor {...props} profile={this.props.profile}/>
        )}/>
        <Route path={`${this.props.match.url}`} render={(props) => (
          <List {...props} profile={this.props.profile} commands={groupCommands.commands}/>
        )}/>
      </Switch>
    )
  }
}

export default Roles;