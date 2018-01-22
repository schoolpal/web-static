import React from 'react'
import {Route, Switch} from 'react-router-dom'

import List from './List'
import Create from './Create'
import Editor from './Editor'

const User = ({location, match, profile}) => {
  const commands = commands.find(item => (item.rule.test(location.pathname) === true));

  return (
    <Switch>
      <Route path={`${match.url}/create`} render={(props) => (
        <Create {...props} profile={profile}/>
      )}/>
      <Route path={`${match.url}/:userId`} render={(props) => (
        <Editor {...props} profile={profile}/>
      )}/>
      <Route path={`${match.url}`} render={(props) => (
        <List {...props} profile={profile} commands={commands.commands}/>
      )}/>
    </Switch>
  )
};

export default User;